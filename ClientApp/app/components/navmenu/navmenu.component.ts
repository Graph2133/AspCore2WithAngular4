import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
    loggedIn: boolean = false;
    subscription: Subscription;
    userName: string = "";
    constructor(private userService: UserService, private router: Router, private toastyService: ToastyService) {
    }

    logOut() {
        this.userService.logout();

        this.toastyService.success({
            title: 'Success!',
            msg: 'Succesfully logged out.',
            theme: 'bootstrap',
            showClose: true,
            timeout: 5000
        });
        this.router.navigate(['/home']);
    }

    ngOnInit() {
        this.subscription = this.userService.authNavStatus$.subscribe(status => {
        this.loggedIn = status;
            if (this.loggedIn) {
                let helper = new JwtHelper();
                const token = localStorage.getItem('token');
                const tokenPayload = helper.decodeToken(token);
                this.userName = tokenPayload.sub;
            }
        });

    }

    ngOnDestroy() {
        // prevent memory leak when component is destroyed
        this.subscription.unsubscribe();
    }
}
