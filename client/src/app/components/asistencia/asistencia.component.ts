import { Component, OnInit } from '@angular/core';
import { Images } from 'src/app/models/images';
import { GrupoService } from 'src/app/service/grupo.service';
import { Asistencia } from 'src/app/models/asistencia';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {
  Imagen:Asistencia[];
  objetos:any=[];
  constructor(private gruposervice: GrupoService) { }

  ngOnInit() {
    this.showPhotos();
  }
  showPhotos(){
    this.gruposervice.getAsist().subscribe(
      res=>{
        this.objetos=res;
        this.RecorrerImagenes();
      },
      error=>{
        console.log(error);
      }
    )
  }
  RecorrerImagenes(){
    var datos =[];
    for (const prop in this.objetos) {
      const tempo = this.objetos[prop];
      for(const a in tempo){
       const direccion =tempo[a].Imagen;
       const nombres = tempo[a].nombre;
       const asistencia = tempo[a].Asistencia;
       console.log(direccion);
       datos.push({
        "nombre":nombres,
        "Imagen": direccion,
        "Asistencia":asistencia
       });
      }
      this.Imagen=datos;
      //console.log(datos);
  }

}
}
