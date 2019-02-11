import { Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
var EditorBase = (function () {
    function EditorBase() {
        this.guid = null;
        this._model = new BehaviorSubject({});
    }
    Object.defineProperty(EditorBase.prototype, "model", {
        get: function () {
            return this._model.getValue();
        },
        set: function (value) {
            this._model.next(value);
        },
        enumerable: true,
        configurable: true
    });
    EditorBase.propDecorators = {
        "model": [{ type: Input },],
    };
    return EditorBase;
}());
export { EditorBase };
//# sourceMappingURL=editor-base.js.map