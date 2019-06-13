export declare class Visual {
    private domElement;
    width: number;
    height: number;
    dx: number;
    offsetX: number;
    offsetY: number;
    x: number;
    y: number;
    element: HTMLElement;
    selectedClass: string;
    constructor(domElement: HTMLElement);
    select(): void;
    deselect(): void;
}
