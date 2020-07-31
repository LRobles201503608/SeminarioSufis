import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { grupo } from '../models/grupos';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private API = 'http://18.216.43.249:3000';
  //private API = 'http://localhost:3000';
  constructor(private http: HttpClient) { }
  getStudents(){
    return this.http.get(`${this.API}/fotos2`);
  }

  datos(request : grupo){
    var a={
      mensaje:"hola",
      contenido:request
    }
    return this.http.post(`${this.API}/grupoasist`, request);
  }
  compare(){
    return this.http.get(`${this.API}/grupoasist2`);
  }
  getAsist(){
    return this.http.get(`https://nagowpasw9.execute-api.us-east-1.amazonaws.com/live/`);
  }
}
