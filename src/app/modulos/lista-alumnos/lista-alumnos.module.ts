import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaAlumnosRoutingModule } from './lista-alumnos-routing.module';
import { ListaAlumnosComponent } from './lista-alumnos.component';


@NgModule({
  declarations: [ListaAlumnosComponent],
  imports: [
    CommonModule,
    ListaAlumnosRoutingModule
  ]
})
export class ListaAlumnosModule { }
