import { Injector } from '@angular/core';
export declare class EmailCampaignsService {
    private injector;
    private emailCampaignsUrl;
    private serverConnection;
    private campaignsList;
    constructor(injector: Injector);
    getAll(): Promise<any>;
}
