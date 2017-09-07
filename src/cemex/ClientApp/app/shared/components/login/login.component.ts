import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service'

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
    username = "ordertaking.customer03@hotmail.com";
    password = "C3m3x2020";
    loading: boolean = false;

    constructor(private session: SessionService, private router: Router) { }

    ngOnInit() {
    }

    login() {
        this.loading = true;
        this.session.login(this.username, this.password).then(response => {
            this.router.navigate(['/app/']);
            this.loading = false;
        })
        .catch(error => {
            console.error(error);
            console.log("Failed log");
            this.loading = false;
        });
    }

}