import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'project-profile-creator',
    templateUrl: './project-profile-creator.html',
    styleUrls: ['./project-profile-creator.scss']
})
export class ProjectProfileCreatorComponent {
    @Output() canceled = new EventEmitter<any>();

    constructor() {
    }

    cancel() {
        this.canceled.emit();
    }
}
