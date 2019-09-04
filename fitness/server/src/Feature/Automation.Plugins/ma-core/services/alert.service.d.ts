import { InjectionToken } from '@angular/core';
import { AlertType } from '../classes/alert.model';
export interface IAlertService {
    alert(type: AlertType, message: string, dismissible: boolean): void;
    clear(): void;
    error(message: string): void;
    info(message: string): void;
    remove(index: number): void;
    success(message: string): void;
    warning(message: string): void;
}
export declare const ALERT_SERVICE: InjectionToken<IAlertService>;
