"use client";

import { useEffect, useRef, useState } from "react";
import type { FileType } from "@dgshahr/ui-kit/Form/FileUploader";
import { toast } from "react-toastify";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { FieldProps } from "./types";

export type Item = FileType & {
  path: string;
};

const toPaths = (value: unknown): string[] =>
  Array.isArray(value) ? (value as string[]) : value ? [value as string] : [];

const sameItems = (a: Item[], b: Item[]) =>
  a.length === b.length &&
  a.every(
    (item, index) =>
      item.path === b[index].path &&
      item.src === b[index].src &&
      item.loading === b[index].loading,
  );

interface Params extends Pick<FieldProps, "field" | "value" | "onChange"> {
  upload: (
    file: File,
    callbacks: {
      onSuccess: (res: { path: string }) => void;
      onError: () => void;
    },
  ) => void;
  errorMessage: string;
}

export const useUploadField = ({
  field,
  value,
  onChange,
  upload,
  errorMessage,
}: Params) => {
  const portfolioUrls = useArtistRegistrationStore(
    (state) => state.portfolioUrls,
  );
  const addPortfolioUrl = useArtistRegistrationStore(
    (state) => state.addPortfolioUrl,
  );

  const [items, setItems] = useState<Item[]>([]);

  const itemsRef = useRef<Item[]>([]);
  const pendingRef = useRef(new Set<string>());
  const blobsRef = useRef(new Set<string>());
  const committedRef = useRef(new Set<string>());
  const awaitingValueRef = useRef(new Set<string>());
  const mountedRef = useRef(true);

  const apply = (next: Item[]) => {
    itemsRef.current = next;
    setItems(next);
  };

  const revoke = (src?: string) => {
    if (!src || !blobsRef.current.delete(src)) {
      return;
    }

    committedRef.current.delete(src);
    URL.revokeObjectURL(src);
  };

  useEffect(() => {
    const blobs = blobsRef.current;
    const committed = committedRef.current;

    return () => {
      mountedRef.current = false;

      blobs.forEach((src) => {
        if (!committed.has(src)) {
          URL.revokeObjectURL(src);
        }
      });

      blobs.clear();
    };
  }, []);

  useEffect(() => {
    const prev = itemsRef.current;
    const valuePaths = toPaths(value);

    /**
     * Keep uploads that haven't received a path yet.
     */
    const pending = prev.filter(
      (item) => !item.path && pendingRef.current.has(item.src ?? ""),
    );

    /**
     * Keep successfully uploaded items while waiting for the parent
     * field value to receive the new path.
     *
     * This is important because onChange() and the next `value` render
     * don't necessarily happen in the same render cycle.
     */
    const awaitingValue = prev.filter(
      (item) =>
        Boolean(item.path) &&
        awaitingValueRef.current.has(item.path) &&
        !valuePaths.includes(item.path),
    );

    /**
     * The parent has now accepted these paths, so they no longer need
     * special treatment.
     */
    valuePaths.forEach((path) => {
      awaitingValueRef.current.delete(path);
    });

    const next = [
      ...valuePaths.map((path) => {
        const existing = prev.find((item) => item.path === path);

        return {
          ...existing,
          path,
          src: existing?.src ?? portfolioUrls[path] ?? path,
          loading: false,
        };
      }),
      ...awaitingValue,
      ...pending,
    ];

    if (!sameItems(prev, next)) {
      apply(next);
    }
  }, [value, portfolioUrls]);

  const commit = (next: Item[]) => {
    apply(next);

    const paths = next.map((item) => item.path).filter(Boolean);

    paths.forEach((path) => {
      awaitingValueRef.current.add(path);
    });

    onChange(field.multiple ? paths : (paths[0] ?? ""));
  };

  const handleAdd = (selected: File | undefined) => {
    if (!selected) {
      return;
    }

    const localSrc = URL.createObjectURL(selected);

    blobsRef.current.add(localSrc);
    pendingRef.current.add(localSrc);

    const pendingItem: Item = {
      path: "",
      file: selected,
      src: localSrc,
      loading: true,
      status: "default",
    };

    if (field.multiple) {
      apply([...itemsRef.current, pendingItem]);
    } else {
      itemsRef.current.forEach((item) => revoke(item.src));
      apply([pendingItem]);
    }

    upload(selected, {
      onSuccess: (res) => {
        pendingRef.current.delete(localSrc);

        const next = itemsRef.current.map((item) => {
          if (item.src !== localSrc) {
            return item;
          }
          return {
            ...item,
            path: res.path,
            loading: false,
          };
        });

        /**
         * Mark the path as committed before changing the store.
         * Updating portfolioUrls triggers the hydration effect.
         */
        awaitingValueRef.current.add(res.path);

        apply(next);

        const paths = next.map((item) => item.path).filter(Boolean);

        onChange(field.multiple ? paths : (paths[0] ?? ""));

        /**
         * The API returns a storage path, which cannot necessarily be
         * rendered by the browser. Keep the local blob as the preview.
         */
        addPortfolioUrl(res.path, localSrc);

        committedRef.current.add(localSrc);
      },

      onError: () => {
        pendingRef.current.delete(localSrc);

        revoke(localSrc);

        const next = itemsRef.current.filter((item) => item.src !== localSrc);

        commit(next);

        toast.error(errorMessage);
      },
    });
  };

  const handleRemove = (removedSrc?: string) => {
    if (removedSrc) {
      const removedItem = itemsRef.current.find(
        (item) => item.src === removedSrc,
      );

      if (removedItem?.path) {
        awaitingValueRef.current.delete(removedItem.path);
      }

      pendingRef.current.delete(removedSrc);
      revoke(removedSrc);

      const next = itemsRef.current.filter((item) => item.src !== removedSrc);

      commit(next);

      return;
    }

    itemsRef.current.forEach((item) => {
      if (item.path) {
        awaitingValueRef.current.delete(item.path);
      }

      if (item.src) {
        pendingRef.current.delete(item.src);
      }

      revoke(item.src);
    });

    commit([]);
  };

  return {
    items,
    handleAdd,
    handleRemove,
  };
};
