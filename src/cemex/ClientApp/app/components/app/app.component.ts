import { Component } from '@angular/core';

let $ = require("jquery");

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    closeModal() {
        $("#app-content").removeClass("blur");
    }
}
