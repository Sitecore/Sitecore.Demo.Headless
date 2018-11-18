import { get } from "./GenericService";

export function getAll() {
  return get(`/products`, { take: 4 });
}
