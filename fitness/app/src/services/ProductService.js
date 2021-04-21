import { get } from "./GenericService";

export const ProductDisplayCount = 4;

export function getAll() {
  // TODO: Implement instead with OrderCloud
  return get(`/products`, { take: ProductDisplayCount }, true);
}
