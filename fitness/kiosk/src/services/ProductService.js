import { get } from "./GenericService";

export const ProductDisplayCount = 4;

export function getAll() {
  return get(`/products`, { take: ProductDisplayCount }, true);
}
