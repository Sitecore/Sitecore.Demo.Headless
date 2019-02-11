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
import { SingleItem } from './SingleItem';
var NotFound = (function (_super) {
    __extends(NotFound, _super);
    function NotFound() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(NotFound.prototype, "hasFrame", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    NotFound.prototype.getVisual = function () {
        return "<div style='background-color:#fff;margin:10px;white-space: nowrap;'>\n            Item with id:" + this.id + " activityTypeId:'" + this.params.activityTypeId + "'<br/>\n            DOES NOT HAVE ASSOCIATED CLASS<br/>Add it to item factory</div>";
    };
    return NotFound;
}(SingleItem));
export { NotFound };
//# sourceMappingURL=NotFound.js.map