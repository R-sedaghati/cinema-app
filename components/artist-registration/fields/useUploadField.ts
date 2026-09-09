"use client";

import { useEffect, useRef, useState } from "react";
import type { FileType } from "@dgshahr/ui-kit/Form/FileUploader";
import { toast } from "react-toastify";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { FieldProps } from "./types";

/**
 * The answer holds a storage path — that is what the API takes back — but a path is not
 * something a browser can render. So each entry carries both: `path` for the answer,
 * `src` for the preview (a blob url while uploading, a presigned url once hydrated).
 */
export type Item = FileType & { path: string };

const toPaths = (value: unknown): string[] =>
  Array.isArray(value) ? (value as string[]) : value ? [value as string] : [];

const sameItems = (a: Item[], b: Item[]) =>
  a.length === b.length &&
  a.every((it, i) => it.path === b[i].path && it.src === b[i].src);

interface Params extends Pick<FieldProps, "field" | "value" | "onChange"> {
  /** `mutate` of the image or video upload mutation. Both return a storage path. */
  upload: (
    file: File,
    callbacks: {
      onSuccess: (res: { path: string }) => void;
      onError: () => void;
    },
  ) => void;
  errorMessage: string;
}

/**
 * Image and video upload fields differ only in which endpoint they call, so the whole
 * upload lifecycle — pending entries, blob previews, answer commits — lives here once.
 */
export const useUploadField = ({
  field,
  value,
  onChange,
  upload,
  errorMessage,
}: Params) => {
  const portfolioUrls = useArtistRegistrationStore((s) => s.portfolioUrls);
  const addPortfolioUrl = useArtistRegistrationStore((s) => s.addPortfolioUrl);

  const [items, setItems] = useState<Item[]>([]);

  // `items` is also read from async upload callbacks, where the state variable would be
  // a stale closure. Every write goes through `apply`, so this ref is always current.
  const itemsRef = useRef<Item[]>([]);
  // One entry per in-flight upload. A single boolean would let the first completed
  // upload drop every other pending entry, silently losing files.
  const pendingRef = useRef(new Set<string>());
  const blobsRef = useRef(new Set<string>());
  // Blobs handed to the store as a preview for the review step. That step renders after
  // this field unmounts, so these must outlive it.
  // ponytail: they are then released only on page unload — bounded by the files the user
  // deliberately kept, unlike the previous leak of every file ever picked.
  const committedRef = useRef(new Set<string>());
  const mountedRef = useRef(true);

  const apply = (next: Item[]) => {
    itemsRef.current = next;
    setItems(next);
  };

  const revoke = (src?: string) => {
    if (!src || !blobsRef.current.delete(src)) return;
    committedRef.current.delete(src);
    URL.revokeObjectURL(src);
  };

  useEffect(() => {
    const blobs = blobsRef.current;
    const committed = committedRef.current;
    return () => {
      mountedRef.current = false;
      blobs.forEach((src) => {
        if (!committed.has(src)) URL.revokeObjectURL(src);
      });
      blobs.clear();
    };
  }, []);

  // An edit hydrates asynchronously, so the value can arrive well after mount — seeding
  // from `useState` alone leaves an already-filled field looking empty. Entries still
  // uploading have no path yet and are not in `value`, so they are carried over.
  useEffect(() => {
    const prev = itemsRef.current;
    const pending = prev.filter(
      (it) => !it.path && pendingRef.current.has(it.src ?? ""),
    );
    const next = [
      ...toPaths(value).map((path) => ({
        path,
        src: prev.find((it) => it.path === path)?.src ?? portfolioUrls[path] ?? path,
      })),
      ...pending,
    ];

    if (!sameItems(prev, next)) apply(next);
  }, [value, portfolioUrls]);

  const commit = (next: Item[]) => {
    apply(next);
    const paths = next.map((it) => it.path).filter(Boolean);
    onChange(field.multiple ? paths : (paths[0] ?? ""));
  };

  const handleAdd = (selected: File | undefined) => {
    if (!selected) return;

    const localSrc = URL.createObjectURL(selected);
    blobsRef.current.add(localSrc);
    pendingRef.current.add(localSrc);

    const pending: Item = {
      path: "",
      file: selected,
      src: localSrc,
      loading: true,
      status: "default",
    };

    if (field.multiple) {
      apply([...itemsRef.current, pending]);
    } else {
      itemsRef.current.forEach((it) => revoke(it.src));
      apply([pending]);
    }

    upload(selected, {
      onSuccess: (res) => {
        pendingRef.current.delete(localSrc);
        if (!mountedRef.current) return;

        // The review step renders answers by path, and an upload only hands back a
        // storage path — not something a browser can load. Park the blob preview under
        // that path so the summary has a src before the server round trip.
        addPortfolioUrl(res.path, localSrc);
        committedRef.current.add(localSrc);

        commit(
          itemsRef.current.map((it) =>
            it.src === localSrc
              ? { ...it, path: res.path, loading: false }
              : it,
          ),
        );
      },
      onError: () => {
        pendingRef.current.delete(localSrc);
        if (!mountedRef.current) return;

        // Nothing was attached, so drop the entry rather than leaving a preview that
        // looks attached — a required field then fails validation on Next, as it should.
        revoke(localSrc);
        commit(itemsRef.current.filter((it) => it.src !== localSrc));
        toast.error(errorMessage);
      },
    });
  };

  const handleRemove = (removedSrc?: string) => {
    if (removedSrc) {
      revoke(removedSrc);
      commit(itemsRef.current.filter((it) => it.src !== removedSrc));
      return;
    }
    itemsRef.current.forEach((it) => revoke(it.src));
    commit([]);
  };

  return { items, handleAdd, handleRemove };
};
