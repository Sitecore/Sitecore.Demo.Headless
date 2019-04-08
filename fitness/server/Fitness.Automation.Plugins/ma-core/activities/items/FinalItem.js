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
var FinalItem = (function (_super) {
    __extends(FinalItem, _super);
    function FinalItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FinalItem.prototype.setVisual = function (domElement) {
        _super.prototype.setVisual.call(this, domElement);
        this.position = this.visual;
    };
    Object.defineProperty(FinalItem.prototype, "isFinal", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return FinalItem;
}(ItemBase));
export { FinalItem };
//# sourceMappingURL=FinalItem.js.map