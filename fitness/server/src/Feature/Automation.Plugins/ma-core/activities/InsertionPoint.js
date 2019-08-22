var InsertionPoint = (function () {
    function InsertionPoint(item, index, x, y, forDecisionPointOnly) {
        if (forDecisionPointOnly === void 0) { forDecisionPointOnly = false; }
        this.item = item;
        this.index = index;
        this.x = x;
        this.y = y;
        this.forDecisionPointOnly = forDecisionPointOnly;
    }
    Object.defineProperty(InsertionPoint.prototype, "id", {
        get: function () {
            return this.item.id + "_" + this.index;
        },
        enumerable: true,
        configurable: true
    });
    return InsertionPoint;
}());
export { InsertionPoint };
//# sourceMappingURL=InsertionPoint.js.map