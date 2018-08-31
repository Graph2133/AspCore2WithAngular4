import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UserRegistration } from '../../models/user.registration.interface';

import 'rxjs/add/operator/finally';
import { ToastyService } from 'ng2-toasty';
@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  errors: string;  
  isRequesting: boolean;
  submitted: boolean = false;

  constructor(private userService: UserService,
    private router: Router,
    private toastyService: ToastyService) { }

  ngOnInit() {
  }

  registerUser({ value, valid }: { value: UserRegistration, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors='';
    if(valid)
    {
        this.userService.register(value.email,value.password,value.firstName,value.lastName,value.location)
                  .finally(() => this.isRequesting = false)
                  .subscribe(
                    result  => {
                      this.toastyService.success({
                        title: 'Success!', 
                        msg: 'User was sucessfully created.',
                        theme: 'bootstrap',
                        showClose: true,
                        timeout: 5000
                      });
                        this.router.navigate(['/login'],{queryParams: {brandNew: true,email:value.email}});                         
                    },
                    errors =>  {this.errors = errors});
    }      
 } 

   

}