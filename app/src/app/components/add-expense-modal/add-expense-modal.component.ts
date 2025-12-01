import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; 

@Component({
  selector: 'app-add-expense-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.scss'],
  standalone: false
})
export class AddExpenseModalComponent {
  amount: number | null = null;
  title: string = '';
  date: string = new Date().toISOString();
  category: string = 'Otros';
  receiptImage: string | undefined; 

  categories = [
    { name: 'Comida', icon: 'fast-food' },
    { name: 'Transporte', icon: 'bus' },
    { name: 'Casa', icon: 'home' },
    { name: 'Ocio', icon: 'game-controller' },
    { name: 'Otros', icon: 'shapes' }
  ];

  constructor(private modalCtrl: ModalController) {}

 
  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, 
        source: CameraSource.Camera
      });
      this.receiptImage = image.dataUrl;
    } catch (error) {
      console.log('Cámara cancelada o error:', error);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss({
      amount: this.amount,
      title: this.title,
      date: this.date,
      category: this.category,
      image: this.receiptImage 
    });
  }
}