import { Component } from '@angular/core';

let $ = require("jquery");

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    closeModal() {
        $("#app-content").removeClass("blur");
    }
}
