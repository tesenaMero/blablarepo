import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'filterOutOldContracts'
})
export class FilterOutOldContractsPipe implements PipeTransform {
    transform(value: any[], args?: any): any {
        if (value) {
            return value.filter(contract => {
                if (contract) {
                    return moment().utc().isBetween(
                        moment(contract.salesDocument.salesDocumentValidity.from),
                        moment(contract.salesDocument.salesDocumentValidity.to)
                    );
                }
                return true;
            });
        }
        return value;
    }
}
