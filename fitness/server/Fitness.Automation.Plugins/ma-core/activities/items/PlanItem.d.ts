import { ItemBase } from './ItemBase';
export declare class PlanItem extends ItemBase {
    initParams(itemData: any): void;
    initChildren(itemData: any): void;
    readonly hasVisual: boolean;
    computeChildrenOffsets(): void;
}
