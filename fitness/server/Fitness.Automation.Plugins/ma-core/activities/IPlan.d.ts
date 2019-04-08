import { Injector } from '@angular/core';
export interface IPlan {
    injector: Injector;
    extractParams(activityData: any): any;
    extractChildren(activityData: any): any[];
    getClass(activityData: any): any;
}
