import { Component, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router'
import { StepperComponent } from '../../shared/components/stepper/';
import { DeliveryMode } from '../../models/delivery.model';
import { DashboardService } from '../../shared/services/dashboard.service';
import { DraftsService } from '../../shared/services/api/drafts.service';
import { CustomerService } from '../../shared/services/customer.service';
import { CreateOrderService } from '../../shared/services/create-order.service';

@Component({
    selector: 'order-builder',
    templateUrl: './order-builder.html',
    styleUrls: ['./order-builder.scss']
})
export class OrderBuilderComponent {
    @ViewChild(StepperComponent) stepper;
    private READYMIX_ID = 6;
    private isReadyMix: boolean = false;
    private rebuildOrder = false;
    private currentCustomer: any;

    constructor(
        private _changeDetector: ChangeDetectorRef,
        private router: Router,
        private dashboard: DashboardService,
        private drafts: DraftsService,
        private customerService: CustomerService,
        private manager: CreateOrderService,
        private zone: NgZone) {
        this.rebuildOrder = false;
        this.customerService.customerSubject.subscribe((customer) => {
            if (customer && customer != this.currentCustomer) {
                this.currentCustomer = customer;
                this.rebuild();
            }
        });
    }

    rebuild() {
        // Add instruction to event queue
        this.manager.resetOrder();
        setTimeout(() => { this.rebuildOrder = false; }, 0);
        setTimeout(() => { this.rebuildOrder = true; }, 0);
    }

    modeStepCompleted(mode: DeliveryMode) {
        this.stepper.complete();
    }

    locationStepCompleted(event: any) {
        if (event)
            this.stepper.complete();
        else
            this.stepper.uncomplete();
    }

    locationStepRequestedNext(event: any) {
        this.stepper.complete();
        this.stepper.next(true);
    }

    productStepCompleted(product: any) {
        this.isReadyMix = product.productLineId == this.READYMIX_ID;
        this._changeDetector.detectChanges();
        this.stepper.complete();
    }

    summaryStepCompleted() {
        this.stepper.complete();
        this.dashboard.alertInfo("Saving draft...");
        this.drafts.add(this.generateOrderObj()).subscribe((response) => {
            const res = response.json();
            this.drafts.draftId(res.id);
            this.dashboard.alertSuccess("Draft saved!");
        });
    }

    checkoutCompleted() {
        this.stepper.complete();
    }

    specificationsStepShowed() {
        this.stepper.complete();
    }

    specificationsStepCompleted(event: any) {
        if (event) {
            this.stepper.complete();
        }
        else {
            this.stepper.uncomplete();
        }
    }

    finishSteps() {
        this.router.navigate(['/app/cart']);
    }

    private uglyOrder() {
        const orderService = this.manager
        return {
            "orderName": "Cement Bag Online Order",
            "requestedDateTime": "2017-09-20T15:00:00.000Z",
            "purchaseOrder": "PO_JVCM",
            "salesArea": {
                "salesAreaId": 2
            },
            "customer": {
                "customerId": 122
            },
            "shippingCondition": {
                "shippingConditionId": 1
            },
            "jobsite": {
                "jobsiteId": 59
            },
            "pointOfDelivery": {
                "pointOfDeliveryId": 393
            },
            "instructions": "Instrucciones de entrega",
            "contact": {
                "contactName": "Ivan el Terrible",
                "contactPhone": "821920192102"
            },
            "items": [
                {
                    "itemSeqNum": 10,
                    "purchaseOrder": "PO_JVCM",
                    "requestedDateTime": "2017-09-05T14:28:18.814Z",
                    "currency": {
                        "currencyCode": "MXN"
                    },
                    "quantity": 50,
                    "product": {
                        "productId": 1629
                    },
                    "uom": {
                        "unitId": 262
                    },
                    "paymentTerm": {
                        "paymentTermId": 43
                    },
                    "orderItemProfile": {
                        "additionalServices": [
                            {
                                "additionalServiceCode": "MANEUVERING"
                            }
                        ]
                    }
                }
            ]
        }
    }

    private generateOrderObj() {
        let _ = this.manager;
        return {
            "orderName": _.productLine.productLineDesc + "Online Order",
            "requestedDateTime": new Date().toISOString(),
            "purchaseOrder": _.purchaseOrder ? _.purchaseOrder : "",
            "salesArea": {
                "salesAreaId": _.salesArea[0].salesArea.salesAreaId
            },
            "customer": {
                "customerId": this.customerService.currentCustomer().legalEntityId
            },
            "shippingCondition": {
                "shippingConditionId": _.shippingCondition.shippingConditionId
            },
            "jobsite": {
                "jobsiteId": _.jobsite.shipmentLocationId
            },
            "pointOfDelivery": {
                "pointOfDeliveryId": _.pointOfDelivery ? _.pointOfDelivery.shipmentLocationId : ""
            },
            "instructions": _.instructions ? _.instructions : "",
            "contact": {
                "contactName": this.safeContactName(),
                "contactPhone": this.safeContactPhone()
            },
            "items": this.makeItems()
        }
    }

    private makeItems(): any[] {
        let items = []
        this.manager.products.forEach(item => {
            items.push(this.makeItem(item));
        });

        return items;
    }

    private makeItem(preProduct) {
        let _ = this.manager;
        return {
            "itemSeqNum": 10,
            "purchaseOrder": _.purchaseOrder ? _.purchaseOrder : "",
            "requestedDateTime": this.combineDateTime(preProduct).toISOString(),
            "currency": {
                "currencyCode": this.getCustomerCurrency()
            },
            "quantity": preProduct.quantity,
            "product": {
                "productId": preProduct.product.product.productId
            },
            "uom": {
                "unitId": preProduct.product.unitOfMeasure.unitId
            },
            "paymentTerm": {
                "paymentTermId": this.safePaymentTerm(preProduct)
            },
            "orderItemProfile": {
                "additionalServices": this.makeAdditionalServices(preProduct)
            }
        }
    }

    private makeAdditionalServices(preProduct): any[] {
        let additionalServices = []
        
        // Maneuvering
        if (preProduct.maneuvering) {
            additionalServices.push({ "additionalServiceCode": "MANEUVERING" });
        }

        return additionalServices;
    }

    private getCustomerCurrency() {
        let country = this.customerService.currentCustomer().countryCode;
        if (country.trim() == "MX") {
            return "MXN";
        }
        else {
            return "USD";
        }
    }

    private combineDateTime(preProduct): Date {
        preProduct.date = new Date(preProduct.date);
        let year = preProduct.date.getFullYear()
        let month = preProduct.date.getMonth() + 1
        let day = preProduct.date.getDate()
        let dateStr = '' + year + '-' + month + '-' + day;
        return new Date(dateStr + ' ' + preProduct.time);
    }

    private safeContactName() {
        if (this.manager.contact) {
            if (this.manager.contact.name) {
                return this.manager.contact.name
            }    
        }

        return ""
    }

    private safeContactPhone() {
        if (this.manager.contact) {
            if (this.manager.contact.phone) {
                return this.manager.contact.phone
            }    
        }

        return ""
    }

    private safePaymentTerm(preProduct) {
        if (preProduct.payment) {
            if (preProduct.payment.paymentTermId) {
                return preProduct.payment.paymentTermId
            }    
        }

        return ""
    }
}
