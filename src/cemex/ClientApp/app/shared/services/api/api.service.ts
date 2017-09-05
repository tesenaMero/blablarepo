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
            "eyJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2IiwiY3R5IjoiSldUIn0.LDenasojRi5EKRLUjvEigFWB2cJzJF8qldOB7C3VZeGW6kuvVm6mALzA-ttjAZ_HFFfZ0HR1S4jxw4Q1LBiW0ycPju5p09adOGYnEfjheB5221XNzfUWDy5eoINsGn4CaJyok_4bz3e2bNBNU7u_TkMg7-4uLzGaQwB6yw4QAb97p1S_uBRV9BUXZMR8gBCuSex2SoR0IfJPOkisslQxLgNLtdfGtP0Nk6R9VMWzb2cUbmr9mXi9UhGbJFFPJXZJao5LMpRIUx0BNH9Pg6G-3Rnaoq1XNsHt6-Ztx1BhB7t8gz7dfYQ2VpBCp_7w4UKMFIdC4HBM0YjDd6iiG9L0ZQ.uPA4WZoSvnknU3ALK9XaAQ.Ve8HyYE-kp5DvNJNDWjX3_YkzSJ1VK6Rxq4qgPRy80rZBw99xU4_0feYbo2XU_k3pvRfuaqe8nWXjO8JaeBGA1hO_y9I9-YbVvTW1asY9FpJflpy_EZ6AijvJkdTx4EWfxG3CI43ukZ0F59HyFZspFBX_LEWnPjMk67pzWDU55hlBjvQN_lEOwpLeFxdxKnIX9JIXszzAXbVPCeB-uYkdCqigzxIqnqYASpBldBHaidAuBzdiLrTrsyrpfQvxx8t9HfqgEiP_45-rW1vbnqlcw-LRuvuRacEexcp9UGWKD16680ODZ2NToZ0jW-B1qi4QtJUJqs0nShHbRZIpGnLy4QraeDCNkKeFtmPGu1C5UOsaIMNtxWr9UmdLOP8npSPX4VEmmhsWZ3cunDPGf6ob08cOK4mYv9m-H9L5l7mkKlYkDEm4dZcOZChgLaeXSrYQ82IUjGW1fexSW03RojqIria9psueDBghQyxZQZXx6W2Wh8h1QKygWA1OXNssekXnThMl-KTkgsQovWxSs7MXT2p22a6fqfxbV1wIHsZopZ4daxBVFH5Tu9bKqTmTLBqNKO9frA5T_iDqMyH8MeVj2r11VR1LfqRlOctNau2XcBmPVsjp1M4a7xg5atkREyB8-U-HhBbArycLnQYjY24GakSHu1_aJ995Fi7Jl-gTJ4fdggDQk4oIrD_88b503XCWdAPS-CC65V2WenbwNB8LM3XM4AEGmMQABNnRRRC7Xfo0xOtRB6gnhh_cL64A4uRb2py371-vTCmaZRJflLdQo0bfutm6y-LyocmXZFMh29ZIy-1qy9TqizGccAWZNZAGF-4lsVL5dcZzBu_dbAGkj5OfBVOFFrpKbw4ugBc9J58ZyC7uq6F9efhB9F334afFT3cmGewrVkrpY36OeRteBQiw9q_jEvvZkpi8bEijgawkS2INBDUcPfZ3mMVPglmdXw0CxqxICwMcbFIBOa5Zqh_RYwMtTM1Th1Ly-AiES5mnUQsWMyI0OU7QrY1lCS-Cne6n30Q2q5Z8E4Ur1HqBxGPYNkOUhiR9TJITa6Ze-GX5zxbwid8tlwl02VERZ-NGRYGYY2M18LiCOj-s2euFH6LPrIiRavEWibSo62goGMUPPPfsIg_WEN-G-TRP6n62BxKKBFP9q600ZYJq9yfrLHD6o5QncdVQiFL9ddUxSSjR2dX3lwv34e6kcI9Qwy4Vo0RRAKbZtfyEuVMdVEWQ-XudGusOjLgND1O3oREnmwIybu0ju4Sva02PZSRoU78lb22r2ZDSqq8pE_Su4EvBRvT4vpYyGd5UIV34uWIeczQRXX2_GaPyTnjQ86CFLsojUa2wep1Ku25EWI6P7b74f4KWSnxEbAhBT6Sm9hQI597NuLdzaScvql9btfPg_azYl21ULIsIFqe76__2B7WxlI0CiH5H_igOADt5aUwaY6WwGnlGHri6f0o-Vj0D6ez8q9_8Dufm6jon4gZuT6Ft8gwTb_GK8O9LAxHZThdaaUnE2v8mvbh5Qp-m0quE0orR4Ub0ZfHt-V1OfqtL7Fn0PPvGb_CaoeufXcE7WWB_Jr0T3c8He3w0v5qbmYy0N9LYdc_l_jBuErKpp9JvLQZ-qtrb1DX5f75tS-Slw11pNnwqyeJG58wpFmLRo6n8z5jXhBsXYwaD05ls088nJvifHcUfsZDIc_z25l9NzsB4rFgosaT4s07knIeJ69W5wnCR9NL-uQNx1hvuGUKiXLzfLNkLCorYC1DOF7KBTeE_hy11NmLOQpywqlWnVLhRu-KhPuTBK9y8qjVWuU65juk8N1GPmvartMLkIds4IjwWTtHJ8vcsWsrbcxEZ9-TLVJp_J5UCKNlN3Doq-zn6tA0giL-xScsbY9yp6deIhITSFJkN31qLM60N51Kq77CeAuPHO052jvGgrjCRdQTqn5-Ampt56iD1wJTIR8XuYNiFVoVMg348PPW9oDRpfdaxj3lkQFWD5NCL8yG1RHymNn9VkP33KFiBKgrH0F6TD1xeO9OFphESu6BffJHMjTsO3aSFw4GspeG5dscURs8vkgecPeM3WURm-e0scKAVW4uPnMw_q7kV1EYoZOb-lFYTLD_LzfGYeOZ9Hjl-NwrQDdpkRyuals0QkUDjxZ6qSirvmUmpY4wLRq-5Z4TrV73hskuYcqixwZLmaYXXNiP7RMdKzLOQvlha5jSNFEa3S0Af_eTxzKCqol9r2NhaPsXZBErmhgVrecOa9y7AuqqqqYM9zaKbF6Nrcv2yAyOtv3jMxE.FCt2NDzYL3r78uhfBJhsBlMaCbyGv0haLqOHxGh5f2o"
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