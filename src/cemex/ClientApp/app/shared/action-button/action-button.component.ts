import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';

/*
  Usage:
  <cemex-action-button
    [title]="Button Label"
    color="orange"
    [action]="someAction.bind(null, actionParams)"
  >              
  </cemex-action-button>
*/

@Component({
  selector: 'cemex-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
})
export class ActionButtonComponent implements OnInit, AfterContentInit {
  styles = {};
  @Input() solid: boolean;
  @Input() ghost: boolean;
  @Input() showIcon: boolean;
  @Input() title: string;
  @Input() action: any;
  @Input() color: string;
  @Input() set isDisabled(value) {
    this.disabled = value;
  }

  public disabled = false;

  ngAfterContentInit() {
    if (this.isDisabled != null) {
      this.disabled;
    }
  }

  constructor() { }

  onConfirm() {
    if ( this.action ) {
      this.disabled = true;
      if ( typeof this.action.then === 'function' ) {
        this.action().then(() => {
          this.disabled = false;
        }).catch(() => {
          this.disabled = false;
        });
        return;
      }
      this.action();
      this.disabled = false;
    }
  }

  ngOnInit() {
  }

}
