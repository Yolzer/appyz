import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; 

@Component({
  selector: 'app-add-expense-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.scss'],
  standalone: false
})
export class AddExpenseModalComponent implements OnInit {
  
  @Input() editData: any; // Datos para editar

  amount: number | null = null;
  title: string = '';
  date: string = new Date().toISOString();
  category: string = 'Otros';
  receiptImage: string | undefined;
  
  isEditMode = false;
  id: string | null = null;

  categories = [
    { name: 'Comida', icon: 'fast-food' },
    { name: 'Transporte', icon: 'bus' },
    { name: 'Casa', icon: 'home' },
    { name: 'Ocio', icon: 'game-controller' },
    { name: 'Otros', icon: 'shapes' }
  ];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.editData) {
      this.isEditMode = true;
      this.id = this.editData.id;
      this.amount = this.editData.amount;
      this.title = this.editData.title;
      this.date = this.editData.date;
      this.category = this.editData.category || 'Otros';
      this.receiptImage = this.editData.image;
    }
  }

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 80, allowEditing: false, resultType: CameraResultType.DataUrl, source: CameraSource.Camera
      });
      this.receiptImage = image.dataUrl;
    } catch (error) { console.log('Error camara', error); }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss({
      id: this.id,
      amount: this.amount,
      title: this.title,
      date: this.date,
      category: this.category,
      image: this.receiptImage,
      isEdit: this.isEditMode
    });
  }
}