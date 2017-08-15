import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'step',
    templateUrl: './step.html',
    styleUrls: ['./step.scss']
})
export class StepComponent {
    @Input() showExit?: boolean;
    //abstract canContinue(): boolean;
    constructor() { }
}
