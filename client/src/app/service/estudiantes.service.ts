import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { estudiante } from '../models/estudiantes';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  private API = 'http://18.216.43.249:4400';
  constructor(private http: HttpClient) { }
  getStudents(){
    return this.http.get(`${this.API}/fotos`);
  }

  datos(request : estudiante){
    var a={
      mensaje:"hola",
      contenido:request
    }
    return this.http.post(`${this.API}/registro`, request);
  }
}
