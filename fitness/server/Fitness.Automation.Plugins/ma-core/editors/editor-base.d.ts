export declare abstract class EditorBase {
    private _model;
    guid: string | null;
    constructor();
    model: any;
    abstract serialize(): any;
}
