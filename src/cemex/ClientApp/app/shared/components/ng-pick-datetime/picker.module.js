"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var picker_component_1 = require("./picker.component");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var numberedFixLen_pipe_1 = require("./numberedFixLen.pipe");
var DateTimePickerModule = (function () {
    function DateTimePickerModule() {
    }
    return DateTimePickerModule;
}());
DateTimePickerModule.decorators = [
    { type: core_1.NgModule, args: [{
                imports: [common_1.CommonModule, forms_1.FormsModule],
                exports: [picker_component_1.DateTimePickerComponent],
                declarations: [picker_component_1.DateTimePickerComponent, numberedFixLen_pipe_1.NumberFixedLenPipe],
                providers: [],
            },] },
];
DateTimePickerModule.ctorParameters = function () { return []; };
exports.DateTimePickerModule = DateTimePickerModule;
//# sourceMappingURL=picker.module.js.map