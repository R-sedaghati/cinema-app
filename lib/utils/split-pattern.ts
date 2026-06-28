import { CategoryItem } from "../mock/artists";

export function splitPattern(items: CategoryItem[]) {
  const result = [];
  let i = 0;
  let toggle = true;

  while (i < items.length) {
    const size = toggle ? 4 : 3;
    result.push(items.slice(i, i + size));
    i += size;
    toggle = !toggle;
  }

  return result;
}

export function mobileSplitPattern(items: CategoryItem[]) {
  const result: CategoryItem[][] = [];

  for (let i = 0; i < items.length; i += 4) {
    result.push(items.slice(i, i + 4));
  }

  return result;
}
