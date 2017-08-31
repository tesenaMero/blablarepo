import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class Api {
    public apiRoot = 'https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev';
    public clientId = 'dd2ee55f-c93c-4c1b-b852-58c18cc7c277';
    private appId = 'DCMWebTool_App';
    private acceptLanguage = 'en-US';
    private jwt = null;
    private authorization = null;

    constructor(private _http: Http) {
        this.setToken(
            "AAEkZGQyZWU1NWYtYzkzYy00YzFiLWI4NTItNThjMThjYzdjMjc38n5DU_VsP4QF15YIVjWeFN3SxXNIxQngAMkYy1FnQNPIIN584E7bgDwqkFxY3dTnJLlPi3TZ909UmC3zqd7wCKKNXwCuHuj-ZeDu6asVO12oUucfcKe-VTM90SOC59Qn",
            "eyJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2IiwiY3R5IjoiSldUIn0.sP0HdFb87gHXR7pVNvmMBkAtEKpr1eJL_BKeiEQRkAxe3xTFvbkeSn27rz8eK-R62_IMHJHI-R0E84DfDIp0NnOC-Pb2Dm4rSzPYV5RI5P9ZtcE0kMNBp3LnHolfBCsuGt7TXWCNFmd32Xk0s6vmYysCbIeNo-0U5jz0PKP6VLj5Fg7UD6ugUf7pH-dWVB2NHAoPIinGW-UHQCt6dLGyhbq1uzg4OQnTQUJ2hd8ANcn-v6-TIK0DDg7-6QyJ0X_J9s2Kd3Uq9AGLAY7X7pea1zn4qJKhAsNq_ehsJ-WaeMlC2CW4XmQCkyDIMMUV_qgwegxTIZJilZISmMPnU2nang.shLFFs6_na4am0Vv2uatvA.ciQYPnfgLSs0LhiH0atfvFzAdneTkgpvssb7InNn3vL_gO2NtYY0-cquO8_OWNU5AVPs3IP1P9qyqBJDJINVHyTL61xGuBJiIQv_vxwmgjFpl2gs7ziQUQWGeUkTL48OMsDKNgB0EHe3LxbUh7UTVzvs_4tN82xxw71tjjWXQ1LzWrcTF4H4vsRi11giFtojZsIGIQmD8Zd6fHrOQ78qxEYWt6tjeVJY2Cbk7yWY1Rj-QbtkmGhZxzxXAYWocLb74VcQk7ZD3HeUaP4siwC-zAI70p84rOrl9eNU2GdTW1vpCa6Qv0_zmt2z0ZwSFrvfSiYIsje-bUNadBwWIFFy4SyEtmKGnU0-FJ4BmnJ-R1L-oC9QtKSWw6Dx_QD8MsrwrfbiRNfPoEHVfYgYTGQNqgatgxWCo3iA2PtB29raAKXmyhkgNUwEBWYf5oEdR-PUBMawM7q1Hie-PS_mt2ttcs_XyQHqHZ8UHgnxGjhSLn5MCO_Kl9qRkdFm0IymDh-wjC3ABWBU1x6mPB0Pe8IfzmBv3u9OYQMsCOCt99yT7xmVq8ovWZ9H7f9unAaGAAzPOhWjsOI3PiDtWb6rH2X1FJ2EpoKkZBin9YiyfdfWyKO2Jx0YC5hfr7gSWSS1969itPxrc_WM7BTySIKHciX9ZikZKz4ZzaLvsjtS_MjjQAiZCyt5YUMZqyv4Tvfy7_GDhU5RB9FEYVwV6qqm88kGIE0EVeoCiMhTJQtb4teGVL4pt7neDZ4glu-zB0V8s9vNvkfdhW3iGMvFBGk94My7Y0GeqLWmhNE4AuMm9RBcrqTl3r9aeiApFozuQL-XSBbc_mOJJn-Q6rAeUYcZjlcLNirb0yQ1ZhyRXTMlcODoUvLP5yL_P2Mdk4NYJ2ZFDFpdCxTpSQZEOC0At02xaOoUtXdp7sYU0aBU2fpmTGz9Iy2kVnzuCalOlecfpUxIVkCtcv69EOG5u-8g_p1FCP7qLjhd-eQzwaCW-N-U2jxQ9cUy111_YtU_ellx8mc6ejB0ogHemRSgAVJAp_fk6Y1Xahi0-nRpXJXPasUakl89nngPgCTAZm7n9NTQawt5j_TqUQnifTB4AecGWo8zOKYzyXPpubKrz0xkJ9Nuf-DxI8DFzC65t_nEfIXFp6nK8gv3_6oJ9VX5JLD0bBg0cUD0-j8YWfpnTYUE-QzQHSJDRkf8ya796Sb4ABbFyHXgtGGLkILmyBD_ovwVZodmTMaedqpnYi15bJzLLn68Vt1HYfcegzJzWbPMOyY1RvegC51ScDhbM03AeU2AohsSn91LhB6jalEf_z2O8576rkkrriShf9o-wjqdibFuwYh8n1acnrZM-CXK0McVzFSCLDpzoFpH9y-U40puFNfSPAKrHXTp52XEAtJwc9UrNuSLoszBbyZBBvnCI5UWLji8hQTFNDTqKF3NJsuFAZyyvw8Cv80WXWOZE1g_AzCbrVbG5CSgE-MpidEA0X_smd8IdeBr6e32r6LrjAN8Y5vW3MHrHKtbGgsSWdERipDsq5gMjtUJDQZQoFELZwWm6urOJRSzJTcvz5GyTwzVYCrnXUUTEjdD-kt8X0cGU76crknyE3FCigjMegrQsyQj0NMUQd73aIuzCO6A13NWN85dyhyId2D49-23hvvpiko-8SaWtXwlrAniCeDhvt1s3VBRQvjgDOlFRxw7y8Uwvxh6mdrs-yYUilht9OZ9cHpbRVmPIOuOA7THypX-okFFZlN52YpCc5vYfnfgTAAKZNlzIITdQErNCt5r_gL-ALeqSqc_sKsPPvgctjEK9gm5BhKQV6hgmIY9h90_TQi4DaWpo7rNsxgSaYoMsabZHB0bkFwujGks8OwlbVMBuhlxID3P9idzdBNESFhj357kOHIavQO83GA4Z9jvV8bXTANWWJF01wQMosh1RjoIZnSNLnMPidHyYGIiDuYCrnvNq2CoMTdMl9ERFDAGMV7CA1u97SVU5YU0ZrOYpVdYPsxNcTwqTgkd-sT5-j3oUvmxugOuCBNeR_JNH9JwMtDmsbt21Msxk2GLuY8OFQC-iK6la_CFla-nwo1t5hrxfcS3eEQwv-zHqUEFxUo1AwJfcCHIj7czG9mj4_s3iofqcZ1hbuRU7pUjF6N-Wj9HYxA-wYz03TbtNalhgCXMZIQbuT5cSXs3XBo8XLD6V8PFA5eUklbdsMMOJ5RiaFnGuoOFUprjSRgUyJZQMBMDBsQrkzjZfXUz7LrFpFctEmm4OZP_7mEqxnik6knQ-BkWDKyGUdPDhHtwTzqUiaofhR1cvYZvb-aFv-bwj_oyByunnwWgBOey6xaOQ9Rt6qfl2B-3DeFRHV0ZQX9yrKsrI37566eeODA-4wGtaJX9KsEJwFSvgHo0gqoOsBHabN7vQu8Duq1J3wOgFRU.6EstbUtu8AQsAV3BaUzp5eGElAcq1qLaD5A_WT5Ma_Q"
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