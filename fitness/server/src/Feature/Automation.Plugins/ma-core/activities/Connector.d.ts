import { ItemBase } from './items/ItemBase';
export declare class Connector {
    item: ItemBase;
    index: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    hy: number;
    constructor(item: ItemBase, index: number, x1?: number, y1?: number, x2?: number, y2?: number, hy?: number);
    readonly id: string;
    getPath(): string;
}
