import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UserRegistration } from '../models/user.registration.interface';
import { BaseService} from "./base.service";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'; 
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

import { tokenNotExpired } from 'angular2-jwt';
@Injectable()
export class UserService extends BaseService {
  private readonly baseUrl: string = 'http://localhost:4047/';  //setting up main server url
  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();

  private loggedIn = false;

  constructor(private http: Http) {
    super();
    if(this.isAuthenticated()){
      this.loggedIn=true;
    }
     this._authNavStatusSource.next(this.loggedIn);
  }
  
    register(email: string, password: string, firstName: string, lastName: string,location: string): Observable<UserRegistration> {
    let body = JSON.stringify({ email, password, firstName, lastName,location });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseUrl + "api/accounts", body, options)
      .map(res => res)
      .catch(this.handleError);
  }  

    login(userName:string, password:string) {
    let headers = new Headers();
    let body = JSON.stringify({ userName, password });
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(
      this.baseUrl + 'api/auth/login',body,options)
      .map(res=>res.json())
      .map(res => {
        localStorage.setItem('token', res.auth_token);
        this.loggedIn = true;
        this._authNavStatusSource.next(true);
        return true;
      })
      .catch(this.handleError);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.clear();
    this.loggedIn = false;
    this._authNavStatusSource.next(false);
  }

  isAuthenticated():boolean {
   //return this.loggedIn;
   return tokenNotExpired();
  }
}