import { OnInit, Injector } from "@angular/core";
import { EditorBase } from "@sitecore/ma-core";
export declare class PushNotificationActivityEditorComponent extends EditorBase implements OnInit {
    private injector;
    constructor(injector: Injector);
    title: Text;
    body: Text;
    ngOnInit(): void;
    serialize(): any;
}
