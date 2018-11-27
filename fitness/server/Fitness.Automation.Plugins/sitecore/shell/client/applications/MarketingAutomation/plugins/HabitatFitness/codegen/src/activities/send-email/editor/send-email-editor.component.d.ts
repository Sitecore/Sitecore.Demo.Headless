import { Injector, OnChanges, OnInit } from '@angular/core';
import { EditorBase } from '@sitecore/ma-core';
import { EmailCampaignsService } from '../email-campaigns.service';
export declare class SendEmailEditorComponent extends EditorBase implements OnChanges, OnInit {
    private injector;
    private emailCampaignsService;
    selectedItems: Array<any>;
    availableItems: Array<any>;
    isDisabled: boolean;
    maxSelectableOptions: any;
    constructor(injector: Injector, emailCampaignsService: EmailCampaignsService);
    ngOnInit(): void;
    onCampaignListLoaded(campaigns: any): void;
    ngOnChanges(): void;
    serialize(): any;
    onItemSelected(id: string): void;
    remove(elementAt: number): void;
    calculateAvailable(): any;
    updateSelectable(): void;
}
