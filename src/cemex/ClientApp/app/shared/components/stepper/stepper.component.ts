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
    Input
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
    //isFirstStep: boolean = true;
    overlay: boolean = false;
    moving: boolean = false;

    currentStep: any;
    constructor(private t: TranslationService) {
        this.overlay = false;
    }

    // Content children are set
    ngAfterContentInit() {
        let activeSteps = this.steps.filter((step) => step.active);
        if (activeSteps.length === 0) {
            this.selectStep(this.steps.first);
        }

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
        if (!this.moving) {
            this.currentStep.completed = true;
            if (this.currentStep.automatic) { this.next(); }
            this.nextAvailable = true;
        }
    }

    goToLastStep() {
        this.selectStep(this.steps.last)
        this.steps.forEach((step) => {
            if (step != this.steps.last) {
                step.completed = true;
                step.active = false;
            }
        });
    }

    // If not index given, uncomplete current step
    uncomplete() {
        this.currentStep.completed = false;
        this.nextAvailable = false;
    }

    finish(result: any) {
        this.onFinish.emit(result);
    }

    private changeShowOverlay() {
        this.overlay = !this.overlay;
    }

    private isLastStep() {
        let currentIndex = this.getActiveStepIndex();
        return currentIndex >= this.steps.length - 1;
    }

    private isFirstStep() {
        let currentIndex = this.getActiveStepIndex();
        return currentIndex == 0;
    }

    private animateNext(toIndex: number) {
        this.moving = true;
        let step: Step = this.getStepByIndex(toIndex);
        if (step) { step.render = true; }

        this.controlNext.nativeElement.click();
        this.nextAvailable = false;
        this.backAvailable = false;
        setTimeout(() => {
            this.nextAvailable = true;
            this.backAvailable = true;
            if (step) { this.selectStep(step); }
            this.moving = false;
        }, 600);
    }

    private animatePrev(toIndex: number) {
        this.moving = true;
        let step: Step = this.getStepByIndex(toIndex);
        if (step) { step.render = true; }
        
        this.controlBack.nativeElement.click();
        this.nextAvailable = false;
        this.backAvailable = false;
        setTimeout(() => {
            this.nextAvailable = true;
            this.backAvailable = true;
            if (step) { this.selectStep(step); }
            this.moving = false;
        }, 600);
    }

    selectStep(step: Step) {
        // Deactivate all steps except one
        let currentIndex = this.getActiveStepIndex();
        this.steps.forEach((item, index) => {
            if (item != step) {
                item.active = false
                item.render = false;
            }

            if (index > currentIndex) {
                item.completed = false;
            }
        });

        this.currentStep = step;
        step.active = true;
        step.render = true;

        if (!this.currentStep.completed)
            this.nextAvailable = false;
        else
            this.nextAvailable = true;

        // Show after dom rendered
        setTimeout(step.show.bind(step), 0);
        //step.show();
    }

    private fireShowEvent() {
        
    }

    private getNextStep() {
        const nextIndex = this.getActiveStepIndex() + 1;
        if (this.steps.length - 1 <= nextIndex) {
            return this.getStepByIndex(nextIndex)
        }
    }

    private getPrevStep() {
        const prevIndex = this.getActiveStepIndex() - 1;
        if (prevIndex >= 0) {
            return this.getStepByIndex(prevIndex)
        }
    }

    private selectStepByIndex(index: number) {
        let step = this.getStepByIndex(index);
        if (step) { this.selectStep(step); }
    }

    private getStepByIndex(index: number): Step {
        let step = this.steps.toArray()[index];
        if (step) { return step; }
    }

}
