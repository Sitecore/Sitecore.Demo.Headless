import { InjectionToken } from '@angular/core';
export interface IActivityDataService {
    getAll(): Promise<any>;
    getByTypeId(id: string): Promise<any>;
}
export declare const ACTIVITY_DATA_SERVICE: InjectionToken<IActivityDataService>;
