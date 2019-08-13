import { TranslateService } from '@ngx-translate/core';
import { IPlan } from '../IPlan';
import { ItemBase } from './ItemBase';
export declare class SingleItem extends ItemBase {
    protected translate: TranslateService;
    constructor(itemData: any, root: IPlan, parent: ItemBase);
    setVisual(domElement: HTMLElement): void;
}
