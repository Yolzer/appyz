import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CompanyNameComponent } from '../../company-name/company-name.component';

@NgModule({
  declarations: [CompanyNameComponent], 
  imports: [CommonModule, IonicModule],
  exports: [CompanyNameComponent] 
})
export class SharedModule {}