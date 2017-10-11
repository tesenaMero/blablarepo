"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var animations_1 = require("@angular/animations");
var forms_1 = require("@angular/forms");
var date_fns_1 = require("date-fns");
var numberedFixLen_pipe_1 = require("./numberedFixLen.pipe");
var DialogType;
(function (DialogType) {
    DialogType[DialogType["Time"] = 0] = "Time";
    DialogType[DialogType["Date"] = 1] = "Date";
    DialogType[DialogType["Month"] = 2] = "Month";
    DialogType[DialogType["Year"] = 3] = "Year";
})(DialogType = exports.DialogType || (exports.DialogType = {}));
exports.DATETIMEPICKER_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return DateTimePickerComponent; }),
    multi: true
};
var DateTimePickerComponent = (function () {
    function DateTimePickerComponent(renderer, numFixedLenPipe) {
        this.renderer = renderer;
        this.numFixedLenPipe = numFixedLenPipe;
        this.dataType = 'date';
        this.dateFormat = 'YYYY/MM/DD HH:mm';
        this.disabledDates = [];
        this.placeHolder = 'yyyy/mm/dd hh:mm';
        this.readonlyInput = true;
        this.selectionMode = 'single';
        this.type = 'both';
        this.hourFormat = '24';
        this.showOtherMonths = true;
        this.onFocus = new core_1.EventEmitter();
        this.onClose = new core_1.EventEmitter();
        this.onBlur = new core_1.EventEmitter();
        this.onInvalid = new core_1.EventEmitter();
        this.calendarYears = [];
        this.dialogType = DialogType.Date;
        this.formattedValue = '';
        this.meridianValue = 'AM';
        this._locale = {
            firstDayOfWeek: 0,
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dateFns: null
        };
        this.valueIndex = 0;
        this.inputValueChanged = false;
        this.onModelChange = function () {
        };
        this.onModelTouched = function () {
        };
    }
    Object.defineProperty(DateTimePickerComponent.prototype, "max", {
        get: function () {
            return this._max;
        },
        set: function (val) {
            this._max = this.parseToDate(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTimePickerComponent.prototype, "min", {
        get: function () {
            return this._min;
        },
        set: function (val) {
            this._min = this.parseToDate(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTimePickerComponent.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        set: function (val) {
            this._locale = Object.assign({}, this._locale, val);
        },
        enumerable: true,
        configurable: true
    });
    DateTimePickerComponent.prototype.ngOnInit = function () {
        this.pickerMoment = this.defaultMoment ? this.parseToDate(this.defaultMoment) : new Date();
        this.generateWeekDays();
        this.generateMonthList();
        this.generateCalendar();
        this.updateTimer(null);
    };
    DateTimePickerComponent.prototype.ngOnDestroy = function () {
        this.unbindDocumentClickListener();
    };
    DateTimePickerComponent.prototype.writeValue = function (obj) {
        if (obj instanceof Array) {
            this.value = [];
            for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
                var o = obj_1[_i];
                var v = this.parseToDate(o);
                this.value.push(v);
            }
            this.updateCalendar(this.value[0]);
            this.updateTimer(this.value[0]);
        }
        else {
            this.value = this.parseToDate(obj);
            this.updateCalendar(this.value);
            this.updateTimer(this.value);
        }
        this.updateFormattedValue();
    };
    DateTimePickerComponent.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    DateTimePickerComponent.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    DateTimePickerComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    DateTimePickerComponent.prototype.onInputUpdate = function (event) {
        this.inputValueChanged = true;
        var value = this.parseValueFromString(event.target.value);
        if (!value) {
            this.value = null;
        }
        else if (this.isSingleSelection()) {
            if (!this.isValidValue(value)) {
                value = null;
            }
            this.value = value;
            this.updateCalendar(this.value);
            this.updateTimer(this.value);
        }
        else if (this.isMultiSelection()) {
            for (var i = 0; i < value.length; i++) {
                if (!this.isValidValue(value[i])) {
                    value[i] = null;
                }
            }
            this.value = value;
            this.updateCalendar(this.value[0]);
            this.updateTimer(this.value[0]);
        }
        else if (this.isRangeSelection()) {
            for (var i = 0; i < value.length; i++) {
                if (!this.isValidValue(value[i])) {
                    value[i] = null;
                }
            }
            if (value[0] && value[1] && date_fns_1.isAfter(value[0], value[1])) {
                value[1] = null;
            }
            this.value = value;
            this.updateCalendar(this.value[0]);
            this.updateTimer(this.value[0]);
        }
        this.updateModel(this.value);
    };
    DateTimePickerComponent.prototype.onInputClick = function (event) {
        if (this.disabled) {
            event.preventDefault();
            return;
        }
        this.dialogClick = true;
        if (!this.dialogVisible) {
            this.show();
        }
        event.preventDefault();
        return;
    };
    DateTimePickerComponent.prototype.onInputFocus = function (event) {
        this.focus = true;
        this.onFocus.emit(event);
        event.preventDefault();
        return;
    };
    DateTimePickerComponent.prototype.onInputBlur = function (event) {
        this.focus = false;
        if (this.inputValueChanged) {
            this.updateFormattedValue();
            this.inputValueChanged = false;
        }
        this.onModelTouched();
        this.onBlur.emit(event);
        event.preventDefault();
        return;
    };
    DateTimePickerComponent.prototype.onDialogClick = function (event) {
        this.dialogClick = true;
    };
    DateTimePickerComponent.prototype.onConfirmClick = function (event) {
        this.updateModel(this.value);
        this.hide(event);
        return;
    };
    DateTimePickerComponent.prototype.onCloseClick = function (event) {
        this.hide(event);
        return;
    };
    DateTimePickerComponent.prototype.prevMonth = function (event) {
        if (this.disabled) {
            event.preventDefault();
            return;
        }
        this.pickerMoment = date_fns_1.addMonths(this.pickerMoment, -1);
        this.generateCalendar();
        event.preventDefault();
        return;
    };
    DateTimePickerComponent.prototype.nextMonth = function (event) {
        if (this.disabled) {
            event.preventDefault();
            return;
        }
        this.pickerMoment = date_fns_1.addMonths(this.pickerMoment, 1);
        this.generateCalendar();
        event.preventDefault();
        return;
    };
    DateTimePickerComponent.prototype.selectDate = function (event, date) {
        if (this.disabled || !date) {
            event.preventDefault();
            return;
        }
        var temp;
        if (this.isValidValue(date)) {
            temp = date;
        }
        else {
            if (date_fns_1.isSameDay(date, this._min)) {
                temp = this._min;
            }
            else if (date_fns_1.isSameDay(date, this._max)) {
                temp = this._max;
            }
            else {
                this.onInvalid.emit({ originalEvent: event, value: date });
                return;
            }
        }
        var selected;
        if (this.isSingleSelection()) {
            if (!date_fns_1.isSameDay(this.value, temp)) {
                selected = temp;
            }
        }
        else if (this.isRangeSelection()) {
            if (this.value && this.value.length) {
                var startDate = this.value[0];
                var endDate = this.value[1];
                if (!endDate && temp.getTime() > startDate.getTime()) {
                    endDate = temp;
                    this.valueIndex = 1;
                }
                else {
                    startDate = temp;
                    endDate = null;
                    this.valueIndex = 0;
                }
                selected = [startDate, endDate];
            }
            else {
                selected = [temp, null];
                this.valueIndex = 0;
            }
        }
        else if (this.isMultiSelection()) {
            if (this.maxDateCount && this.value &&
                this.value.length && this.value.length >= this.maxDateCount) {
                this.onInvalid.emit({ originalEvent: event, value: 'Exceed max date count.' });
                return;
            }
            if (this.isSelectedDay(temp)) {
                selected = this.value.filter(function (d) {
                    return !date_fns_1.isSameDay(d, temp);
                });
            }
            else {
                selected = this.value ? this.value.concat([temp]) : [temp];
                this.valueIndex = selected.length - 1;
            }
        }
        if (selected) {
            this.updateModel(selected);
            if (this.value instanceof Array) {
                this.updateCalendar(this.value[this.valueIndex]);
                this.updateTimer(this.value[this.valueIndex]);
            }
            else {
                this.updateCalendar(this.value);
                this.updateTimer(this.value);
            }
            this.updateFormattedValue();
        }
        if (this.autoClose) {
            this.hide(event);
        }
    };
    DateTimePickerComponent.prototype.selectMonth = function (monthNum) {
        this.pickerMoment = date_fns_1.setMonth(this.pickerMoment, monthNum);
        this.generateCalendar();
        this.changeDialogType(DialogType.Month);
    };
    DateTimePickerComponent.prototype.selectYear = function (yearNum) {
        this.pickerMoment = date_fns_1.setYear(this.pickerMoment, yearNum);
        this.generateCalendar();
        this.changeDialogType(DialogType.Year);
    };
    DateTimePickerComponent.prototype.toggleMeridian = function (event) {
        var value = this.value ? (this.value.length ? this.value[this.valueIndex] : this.value) : null;
        if (this.disabled) {
            event.preventDefault();
            return;
        }
        if (!value) {
            this.meridianValue = this.meridianValue === 'AM' ? 'PM' : 'AM';
            return;
        }
        var hours = date_fns_1.getHours(value);
        if (this.meridianValue === 'AM') {
            hours += 12;
        }
        else if (this.meridianValue === 'PM') {
            hours -= 12;
        }
        var selectedTime = date_fns_1.setHours(value, hours);
        this.setSelectedTime(selectedTime);
        event.preventDefault();
        return;
    };
    DateTimePickerComponent.prototype.setHours = function (event, val, input) {
        var value;
        if (this.value) {
            if (this.value.length) {
                value = this.value[this.valueIndex];
            }
            else {
                value = this.value;
            }
        }
        else {
            if (this.type === 'timer') {
                value = new Date();
            }
            else {
                value = null;
            }
        }
        if (this.disabled || !value) {
            event.preventDefault();
            return false;
        }
        var hours = date_fns_1.getHours(value);
        if (val === 'increase') {
            hours += 1;
        }
        else if (val === 'decrease') {
            hours -= 1;
        }
        else {
            hours = val;
        }
        if (hours > 23) {
            hours = 0;
        }
        else if (hours < 0) {
            hours = 23;
        }
        var selectedTime = date_fns_1.setHours(value, hours);
        var done = this.setSelectedTime(selectedTime);
        if (input) {
            setTimeout(function () {
                input.focus();
            }, 0);
        }
        event.preventDefault();
        return done;
    };
    DateTimePickerComponent.prototype.setMinutes = function (event, val, input) {
        var value;
        if (this.value) {
            if (this.value.length) {
                value = this.value[this.valueIndex];
            }
            else {
                value = this.value;
            }
        }
        else {
            if (this.type === 'timer') {
                value = new Date();
            }
            else {
                value = null;
            }
        }
        if (this.disabled || !value) {
            event.preventDefault();
            return false;
        }
        var minutes = date_fns_1.getMinutes(value);
        if (val === 'increase') {
            minutes += 1;
        }
        else if (val === 'decrease') {
            minutes -= 1;
        }
        else {
            minutes = val;
        }
        if (minutes > 59) {
            minutes = 0;
        }
        else if (minutes < 0) {
            minutes = 59;
        }
        var selectedTime = date_fns_1.setMinutes(value, minutes);
        var done = this.setSelectedTime(selectedTime);
        if (input) {
            setTimeout(function () {
                input.focus();
            }, 0);
        }
        event.preventDefault();
        return done;
    };
    DateTimePickerComponent.prototype.setSeconds = function (event, val, input) {
        var value;
        if (this.value) {
            if (this.value.length) {
                value = this.value[this.valueIndex];
            }
            else {
                value = this.value;
            }
        }
        else {
            if (this.type === 'timer') {
                value = new Date();
            }
            else {
                value = null;
            }
        }
        if (this.disabled || !value) {
            event.preventDefault();
            return false;
        }
        var seconds = date_fns_1.getSeconds(value);
        if (val === 'increase') {
            seconds = this.secValue + 1;
        }
        else if (val === 'decrease') {
            seconds = this.secValue - 1;
        }
        else {
            seconds = val;
        }
        if (seconds > 59) {
            seconds = 0;
        }
        else if (seconds < 0) {
            seconds = 59;
        }
        var selectedTime = date_fns_1.setSeconds(value, seconds);
        var done = this.setSelectedTime(selectedTime);
        if (input) {
            setTimeout(function () {
                input.focus();
            }, 0);
        }
        event.preventDefault();
        return done;
    };
    DateTimePickerComponent.prototype.isSelectedDay = function (date) {
        if (this.isSingleSelection()) {
            return this.value && date_fns_1.isSameDay(this.value, date);
        }
        else if (this.isRangeSelection() && this.value && this.value.length) {
            if (this.value[1]) {
                return (date_fns_1.isSameDay(this.value[0], date) || date_fns_1.isSameDay(this.value[1], date) ||
                    this.isDayBetween(this.value[0], this.value[1], date)) && this.isValidDay(date);
            }
            else {
                return date_fns_1.isSameDay(this.value[0], date);
            }
        }
        else if (this.isMultiSelection() && this.value && this.value.length) {
            var selected = void 0;
            for (var _i = 0, _a = this.value; _i < _a.length; _i++) {
                var d = _a[_i];
                selected = date_fns_1.isSameDay(d, date);
                if (selected) {
                    break;
                }
            }
            return selected;
        }
        return false;
    };
    DateTimePickerComponent.prototype.isDayBetween = function (start, end, day) {
        if (start && end) {
            return date_fns_1.isAfter(day, start) && date_fns_1.isBefore(day, end);
        }
        else {
            return false;
        }
    };
    DateTimePickerComponent.prototype.isValidDay = function (date) {
        var isValid = true;
        if (this.disabledDates && this.disabledDates.length) {
            for (var _i = 0, _a = this.disabledDates; _i < _a.length; _i++) {
                var disabledDate = _a[_i];
                if (date_fns_1.isSameDay(disabledDate, date)) {
                    return false;
                }
            }
        }
        if (isValid && this.disabledDays && this.disabledDays.length) {
            var weekdayNum = date_fns_1.getDay(date);
            isValid = this.disabledDays.indexOf(weekdayNum) === -1;
        }
        if (isValid && this.min) {
            isValid = isValid && !date_fns_1.isBefore(date, date_fns_1.startOfDay(this.min));
        }
        if (isValid && this.max) {
            isValid = isValid && !date_fns_1.isAfter(date, date_fns_1.startOfDay(this.max));
        }
        return isValid;
    };
    DateTimePickerComponent.prototype.isCurrentMonth = function (monthNum) {
        return date_fns_1.getMonth(this.pickerMoment) == monthNum;
    };
    DateTimePickerComponent.prototype.isCurrentYear = function (yearNum) {
        return date_fns_1.getYear(this.pickerMoment) == yearNum;
    };
    DateTimePickerComponent.prototype.changeDialogType = function (type) {
        if (this.dialogType === type) {
            this.dialogType = DialogType.Date;
            return;
        }
        else {
            this.dialogType = type;
        }
        if (this.dialogType === DialogType.Year) {
            this.generateYearList();
        }
    };
    DateTimePickerComponent.prototype.onTimerInputBlur = function (event, input, type, modelValue) {
        var val = +input.value;
        if (this.disabled || val === modelValue) {
            event.preventDefault();
            return;
        }
        var done;
        if (!isNaN(val)) {
            switch (type) {
                case 'hours':
                    if (this.hourFormat === '24' &&
                        val >= 0 && val <= 23) {
                        done = this.setHours(event, val);
                    }
                    else if (this.hourFormat === '12'
                        && val >= 1 && val <= 12) {
                        if (this.meridianValue === 'AM' && val === 12) {
                            val = 0;
                        }
                        else if (this.meridianValue === 'PM' && val < 12) {
                            val = val + 12;
                        }
                        done = this.setHours(event, val);
                    }
                    break;
                case 'minutes':
                    if (val >= 0 && val <= 59) {
                        done = this.setMinutes(event, val);
                    }
                    break;
                case 'seconds':
                    if (val >= 0 && val <= 59) {
                        done = this.setSeconds(event, val);
                    }
                    break;
            }
        }
        if (!done) {
            input.value = this.numFixedLenPipe.transform(modelValue, 2);
            return;
        }
        event.preventDefault();
        return;
    };
    DateTimePickerComponent.prototype.clearValue = function (event) {
        this.dialogClick = true;
        this.updateModel(null);
        this.updateTimer(this.value);
        this.updateFormattedValue();
        event.preventDefault();
    };
    DateTimePickerComponent.prototype.show = function () {
        this.alignDialog();
        this.dialogVisible = true;
        this.dialogType = DialogType.Date;
        this.bindDocumentClickListener();
        return;
    };
    DateTimePickerComponent.prototype.hide = function (event) {
        this.dialogVisible = false;
        this.onClose.emit({ event: event });
        this.unbindDocumentClickListener();
        return;
    };
    DateTimePickerComponent.prototype.alignDialog = function () {
        var element = this.dialogElm.nativeElement;
        var target = this.containerElm.nativeElement;
        var elementDimensions = element.offsetParent ? {
            width: element.offsetWidth,
            height: element.offsetHeight
        } : this.getHiddenElementDimensions(element);
        var targetHeight = target.offsetHeight;
        var targetWidth = target.offsetWidth;
        var targetOffset = target.getBoundingClientRect();
        var viewport = this.getViewport();
        var top, left;
        if ((targetOffset.top + targetHeight + elementDimensions.height) > viewport.height) {
            top = -1 * (elementDimensions.height);
            if (targetOffset.top + top < 0) {
                top = 0;
            }
        }
        else {
            top = targetHeight;
        }
        if ((targetOffset.left + elementDimensions.width) > viewport.width)
            left = targetWidth - elementDimensions.width;
        else
            left = 0;
        element.style.top = top + 'px';
        element.style.left = left + 'px';
    };
    DateTimePickerComponent.prototype.bindDocumentClickListener = function () {
        var _this = this;
        var firstClick = true;
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', function (event) {
                if (!firstClick && !_this.dialogClick) {
                    _this.hide(event);
                }
                firstClick = false;
                _this.dialogClick = false;
            });
        }
        return;
    };
    DateTimePickerComponent.prototype.unbindDocumentClickListener = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
        return;
    };
    DateTimePickerComponent.prototype.parseToDate = function (val) {
        if (!val) {
            return;
        }
        var parsedVal;
        if (typeof val === 'string') {
            parsedVal = date_fns_1.parse(val);
        }
        else {
            parsedVal = val;
        }
        return date_fns_1.isValid(parsedVal) ? parsedVal : null;
    };
    DateTimePickerComponent.prototype.generateCalendar = function () {
        if (!this.pickerMoment) {
            return;
        }
        this.calendarDays = [];
        var startDateOfMonth = date_fns_1.startOfMonth(this.pickerMoment);
        var startWeekdayOfMonth = date_fns_1.getDay(startDateOfMonth);
        var dayDiff = 0 - (startWeekdayOfMonth + (7 - this.locale.firstDayOfWeek)) % 7;
        for (var i = 1; i < 7; i++) {
            var week = [];
            for (var j = 0; j < 7; j++) {
                var date = date_fns_1.addDays(startDateOfMonth, dayDiff);
                var inOtherMonth = !date_fns_1.isSameMonth(date, this.pickerMoment);
                week.push({
                    date: date,
                    num: date_fns_1.getDate(date),
                    today: date_fns_1.isToday(date),
                    otherMonth: inOtherMonth,
                    hide: !this.showOtherMonths && inOtherMonth,
                });
                dayDiff += 1;
            }
            this.calendarDays.push(week);
        }
        this.pickerMonth = this.locale.monthNames[date_fns_1.getMonth(this.pickerMoment)];
        this.pickerYear = date_fns_1.getYear(this.pickerMoment).toString();
    };
    DateTimePickerComponent.prototype.generateWeekDays = function () {
        if (this.type === 'timer') {
            return;
        }
        this.calendarWeekdays = [];
        var dayIndex = this.locale.firstDayOfWeek;
        for (var i = 0; i < 7; i++) {
            this.calendarWeekdays.push(this.locale.dayNamesShort[dayIndex]);
            dayIndex = (dayIndex == 6) ? 0 : ++dayIndex;
        }
        return;
    };
    DateTimePickerComponent.prototype.generateMonthList = function () {
        if (this.type === 'timer') {
            return;
        }
        this.calendarMonths = [];
        var monthIndex = 0;
        for (var i = 0; i < 4; i++) {
            var months = [];
            for (var j = 0; j < 3; j++) {
                months.push(this.locale.monthNamesShort[monthIndex]);
                monthIndex += 1;
            }
            this.calendarMonths.push(months);
        }
        return;
    };
    DateTimePickerComponent.prototype.generateYearList = function (dir) {
        if (!this.pickerMoment) {
            return;
        }
        var start;
        if (dir === 'prev') {
            start = +this.calendarYears[0][0] - 12;
        }
        else if (dir === 'next') {
            start = +this.calendarYears[3][2] + 1;
        }
        else {
            start = date_fns_1.getYear(date_fns_1.addYears(this.pickerMoment, -4));
        }
        for (var i = 0; i < 4; i++) {
            var years = [];
            for (var j = 0; j < 3; j++) {
                var year = (start + i * 3 + j).toString();
                years.push(year);
            }
            this.calendarYears[i] = years;
        }
        return;
    };
    DateTimePickerComponent.prototype.updateCalendar = function (value) {
        if (this.type === 'timer') {
            return;
        }
        if (value && (!this.calendarDays || !date_fns_1.isSameMonth(value, this.pickerMoment))) {
            this.pickerMoment = date_fns_1.setMonth(this.pickerMoment, date_fns_1.getMonth(value));
            this.pickerMoment = date_fns_1.setYear(this.pickerMoment, date_fns_1.getYear(value));
            this.generateCalendar();
        }
        else if (!value && !this.calendarDays) {
            this.generateCalendar();
        }
        return;
    };
    DateTimePickerComponent.prototype.updateTimer = function (value) {
        if (this.type === 'calendar') {
            return false;
        }
        if (!value && !this.defaultMoment) {
            this.hourValue = null;
            this.minValue = null;
            this.secValue = null;
            return true;
        }
        var time = value || this.parseToDate(this.defaultMoment);
        var hours = date_fns_1.getHours(time);
        if (this.hourFormat === '12') {
            if (hours < 12 && hours > 0) {
                this.hourValue = hours;
                this.meridianValue = 'AM';
            }
            else if (hours > 12) {
                this.hourValue = hours - 12;
                this.meridianValue = 'PM';
            }
            else if (hours === 12) {
                this.hourValue = 12;
                this.meridianValue = 'PM';
            }
            else if (hours === 0) {
                this.hourValue = 12;
                this.meridianValue = 'AM';
            }
        }
        else if (this.hourFormat === '24') {
            this.hourValue = hours;
        }
        this.minValue = date_fns_1.getMinutes(time);
        this.secValue = date_fns_1.getSeconds(time);
        return true;
    };
    DateTimePickerComponent.prototype.updateModel = function (value) {
        this.value = value;
        if (this.dataType === 'date') {
            this.onModelChange(this.value);
        }
        else if (this.dataType === 'string') {
            if (this.value && this.value.length) {
                var formatted = [];
                for (var _i = 0, _a = this.value; _i < _a.length; _i++) {
                    var v = _a[_i];
                    if (v) {
                        formatted.push(date_fns_1.format(v, this.dateFormat, { locale: this.locale.dateFns }));
                    }
                    else {
                        formatted.push(null);
                    }
                }
                this.onModelChange(formatted);
            }
            else {
                this.onModelChange(date_fns_1.format(this.value, this.dateFormat, { locale: this.locale.dateFns }));
            }
        }
        return true;
    };
    DateTimePickerComponent.prototype.updateFormattedValue = function () {
        var formattedValue = '';
        if (this.value) {
            if (this.isSingleSelection()) {
                formattedValue = date_fns_1.format(this.value, this.dateFormat, { locale: this.locale.dateFns });
            }
            else if (this.isRangeSelection()) {
                var startDate = this.value[0];
                var endDate = this.value[1];
                formattedValue = date_fns_1.format(startDate, this.dateFormat, { locale: this.locale.dateFns });
                if (endDate) {
                    formattedValue += ' - ' + date_fns_1.format(endDate, this.dateFormat, { locale: this.locale.dateFns });
                }
                else {
                    formattedValue += ' - ' + this.dateFormat;
                }
            }
            else if (this.isMultiSelection()) {
                for (var i = 0; i < this.value.length; i++) {
                    var dateAsString = date_fns_1.format(this.value[i], this.dateFormat, { locale: this.locale.dateFns });
                    formattedValue += dateAsString;
                    if (i !== (this.value.length - 1)) {
                        formattedValue += ', ';
                    }
                }
            }
        }
        this.formattedValue = formattedValue;
        return;
    };
    DateTimePickerComponent.prototype.setSelectedTime = function (val) {
        var done;
        if (this.isValidValue(val)) {
            if (this.value instanceof Array) {
                this.value[this.valueIndex] = val;
                done = this.updateModel(this.value);
                done = done && this.updateTimer(this.value[this.valueIndex]);
            }
            else {
                done = this.updateModel(val);
                done = done && this.updateTimer(this.value);
            }
            this.updateFormattedValue();
        }
        else {
            this.onInvalid.emit({ originalEvent: event, value: val });
            done = false;
        }
        return done;
    };
    DateTimePickerComponent.prototype.isValidValue = function (value) {
        var isValid = true;
        if (this.disabledDates && this.disabledDates.length) {
            for (var _i = 0, _a = this.disabledDates; _i < _a.length; _i++) {
                var disabledDate = _a[_i];
                if (date_fns_1.isSameDay(disabledDate, value)) {
                    return false;
                }
            }
        }
        if (isValid && this.disabledDays && this.disabledDays.length) {
            var weekdayNum = date_fns_1.getDay(value);
            isValid = this.disabledDays.indexOf(weekdayNum) === -1;
        }
        if (isValid && this.min) {
            isValid = isValid && !date_fns_1.isBefore(value, this.min);
        }
        if (isValid && this.max) {
            isValid = isValid && !date_fns_1.isAfter(value, this.max);
        }
        return isValid;
    };
    DateTimePickerComponent.prototype.isSingleSelection = function () {
        return this.selectionMode === 'single';
    };
    DateTimePickerComponent.prototype.isRangeSelection = function () {
        return this.selectionMode === 'range';
    };
    DateTimePickerComponent.prototype.isMultiSelection = function () {
        return this.selectionMode === 'multiple';
    };
    DateTimePickerComponent.prototype.getHiddenElementDimensions = function (element) {
        var dimensions = {};
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        dimensions.width = element.offsetWidth;
        dimensions.height = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return dimensions;
    };
    DateTimePickerComponent.prototype.getViewport = function () {
        var win = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], w = win.innerWidth || e.clientWidth || g.clientWidth, h = win.innerHeight || e.clientHeight || g.clientHeight;
        return { width: w, height: h };
    };
    DateTimePickerComponent.prototype.parseValueFromString = function (text) {
        if (!text || text.trim().length === 0) {
            return null;
        }
        var value;
        if (this.isSingleSelection()) {
            value = this.parseToDate(text);
        }
        else if (this.isMultiSelection()) {
            var tokens = text.split(',');
            value = [];
            for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
                var token = tokens_1[_i];
                value.push(this.parseToDate(token.trim()));
            }
        }
        else if (this.isRangeSelection()) {
            var tokens = text.split(' - ');
            value = [];
            for (var i = 0; i < tokens.length; i++) {
                value[i] = this.parseToDate(tokens[i].trim());
            }
        }
        return value;
    };
    return DateTimePickerComponent;
}());
DateTimePickerComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'owl-date-time',
                template: "<div [ngClass]=\"{\n     'owl-dateTime owl-widget': true,\n     'owl-dateTime-inline': inline\n     }\" [class]=\"styleClass\" [ngStyle]=\"style\" #container><div *ngIf=\"!inline && customTemp.children.length == 0\" class=\"owl-dateTime-inputWrapper\"><input type=\"text\" [class]=\"inputStyleClass\" [ngClass]=\"{\n            'owl-dateTime-input owl-inputtext owl-state-default owl-corner-all': true,\n            'owl-state-focus': focus\n            }\" [ngStyle]=\"inputStyle\" [attr.placeholder]=\"placeHolder\" [attr.tabindex]=\"tabIndex\" [attr.id]=\"inputId\" [attr.required]=\"required\" [disabled]=\"disabled\" [value]=\"formattedValue\" [readonly]=\"readonlyInput\" (focus)=\"onInputFocus($event)\" (blur)=\"onInputBlur($event)\" (click)=\"onInputClick($event)\" (input)=\"onInputUpdate($event)\"> <i class=\"owl-dateTime-cancel icon icon-cancel\" *ngIf='false' [hidden]=\"!value\" (click)=\"clearValue($event)\"></i></div><!-- Workaround of ng-content default content (angular issue #12530) --><div [ngClass]=\"{'owl-dateTime-customTemp': customTemp.children.length !== 0}\" #customTemp (click)=\"onInputClick($event)\"><ng-content></ng-content></div><div class=\"owl-dateTime-dialog owl-state-default owl-corner-all\" [ngStyle]=\"{'display': inline ? 'inline-block' : null}\" [@fadeInOut]=\"dialogVisible? 'visible' : (!inline? 'hidden': null)\" (click)=\"onDialogClick($event)\" #dialog><div *ngIf=\"showHeader\" class=\"owl-dateTime-dialogHeader owl-corner-top\"><span *ngIf=\"value; else elseBlock\">{{formattedValue}}</span><ng-template #elseBlock><span>{{placeHolder}}</span></ng-template></div><div *ngIf=\"type ==='both' || type === 'calendar'\" class=\"owl-calendar-wrapper owl-corner-all\"><div class=\"owl-calendar-control\"><div class=\"owl-calendar-controlNav\"><span class=\"nav-prev\" (click)=\"prevMonth($event)\"></span></div><div class=\"owl-calendar-controlContent\"><span class=\"month-control\" (click)=\"changeDialogType(2)\">{{pickerMonth}}</span> <span class=\"year-control\" (click)=\"changeDialogType(3)\">{{pickerYear}}</span></div><div class=\"owl-calendar-controlNav\"><span class=\"nav-next\" (click)=\"nextMonth($event)\"></span></div></div><div class=\"owl-calendar\" [hidden]=\"dialogType !== 1\"><table class=\"owl-calendar-day\"><thead><tr class=\"owl-weekdays\"><th *ngFor=\"let weekDay of calendarWeekdays\" class=\"owl-weekday\" scope=\"col\"><span>{{weekDay}}</span></th></tr></thead><tbody><tr class=\"owl-days\" *ngFor=\"let week of calendarDays\"><td *ngFor=\"let d of week\" class=\"owl-day\" [ngClass]=\"{\n                        'owl-calendar-selected': isSelectedDay(d.date),\n                        'owl-calendar-invalid': !isValidDay(d.date),\n                        'owl-calendar-outFocus': d.otherMonth,\n                        'owl-calendar-hidden': d.hide,\n                        'owl-day-today': d.today\n                    }\" (click)=\"selectDate($event, d.date)\"><a>{{d.num}}</a></td></tr></tbody></table></div><div class=\"owl-calendar\" [hidden]=\"dialogType !== 2\"><table class=\"owl-calendar-month\"><tbody><tr class=\"owl-months\" *ngFor=\"let months of calendarMonths; let i = index\"><td *ngFor=\"let month of months; let j = index\" class=\"owl-month\" [ngClass]=\"{'owl-calendar-selected': isCurrentMonth(i*3 + j)}\" (click)=\"selectMonth(i*3 + j)\"><a>{{month}}</a></td></tr></tbody></table></div><div class=\"owl-calendar\" [hidden]=\"dialogType !== 3\"><table class=\"owl-calendar-year\"><tbody><tr class=\"owl-years\" *ngFor=\"let years of calendarYears\"><td class=\"owl-year\" *ngFor=\"let year of years\" [ngClass]=\"{'owl-calendar-selected': isCurrentYear(+year)}\" (click)=\"selectYear(+year)\"><a>{{year}}</a></td></tr></tbody></table><div class=\"owl-calendar-yearArrow left\" (click)=\"generateYearList('prev')\"><i class=\"icon icon-left-open\"></i></div><div class=\"owl-calendar-yearArrow right\" (click)=\"generateYearList('next')\"><i class=\"icon icon-right-open\"></i></div></div></div><div *ngIf=\"type ==='both' || type === 'timer'\" class=\"owl-timer-wrapper owl-corner-all\"><div class=\"owl-timer owl-hours\"><div class=\"owl-timer-control\" (click)=\"setHours($event, 'increase', hoursInput)\"><i class=\"icon icon-up-open\"></i></div><div class=\"owl-timer-text\"><input class=\"owl-timer-input owl-inputtext owl-state-default owl-corner-all\" placeholder=\"hh\" onfocus=\"this.select()\" [ngModel]=\"hourValue | numberFixedLen : 2\" (blur)=\"onTimerInputBlur($event, hoursInput, 'hours', hourValue)\" #hoursInput></div><div class=\"owl-timer-control\" (click)=\"setHours($event, 'decrease', hoursInput)\"><i class=\"icon icon-down-open\"></i></div></div><div class=\"owl-timer owl-minutes\"><div class=\"owl-timer-divider\"><span class=\"owl-timer-dot dot-top\"></span> <span class=\"owl-timer-dot dot-bottom\"></span></div><div class=\"owl-timer-control\" (click)=\"setMinutes($event, 'increase', minutesInput)\"><i class=\"icon icon-up-open\"></i></div><div class=\"owl-timer-text\"><input class=\"owl-timer-input owl-inputtext owl-state-default owl-corner-all\" placeholder=\"mm\" onfocus=\"this.select()\" [ngModel]=\"minValue | numberFixedLen : 2\" (blur)=\"onTimerInputBlur($event, minutesInput, 'minutes', minValue)\" #minutesInput></div><div class=\"owl-timer-control\" (click)=\"setMinutes($event, 'decrease', minutesInput)\"><i class=\"icon icon-down-open\"></i></div></div><div *ngIf=\"showSecondsTimer\" class=\"owl-timer owl-seconds\"><div class=\"owl-timer-divider\"><span class=\"owl-timer-dot dot-top\"></span> <span class=\"owl-timer-dot dot-bottom\"></span></div><div class=\"owl-timer-control\" (click)=\"setSeconds($event, 'increase', secondsInput)\"><i class=\"icon icon-up-open\"></i></div><div class=\"owl-timer-text\"><input class=\"owl-timer-input owl-inputtext owl-state-default owl-corner-all\" placeholder=\"ss\" onfocus=\"this.select()\" [ngModel]=\"secValue | numberFixedLen : 2\" (blur)=\"onTimerInputBlur($event, secondsInput, 'seconds', secValue)\" #secondsInput></div><div class=\"owl-timer-control\" (click)=\"setSeconds($event, 'decrease', secondsInput)\"><i class=\"icon icon-down-open\"></i></div></div><div *ngIf=\"hourFormat === '12'\" class=\"owl-timer owl-meridian\"><button class=\"owl-btn owl-meridian-btn\" (click)=\"toggleMeridian($event)\">{{meridianValue}}</button></div></div><div *ngIf=\"showButtons\" class=\"owl-dateTime-btnWrapper\"><div class=\"owl-dateTime-btn owl-corner-bottomLeft owl-dateTime-btnConfirm\" (click)=\"onConfirmClick($event)\">Confirm</div><div class=\"owl-dateTime-btn owl-corner-bottomRight owl-dateTime-btnClose\" (click)=\"onCloseClick($event)\">Close</div></div></div></div>",
                styles: [`
                    .owl-dateTime-input{width:100%;padding-right:1.5em}
                    .owl-dateTime-cancel{display:none;position:absolute;top:50%;right:.1em;-moz-border-radius:50%;border-radius:50%;-webkit-transform:translateY(-50%);-moz-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);cursor:pointer;color:inherit}
                    .owl-dateTime-inputWrapper{position:relative}
                    .owl-dateTime-customTemp{display:inline-block;position:relative}
                    .owl-dateTime-dialog{position:absolute; width: 300px; background: white}
                    .owl-dateTime-dialogHeader{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;width:100%}
                    .owl-calendar-wrapper,.owl-timer-wrapper{position:relative;width:100%;padding:.2em .5em}
                    .owl-calendar-control{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around;width:100%;height:2em}
                    .owl-calendar-control .owl-calendar-controlNav{position:relative;cursor:pointer;width:12.5%}
                    .owl-calendar-control .owl-calendar-controlContent{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;width:75%;height:100%}
                    .owl-calendar{position:relative;min-height:13.7em}.owl-calendar table{width:100%;border-collapse:collapse}
                    .owl-calendar tbody td{position:relative;text-align:center}
                    .owl-calendar tbody td a{display:block;width:100%;height:100%;text-decoration:none;color:inherit}
                    .owl-calendar .owl-calendar-yearArrow{position:absolute;top:50%;width:1.5em;height:1.5em;-webkit-transform:translateY(-50%);-moz-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);cursor:pointer}
                    .owl-calendar .owl-calendar-yearArrow.left{left:-.5em}
                    .owl-calendar .owl-calendar-yearArrow.right{right:-.5em}
                    .owl-timer-wrapper{position:relative;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center}
                    .owl-timer-wrapper .owl-timer{position:relative;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;width:25%;height:100%}
                    .owl-timer-wrapper .owl-timer-control{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;height:30%;width:100%;cursor:pointer}
                    .owl-timer-wrapper .owl-timer-control .icon:before{margin:0}
                    .owl-timer-wrapper .owl-timer-input{width:60%;height:100%; text-align: center; border: 1px solid #ccc;}
                    .owl-dateTime-btnWrapper{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;width:100%}
                    .owl-widget,.owl-widget *{-moz-box-sizing:border-box;box-sizing:border-box}
                    .owl-widget{font-size:1em}
                    .owl-corner-all{-moz-border-radius:3px;border-radius:3px}
                    .owl-corner-top{-moz-border-radius-topleft:3px;border-top-left-radius:3px;-moz-border-radius-topright:3px;border-top-right-radius:3px}
                    .owl-corner-bottomLeft{-moz-border-radius-bottomleft:3px;border-bottom-left-radius:3px}
                    .owl-corner-bottomRight{-moz-border-radius-bottomright:3px;border-bottom-right-radius:3px}
                    .owl-state-default{border: 0;background:#fff;color:#555}
                    .owl-inputtext{margin:0;outline:medium none;padding:0;background:#fff;color:#222;-webkit-transition:.2s;-moz-transition:.2s;transition:.2s}
                    .owl-dateTime{display:inline-block;position:relative;width:100%}
                    .owl-dateTime.owl-dateTime-inline{width:auto}
                    .owl-dateTime.owl-dateTime-inline .owl-dateTime-dialog{position:relative;z-index:auto}
                    .owl-dateTime-dialog{width: 320px; background: #FFF; border-radius: 2px; font-weight: 700; border-top: 3px solid #3FA9F5; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.14); padding: 8px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:99999}
                    .owl-dateTime-dialogHeader{height:2.5em;padding:.25em;background-color:rgba(0,0,0,.1);overflow-y:auto}
                    .owl-calendar-control .owl-calendar-controlNav .nav-next,.owl-calendar-control .owl-calendar-controlNav .nav-prev{position:absolute;top:50%;right:auto;bottom:auto;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}
                    .owl-calendar-control .owl-calendar-controlNav .nav-next:before,.owl-calendar-control .owl-calendar-controlNav .nav-prev:before{content:' ';border-top:0.5em solid transparent;border-bottom:0.5em solid transparent;border-right:0.75em solid #000;width:0;height:0;display:block;margin:0 auto}.owl-calendar-control .owl-calendar-controlNav .nav-next:before{border-right:0;border-left:.75em solid #000}.owl-calendar-control .owl-calendar-controlContent .month-control,.owl-calendar-control .owl-calendar-controlContent .year-control{display:inline-block;cursor:pointer;-webkit-transition:-webkit-transform .2s ease;transition:-webkit-transform .2s ease;-moz-transition:transform .2s ease,-moz-transform .2s ease;transition:transform .2s ease;transition:transform .2s ease,-webkit-transform .2s ease,-moz-transform .2s ease}.owl-calendar-control .owl-calendar-controlContent .month-control:hover,.owl-calendar-control .owl-calendar-controlContent .year-control:hover{-webkit-transform:scale(1.2);-moz-transform:scale(1.2);-ms-transform:scale(1.2);transform:scale(1.2)}.owl-calendar-control .owl-calendar-controlContent .month-control{font-size:1em;margin-right:12.8px;margin-right:.8rem;font-weight:700}.owl-calendar-control .owl-calendar-controlContent .year-control{font-size:.8em;font-style:italic;color:#999}.owl-calendar tbody td.owl-calendar-selected{background-color:#3FA9F5;color:#fff}.owl-calendar tbody td.owl-calendar-invalid{color:#acacac}.owl-calendar tbody td.owl-calendar-outFocus{color:#ddd}.owl-calendar tbody td.owl-calendar-hidden{visibility:hidden}.owl-calendar tbody td:not(.owl-calendar-selected):not(.owl-calendar-invalid):hover{background-color:#bae4ff;color:#000}.owl-months td.owl-month,.owl-months td.owl-year,.owl-years td.owl-month,.owl-years td.owl-year{font-size:1.2em;height:2.5em;width:33.33%;line-height:2.5em}.owl-weekdays th.owl-weekday{height:1em;line-height:1em;text-align:center;font-size:.7em;color:#999}.owl-days td.owl-day{height:2em;width:-webkit-calc(100% / 7);width:-moz-calc(100% / 7);width:calc(100% / 7);line-height:2em;min-width: 40px !important;}.owl-days td.owl-day.owl-day-today:before{content:'';display:block;position:absolute;right:2px;top:2px;border-top:.5em solid #21a7ff;border-left:.5em solid transparent}.owl-timer-wrapper{height:5.4em;}.owl-timer-wrapper .owl-timer-text{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;width:100%;height:40%;font-size:1.5em}.owl-timer-wrapper .owl-meridian-btn{font-size:.8em;color:#0070ba;background-image:none;background-color:transparent;border-color:#0070ba}.owl-timer-wrapper .owl-meridian-btn:hover{color:#fff;background-color:#0070ba;border-color:#0070ba}.owl-timer-divider{display:inline-block;-webkit-align-self:flex-end;-ms-flex-item-align:end;align-self:flex-end;position:absolute;width:.6em;height:100%;left:-.3em}.owl-timer-divider .owl-timer-dot{display:block;width:.3em;height:.3em;position:absolute;left:50%;-moz-border-radius:50%;border-radius:50%;-webkit-transform:translateX(-50%);-moz-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%)}.owl-timer-divider .owl-timer-dot.dot-top{top:38%}.owl-timer-divider .owl-timer-dot.dot-bottom{bottom:38%}.owl-dateTime-btnWrapper{height:3em;line-height:3em;text-align:center;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.owl-dateTime-btnWrapper .owl-dateTime-btn{height:100%;width:50%;color:#fff;background-color:#0070ba}.owl-dateTime-btnWrapper .owl-dateTime-btn:hover{background-color:#0061a1}.owl-dateTime-btnWrapper .owl-dateTime-btn:first-child{border-right:1px solid #0061a1}.owl-dateTime-btnWrapper .owl-dateTime-btn:last-child{border-left:1px solid #0061a1}table td, table th{min-width: 0 !important;}
                    [class*=" icon-"]:before,[class^=icon-]:before{font-family:fontello;font-style:normal;font-weight:400;speak:none;display:inline-block;text-decoration:inherit;width:1em;margin-right:.2em;text-align:center;font-variant:normal;text-transform:none;line-height:1em;margin-left:.2em;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.icon-cancel:before{content:' '}.icon-up-open:before{content:' '}.icon-up-open:before{width: 0px; height: 0px; border-left: 10px solid transparent; border-right: 10px solid transparent;border-bottom: 10px solid #2f2f2f;}.icon-down-open:before{content:' '}.icon-down-open:before{width: 0px;height: 0px;border-left: 10px solid transparent;border-right: 10px solid transparent;border-top: 10px solid #2f2f2f; position: relative; top: 5px;}.icon-left-open:before{content:' '}.icon-right-open:before{content:' '}
                    `],
                providers: [numberedFixLen_pipe_1.NumberFixedLenPipe, exports.DATETIMEPICKER_VALUE_ACCESSOR],
                animations: [
                    animations_1.trigger('fadeInOut', [
                        animations_1.state('hidden', animations_1.style({
                            opacity: 0,
                            display: 'none'
                        })),
                        animations_1.state('visible', animations_1.style({
                            opacity: 1,
                            display: 'block'
                        })),
                        animations_1.transition('visible => hidden', animations_1.animate('200ms ease-in')),
                        animations_1.transition('hidden => visible', animations_1.animate('400ms ease-out'))
                    ])
                ],
            },] },
];
DateTimePickerComponent.ctorParameters = function () { return [
    { type: core_1.Renderer2, },
    { type: numberedFixLen_pipe_1.NumberFixedLenPipe, },
]; };
DateTimePickerComponent.propDecorators = {
    'autoClose': [{ type: core_1.Input },],
    'dataType': [{ type: core_1.Input },],
    'dateFormat': [{ type: core_1.Input },],
    'defaultMoment': [{ type: core_1.Input },],
    'disabled': [{ type: core_1.Input },],
    'disabledDates': [{ type: core_1.Input },],
    'disabledDays': [{ type: core_1.Input },],
    'inline': [{ type: core_1.Input },],
    'inputId': [{ type: core_1.Input },],
    'inputStyle': [{ type: core_1.Input },],
    'inputStyleClass': [{ type: core_1.Input },],
    'maxDateCount': [{ type: core_1.Input },],
    'max': [{ type: core_1.Input },],
    'min': [{ type: core_1.Input },],
    'placeHolder': [{ type: core_1.Input },],
    'readonlyInput': [{ type: core_1.Input },],
    'required': [{ type: core_1.Input },],
    'selectionMode': [{ type: core_1.Input },],
    'showButtons': [{ type: core_1.Input },],
    'showHeader': [{ type: core_1.Input },],
    'showSecondsTimer': [{ type: core_1.Input },],
    'style': [{ type: core_1.Input },],
    'styleClass': [{ type: core_1.Input },],
    'tabIndex': [{ type: core_1.Input },],
    'type': [{ type: core_1.Input },],
    'locale': [{ type: core_1.Input },],
    'hourFormat': [{ type: core_1.Input },],
    'showOtherMonths': [{ type: core_1.Input },],
    'onFocus': [{ type: core_1.Output },],
    'onClose': [{ type: core_1.Output },],
    'onBlur': [{ type: core_1.Output },],
    'onInvalid': [{ type: core_1.Output },],
    'containerElm': [{ type: core_1.ViewChild, args: ['container',] },],
    'textInputElm': [{ type: core_1.ViewChild, args: ['textInput',] },],
    'dialogElm': [{ type: core_1.ViewChild, args: ['dialog',] },],
};
exports.DateTimePickerComponent = DateTimePickerComponent;
//# sourceMappingURL=picker.component.js.map