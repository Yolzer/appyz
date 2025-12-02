import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { Chart, registerables } from 'chart.js';
import { NavController, AlertController } from '@ionic/angular';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  
  viewMode: 'day' | 'month' | 'year' = 'day';
  selectedDate: string = new Date().toISOString();
  
  totals = { expense: 0, income: 0 };
  
  incomeChart: any;
  balanceChart: any;
  expenseChart: any;

  constructor(
    private expService: ExpenseService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.updateDashboard();
  }

  // Eliminamos openAddExpense() porque ya no se usa el modal aquí

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Salir', handler: () => {
            localStorage.removeItem('isLoggedIn');
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });
    await alert.present();
  }

  updateDashboard() {
    const dateObj = new Date(this.selectedDate);
    const data = this.expService.getTotalsByDate(dateObj, this.viewMode);
    
    this.totals.expense = data.expense;
    this.totals.income = data.income;

    this.renderIncomeChart(data.incomeBreakdown);
    this.renderBalanceChart(data.income, data.expense);
    this.renderExpenseChart(data.expenseBreakdown);
  }

  renderIncomeChart(dataMap: any) {
    const ctx = (document.getElementById('incomeChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;
    if (this.incomeChart) this.incomeChart.destroy();

    const labels = Object.keys(dataMap);
    const values = Object.values(dataMap);

    this.incomeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels.length ? labels : ['Sin datos'],
        datasets: [{
          data: values.length ? values : [1],
          backgroundColor: ['#2dd36f', '#2fdf75', '#35eb80', '#4bf08f', '#e0e0e0'],
          borderWidth: 0
        }]
      },
      options: { responsive: true, plugins: { legend: { display: true, position: 'right' } } }
    });
  }

  renderBalanceChart(inc: number, exp: number) {
    const ctx = (document.getElementById('balanceChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;
    if (this.balanceChart) this.balanceChart.destroy();

    this.balanceChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Ingresos', 'Gastos'],
        datasets: [{
          data: [inc, exp],
          backgroundColor: ['#2dd36f', '#eb445a'],
          borderWidth: 0
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  renderExpenseChart(dataMap: any) {
    const ctx = (document.getElementById('expenseChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;
    if (this.expenseChart) this.expenseChart.destroy();

    const labels = Object.keys(dataMap);
    const values = Object.values(dataMap);

    this.expenseChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels.length ? labels : ['Sin datos'],
        datasets: [{
          data: values.length ? values : [1],
          backgroundColor: ['#eb445a', '#f06577', '#f27888', '#f58a99', '#e0e0e0'],
          borderWidth: 0
        }]
      },
      options: { responsive: true, plugins: { legend: { display: true, position: 'right' } } }
    });
  }
}