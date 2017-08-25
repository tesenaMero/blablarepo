import { Injectable } from '@angular/core';

const moment = require('moment');

export interface OrderRequestColumnConfiguration {
  key: string;
  format: string;
  value: string | Array<string>;
  ignoreValue?: string;
  defaultValue?: string;
  translateable?: boolean;
}
export interface OrderRequestTableComponentConfiguration {
  columns: Array<OrderRequestColumnConfiguration>;
}

export interface OrderRequestResponse {
  orderRequestId: string;
  submitedOn: string;
  submitedOnFiltered: string;
  pointOfDelivery: string;
  purchaseOrder: string;
  businessLine: string;
  amount: string;
  requestedOn: string;
  requestedOnFiltered: string;
  status: string;
  unitDesc: string;
  total: string;
}

export interface OrderRequestLayoutColumnConfiguration {
  key: string;
  width?: number;
  hidden?: boolean;
  title?: string;
}

export interface OrderRequestLayoutConfiguration {
  columns: Array<OrderRequestLayoutColumnConfiguration>;
}

@Injectable()
export class OrderRequestHelper {
  public mapDataToResponseFormat(data: any, mapping): Array<OrderRequestResponse> {
    data = data.map(request => {
      const newRequest: any = {};
      mapping.columns.forEach(column => {
        newRequest[column.key] = this.getFormatForColumn(
          column.format,
          this.getModelFieldByColumn(
            request,
            column,
          ),
        );
      });
      return newRequest;
    });

    return data;
  }

  public getCountryCode(): string {
    return 'mx';
  }

  public getModelFieldByColumn(row, column: OrderRequestColumnConfiguration): string {
    const getPropertyByKey = (key: Array<string>, pointer: any, index = 0) => {
      pointer = pointer[key[index]];
      if (!pointer) {
        throw new Error('NullException');
      }
      if (index < key.length - 1) {
        return getPropertyByKey(key, pointer, ++index);
      }
      return pointer;
    };
    let value = '';
    try {
      if (Array.isArray(column.value)) {
        value = column.value.map(item => {
          const key = item.split('.');
          try {
            return getPropertyByKey(key, row);
          } catch (e) {
            value = item.toString();
            if (column.ignoreValue === value || item === value) {
              if (column.defaultValue) {
                if (column.translateable) {
                  return column.defaultValue;
                }
                return column.defaultValue;
              }
              return '';
            }
            return value;
          }
        }).join(' ');
      } else {
        const key = column.value.split('.');
        if (row[key[0]]) {
          value = getPropertyByKey(key, row);
        } else {
          throw new Error('unknown field');
        }
      }
    } catch (e) {
      value = column.value.toString();
    }
    if (column.ignoreValue && column.ignoreValue === value) {
      if (column.defaultValue) {
        if (column.translateable) {
          return column.defaultValue;
        }
        return column.defaultValue;
      }
      return '';
    }
    return value;
  }

  public getFormatForColumn(format: string, value: any): any {
    const leftPad = (pad: number = 1, char: string = '0') => {
      return (value) => {
        const a = new Array<string>(pad)
          .join('.')
          .split('.')
          .map(_ => char);
        return a
          .slice(0, a.length - 1)
          .concat(value)
          .join('')
          .substr(-2);
      };
    };
    try {
      switch (format) {
        case 'array': {
          return value;
        }
        case 'numbers': {
          return Number(value);
        }
        case 'string': {
          return String(value).trim();
        }
        case 'currency': {
          const currencyPattern = /^\$*([0-9,.])+$/g;
          if (String(value).trim().match(currencyPattern) == null) {
            throw new Error('Invalid currency format');
          }
          const formatted = String(value)
            .replace(',', '')
            .replace('$', '')
            .split('.');
          if (formatted.length > 1 && formatted[1].length > 2) {
            formatted[1] = formatted[1].substr(0, 2);
          }
          formatted[1] = (formatted[1] && formatted[1].length == 1) ? formatted[1] + '0' : formatted[1];

          if (formatted[1]) {
            return `$${formatted.join('.').trim()}`;
          } else {
            return `$${String(formatted).replace(',', '')}`;
          }
        }
        case 'getTime': {
          const parsed = Date.parse(value);
          if (isNaN(parsed)) {
            throw new Error('Invalid date');
          }
          return parsed.toString();
        }
        case 'getTimeHours': {
          const country = this.getCountryCode();
          const parsed = Date.parse(value);
          if (isNaN(parsed)) {
            throw new Error('Invalid date');
          }
          const date = new Date(parsed);
          const pad2chars = leftPad(2);
          if (country === 'mx') {
            return new Date([
              [
                pad2chars(date.getDate()),
                pad2chars(date.getMonth() + 1),
                date.getFullYear().toString().substr(-2)
              ].join('/'),
              [
                pad2chars(date.getHours()),
                pad2chars(date.getMinutes())
              ].join(':')
            ].join(' ')).getTime().toString();
          } else {
            return new Date([
              [
                pad2chars(date.getMonth() + 1),
                pad2chars(date.getDate()),
                date.getFullYear().toString().substr(-2)
              ].join('/'),
              [
                pad2chars(date.getHours()),
                pad2chars(date.getMinutes())
              ].join(':')
            ].join(' ')).getTime().toString();
          }
        }
        case 'dateShortened': {
          const country = this.getCountryCode();
          const parsed = Date.parse(value);
          if (isNaN(parsed)) {
            throw new Error('Invalid date');
          }
          const date = new Date(parsed);
          const pad2chars = leftPad(2);
          if (country === 'mx') {
            return [
              [
                pad2chars(date.getDate()),
                pad2chars(date.getMonth() + 1),
                date.getFullYear().toString().substr(-2)
              ].join('/'),
              [
                pad2chars(date.getHours()),
                pad2chars(date.getMinutes())
              ].join(':')
            ].join(' ');
          } else {
            return [
              [
                pad2chars(date.getMonth() + 1),
                pad2chars(date.getDate()),
                date.getFullYear().toString().substr(-2)
              ].join('/'),
              [
                pad2chars(date.getHours()),
                pad2chars(date.getMinutes())
              ].join(':')
            ].join(' ');
          }
        }
        case 'date': {
          const country = this.getCountryCode();
          const parsed = Date.parse(value);
          if (isNaN(parsed)) {
            throw new Error('Invalid date');
          }
          const date = new Date(parsed);
          const pad2chars = leftPad(2);
          if (country === 'mx') {
            return [
              [
                pad2chars(date.getDate()),
                pad2chars(date.getMonth() + 1),
                date.getFullYear()
              ].join('/'),
              [
                pad2chars(date.getHours()),
                pad2chars(date.getMinutes())
              ].join(':')
            ].join(' ');
          } else {
            return [
              [
                pad2chars(date.getMonth() + 1),
                pad2chars(date.getDate()),
                date.getFullYear()
              ].join('/'),
              [
                pad2chars(date.getHours()),
                pad2chars(date.getMinutes())
              ].join(':')
            ].join(' ');
          }
        }
        case 'localDate': {
          const country = this.getCountryCode();
          if (country === 'mx') {
            return moment.utc(value).local().format('DD/MM/YYYY h:mm:ss A');
          } else {
            return moment.utc(value).local().format('MM/DD/YYYY h:mm:ss A');
          }
        }
        case 'getDate': {
          const country = this.getCountryCode();
          if (country === 'mx') {
            return moment.utc(value).local().format('DD/MM/YYYY');
          } else {
            return moment.utc(value).local().format('MM/DD/YYYY');
          }
        }
        default: {
          return String(value);
        }
      }
    } catch (e) {
      return '';
    }
  }

  public flattenData(response: any): Array<any> {
    const orderRequests = [];
    // todo
    response.orders.forEach((request) => {
      if (!request || !request.items) {
        return;
      }
      request = Object.assign(
        request,
        {
          unitDesc: request.items[0].uom.unitCode,
        },
      );
      orderRequests.push(request);
    });
    return orderRequests;
  }
}