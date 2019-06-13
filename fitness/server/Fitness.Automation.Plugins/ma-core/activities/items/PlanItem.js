var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ItemBase } from './ItemBase';
var PlanItem = (function (_super) {
    __extends(PlanItem, _super);
    function PlanItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlanItem.prototype.initParams = function (itemData) {
        this.params = this.root.extractParams(itemData);
    };
    PlanItem.prototype.initChildren = function (itemData) {
        _super.prototype.initChildren.call(this, itemData);
        this.children = this.children || [];
    };
    Object.defineProperty(PlanItem.prototype, "hasVisual", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    PlanItem.prototype.computeChildrenOffsets = function () {
        this.position.offsetX = 0;
        this.position.offsetY = 0;
        var height = 0;
        this.children.forEach(function (child) {
            child.position.offsetX = -child.position.dx;
            child.position.offsetY = height;
            height += child.position.height;
        });
    };
    return PlanItem;
}(ItemBase));
export { PlanItem };
//# sourceMappingURL=PlanItem.js.map