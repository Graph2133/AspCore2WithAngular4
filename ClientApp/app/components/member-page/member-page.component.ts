import { Component, OnInit } from '@angular/core';
import { SecretService } from '../../services/secret.service';
@Component({
  selector: 'app-member-page',
  templateUrl: './member-page.component.html',
  styleUrls: ['./member-page.component.css']
})
export class MemberPageComponent implements OnInit {

  private data:any;
  constructor(private secretService:SecretService) { }

  ngOnInit() {
    this.secretService.getMemberData().subscribe((response)=>{
      this.data = response;
    });
  }

}
