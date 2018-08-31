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
import { CounterComponent } from './components/counter/counter.component';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';
import { ViewVehicleComponent } from './components/view-vehicle/view-vehicle.component';

import { PaginationComponent } from './components/shared/pagination.component';
import { PhotoService } from './services/photo.service'
import { VehicleService } from './services/vehicle.service';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { UserService } from './services/user.service';


const appRoutes: Routes = [
    { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
    { path: 'spinner', component: SpinnerComponent },
    { path: 'vehicles', component: VehicleListComponent },
    { path: 'home', component: HomeComponent },
    { path: 'vehicles/new', component: VehicleFormComponent },
    { path: 'vehicles/edit/:id', component: VehicleFormComponent },
    { path: 'vehicles/:id', component: ViewVehicleComponent },
    { path: 'counter', component: CounterComponent },
    { path: 'fetch-data', component: FetchDataComponent },
    { path: 'register', component: RegistrationFormComponent },
    { path: '**', redirectTo: 'home' }
];


@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        VehicleFormComponent,
        VehicleListComponent,
        PaginationComponent,
        ViewVehicleComponent,
        RegistrationFormComponent,
        SpinnerComponent
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
        { provide: BrowserXhr, useClass: BrowserXhrWithProgress },
    ]
})
export class AppModuleShared {
}
