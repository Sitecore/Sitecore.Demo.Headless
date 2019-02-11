import { InjectionToken } from '@angular/core';
import { RequestOptionsArgs } from '@angular/http';
export interface IServerConnectionService {
    get(url: string, cache: boolean, appendCultureName: boolean): Promise<any>;
    get(url: string, options: RequestOptionsArgs, cache: boolean, appendCultureName: boolean): Promise<any>;
    post(url: string, data: any): Promise<any>;
    put(url: string, data: any): Promise<any>;
    patch(url: string, data?: any): Promise<any>;
    delete(url: string): Promise<any>;
}
export declare const SERVER_CONNECTION_SERVICE: InjectionToken<IServerConnectionService>;
