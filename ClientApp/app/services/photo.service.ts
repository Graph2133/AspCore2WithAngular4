import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PhotoService {
  private readonly baseUrl: string = 'http://localhost:4047/';
  constructor(private http: Http) { }

  upload(vehicleId: number, photo: File) {
    var formData = new FormData();
    formData.append('file', photo);
    return this.http.post(this.baseUrl+`api/vehicles/${vehicleId}/photos`, formData)
      .map(res => res.json());
  }

  getPhotos(vehicleId:number) {
    return this.http.get(this.baseUrl+`api/vehicles/${vehicleId}/photos`)
      .map(res => res.json());
  }
}