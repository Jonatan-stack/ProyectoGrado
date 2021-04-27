import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectClasesRoutingModule } from './select-clases-routing.module';
import { SelectClasesComponent } from './select-clases.component';


@NgModule({
  declarations: [SelectClasesComponent],
  imports: [
    CommonModule,
    SelectClasesRoutingModule
  ]
})
export class SelectClasesModule { }
