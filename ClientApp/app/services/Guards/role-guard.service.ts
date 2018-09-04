import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { UserService } from '../user.service';
@Injectable()
export class RoleGuardService implements CanActivate {
    constructor(public auth: UserService,
        public router: Router) { }
    canActivate(route: ActivatedRouteSnapshot): boolean {
        // this will be passed from the route config
        // on the data property

        if (this.auth.isAuthenticated()) {
            const helper = new JwtHelper();
            const expectedRoles: string[] = route.data.expectedRoles;
            const token = localStorage.getItem('token');
            // decode the token to get its payload
            const tokenPayload = helper.decodeToken(token);
            console.log(tokenPayload);
            const userRoles: string[] = tokenPayload.role.split(",");

            // check if user token has at least one role that is required
            let found: boolean = expectedRoles.some(el => userRoles.indexOf(el) >= 0);
            if (found)
                return true;
            else {
                this.router.navigate(['home']);
                return false;
            }
        }
        else {
            this.router.navigate(['home']);
            return false;
        }
    }
}