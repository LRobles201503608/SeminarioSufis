import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit {
  user: string=''; password: string=''; password2:string=''; base64: string; extension: string;
  file;
  name: string;
  showSelector = true;

  constructor() { }

  ngOnInit() {
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
