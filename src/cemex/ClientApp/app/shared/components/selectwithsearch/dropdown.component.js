import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/takeUntil';
import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, IterableDiffers, Output, } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR, } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { MultiSelectSearchFilter } from './search-filter.pipe';

var MULTISELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function() { return MultiselectDropdown; }),
    multi: true
};
var MultiselectDropdown = (function() {
    function MultiselectDropdown(element, fb, searchFilter, differs) {
        this.element = element;
        this.fb = fb;
        this.searchFilter = searchFilter;
        this.filterControl = this.fb.control('');
        this.disabled = false;
        this.selectionLimitReached = new EventEmitter();
        this.dropdownClosed = new EventEmitter();
        this.dropdownOpened = new EventEmitter();
        this.onAdded = new EventEmitter();
        this.onRemoved = new EventEmitter();
        this.onCancel = new EventEmitter();
        this.onDeselect = new EventEmitter();
        this.onLazyLoad = new EventEmitter();
        this.onFilter = this.filterControl.valueChanges;
        this.destroyed$ = new Subject();
        this.filteredOptions = [];
        this.renderFilteredOptions = [];
        this.model = [];
        this.manualInput = {
            name: "",
            phone: ""
        }
        this.numSelected = 0;
        this.renderItems = true;
        this.defaultSettings = {
            closeOnClickOutside: true,
            pullRight: false,
            enableSearch: false,
            searchRenderLimit: 0,
            searchRenderAfter: 1,
            searchMaxLimit: 0,
            searchMaxRenderedItems: 0,
            checkedStyle: 'checkboxes',
            buttonClasses: 'btn btn-default btn-secondary',
            containerClasses: 'dropdown-inline',
            selectionLimit: 0,
            minSelectionLimit: 0,
            closeOnSelect: false,
            autoUnselect: false,
            showCheckAll: false,
            showUncheckAll: false,
            fixedTitle: false,
            dynamicTitleMaxItems: 3,
            maxHeight: '300px',
            isLazyLoad: false,
            stopScrollPropagation: false,
            loadViewDistance: 1
        };
        this.defaultTexts = {
            checkAll: 'Check all',
            uncheckAll: 'Uncheck all',
            checked: 'checked',
            checkedPlural: 'checked',
            searchPlaceholder: 'Search...',
            searchEmptyResult: 'Nothing found...',
            searchNoRenderText: 'Type in search box to see results...',
            defaultTitle: 'Select',
            allSelected: 'All selected',
            createNew: '+ Create a new one',
        };
        this._isVisible = false;
        this._workerDocClicked = false;
        this.onModelChange = function(_) {};
        this.onModelTouched = function() {};
        this.differ = differs.find([]).create(null);
        this.settings = this.defaultSettings;
        this.texts = this.defaultTexts;
    }
    MultiselectDropdown.prototype.onClick = function(target) {
        if (!this.isVisible || !this.settings.closeOnClickOutside)
            return;
        var parentFound = false;
        while (target != null && !parentFound) {
            if (target === this.element.nativeElement) {
                parentFound = true;
            }
            target = target.parentElement;
        }
        if (!parentFound) {
            this.isVisible = false;
            this.dropdownClosed.emit();
        }
    };
    Object.defineProperty(MultiselectDropdown.prototype, "isVisible", {
        get: function() {
            return this._isVisible;
        },
        set: function(val) {
            this._isVisible = val;
            this._workerDocClicked = val ? false : this._workerDocClicked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiselectDropdown.prototype, "searchLimit", {
        get: function() {
            return this.settings.searchRenderLimit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiselectDropdown.prototype, "searchRenderAfter", {
        get: function() {
            return this.settings.searchRenderAfter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiselectDropdown.prototype, "searchLimitApplied", {
        get: function() {
            return this.searchLimit > 0 && this.options.length > this.searchLimit;
        },
        enumerable: true,
        configurable: true
    });
    MultiselectDropdown.prototype.getItemStyle = function(option) {
        if (!option.isLabel) {
            return { 'cursor': 'pointer' };
        }
    };
    MultiselectDropdown.prototype.getItemStyleSelectionDisabled = function() {
        if (this.disabledSelection) {
            return { 'cursor': 'default' };
        }
    };
    MultiselectDropdown.prototype.ngOnInit = function() {
        this.settings = Object.assign(this.defaultSettings, this.settings);
        this.texts = Object.assign(this.defaultTexts, this.texts);
        this.title = this.texts.defaultTitle || '';
        this.filterControl.valueChanges
            .takeUntil(this.destroyed$)
            .subscribe(function() {
                this.updateRenderItems();
                if (this.settings.isLazyLoad) {
                    this.load();
                }
            }.bind(this));
    };
    MultiselectDropdown.prototype.ngOnChanges = function(changes) {
        if (changes['options']) {
            this.options = this.options || [];
            this.parents = this.options
                .filter(function(option) { return typeof option.parentId === 'number'; })
                .map(function(option) { return option.parentId; });
            this.updateRenderItems();
            if (this.texts) {
                this.updateTitle();
            }
        }
        if (changes['texts'] && !changes['texts'].isFirstChange()) {
            this.updateTitle();
        }
    };
    MultiselectDropdown.prototype.ngOnDestroy = function() {
        this.destroyed$.next();
    };
    MultiselectDropdown.prototype.updateRenderItems = function() {
        this.renderItems = !this.searchLimitApplied || this.filterControl.value.length >= this.searchRenderAfter;
        this.filteredOptions = this.searchFilter.transform(this.options, this.settings.isLazyLoad ? '' : this.filterControl.value, this.settings.searchMaxLimit, this.settings.searchMaxRenderedItems);
        this.renderFilteredOptions = this.renderItems ? this.filteredOptions : [];
    };
    MultiselectDropdown.prototype.writeValue = function(value) {
        if (value !== undefined && value !== null) {
            this.model = Array.isArray(value) ? value : [value];
        } else {
            this.model = [];
        }
    };
    MultiselectDropdown.prototype.registerOnChange = function(fn) {
        this.onModelChange = fn;
    };
    MultiselectDropdown.prototype.registerOnTouched = function(fn) {
        this.onModelTouched = fn;
    };
    MultiselectDropdown.prototype.setDisabledState = function(isDisabled) {
        this.disabled = isDisabled;
    };
    MultiselectDropdown.prototype.ngDoCheck = function() {
        var changes = this.differ.diff(this.model);
        if (changes) {
            this.updateNumSelected();
            this.updateTitle();
        }
    };
    MultiselectDropdown.prototype.validate = function(_c) {
        return (this.model && this.model.length) ? null : {
            required: {
                valid: false,
            },
        };
    };
    MultiselectDropdown.prototype.registerOnValidatorChange = function(_fn) {
        throw new Error('Method not implemented.');
    };
    MultiselectDropdown.prototype.clearSearch = function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        this.filterControl.setValue('');
    };
    MultiselectDropdown.prototype.toggleDropdown = function() {
        this.isVisible = !this.isVisible;
        this.isVisible ? this.dropdownOpened.emit() : this.dropdownClosed.emit();
    };
    MultiselectDropdown.prototype.addOption = function(e) {
        this.toggleDropdown();
        this.uncheckAll();
        this.settings.addingOption = true;
    };
    MultiselectDropdown.prototype.cancel = function(e) {
        this.onCancel.emit();
        this.settings.addingOption = false;
    };
    MultiselectDropdown.prototype.onlyNumberKey = function(evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode != 43 && charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    };
    MultiselectDropdown.prototype.manualInputChanged = function(e) {
        this.onModelChange(this.manualInput)
    };
    MultiselectDropdown.prototype.isSelected = function(option) {
        return this.model && this.model.indexOf(option.id) > -1;
    };
    MultiselectDropdown.prototype.setSelected = function(_event, option) {
        var _this = this;
        if (option.isLabel) {
            return;
        }
        if (!this.disabledSelection) {
            if (_event.stopPropagation) {
                _event.stopPropagation();
            }
            var index = this.model.indexOf(option.id);
            if (index > -1) {
                this.onDeselect.emit()
                if ((this.settings.minSelectionLimit === undefined) || (this.numSelected > this.settings.minSelectionLimit)) {
                    this.model.splice(index, 1);
                    this.onRemoved.emit(option.id);
                }
                var parentIndex = option.parentId && this.model.indexOf(option.parentId);
                if (parentIndex >= 0) {
                    this.model.splice(parentIndex, 1);
                    this.onRemoved.emit(option.parentId);
                } else if (this.parents.indexOf(option.id) > -1) {
                    var childIds_1 = this.options.filter(function(child) { return _this.model.indexOf(child.id) > -1 && child.parentId == option.id; }).map(function(child) { return child.id; });
                    this.model = this.model.filter(function(id) { return childIds_1.indexOf(id) < 0; });
                    childIds_1.forEach(function(childId) { return _this.onRemoved.emit(childId); });
                }
            } else {
                if (this.settings.selectionLimit === 0 || (this.settings.selectionLimit && this.model.length < this.settings.selectionLimit)) {
                    this.model.push(option.id);
                    this.onAdded.emit(option.id);
                    if (option.parentId) {
                        var children = this.options.filter(function(child) { return child.id !== option.id && child.parentId == option.parentId; });
                        if (children.every(function(child) { return _this.model.indexOf(child.id) > -1; })) {    
                            this.model.push(option.parentId);
                            this.onAdded.emit(option.parentId);
                        }
                    } else if (this.parents.indexOf(option.id) > -1) {
                        var children = this.options.filter(function(child) { return _this.model.indexOf(child.id) < 0 && child.parentId == option.id; });
                        children.forEach(function(child) {
                            _this.model.push(child.id);
                            _this.onAdded.emit(child.id);
                        });
                    }
                } else {
                    if (this.settings.autoUnselect) {
                        this.model.push(option.id);
                        this.onAdded.emit(option.id);
                        var removedOption = this.model.shift();
                        this.onRemoved.emit(removedOption);
                    } else {
                        this.selectionLimitReached.emit(this.model.length);
                        return;
                    }
                }
            }
            if (this.settings.closeOnSelect) {
                this.toggleDropdown();
            }
            this.model = this.model.slice();
            this.onModelChange(this.model);
            this.onModelTouched();
        }
    };
    MultiselectDropdown.prototype.updateNumSelected = function() {
        var _this = this;
        this.numSelected = this.model.filter(function(id) { return _this.parents.indexOf(id) < 0; }).length || 0;
    };
    MultiselectDropdown.prototype.updateTitle = function() {
        var _this = this;
        if (this.numSelected === 0 || this.settings.fixedTitle) {
            this.title = (this.texts) ? this.texts.defaultTitle : '';
        } else if (this.settings.displayAllSelectedText && this.model.length === this.options.length) {
            this.title = (this.texts) ? this.texts.allSelected : '';
        } else if (this.settings.dynamicTitleMaxItems && this.settings.dynamicTitleMaxItems >= this.numSelected) {
            this.title = this.options
                .filter(function(option) {
                    return _this.model.indexOf(option.id) > -1;
                })
                .map(function(option) { return option.name; })
                .join(', ');
        } else {
            this.title = this.numSelected +
                ' ' +
                (this.numSelected === 1 ? this.texts.checked : this.texts.checkedPlural);
        }
    };
    MultiselectDropdown.prototype.searchFilterApplied = function() {
        return this.settings.enableSearch && this.filterControl.value && this.filterControl.value.length > 0;
    };
    MultiselectDropdown.prototype.checkAll = function() {
        var _this = this;
        if (!this.disabledSelection) {
            var checkedOptions = (!this.searchFilterApplied() ? this.options : this.filteredOptions)
                .filter(function(option) {
                    if (_this.model.indexOf(option.id) === -1) {
                        _this.onAdded.emit(option.id);
                        return true;
                    }
                    return false;
                }).map(function(option) { return option.id; });
            this.model = this.model.concat(checkedOptions);
            this.onModelChange(this.model);
            this.onModelTouched();
        }
    };
    MultiselectDropdown.prototype.uncheckAll = function() {
        var _this = this;
        if (!this.disabledSelection) {
            var unCheckedOptions_1 = (!this.searchFilterApplied() ? this.model :
                this.filteredOptions.map(function(option) { return option.id; }));
            this.model = this.model.filter(function(id) {
                if (((unCheckedOptions_1.indexOf(id) < 0) && (_this.settings.minSelectionLimit === undefined)) || ((unCheckedOptions_1.indexOf(id) < _this.settings.minSelectionLimit))) {
                    return true;
                } else {
                    _this.onRemoved.emit(id);
                    return false;
                }
            });
            this.onModelChange(this.model);
            this.onModelTouched();
        }
    };
    MultiselectDropdown.prototype.preventCheckboxCheck = function(event, option) {
        if (this.settings.selectionLimit && !this.settings.autoUnselect &&
            this.model.length >= this.settings.selectionLimit &&
            this.model.indexOf(option.id) === -1 &&
            event.preventDefault) {
            event.preventDefault();
        }
    };
    MultiselectDropdown.prototype.isCheckboxDisabled = function() {
        return this.disabledSelection;
    };
    MultiselectDropdown.prototype.checkScrollPosition = function(ev) {
        var scrollTop = ev.target.scrollTop;
        var scrollHeight = ev.target.scrollHeight;
        var scrollElementHeight = ev.target.clientHeight;
        var roundingPixel = 1;
        var gutterPixel = 1;
        if (scrollTop >= scrollHeight - (1 + this.settings.loadViewDistance) * scrollElementHeight - roundingPixel - gutterPixel) {
            this.load();
        }
    };
    MultiselectDropdown.prototype.checkScrollPropagation = function(ev, element) {
        var scrollTop = element.scrollTop;
        var scrollHeight = element.scrollHeight;
        var scrollElementHeight = element.clientHeight;
        if ((ev.deltaY > 0 && scrollTop + scrollElementHeight >= scrollHeight) || (ev.deltaY < 0 && scrollTop <= 0)) {
            ev = ev || window.event;
            ev.preventDefault && ev.preventDefault();
            ev.returnValue = false;
        }
    };
    MultiselectDropdown.prototype.load = function() {
        this.onLazyLoad.emit({
            length: this.options.length,
            filter: this.filterControl.value
        });
    };
    return MultiselectDropdown;
}());
export { MultiselectDropdown };
MultiselectDropdown.decorators = [{
    type: Component,
    args: [{
        selector: 'ss-multiselect-dropdown',
        template: `
        <div *ngIf="!settings.addingOption" class="dropdown selection" [ngClass]="settings.containerClasses" [class.open]="isVisible"><button type="button" class="dropdown-toggle" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;padding-right: 35px;" [ngClass]="settings.buttonClasses" (click)="toggleDropdown()" [disabled]="disabled">{{ title }}<span _ngcontent-c42="" class="arrow cmx-icon-straight-arrow-down" style="right: 12px;position: absolute;line-height: 24px;color: #37A7F8;"></span></button>
            <ul #scroller *ngIf="isVisible" class="dropdown-menu" (scroll)="settings.isLazyLoad ? checkScrollPosition($event) : null" (wheel)="settings.stopScrollPropagation ? checkScrollPropagation($event, scroller) : null" [class.pull-right]="settings.pullRight"
                [class.dropdown-menu-right]="settings.pullRight" [style.max-height]="settings.maxHeight" style="border: 1px solid #ACAEBA;margin-left: -1px;overflow-x: hidden;display: block; height: auto; overflow-y: auto">
                <li class="dropdown-item search" *ngIf="settings.enableSearch">
                    <div class="input-group input-group-sm"><span class="input-group-addon" id="sizing-addon3"><i class="fa fa-search"></i></span> <input type="text" class="form-control" placeholder="{{ texts.searchPlaceholder }}" aria-describedby="sizing-addon3" [formControl]="filterControl" autofocus>                <span class="input-group-btn" *ngIf="filterControl.value.length > 0"><button class="btn btn-default btn-secondary" type="button" (click)="clearSearch($event)"><i class="fa fa-times"></i></button></span></div>
                </li>
                <li class="dropdown-item check-control check-control-check" *ngIf="settings.showCheckAll && !disabledSelection"><a href="javascript:;" role="menuitem" tabindex="-1" (click)="checkAll()"><span style="width: 16px" [ngClass]="{\'glyphicon glyphicon-ok\': settings.checkedStyle !== \'fontawesome\',\'fa fa-check\': settings.checkedStyle === \'fontawesome\'}"></span> {{ texts.checkAll }}</a></li>
                <li class="dropdown-item check-control check-control-uncheck" *ngIf="settings.showUncheckAll && !disabledSelection"><a href="javascript:;" role="menuitem" tabindex="-1" (click)="uncheckAll()"><span style="width: 16px" [ngClass]="{\'glyphicon glyphicon-remove\': settings.checkedStyle !== \'fontawesome\',\'fa fa-times\': settings.checkedStyle === \'fontawesome\'}"></span> {{ texts.uncheckAll }}</a></li>
                <li *ngIf="!renderItems" class="dropdown-item empty">{{ texts.searchNoRenderText }}</li>
                <li *ngIf="renderItems && !renderFilteredOptions.length" class="dropdown-item empty">{{ texts.searchEmptyResult }}</li>
                <li class="dropdown-item" *ngFor="let option of renderFilteredOptions" (click)="setSelected($event, option)" [ngStyle]="getItemStyle(option)" [ngClass]="option.classes" [class.dropdown-header]="option.isLabel">
                    <a style="text-decoration: none;" *ngIf="!option.isLabel; else label" href="javascript:;" role="menuitem" tabindex="-1" [style.padding-left]="this.parents.length>0&&this.parents.indexOf(option.id)<0&&\'30px\'" [ngStyle]="getItemStyleSelectionDisabled()">
                        <ng-container [ngSwitch]="settings.checkedStyle"><input *ngSwitchCase="\'checkboxes\'" type="checkbox" [checked]="isSelected(option)" (click)="preventCheckboxCheck($event, option)" [disabled]="isCheckboxDisabled()" [ngStyle]="getItemStyleSelectionDisabled()"> <span *ngSwitchCase="\'glyphicon\'"
                                style="width: 16px" class="glyphicon" [class.glyphicon-ok]="isSelected(option)"></span> <span *ngSwitchCase="\'fontawesome\'" style="width: 16px;display: inline-block"><i *ngIf="isSelected(option)" class="fa fa-check" aria-hidden="true"></i></span></ng-container>
                        <span [ngClass]="settings.itemClasses" style="color: #2A2A2A;font-family: Roboto;font-size: 14px;font-weight: bold;line-height: 19px;" [style.font-weight]="this.parents.indexOf(option.id)>=0?\'bold\':\'normal\'">{{ option.name }}</span>
                    </a>
                    <ng-template #label>{{ option.name }}</ng-template>
                </li>
                <li class="addMoreOption" (click)="addOption()" *ngIf="settings.addOption"><span>{{ texts.createNew }}</span></li>
            </ul>
        </div>
        <div *ngIf="settings.addingOption" class="add-option-container">
            <span>
                <label>Name:</label>
                <input (keyup)="manualInputChanged()" [(ngModel)]="manualInput.name" id="contact-name" name="Contact name" type="text" />
            </span>
            <span>
                <label>Phone number:</label>
                <input (keypress)="onlyNumberKey($event)" (keyup)="manualInputChanged()" [(ngModel)]="manualInput.phone" type="text" name="Contact number" id="contact-phone" />
            </span>
        </div>
        <div class="button-ghost button-cancel" *ngIf="settings.addingOption" (click)="cancel()">Cancel</div>
        `,
        styles: ['a {outline: none !important;}.dropdown.selection { min-height: 48px; } .dropdown-inline {display: inline-block; width: 100%}.dropdown-toggle:focus{box-shadow: none;}.dropdown-toggle::after{display: none}.dropdown-toggle .caret { margin-left: 4px;  white-space: nowrap;  display: inline-block;}.dropdown-toggle{overflow: hidden; background-color: transparent; border: none;text-align: left; color: #495057; line-height: 24px;}.dropdown-menu{background: white;width: calc(100% + 4px); border-radius: 0;}.input-group-addon{background: none;border: none;border-bottom: 1px solid #e6e6e6;padding-bottom: 10px;border-radius: 0;}.dropdown-item.search:focus{background: none;outline: 0;}.dropdown-item.search:hover{background: none;}.dropdown-item.search input{border: none;border-bottom: 1px solid #e6e6e6;padding-bottom: 10px;}.dropdown-item.search{margin-bottom: 20px;}.dropdown{border: 1px solid #ACAEBA; padding: 3px 0;background: white;border-radius: 3px;}.dropdown-item:active{background: none}.dropdown-item:hover{background: none}.dropdown-item{cursor: pointer; padding: 0 10px; font-size: 14px;margin-bottom: 10px;}.dropdown-menu .dropdown-item a{color: #2d2d2d}.search .fa-search{color: #37A8F8;font-size: 16px;}.input-group-btn .btn{background: none; border: 0;border-bottom: 1px solid #e6e6e6;padding-bottom: 9px;}.input-group-btn .btn .fa{color: #2d2d2d;}.dropdown-menu::-webkit-scrollbar-track{border-radius: 10px;background-color: #FFFFFF;}.dropdown-menu::-webkit-scrollbar{width: 7px;background-color: #F5F5F5;}.dropdown-menu::-webkit-scrollbar-thumb{border-radius: 10px; background-color: #00ACF9;}.addMoreOption{ width: 100%; padding: 0 10px; text-transform: uppercase; color: #37A8F8; font-size: 14px; font-weight: bold;}.addMoreOption span{cursor: pointer; width: 100%; display: inline-block;}.add-option-container label{color: #9CA4AE; font-size: 12px; display: block}.add-option-container input{width: 100%;font-size: 1rem; line-height: 1rem; border-radius: 3px; height: 48px; padding: 16px;border: 1px solid #ACAEBA;}.add-option-container span{display: inline-block; width: 100%; margin-bottom: 10px;} .button-cancel { float: right; font-size: 12px; padding: 4px 8px; }.location-dropdown .dropdown-menu{width: auto !important; min-width: 100% !important;}'],
        providers: [MULTISELECT_VALUE_ACCESSOR, MultiSelectSearchFilter]
    }, ]
}, ];
/** @nocollapse */
MultiselectDropdown.ctorParameters = function() {
    return [
        { type: ElementRef, },
        { type: FormBuilder, },
        { type: MultiSelectSearchFilter, },
        { type: IterableDiffers, },
    ];
};
MultiselectDropdown.propDecorators = {
    'options': [{ type: Input }, ],
    'settings': [{ type: Input }, ],
    'texts': [{ type: Input }, ],
    'disabled': [{ type: Input }, ],
    'disabledSelection': [{ type: Input }, ],
    'selectionLimitReached': [{ type: Output }, ],
    'dropdownClosed': [{ type: Output }, ],
    'dropdownOpened': [{ type: Output }, ],
    'onAdded': [{ type: Output }, ],
    'onCancel': [{ type: Output }, ],
    'onDeselect': [{ type: Output }, ],
    'onRemoved': [{ type: Output }, ],
    'onLazyLoad': [{ type: Output }, ],
    'onFilter': [{ type: Output }, ],
    'onClick': [{ type: HostListener, args: ['document: click', ['$event.target'], ] }, ],
};