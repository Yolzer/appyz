import { Component } from '@angular/core';
import { ExpenseService } from '../../expense.service';
import { AlertController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
  standalone: false
})
export class GastosPage {
  movements: any[] = [];
  filteredMovements: any[] = [];
  filterType: 'all' | 'income' | 'expense' = 'all';

  constructor(
    private expService: ExpenseService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    const expenses = this.expService.list().map((e: any) => ({ ...e, type: 'expense' }));
    const incomes = this.expService.listIncomes().map((i: any) => ({ ...i, type: 'income', category: i.type })); 
    
    this.movements = [...expenses, ...incomes].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    this.filterData();
  }

  filterData() {
    if (this.filterType === 'all') {
      this.filteredMovements = this.movements;
    } else {
      this.filteredMovements = this.movements.filter(m => m.type === this.filterType);
    }
  }

  getIcon(m: any) {
    if (m.type === 'income') return 'arrow-up-circle';
    const cat = m.category || '';
    switch (cat) {
      case 'Comida': return 'fast-food';
      case 'Transporte': return 'bus';
      case 'Casa': return 'home';
      case 'Ocio': return 'game-controller';
      default: return 'cash-outline';
    }
  }

  async deleteMovement(m: any) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar',
      message: '¿Confirma eliminar este registro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Borrar',
          handler: () => {
            if (m.type === 'expense') {
              this.expService.remove(m.id);
            } else {
              this.expService.removeIncome(m.id);
            }
            this.loadData(); 
          }
        }
      ]
    });
    await alert.present();
  }

  editMovement(m: any) {
    const navExtras: NavigationExtras = {
      queryParams: { id: m.id }
    };

    if (m.type === 'expense') {
      // Ir a página de editar gasto
      this.navCtrl.navigateForward(['/agregar-gasto'], navExtras);
    } else {
      // Ir a página de editar ingreso (usando el parámetro editIncomeId)
      const incomeExtras: NavigationExtras = { queryParams: { editIncomeId: m.id } };
      this.navCtrl.navigateForward(['/ingreso'], incomeExtras);
    }
  }
}