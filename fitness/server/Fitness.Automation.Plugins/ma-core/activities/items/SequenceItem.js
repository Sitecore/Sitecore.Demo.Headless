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
import { Connector } from '../Connector';
import { EMPTY_SEQUENCE_WIDTH, LINE_RADIUS, SEQUENCE_VSPACING } from '../constants';
import { InsertionPoint } from '../InsertionPoint';
import { ConditionItem } from './ConditionItem';
import { DecisionPointItem } from './DecisionPointItem';
import { ItemBase } from './ItemBase';
var SequenceItem = (function (_super) {
    __extends(SequenceItem, _super);
    function SequenceItem(itemData, root, parent) {
        var _this = _super.call(this, itemData, root, parent) || this;
        _this.children = _this.children || [];
        return _this;
    }
    Object.defineProperty(SequenceItem.prototype, "hasVisual", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SequenceItem.prototype, "hasDecisionPoint", {
        get: function () {
            return this.children.some(function (child) { return child instanceof DecisionPointItem; });
        },
        enumerable: true,
        configurable: true
    });
    SequenceItem.prototype.computeChildrenOffsets = function () {
        var children = this.children;
        if (children.length === 0) {
            this.position.height = SEQUENCE_VSPACING;
            this.position.width = EMPTY_SEQUENCE_WIDTH;
            this.position.dx = EMPTY_SEQUENCE_WIDTH / 2;
        }
        else {
            var height_1 = this.hasDecisionPoint ? 0 : SEQUENCE_VSPACING;
            var maxDx_1 = 0;
            var maxAfterDx_1 = 0;
            children.forEach(function (child) {
                child.position.offsetY = height_1;
                height_1 += child.position.height + SEQUENCE_VSPACING;
                var childDx = child.position.dx;
                maxDx_1 = Math.max(maxDx_1, childDx);
                maxAfterDx_1 = Math.max(maxAfterDx_1, child.position.width - childDx);
            });
            this.position.width = maxDx_1 + maxAfterDx_1;
            this.position.height = height_1;
            this.position.dx = maxDx_1;
            children.forEach(function (child) {
                child.position.offsetX = maxDx_1 - child.position.dx;
            });
        }
    };
    SequenceItem.prototype.getConnectors = function (resultArray) {
        var _this = this;
        var pos = this.position;
        var x = pos.x + pos.dx;
        var y = pos.y;
        var idx = 0;
        if (!this.hasDecisionPoint) {
            resultArray.push(new Connector(this, idx++, x, y, x, y + SEQUENCE_VSPACING));
        }
        this.children.forEach(function (child) {
            if (child instanceof ConditionItem && child.hasFinal) {
                return;
            }
            if (!(child.isFinal || child.hasFinal)) {
                y = child.position.y + child.position.height;
                resultArray.push(new Connector(_this, idx++, x, y, x, y + SEQUENCE_VSPACING));
            }
        });
    };
    SequenceItem.prototype.getInserts = function (resultArray) {
        var _this = this;
        var decisionPointInsertionPointIndex = 0;
        var x = this.position.x + this.position.dx;
        var y = this.position.y + SEQUENCE_VSPACING / 2;
        var parentY;
        if (this.parent instanceof ConditionItem || this.parent instanceof DecisionPointItem) {
            var parentCondition = this.parent;
            parentY = this.position.y - parentCondition.headerLength + LINE_RADIUS;
            resultArray.push(new InsertionPoint(this, decisionPointInsertionPointIndex, x, parentY, true));
        }
        var idx = 0;
        if (this.hasDecisionPoint) {
            idx++;
        }
        else {
            resultArray.push(new InsertionPoint(this, idx++, x, y));
        }
        this.children.forEach(function (child) {
            if (child instanceof ConditionItem && child.hasFinal) {
                return;
            }
            if (!child.isFinal) {
                y = child.position.y + child.position.height + SEQUENCE_VSPACING / 2;
                resultArray.push(new InsertionPoint(_this, idx++, x, y));
            }
        });
    };
    return SequenceItem;
}(ItemBase));
export { SequenceItem };
//# sourceMappingURL=SequenceItem.js.map