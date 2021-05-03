import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaAlumnosRoutingModule } from './lista-alumnos-routing.module';
import { ListaAlumnosComponent } from './lista-alumnos.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListaAlumnosComponent],
  imports: [
    CommonModule,
    ListaAlumnosRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ListaAlumnosModule { }
