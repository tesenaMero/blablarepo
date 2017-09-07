import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { WindowRef } from '../window-ref.service';

@Injectable()
export class Api {
    public apiRoot = this.winRef['API_HOST'] || 'https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev';
    public clientId = this.winRef['CLIENT_ID'] || 'dd2ee55f-c93c-4c1b-b852-58c18cc7c277';
    private appId = 'DCMWebTool_App';
    private acceptLanguage = 'en-US';
    private jwt = null;
    private authorization = null;

    constructor(private _http: Http, private winRef: WindowRef) {
        this.setToken(
            "AAEkZGQyZWU1NWYtYzkzYy00YzFiLWI4NTItNThjMThjYzdjMjc3NLP-wDzaZMIQkhjveQCc6612G00KbKgS7LnaYWtgiKywTTgVsV0Mq8v03Iibmp2qkwmqT7gY7Cb7hsbhNE6PjCNHr3FEgs1NzW4ocjaKLGE",
            "eyJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2IiwiY3R5IjoiSldUIn0.quEgayzLYW0S0WNfpJaOzJnYHJqKB2UPfSX2R46im6vlj_ACLyV3BWCX8LzjBB0lMKAYycAh3dfPGgGYzMWeL_unVooezCjHUqcXvtXFUK5Z3O5Rf9yA54SHBL_w8-qZ2racG0kSguHsTDm_q55_Ksq1310jAhP8hynNk3f-fiHRPmjpfLpfNh_aVS0QeQ4HEy09ofo5cK-xYLN-1mDozsgAWU-gvaHy2XB_A0QCX_3uWOJWYNleSkT6idnGD6_R65SQHGdKsRvIPJMkyVQhc8EwpJmO5ayQ6xjiaDSW1PQNQ_NCavgJetzkMYxQJmYEl8pqHqBlGH0cQLyeHnI3Zg.XgOi53jVEQAcraSJ7nuNxA.zp4LW0hPrKraLBzfFsRQe-WV9pODZBc2iSJbqlCvyMj0HVYknUogN8ZlYrG2OLPF5hpCBDXQy99c7BekMTL_LXcx8omOh0neFy1ENRXWswI9UahBn0S11qjCjZIzodAdZxn1Zzqb-dV02TGSFD_lAxdFESEkVvivJu1QbfGnnwXoL9sKUBrgExCl9AafIY49uxjla_4Xdluikt9Bx6j0HdPNqboZRgK62zyt9GmWTkwB8BIVm4G7-G-kr6hck8SOCN4NdGboJJ_qsI9GRr2JOefGNlk89OvTqx3jMejxlbShAyVsPUq7yJ_RFOprp135K87ibIoe5R6u-NbK14tvuF_lZTRy5CyWdKBxdtKnNdN3E6zCqB3k_W9iFVuIq8cCRJJUq2itT3L1x1iJAMbI7A2hgNT4VDFz49FlOSCkLK2bPXzTlzZ8l4gkZfrebgRixLRVYOy87_mjbgzOdMgLQMgpWqD00spIf28dX_pBCWmhWfLPnfEbAfzXQ4RULWh7qWpqXwmJDSxphCNengZs67u1nie7PXOlLZMZVZkWTbIFsAuOHZ3H2x-qehKD8XhqaJ8SzvS7wHlo8HBk94LDxpsURxrYUDCo-D--M6wgukPKEj2b-V-p5ZX6xNmXkd8-rSGN2t5hxRb5PBuGDc2A7BHBOrzPh5baxScEb0ITHHWJeKDid0k9MLG6SS3XLzwmAxSqGaXnVVym4PuzW_gd3TkMi6sUk5MhEeYqFKi8oMV1lKejI7MtUD2puiyRpImcLFN8Ix_K1dcQtQuNrFkN053JADhu2-k9CF6iNSz0TP9slHP8GB2xG3X6TMoDwx1UZ-ACiTqYTxNdXOM-m0AUW37JuGc9UIEVtgRVyXmOMfbjGHsdI4Lyrji77D691ycy7Uv9UbkSC0EONiDBBLNfDpat7u5AcHE0tk8V3lQ70D66yzRZVFo0PTtnSGo9xc8Js5oBXP5VR6KEwoXI7P3Yvz1QIR923Wwc1ZBq-RXzdbEAmlmokMbPjh9poBvpQnkbACc9rllCqtfSAGd4buTR_syg7WR1IdjQbFLRtcxNl6GSdE7ehwXr2bcd3tC2sfsBnI4P7Pf324VEEOGqCXXQ2N2J7KimirzIbYpb1FOtvDatT6BddcPL83nVdLEsvqtTwMt61XFk-P3bkdXd_WvokB9NCEjbOaiLncaMA6j-5SslqHCDogM_gv0I2HNblp5ft5w_DtpQof9OqWb_6jrZoLxI9StQIBj6CD6uubEBSUGp0OuG8SVZZmTTGrYlHhu-eHIQDy3iz0HrWyAWAM5nmxRV88n5o8ggryN3idIJnOQ_sX-xFYH5AqoWM-xzYoThjg8hEMDxtyZ7YvXG1dvoWCFQ-ovvZuGZxqaH7GdNtpy2USeaMyksk51TW21jCFVcejs5OiggxobwzSGTXxgLWfr3PLJhf8dp7Uax_Z2UN-DuWGFjsi0pmyiJJwvoRAl-P1yrvlYG4oaCchnx4316EeSXF7IxRfMXuRJsGLmlTVvxGPKFP7gwmVHQ1tYBHCSLfUx8DkiaZb11hqhmmmL-2I2u_-4jn6P2CEB65Ni2qZDU0TngBlVQmU_iybTfmPUIfRmNCFResg5m1jARMgdivC9F2yJ1Wo0d6hx2QZSVfi5W7-p5OM4xXetj_vbMzhQwQ87ZeiQ33pHn9A3p8mPTuyTe6Apmu0d39arOgURxOrJJjdcZ8Ej6cx6caXHrN3PvCZ3On0sRvGWg5S0R3X2RwYjDp4V6YlVJtS4FwIKso693zgL0weV2UQIaSLOHWTykH9KGiRuArKV9f31OS6UKTztOptt9mRhEksqwCYdmi9NfkyEiC3VwfhDAHDNHRpP4Lzl7LMBdWWgH682-N6bQ_50w4ppCr7ya_y_K8x-H4PKSxoe3Bv5fk82kI35-T0h-VcI1TjXbuUZLT5UaGoCrgg3A1ehXRBmoK5sTQg1HP-5IONY4XDGdHePQZ_jOUxww2dVDlDY_gd9WDws4Hw9RYRXRmNhjVSAHsd8uxK--xYNhrBel4rq5gylVi0Y_oxHhKYO5uyIDStzZEK2nQ6C-y4Z1dSr3klUIZu0oIUHk-0Pf_zJtP8Po328zFS8TbX-V78CHq2gN7w5XZQWjlgkEHaRTkun6cI1qmq9ttug_81hprL4zCPL6Qorr5E6egtG7FlCXH1tK3lu1gD6KQclPoj3dQvddwtBwsEnZ3PmBMhnZq0R1oq11x6XcG5GogKtRYK5Ou9aMl6owbwmv9w9bYltnpt4GNQ0yyoAoYwhpMdz7pRghfbk7-ls61s8ZJoz3_qFz1HLEIukn0wJG5qkX_REsU9B6szT1vNtNOuLYnY6lECqBk47y7p8qYN4v7EEiMEqkYOnIklYirIDa8g3FE5h-hyGDeLed905k340xSAs.Q4hWr8gCXAIHwbAdogozYKTHbp6nnktm1AZwTKou-Ss"
        );
    }

    public get(url: string, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders(options.headers);
        return this._http.get(`${this.apiRoot}${url}`, options);
    }

    public post(url: string, body: any, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders(options.headers);
        return this._http.post(`${this.apiRoot}${url}`, body, options);
    }

    public put(url: string, body: any, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.post(`${this.apiRoot}${url}`, body, options);
    }

    public patch(url: string, body: any, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.patch(`${this.apiRoot}${url}`, body, options);
    }

    public delete(url: string, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.delete(`${this.apiRoot}${url}`, options);
    }

    private getHeaders(headers = new Headers()): Headers {
        headers.append('content-type', 'application/json');
        headers.append('Accept-Language', this.acceptLanguage);
        headers.append('App-Code', this.appId);
        headers.append('x-ibm-client-id', this.clientId);

        if (this.authorization && this.jwt) {
            headers.append('authorization', 'Bearer ' + this.authorization);
            headers.append('jwt', this.jwt);
        }

        return headers;
    }

    public setAcceptLanguage(language: string) {
        this.acceptLanguage = language;
    }

    public setToken(accessToken: string, jwt: string): void {
        this.authorization = accessToken;
        this.jwt = jwt;
    }

    public clearToken(): void {
        this.authorization = null;
        this.jwt = null;
    }
}