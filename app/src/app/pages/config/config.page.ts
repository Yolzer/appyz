import { Component } from '@angular/core';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: false
})
export class ConfigPage {
  user = localStorage.getItem('user_email') || 'demo';

  constructor(private store: StorageService) {}

  reset() {
    this.store.remove('gasto_rapido_v1');
    location.reload();
  }
}
