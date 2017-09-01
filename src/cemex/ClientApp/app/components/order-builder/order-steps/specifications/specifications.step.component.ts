import { Component, OnInit, Input } from '@angular/core';
import { ProductsApi } from '../../../../shared/api'

@Component({
    selector: 'specifications-step',
    templateUrl: './specifications.step.html',
    styleUrls: ['./specifications.step.scss'],
    host: { 'class': 'w-100' }
})
export class SpecificationsStepComponent implements OnInit {
    constructor() { }
    ngOnInit() {}
}