import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ExpenseService, Expense } from '../../expense.service';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-agregar-gasto',
  templateUrl: './agregar-gasto.page.html',
  styleUrls: ['./agregar-gasto.page.scss'],
  standalone: false
})
export class AgregarGastoPage implements OnInit {

  expense: any = {
    amount: null,
    title: '',
    date: new Date().toISOString(),
    category: 'Otros',
    image: null
  };

  isEdit = false;
  editId: string | null = null;

  categories = [
    { name: 'Comida', icon: 'fast-food' },
    { name: 'Transporte', icon: 'bus' },
    { name: 'Casa', icon: 'home' },
    { name: 'Ocio', icon: 'game-controller' },
    { name: 'Otros', icon: 'shapes' }
  ];

  constructor(
    private expenseService: ExpenseService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params['id']) {
        const id = params['id'];
        const existing = this.expenseService.byId(id);
        if (existing) {
          this.isEdit = true;
          this.editId = existing.id;
          this.expense = { ...existing };
        }
      }
    });
  }

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      this.expense.image = image.dataUrl;
    } catch (error) { console.log(error); }
  }

  async guardar() {
    if (!this.expense.amount || !this.expense.title) return;

    const data: Expense = {
      id: this.isEdit && this.editId ? this.editId : crypto.randomUUID(),
      amount: Number(this.expense.amount),
      title: this.expense.title,
      date: this.expense.date,
      category: this.expense.category,
      image: this.expense.image
    };

    if (this.isEdit) {
      this.expenseService.update(data);
    } else {
      this.expenseService.add(data);
    }
    
    const toast = await this.toastCtrl.create({
      message: this.isEdit ? 'Gasto actualizado' : 'Gasto registrado',
      duration: 2000,
      color: 'danger'
    });
    await toast.present();

    this.navCtrl.navigateBack('/home');
  }
}