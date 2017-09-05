import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'step',
    template: `<ng-content></ng-content>`,
    host: {'class': 'carousel-item', '[class.active]': 'active' }
})
export class Step {
    @Input() title?: string = "Step";
    @Input() active? = false;
    @Input() inLine? = true; // If step should be used as a number in the stepper line
    @Input() showExit? = false; // Show exit action button
    @Input() showControls? = true; // Show back/next control buttons
    @Input() automatic? = false; // Moves to next step automatically once its completed
    @Output() onShowed = new EventEmitter<any>();

    private stepEventsListener: StepEventsListener = null;
    completed: boolean = false;

    constructor() { }

    setEventsListener(stepEventsListener: StepEventsListener) {
        this.stepEventsListener = stepEventsListener;
    }

    show() {
        this.onShowed.emit();
        //window.scrollTo(0, 0);
        if (this.stepEventsListener)
            this.stepEventsListener.onShowed();
    }
}

export interface StepEventsListener {
    onShowed(): void;
}

export abstract class _Step {
    abstract isCompleted(): boolean;
}