import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as $ from 'jquery';

import { ModalService } from './modal.service';

@Component({
    moduleId: module.id.toString(),
    selector: 'modal',
    styleUrls: ['./modal.scss'],
    template: `
    <div class="modal fade" data-backdrop="static" data-keyboard="false" id="{{id}}-modal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="">
                    <ng-content></ng-content>
                </div>
            </div>
            <button #modalCloser data-dismiss="modal" class="hidden"></button>
        </div>
    </div>
    <button #modalOpener data-toggle="modal" [attr.data-target]="'#' + id + '-modal'" class="hidden"></button>
    `
})

export class ModalComponent implements OnInit, OnDestroy {
    @Input() id: string;
    @ViewChild('modalOpener') opener: any;
    @ViewChild('modalCloser') closer: any;
    
    private element: JQuery;

    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = $(el.nativeElement);
    }

    ngOnInit(): void {
        let modal = this;

        // Ensure id attribute exists
        if (!this.id) {
            console.error('Modal must have an id');
            return;
        }

        // Move element to bottom of page (just before </body>) so it can be displayed above everything else
        this.element.appendTo('app');

        // Close modal on background click
        // this.element.on('click', function (e: any) {
        //     var target = $(e.target);
        //     if (!target.closest('.modal-body').length) {
        //         modal.close();
        //     }
        // });

        // Add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this);
    }

    // Remove self from modal service when directive is destroyed
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.opener.nativeElement.click();
        $("#app-content").addClass("blur");
        //this.element.show();
        //$('body').addClass('modal-open');
    }

    // close modal
    close(): void {
        this.closer.nativeElement.click();
        $("#app-content").removeClass("blur");
        //$('body').removeClass('modal-open');
    }
}