import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ToastyService } from 'ng2-toasty';
// operators

import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/map";
import { SaveVehicle } from '../models/vehicle';

@Injectable()
export class VehicleService {
  constructor(
    private http: Http,
    private toastyService:ToastyService) {

  }
  getMakes() {
    return this.http.get("/api/makes")
      .map((res) => res.json())
      .catch(err=>this.handleError(err));
  }

  getFeatures() {
    return this.http.get("/api/features")
      .map((res) => res.json())
      .catch(err=>this.handleError(err,"Error in get feature action."));
  }

    create(data: any) {
        let model = {
            Id: 0,
            IsRegistered: data.isRegistered,
            Contact: data.contact,
            Features: data.features,
            ModelId: data.modelId,
            MakeId:data.makeId
        }
        return this.http.post('http://localhost:4047/api/vehicles', model)
      .map(res => res.json())
      .catch(err=>this.handleError(err,"Error in create vehicle action."));
  }

  getVehicle(id:any){
    return this.http.get('/api/vehicles/'+id)
    .map(res=>res.json())
    .catch(err=>this.handleError(err,"Error in get vehicle action."));
  }

  private handleError(error: any,defMessage:string="") {
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg);
    console.log(error);
    let message="Something went wrong.";
    if(defMessage!==""){
      message=defMessage;
    }
    this.toastyService.error({
      title: 'Error',
      msg: message,
      theme: 'bootstrap',
      showClose: true,
      timeout: 5000
    });
    return Observable.throw(error);
  }

  update(vehicle:SaveVehicle){
    return this.http.put('/api/vehicles/'+vehicle.id,vehicle)
    .map(res=>res.json())
    .catch(err=>this.handleError(err,"Error in update action."));
  }

  delete(id:any) {
    return this.http.delete('/api/vehicles/' + id)
      .map(res => res.json())
      .catch(err=>this.handleError(err,"Error in delete action."));;
  }

  getVehicles(filter:any) {
    return this.http.get('/api/vehicles'+ '?' + this.toQueryString(filter))
      .map(res => res.json());
  }

  toQueryString(obj:any) {
    var parts = [];
    for (var property in obj) {
      var value = obj[property];
      if (value != null && value != undefined) 
        parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
    } 
    return parts.join('&');
  }
  
}
