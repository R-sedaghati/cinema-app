import type {
  IArtistFilterDescriptor,
  ParamsPublicArtistList,
} from "@/lib/services/landing/type";
import type { RangeValue } from "@/lib/hooks/useArtistSearchParams";

/**
 * Descriptors carry the exact API query key (`param`/`paramMin`/`paramMax`), so the
 * client never has to guess how a schema field maps onto a filter param.
 *
 * Because of that dependency the caller must wait for the descriptors to load before
 * firing the artist query — otherwise a deep-linked URL searches unfiltered.
 */
export function buildParams({
  categoryId,
  search,
  selections,
  ranges,
  descriptors,
}: {
  categoryId: number | null;
  search: string;
  selections: Record<string, string[]>;
  ranges: Record<string, RangeValue>;
  descriptors: IArtistFilterDescriptor[];
}): ParamsPublicArtistList {
  const params: ParamsPublicArtistList = {};

  if (categoryId) params.category__in = [categoryId];
  if (search) params.search = search;

  for (const descriptor of descriptors) {
    if (descriptor.kind === "select") {
      const values = selections[descriptor.key];
      if (values?.length) params[descriptor.param] = values;
      continue;
    }

    const range = ranges[descriptor.key];
    if (range?.min) params[descriptor.paramMin] = range.min;
    if (range?.max) params[descriptor.paramMax] = range.max;
  }

  return params;
}
