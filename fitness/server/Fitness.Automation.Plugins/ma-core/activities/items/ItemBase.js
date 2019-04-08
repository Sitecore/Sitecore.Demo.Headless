import * as _ from 'lodash';
import { PlanHelpers } from '../PlanHelpers';
import { Position } from './Position';
import { Visual } from './Visual';
var ItemBase = (function () {
    function ItemBase(itemData, root, parent) {
        this._cssClass = 'item-base';
        this.canBeSelected = true;
        this.canBeDeleted = true;
        this.hasFinal = false;
        this.canSaveParametersForTemplate = true;
        this.root = root;
        this.parent = parent;
        this.initParams(itemData);
        this.editorParams = itemData.parameters || {};
        this.position = new Position();
        this.initChildren(itemData);
    }
    Object.defineProperty(ItemBase.prototype, "id", {
        get: function () {
            return this.params.id;
        },
        set: function (value) {
            this.params.id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemBase.prototype, "activityTypeId", {
        get: function () {
            return this.params.activityTypeId;
        },
        enumerable: true,
        configurable: true
    });
    ItemBase.prototype.initParams = function (itemData) {
        this.params = this.root.extractParams(itemData);
        this.id = this.id || PlanHelpers.newGUID();
    };
    ItemBase.prototype.initChildren = function (itemData) {
        var _this = this;
        var children = this.root.extractChildren(itemData);
        if (children) {
            this.children = children.map(function (child) {
                var cls = _this.root.getClass(child);
                return new cls(child, _this.root, _this);
            });
        }
    };
    ItemBase.prototype.toJson = function (isTemplate) {
        if (isTemplate === void 0) { isTemplate = false; }
        var res = _.cloneDeep(this.params);
        this.stringifyPropertyValues(res.parameters);
        if (this.children) {
            res.children = this.children.map(function (child) {
                var serialized = child.toJson(isTemplate);
                if (isTemplate && !child.saveParametersForTemplate) {
                    serialized.parameters = serialized.parameters.name ? { name: serialized.parameters.name } : {};
                }
                return serialized;
            });
        }
        return res;
    };
    Object.defineProperty(ItemBase.prototype, "hasVisual", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ItemBase.prototype.getVisual = function () {
        return;
    };
    ItemBase.prototype.setVisual = function (domElement) {
        this.visual = new Visual(domElement);
    };
    ItemBase.prototype.computeChildrenOffsets = function () {
    };
    ItemBase.prototype.computeXY = function (parentX, parentY) {
        var _this = this;
        this.position.x = parentX + this.position.offsetX;
        this.position.y = parentY + this.position.offsetY;
        if (this.children) {
            this.children.forEach(function (child) {
                child.computeXY(_this.position.x, _this.position.y);
            });
        }
    };
    ItemBase.prototype.getConnectors = function (resultArray) {
    };
    ItemBase.prototype.getInserts = function (resultArray) {
    };
    Object.defineProperty(ItemBase.prototype, "hasFrame", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    ItemBase.prototype.getFrame = function () {
    };
    Object.defineProperty(ItemBase.prototype, "hasLabel", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    ItemBase.prototype.getLabel = function () {
        return;
    };
    Object.defineProperty(ItemBase.prototype, "editorParams", {
        get: function () {
            var params = this.params.parameters || {};
            return _.assign({}, params);
        },
        set: function (params) {
            this.params.parameters = params;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemBase.prototype, "isDefined", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemBase.prototype, "isFinal", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    ItemBase.prototype.stringifyPropertyValues = function (object) {
        for (var property in object) {
            if (object.hasOwnProperty(property) && object[property]) {
                if (property !== 'condition') {
                    object[property] = JSON.stringify(object[property]);
                }
            }
        }
    };
    Object.defineProperty(ItemBase.prototype, "cssClass", {
        get: function () {
            return this._cssClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemBase.prototype, "hasDecisionPoint", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemBase.prototype, "saveParametersForTemplate", {
        get: function () {
            return this.canSaveParametersForTemplate;
        },
        set: function (value) {
            this.canSaveParametersForTemplate = value;
        },
        enumerable: true,
        configurable: true
    });
    return ItemBase;
}());
export { ItemBase };
//# sourceMappingURL=ItemBase.js.map