import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleGastoPage } from './detalle-gasto.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleGastoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleGastoPageRoutingModule {}
