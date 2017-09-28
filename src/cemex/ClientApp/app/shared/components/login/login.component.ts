import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service'

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
    username = "";
    password = "";
    loading: boolean = false;

    constructor(private session: SessionService, private router: Router) { }

    ngOnInit() {
        if (this.session.isLoggedIn) {
            this.router.navigate(['/ordersnproduct/app/']);
        }
    }

    login() {
        this.loading = true;
        this.session.login(this.username, this.password).then(response => {
            this.router.navigate(['/ordersnproduct/app/']);
            this.loading = false;
        })
        .catch(error => {
            console.error(error);
            console.log("Failed log");
            this.loading = false;
        });
    }

}