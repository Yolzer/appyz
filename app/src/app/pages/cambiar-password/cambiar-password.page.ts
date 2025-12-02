import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.page.html',
  styleUrls: ['./cambiar-password.page.scss'],
  standalone: false
})
export class CambiarPasswordPage implements OnInit {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private storage: StorageService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    // Recibir el correo enviado desde la página anterior
    this.route.queryParams.subscribe(params => {
      if (params && params['email']) {
        this.email = params['email'];
      }
    });
  }

  async cambiarContrasena() {
    // 1. Validaciones
    if (this.newPassword.length < 4) {
      this.mostrarAlerta('Error', 'La contraseña es muy corta.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.mostrarAlerta('Error', 'Las contraseñas no coinciden.');
      return;
    }

    // 2. Obtener BD
    const usersDb = await this.storage.get<any[]>('users_db') || [];

    // 3. Encontrar el índice del usuario
    const index = usersDb.findIndex(u => u.email === this.email);

    if (index >= 0) {
      // 4. ACTUALIZAR CONTRASEÑA
      usersDb[index].password = this.newPassword;
      
      // 5. Guardar cambios en Storage
      await this.storage.set('users_db', usersDb);

      // 6. Éxito
      this.mostrarToast('Contraseña actualizada correctamente');
      this.navCtrl.navigateRoot('/login');
    } else {
      this.mostrarAlerta('Error', 'No se pudo actualizar el usuario.');
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

  async mostrarToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}