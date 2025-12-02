import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private toastController: ToastController,
    private storage: StorageService
  ) {}

  async login() {
    // 1. Validar campos vacíos
    if (!this.email || !this.password) {
      this.mostrarAlerta('Faltan Datos', 'El correo y la contraseña son obligatorios.');
      return;
    }

    // 2. Validar formato de correo (Mejora UX: avisar si escribió mal el correo antes de buscar)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.mostrarAlerta('Correo Inválido', 'El formato del correo no es correcto.');
      return;
    }

    // 3. Obtener base de datos
    const usersDb = await this.storage.get<any[]>('users_db') || [];

    // 4. Buscar usuario
    const usuarioEncontrado = usersDb.find(u => u.email === this.email && u.password === this.password);

    if (usuarioEncontrado) {
      // --- ÉXITO ---
      console.log('Login exitoso:', usuarioEncontrado);
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(usuarioEncontrado));

      this.mostrarToast(`¡Hola de nuevo, ${usuarioEncontrado.nombre}!`);
      this.navCtrl.navigateRoot(['/home']);
      
      this.email = '';
      this.password = '';
    } else {
      // --- FALLO ---
      this.mostrarAlerta('Acceso Denegado', 'Usuario no encontrado o contraseña incorrecta.');
    }
  }

  registro() {
    this.navCtrl.navigateForward(['/registro']);
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
      duration: 3000,
      position: 'top',
      color: 'success',
      icon: 'happy-outline'
    });
    await toast.present();
  }
}