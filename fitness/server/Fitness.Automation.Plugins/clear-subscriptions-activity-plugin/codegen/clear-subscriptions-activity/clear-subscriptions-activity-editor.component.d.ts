import { OnInit, Injector } from "@angular/core";
import { EditorBase } from "@sitecore/ma-core";
export declare class ClearSubscriptionActivityEditorComponent extends EditorBase implements OnInit {
    private injector;
    constructor(injector: Injector);
    ngOnInit(): void;
    serialize(): any;
}
