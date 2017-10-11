import { ElementRef, EventEmitter, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NumberFixedLenPipe } from './numberedFixLen.pipe';
export interface LocaleSettings {
    firstDayOfWeek?: number;
    dayNames: string[];
    dayNamesShort: string[];
    monthNames: string[];
    monthNamesShort: string[];
    dateFns: any;
}
export declare enum DialogType {
    Time = 0,
    Date = 1,
    Month = 2,
    Year = 3,
}
export declare const DATETIMEPICKER_VALUE_ACCESSOR: any;
export declare class DateTimePickerComponent implements OnInit, OnDestroy, ControlValueAccessor {
    private renderer;
    private numFixedLenPipe;
    autoClose: boolean;
    dataType: 'string' | 'date';
    dateFormat: string;
    defaultMoment: Date | string;
    disabled: boolean;
    disabledDates: Date[];
    disabledDays: number[];
    inline: boolean;
    inputId: string;
    inputStyle: any;
    inputStyleClass: string;
    maxDateCount: number;
    private _max;
    max: Date | string;
    private _min;
    min: Date | string;
    placeHolder: string;
    readonlyInput: boolean;
    required: boolean;
    selectionMode: 'single' | 'multiple' | 'range';
    showButtons: boolean;
    showHeader: boolean;
    showSecondsTimer: boolean;
    style: any;
    styleClass: string;
    tabIndex: number;
    type: 'both' | 'calendar' | 'timer';
    locale: any;
    hourFormat: '12' | '24';
    showOtherMonths: boolean;
    onFocus: EventEmitter<any>;
    onClose: EventEmitter<any>;
    onBlur: EventEmitter<any>;
    onInvalid: EventEmitter<any>;
    containerElm: ElementRef;
    textInputElm: ElementRef;
    dialogElm: ElementRef;
    calendarDays: Array<any[]>;
    calendarWeekdays: string[];
    calendarMonths: Array<string[]>;
    calendarYears: Array<string[]>;
    dialogType: DialogType;
    dialogVisible: boolean;
    focus: boolean;
    formattedValue: string;
    value: any;
    pickerMoment: Date;
    pickerMonth: string;
    pickerYear: string;
    hourValue: number;
    minValue: number;
    secValue: number;
    meridianValue: string;
    private _locale;
    private dialogClick;
    private documentClickListener;
    private valueIndex;
    private inputValueChanged;
    private onModelChange;
    private onModelTouched;
    constructor(renderer: Renderer2, numFixedLenPipe: NumberFixedLenPipe);
    ngOnInit(): void;
    ngOnDestroy(): void;
    writeValue(obj: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    onInputUpdate(event: any): void;
    onInputClick(event: any): void;
    onInputFocus(event: any): void;
    onInputBlur(event: any): void;
    onDialogClick(event: any): void;
    onConfirmClick(event: any): void;
    onCloseClick(event: any): void;
    prevMonth(event: any): void;
    nextMonth(event: any): void;
    selectDate(event: any, date: Date): void;
    selectMonth(monthNum: number): void;
    selectYear(yearNum: number): void;
    toggleMeridian(event: any): void;
    setHours(event: any, val: 'increase' | 'decrease' | number, input?: HTMLInputElement): boolean;
    setMinutes(event: any, val: 'increase' | 'decrease' | number, input?: HTMLInputElement): boolean;
    setSeconds(event: any, val: 'increase' | 'decrease' | number, input?: HTMLInputElement): boolean;
    isSelectedDay(date: Date): boolean;
    isDayBetween(start: Date, end: Date, day: Date): boolean;
    isValidDay(date: Date): boolean;
    isCurrentMonth(monthNum: number): boolean;
    isCurrentYear(yearNum: number): boolean;
    changeDialogType(type: DialogType): void;
    onTimerInputBlur(event: any, input: HTMLInputElement, type: string, modelValue: number): void;
    clearValue(event: any): void;
    private show();
    private hide(event);
    private alignDialog();
    private bindDocumentClickListener();
    private unbindDocumentClickListener();
    private parseToDate(val);
    private generateCalendar();
    private generateWeekDays();
    private generateMonthList();
    generateYearList(dir?: string): void;
    private updateCalendar(value);
    private updateTimer(value);
    private updateModel(value);
    private updateFormattedValue();
    setSelectedTime(val: Date): boolean;
    private isValidValue(value);
    private isSingleSelection();
    private isRangeSelection();
    private isMultiSelection();
    private getHiddenElementDimensions(element);
    private getViewport();
    private parseValueFromString(text);
}
