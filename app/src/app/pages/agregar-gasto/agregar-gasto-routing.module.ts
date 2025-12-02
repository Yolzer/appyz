import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarGastoPage } from './agregar-gasto.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarGastoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarGastoPageRoutingModule {}
