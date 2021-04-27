import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectClasesComponent } from './select-clases.component';

const routes: Routes = [{ path: '', component: SelectClasesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectClasesRoutingModule { }
