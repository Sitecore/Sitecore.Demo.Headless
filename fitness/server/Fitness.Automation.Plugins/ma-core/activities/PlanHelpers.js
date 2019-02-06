import * as _ from 'lodash';
var PlanHelpers = (function () {
    function PlanHelpers() {
    }
    PlanHelpers.newGUID = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
    PlanHelpers.setRandomIds = function (planData) {
        var _this = this;
        planData.id = this.newGUID();
        if (planData.children) {
            _.forEach(planData.children, function (item) {
                _this.setRandomIds(item);
            });
        }
        return planData;
    };
    return PlanHelpers;
}());
export { PlanHelpers };
//# sourceMappingURL=PlanHelpers.js.map