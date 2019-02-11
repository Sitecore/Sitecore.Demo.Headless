export var AlertType;
(function (AlertType) {
    AlertType[AlertType["error"] = 0] = "error";
    AlertType[AlertType["warning"] = 1] = "warning";
    AlertType[AlertType["info"] = 2] = "info";
    AlertType[AlertType["confirmation"] = 3] = "confirmation";
})(AlertType || (AlertType = {}));
var Alert = (function () {
    function Alert(type, dismissible, message) {
        this.dismissible = dismissible;
        this.message = message;
        this.type = AlertType[type];
    }
    return Alert;
}());
export { Alert };
//# sourceMappingURL=alert.model.js.map