import { Component, OnInit } from '@angular/core';
import { Images } from 'src/app/models/images';
import { grupo } from 'src/app/models/grupos';
import { GrupoService } from 'src/app/service/grupo.service';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit {
  user: string=''; password: string=''; password2:string=''; base64: string; extension: string;
  file;
  name: string;
  showSelector = true;
  imge:Images;
  Imagen:Images[];
  objetos:any=[];
  mensaje:boolean=false;
  estudiante:grupo={
    nombre: '',
    name: '',
    base64: '',
    extension: ''
  }
  constructor(private gruposervice: GrupoService) { }

  ngOnInit() {
    this.showPhotos();
  }
  Agregar(){
    this.estudiante.nombre=this.user;
    console.log(this.estudiante);
    this.gruposervice.datos(this.estudiante).subscribe(
      (res : {message}) => {
        console.log(res)
        this.mensaje=true;
        this.showPhotos();
      },
      error => console.error(error)
  );
  //this.compare2();
  }
  compare2(){
    /*this.gruposervice.compare2().subscribe(
      res=>{
        console.log(res);
      },
      err=>{
        console.log(err);
      }
    );*/
  }
  compare(){
    this.gruposervice.compare().subscribe(
      res=>{
        console.log(res);
      },
      err=>{
        console.log(err);
      }
    );
  }
  showPhotos(){
    this.gruposervice.getStudents().subscribe(
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
       console.log(direccion);
       datos.push({
        "nombre":nombres,
        "Imagen": direccion
       });
      }
      this.Imagen=datos;
      //console.log(datos);
  }

}
  changeListener($event) : void {
    this.showSelector = false
    this.file = $event.target.files[0];
    this.getFile(this.file);
  }

  getFile(newFile){
    const reader = new FileReader();
    reader.readAsDataURL(newFile);
    reader.onload = (e) => {
      this.name = newFile.name.split('.')[0];
      this.base64 = reader.result as string;
      this.base64 = this.base64.split(',')[1];
      this.extension = newFile.name.split('.')[1];
      this.estudiante.base64=this.base64;
      this.estudiante.extension=this.extension;
      this.estudiante.name=this.name;
      //console.log(this.base64)
      this.chargeImage(this.base64, this.extension)
    }
  }

  chargeImage(base64, extension){
    const image = document.getElementById('image') as HTMLImageElement;
    console.log(image);
    image.src = `data:image/${extension};base64, ${base64}`
  }

  closeImage(){
    this.showSelector = true
  }
}
