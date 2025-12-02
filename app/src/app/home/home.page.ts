import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { Chart, registerables } from 'chart.js';
import { NavController, AlertController } from '@ionic/angular'; // Importar NavController y Alert

Chart.register(...registerables);

type Scope = 'day'|'month'|'year'|'all';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  scope: Scope = 'day';
  total = 0;
  display = 0;
  label = 'de hoy';
  chart: any;

  constructor(
    private exp: ExpenseService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.refreshTotals();
  }

  // --- Lógica Logout ---
  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          handler: () => {
            // Borrar sesión
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user_name');
            // Redirigir al Login
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });
    await alert.present();
  }
  // ---------------------

  refreshTotals(): void {
    const now = new Date();
    
    switch (this.scope) {
      case 'day':  
        this.total = this.exp.totalByDay(now);  
        this.label = 'de hoy'; 
        break;
      case 'month':
        this.total = this.exp.totalByMonth(now);
        this.label = 'del mes'; 
        break;
      case 'year': 
        this.total = this.exp.totalByYear(now); 
        this.label = 'del año'; 
        break;
      default:     
        this.total = this.exp.totalAll();       
        this.label = 'acumulado';
    }

    this.animateCounter(this.display, this.total, 240);
    
    setTimeout(() => {
      this.updateChart();
    }, 100);
  }

  private animateCounter(from: number, to: number, ms: number) {
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start)/ms);
      this.display = Math.round((from + (to - from) * p) * 100) / 100;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  updateChart() {
    const canvas = document.getElementById('expenseChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Datos Dummy (puedes conectarlo con expense.service si quieres datos reales)
    const data = [12000, 5000, 3000, 2000, 1500]; 
    const labels = ['Comida', 'Transporte', 'Casa', 'Ocio', 'Otros'];

    if (this.chart) this.chart.destroy(); 

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}