import { LINE_RADIUS } from './constants';
var Connector = (function () {
    function Connector(item, index, x1, y1, x2, y2, hy) {
        if (x1 === void 0) { x1 = 0; }
        if (y1 === void 0) { y1 = 0; }
        if (x2 === void 0) { x2 = 0; }
        if (y2 === void 0) { y2 = 0; }
        if (hy === void 0) { hy = 0; }
        this.item = item;
        this.index = index;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.hy = hy;
    }
    Object.defineProperty(Connector.prototype, "id", {
        get: function () {
            return this.item.id + "_" + this.index;
        },
        enumerable: true,
        configurable: true
    });
    Connector.prototype.getPath = function () {
        var _a = this, x1 = _a.x1, x2 = _a.x2, y1 = _a.y1, y2 = _a.y2, hy = _a.hy;
        if (x1 === x2 || y1 === y2) {
            return "M" + x1 + ", " + y1 + "L" + x2 + ", " + (y2 + 1);
        }
        var sign = Math.sign(x2 - x1);
        if (hy === 0) {
            var d = "M" + x1 + "," + y1 + "H" + (x2 - LINE_RADIUS * sign) +
                ("A" + LINE_RADIUS + " " + LINE_RADIUS + " 0 0 " + (sign > 0 ? 1 : 0) + " " + x2 + " " + (y1 + LINE_RADIUS)) +
                ("V" + y2);
            return d;
        }
        else if (hy === y2) {
            var d = "M" + x1 + "," + y1 + "V" + (hy - LINE_RADIUS) +
                ("A" + LINE_RADIUS + " " + LINE_RADIUS + " 0 0 " + (sign > 0 ? 0 : 1) + " " + (x1 + LINE_RADIUS * sign) + " " + hy) +
                ("H" + x2);
            return d;
        }
        else {
            var d = "M" + x1 + "," + y1 + "V" + (hy - LINE_RADIUS) +
                ("A" + LINE_RADIUS + " " + LINE_RADIUS + " 0 0 " + (sign > 0 ? 0 : 1) + " " + (x1 + LINE_RADIUS * sign) + " " + hy) +
                ("H" + (x2 - LINE_RADIUS * sign)) +
                ("A" + LINE_RADIUS + " " + LINE_RADIUS + " 0 0 " + (sign > 0 ? 1 : 0) + " " + x2 + " " + (hy + LINE_RADIUS)) +
                ("V" + y2);
            return d;
        }
    };
    return Connector;
}());
export { Connector };
//# sourceMappingURL=Connector.js.map