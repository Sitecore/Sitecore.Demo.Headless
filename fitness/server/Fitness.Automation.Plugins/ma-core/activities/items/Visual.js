var Visual = (function () {
    function Visual(domElement) {
        this.domElement = domElement;
        this.selectedClass = 'selected-plan-item';
        this.width = domElement.offsetWidth;
        this.height = domElement.offsetHeight;
        this.dx = domElement.offsetWidth / 2;
        this.element = domElement;
    }
    Visual.prototype.select = function () {
        this.element.classList.add(this.selectedClass);
    };
    Visual.prototype.deselect = function () {
        this.element.classList.remove(this.selectedClass);
    };
    return Visual;
}());
export { Visual };
//# sourceMappingURL=Visual.js.map