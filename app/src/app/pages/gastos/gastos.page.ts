import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseService } from '../../expense.service';
import { ModalController } from '@ionic/angular';
import { AddExpenseModalComponent } from '../../components/add-expense-modal/add-expense-modal.component';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
  standalone: false
})
export class GastosPage {

  constructor(
    public exp: ExpenseService,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  goHome() {
    this.router.navigateByUrl('/home');
  }

  async openAdd() {
    const modal = await this.modalCtrl.create({
      component: AddExpenseModalComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.addExpense(result.data);
      }
    });

    await modal.present();
  }

  private addExpense(data: any) {
    const amount = Number(data?.amount);
    const title  = (data?.title ?? '').trim();

    if (!title || !amount || amount <= 0) return;

    this.exp.add({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title,
      amount,
      date: data.date ? data.date : new Date().toISOString(),
      notes: data?.notes ?? '',
      category: data?.category ?? '',
      image: data?.image 
    });
  }


  getIcon(category: string): string {
    switch(category) {
      case 'Comida': return 'fast-food';
      case 'Transporte': return 'bus';
      case 'Casa': return 'home';
      case 'Ocio': return 'game-controller';
      default: return 'cash-outline';
    }
  }


  borrarGasto(id: string) {
    this.exp.remove(id);
  }

  go(id: string) {
    this.router.navigate(['/detalle-gasto', id]);
  }
}