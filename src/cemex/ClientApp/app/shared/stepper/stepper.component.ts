import { Component, OnInit, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { Step } from './step/step.component'

@Component({
    selector: 'stepper',
    templateUrl: './stepper.html',
    styleUrls: ['./stepper.scss']
})
export class StepperComponent implements AfterContentInit {
    @ContentChildren(Step) steps: QueryList<Step>;
    constructor() { }

    // contentChildren are set
    ngAfterContentInit() {
        let activeSteps = this.steps.filter((step) => step.active);
        if (activeSteps.length === 0) {
            this.selectTab(this.steps.first);
        }
    }

    selectTab(step: Step) {
        // Deactivate all steps except one
        this.steps.toArray().forEach(step => step.active = false);
        step.active = true;
    }

}
