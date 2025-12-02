import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {

  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    fechaNacimiento: new Date().toISOString()
  };

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private toastController: ToastController,
    private storage: StorageService
  ) { }

  ngOnInit() {}

  async guardar() {
    // 1. Validar campos vacíos
    if (!this.usuario.nombre || !this.usuario.apellido || !this.usuario.email || !this.usuario.password) {
      this.mostrarAlerta('Faltan datos', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    // 2. Validar formato de correo (Regex simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuario.email)) {
      this.mostrarAlerta('Correo Inválido', 'Ingresa un correo electrónico válido (ej: usuario@dominio.com).');
      return;
    }

    // 3. Validar contraseña segura
    // Mínimo 8 caracteres, al menos 1 número, al menos 1 caracter especial
    const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    
    if (this.usuario.password.length < 8) {
      this.mostrarAlerta('Contraseña Débil', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (!passRegex.test(this.usuario.password)) {
      this.mostrarAlerta('Contraseña Insegura', 'La contraseña debe incluir al menos un número y un símbolo especial (!@#$%^&*).');
      return;
    }

    // 4. Validar si el correo ya existe
    const usersDb = await this.storage.get<any[]>('users_db') || [];
    const existe = usersDb.find(u => u.email === this.usuario.email);
    
    if (existe) {
      this.mostrarAlerta('Error', 'Este correo ya está registrado.');
      return;
    }

    // 5. Guardar usuario
    usersDb.push(this.usuario);
    await this.storage.set('users_db', usersDb);

    // 6. Éxito
    this.mostrarToast('¡Cuenta creada con éxito! Ahora inicia sesión.');
    this.navCtrl.navigateBack('/login');
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