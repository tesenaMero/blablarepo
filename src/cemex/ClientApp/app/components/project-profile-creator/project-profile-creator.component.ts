import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'project-profile-creator',
    templateUrl: './project-profile-creator.html',
    styleUrls: ['./project-profile-creator.scss']
})
export class ProjectProfileCreatorComponent {
    @Output() canceled = new EventEmitter<any>();
    @Output() confirmed = new EventEmitter<any>();

    private finishedOrder: boolean;

    constructor() {
    }

    confirm() {
        this.finishedOrder = true;
    }

    cancel() {
        this.finishedOrder = false;
        this.canceled.emit();
    }
}
