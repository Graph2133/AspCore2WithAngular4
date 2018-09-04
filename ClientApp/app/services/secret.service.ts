import { Http, Headers, RequestOptions  } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class SecretService {

    constructor(private http: Http) {
        this.setupHeaders();
     }
    private readonly baseUrl: string = 'http://localhost:4047/';
    private reqOptions:RequestOptions = new RequestOptions();

    getMemberData() {
        return this.http.get(this.baseUrl + "api/secret/member",this.reqOptions)
            .map(res => res.text());
    }

    getAdminData() {
        return this.http.get(this.baseUrl + "api/secret/admin",this.reqOptions)
            .map(res => res.json());
    }

    setupHeaders() {
        const token = localStorage.getItem('token');
        let headers = new Headers();
        headers.append('Authorization', "Bearer " + token);
        this.reqOptions = new RequestOptions({ headers: headers });
    }
}