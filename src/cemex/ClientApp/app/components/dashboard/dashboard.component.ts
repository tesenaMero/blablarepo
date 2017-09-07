import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../shared/services/session.service'
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

    constructor(private session: SessionService, private router: Router) { }

    ngOnInit() {
    }

    logout() {
        this.session.logout();
        this.router.navigate(['/login']);
    }

}