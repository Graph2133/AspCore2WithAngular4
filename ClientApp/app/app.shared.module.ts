import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { ToastyModule } from 'ng2-toasty';
import { BrowserXhr } from '@angular/http';
import { BrowserXhrWithProgress, ProgressService } from './services/progress.service';
import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';
import { ViewVehicleComponent } from './components/view-vehicle/view-vehicle.component';

import { PaginationComponent } from './components/shared/pagination.component';
import { PhotoService } from './services/photo.service'
import { VehicleService } from './services/vehicle.service';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { UserService } from './services/user.service';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { MemberPageComponent } from './components/member-page/member-page.component';
import { AuthGuardService } from './services/Guards/auth-guard.service';
import { RoleGuardService } from './services/Guards/role-guard.service';


const appRoutes: Routes = [
    { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
    { path: 'login', component: LoginFormComponent },
    { path: 'vehicles', component: VehicleListComponent },
    { path: 'home', component: HomeComponent },
    { path: 'vehicles/new', component: VehicleFormComponent },
    { path: 'vehicles/edit/:id', component: VehicleFormComponent },
    { path: 'vehicles/:id', component: ViewVehicleComponent },
    { path: 'fetch-data', component: FetchDataComponent },
    { path: 'register', component: RegistrationFormComponent },
    { path: 'member',component:MemberPageComponent, canActivate:[AuthGuardService] },
    { path: 'admin', component:AdminPageComponent, canActivate:[RoleGuardService],data:{expectedRoles:["Admin"]}},
    { path: '**', redirectTo: 'home' }
];


@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        FetchDataComponent,
        HomeComponent,
        VehicleFormComponent,
        VehicleListComponent,
        PaginationComponent,
        ViewVehicleComponent,
        RegistrationFormComponent,
        SpinnerComponent,
        LoginFormComponent,
        AdminPageComponent,
        MemberPageComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ToastyModule.forRoot(),
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
        VehicleService,
        PhotoService,
        ProgressService,
        UserService,
        AuthGuardService,
        RoleGuardService,
        { provide: BrowserXhr, useClass: BrowserXhrWithProgress },
    ]
})
export class AppModuleShared {
}
