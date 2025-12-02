import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AgregarGastoPageRoutingModule } from './agregar-gasto-routing.module';
import { AgregarGastoPage } from './agregar-gasto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, 
    AgregarGastoPageRoutingModule
  ],
  declarations: [AgregarGastoPage] 
})
export class AgregarGastoPageModule {}