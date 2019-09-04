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
import { TranslateService } from '@ngx-translate/core';
import { ItemBase } from './ItemBase';
var SingleItem = (function (_super) {
    __extends(SingleItem, _super);
    function SingleItem(itemData, root, parent) {
        var _this = _super.call(this, itemData, root, parent) || this;
        _this.translate = root.injector.get(TranslateService);
        return _this;
    }
    SingleItem.prototype.setVisual = function (domElement) {
        _super.prototype.setVisual.call(this, domElement);
        this.position = this.visual;
    };
    return SingleItem;
}(ItemBase));
export { SingleItem };
//# sourceMappingURL=SingleItem.js.map