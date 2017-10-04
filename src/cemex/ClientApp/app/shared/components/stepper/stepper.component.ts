/**
 * Supoprts from 2 steps to 5 steps visually
 */

import {
    Component,
    OnInit,
    ContentChildren,
    QueryList,
    AfterContentInit,
    EventEmitter,
    Output,
    ViewChild,
    Input,
    NgZone
} from '@angular/core';
import { Step } from './step/step.component'
import { TranslationService } from '@cemex-core/angular-services-v2/dist';

@Component({
    selector: 'stepper',
    templateUrl: './stepper.html',
    styleUrls: ['./stepper.scss']
})
export class StepperComponent implements AfterContentInit {
    @Input() finishText?: string = this.t.pt('views.stepper.finish');
    @Output() onFinish = new EventEmitter<any>();
    @Output() onRendered = new EventEmitter<any>();

    @ViewChild('controlNext') controlNext;
    @ViewChild('controlPrev') controlBack;
    @ContentChildren(Step) steps: QueryList<Step>;

    nextAvailable: boolean = false;
    backAvailable: boolean = true;
    isFirstStep: boolean = true;
    overlay: boolean = false;

    currentStep: any;
    constructor(private zone: NgZone, private t: TranslationService) {
        this.overlay = false;
    }

    // Content children are set
    ngAfterContentInit() {
        let activeSteps = this.steps.filter((step) => step.active);
        if (activeSteps.length === 0) {
            this.selectStep(this.steps.first);
        }

        let currentIndex = this.getActiveStepIndex();
        if (currentIndex == 0) { this.isFirstStep = true; }
        else { this.isFirstStep = false; }

        this.onRendered.emit();
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
    next(ignore = false) {
        if (!this.currentStep.completed) { return; }
        if (!ignore && !this.currentStep.canAdvance()) { return; }
        
        let currentIndex = this.getActiveStepIndex();

        // If last step
        if (this.isLastStep()) { return; }

        // If invalid index step
        if (currentIndex <= -1) { return; }

        this.animateNext(currentIndex + 1);
    }

    prev() {
        let currentIndex = this.getActiveStepIndex();

        // Callback
        this.currentStep.onBeforeBack();

        this.uncomplete();

        // If last step or index not found
        if (currentIndex <= 0) { return; }
        this.animatePrev(currentIndex - 1);
    }

    complete() {
        this.currentStep.completed = true;
        if (this.currentStep.automatic) { this.next(); }
        this.nextAvailable = true;
    }

    uncomplete() {
        this.currentStep.completed = false;
        this.nextAvailable = false;
    }

    finish(result: any) {
        this.onFinish.emit(result);
    }

    changeShowOverlay() {
        this.overlay = !this.overlay;
    }

    private validateNext

    private isLastStep() {
        let currentIndex = this.getActiveStepIndex();
        return currentIndex >= this.steps.length - 1;
    }

    private animateNext(toIndex: number) {
        this.controlNext.nativeElement.click();
        this.nextAvailable = false;
        this.backAvailable = false;
        setTimeout(() => {
            this.nextAvailable = true;
            this.backAvailable = true;
            this.selectStepByIndex(toIndex);
        }, 600);
    }

    private animatePrev(toIndex: number) {
        this.controlBack.nativeElement.click();
        this.nextAvailable = false;
        this.backAvailable = false;
        setTimeout(() => {
            this.nextAvailable = true;
            this.backAvailable = true;
            this.selectStepByIndex(toIndex);
        }, 600);
    }

    selectStep(step: Step) {
        // Deactivate all steps except one
        this.steps.toArray().forEach(step => step.active = false);
        this.currentStep = step;

        step.active = true;

        let currentIndex = this.getActiveStepIndex();
        if (currentIndex == 0) { this.isFirstStep = true; }
        else { this.isFirstStep = false; }

        step.show();
    }

    private selectStepByIndex(index: number) {
        let step = this.getStepByIndex(index);
        if (step) { this.selectStep(step); }

        if (!this.currentStep.completed)
            this.nextAvailable = false;
        else
            this.nextAvailable = true;
    }

    private getStepByIndex(index: number) {
        let step = this.steps.toArray()[index];
        if (step) { return step; }
    }

}
