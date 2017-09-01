import { MultiselectDropdown } from './dropdown.component';
import { MultiSelectSearchFilter } from './search-filter.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
var SelectDropdownModule = (function () {
    function SelectDropdownModule() {
    }
    return SelectDropdownModule;
}());
export { SelectDropdownModule };
SelectDropdownModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, ReactiveFormsModule],
                exports: [MultiselectDropdown, MultiSelectSearchFilter],
                declarations: [MultiselectDropdown, MultiSelectSearchFilter],
            },] },
];
/** @nocollapse */
SelectDropdownModule.ctorParameters = function () { return []; };
//# sourceMappingURL=dropdown.module.js.map