import { InsertionPoint } from '../InsertionPoint';
import { IPlan } from '../IPlan';
import { ItemBase } from './ItemBase';
export declare class SequenceItem extends ItemBase {
    constructor(itemData: any, root: IPlan, parent?: ItemBase);
    readonly hasVisual: boolean;
    readonly hasDecisionPoint: boolean;
    computeChildrenOffsets(): void;
    getConnectors(resultArray: any): void;
    getInserts(resultArray: InsertionPoint[]): void;
}
