import { TranslateService } from '@ngx-translate/core';
import { Connector } from '../Connector';
import { IPlan } from '../IPlan';
import { ItemBase } from './ItemBase';
import { SequenceItem } from './SequenceItem';
export declare class ConditionItem extends ItemBase {
    protected translate: TranslateService;
    private labelYes;
    private labelNo;
    constructor(itemData: any, root: IPlan, parent: ItemBase);
    readonly yesSequence: SequenceItem;
    readonly noSequence: SequenceItem;
    readonly hasLabel: boolean;
    readonly leftHalfWidth: number;
    readonly rightHalfWidth: number;
    readonly hasDecisionPoint: boolean;
    readonly headerLength: number;
    getLabel(): string;
    computeChildrenOffsets(): void;
    computeXY(parentX: number, parentY: number): void;
    getConnectors(resultArray: Connector[]): void;
    setVisual(domElement: HTMLElement): void;
}
