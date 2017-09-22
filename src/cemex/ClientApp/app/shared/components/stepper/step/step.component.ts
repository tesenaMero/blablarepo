import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface StepEventsListener {
    onShowed(): void;
}

export abstract class _Step {
    abstract canAdvance(): boolean;
}

@Component({
    selector: 'step',
    template: `<ng-content></ng-content>`,
    host: {'class': 'carousel-item', '[class.active]': 'active' }
})
export class Step {
    @Input() name?: string = "Step";
    @Input() active? = false;
    @Input() inLine? = true; // If step should be used as a number in the stepper line
    @Input() showExit? = false; // Show exit action button
    @Input() showControls? = true; // Show back/next control buttons
    @Input() automatic? = false; // Moves to next step automatically once its completed
    @Output() showed = new EventEmitter<any>();

    canAdvance = () => { return true; }
    private stepEventsListener: StepEventsListener = null;
    completed: boolean = false;

    constructor() {}

    setEventsListener(stepEventsListener: StepEventsListener) {
        this.stepEventsListener = stepEventsListener;
    }

    show() {
        this.showed.emit();
        //window.scrollTo(0, 0);
        if (this.stepEventsListener)
            this.stepEventsListener.onShowed();
    }
}