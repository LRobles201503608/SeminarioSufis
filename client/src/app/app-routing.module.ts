import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EstudiantesComponent} from './components/estudiantes/estudiantes.component';
import {GrupoComponent} from './components/grupo/grupo.component';
import {AsistenciaComponent} from './components/asistencia/asistencia.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/estudiantes',
    pathMatch:'full'
  },
  {
    path:'estudiantes',
    component:EstudiantesComponent
  },
  {
    path:'grupo',
    component:GrupoComponent
  },
  {
    path:'asistencia',
    component:AsistenciaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
