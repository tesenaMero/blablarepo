/**
 * Supoprts from 2 steps to 5 steps visually
 */

import { Component, OnInit, ContentChildren, QueryList, AfterContentInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Step } from './step/step.component'

@Component({
    selector: 'stepper',
    templateUrl: './stepper.html',
    styleUrls: ['./stepper.scss']
})
export class StepperComponent implements AfterContentInit {
    @ViewChild('controlNext') controlNext;
    @ViewChild('controlPrev') controlBack;

    nextAvailable: boolean = false;
    backAvailable: boolean = true;

    @ContentChildren(Step) steps: QueryList<Step>;
    @Output() onFinish = new EventEmitter<any>();

    currentStep: any;
    constructor() { }

    // Content children are set
    ngAfterContentInit() {
        let activeSteps = this.steps.filter((step) => step.active);
        if (activeSteps.length === 0) {
            this.selectStep(this.steps.first);
        }
    }

    makeStepperClass(size: number) {
        return size <= 5 ? 'cmx-stepper-' + size.toString() : '';
    }

    filterVisible(steps: Array<any>): Array<any> {
        return this.steps.filter((step) => step.inLine);
    }

    getActiveStepIndex(): number {
        return this.steps.toArray().findIndex(item => item.active);
    }

    // Controls
    // ==============================================================
    next() {
        if (this.currentStep.automatic) { this.complete(); }
        if (!this.currentStep.completed) { return; }

        let currentIndex = this.getActiveStepIndex();
        // If last step or index not found
        if (currentIndex >= this.steps.length - 1) { return; }
        if (currentIndex <= -1) { return; }

        this.animateNext(currentIndex + 1);
    }

    prev() {
        let currentIndex = this.getActiveStepIndex();
        // If last step or index not found
        if (currentIndex <= 0) { return; }
        this.animatePrev(currentIndex - 1);
    }

    complete() {
        this.currentStep.completed = true;
        this.nextAvailable = true;
    }

    finish(result: any) {
        this.onFinish.emit(result);
    }

    private animateNext(toIndex: number) {
        this.controlNext.nativeElement.click();
        setTimeout(() => {
            this.selectStepByIndex(toIndex);
        }, 600);
    }

    private animatePrev(toIndex: number) {
        this.controlBack.nativeElement.click();
        setTimeout(() => {
            this.selectStepByIndex(toIndex);
        }, 600);
    }

    private selectStep(step: Step) {
        // Deactivate all steps except one
        this.steps.toArray().forEach(step => step.active = false);
        this.currentStep = step;
        step.active = true;
        step.show();
    }

    private selectStepByIndex(index: number) {
        let step = this.steps.toArray()[index];
        if (step) { this.selectStep(step); }

        if (!this.currentStep.completed)
            this.nextAvailable = false;
        else
            this.nextAvailable = true;
    }

}