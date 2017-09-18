import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'navigation',
    templateUrl: './navigation.html',
    styleUrls: ['navigation.scss'],
})

export class NavigationComponent {
    @Input() entityName:string;
    @Input() entityId:string;
    @Input() entityItems: any[];
    @Input() entityItemsTitle:string;
    @Input() entityItemsSubtitle:string;
    @Input() notifications: any[];

    @Input() customers: any[] = [];

    @Output() public logout: EventEmitter<any> = new EventEmitter<any>();
    @Output() public selectDropdown: EventEmitter<any> = new EventEmitter<any>();
    @Output() public customerChange: EventEmitter<any> = new EventEmitter<any>();

    public open: boolean = false;
    private customer: any;

    ngOnChanges() {
        if (this.customers && this.customers.length > 0) {
            this.customer = this.customers[0];
        }
    }

    constructor() {

    }

    public fireSelectDropdown(customer) {
        this.selectDropdown.emit(customer);
    }

    public firelogout() { 
        this.logout.emit();
    }

    public toggleMenu() {
        this.open = !this.open;
    }

    customerChanged(customer: any) {
        this.customerChange.emit(this.customer);
    }
}