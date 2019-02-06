import { TranslateService } from '@ngx-translate/core';
import { Connector } from '../Connector';
import { IPlan } from '../IPlan';
import { ConditionItem } from './ConditionItem';
import { ItemBase } from './ItemBase';
import { SequenceItem } from './SequenceItem';
export declare class DecisionPointItem extends ItemBase {
    protected translate: TranslateService;
    private labelYes;
    private labelNo;
    constructor(itemData: any, plan: IPlan, parent: ItemBase);
    readonly yesSequence: SequenceItem;
    readonly noSequence: SequenceItem;
    readonly hasLabel: boolean;
    getParentListener(): ConditionItem;
    getLabel(): string;
    computeChildrenOffsets(): void;
    readonly headerLength: number;
    readonly leftHalfWidth: number;
    readonly rightHalfWidth: number;
    computeXY(parentX: number, parentY: number): void;
    getConnectors(resultArray: Connector[]): void;
}
