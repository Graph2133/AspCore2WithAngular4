import { Component, OnInit } from '@angular/core';
import { SecretService } from '../../services/secret.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  private data:any;
  constructor(private secretService:SecretService) {
    this.secretService.getAdminData().subscribe((response)=>{
      this.data = response;
      
      console.log(this.data);
    });
   }

  ngOnInit() {
  }

}
