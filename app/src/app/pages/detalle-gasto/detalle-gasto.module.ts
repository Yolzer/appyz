import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DetalleGastoPageRoutingModule } from './detalle-gasto-routing.module';
import { DetalleGastoPage } from './detalle-gasto.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DetalleGastoPageRoutingModule],
  declarations: [DetalleGastoPage]
})
export class DetalleGastoPageModule {}
