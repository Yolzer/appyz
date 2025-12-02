import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { StorageService } from '../../storage.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
  standalone: false
})
export class RecuperarPage {
  email: string = '';
  nombre: string = '';

  constructor(
    private storage: StorageService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  async validarUsuario() {
    // 1. Obtener usuarios
    const usersDb = await this.storage.get<any[]>('users_db') || [];

    // 2. Buscar coincidencia exacta de Correo y Nombre
    const usuarioEncontrado = usersDb.find(
      u => u.email.toLowerCase() === this.email.toLowerCase() && 
           u.nombre.toLowerCase() === this.nombre.toLowerCase()
    );

    if (usuarioEncontrado) {
      // 3. Usuario encontrado
      const navigationExtras: NavigationExtras = {
        queryParams: {
          email: this.email 
        }
      };
      this.navCtrl.navigateForward(['/cambiar-password'], navigationExtras);
    } else {
      // 4. Error
      this.mostrarAlerta('Datos Incorrectos', 'No encontramos un usuario con ese correo y nombre.');
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}