import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ExpenseService, Income } from '../../expense.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
  standalone: false
})
export class IngresoPage implements OnInit {

  income: any = {
    amount: null,
    title: '',
    type: 'Sueldo', 
    frequency: 'Mensual',
    source: '',
    date: new Date().toISOString()
  };

  isEditMode = false;
  editId: string | null = null;

  constructor(
    private expenseService: ExpenseService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Verificar si venimos a editar
    this.route.queryParams.subscribe(params => {
      if (params && params['editIncomeId']) {
        const id = params['editIncomeId'];
        const existingIncome = this.expenseService.byIdIncome(id);
        
        if (existingIncome) {
          this.isEditMode = true;
          this.editId = existingIncome.id;
          // Cargar datos en el formulario
          this.income = { ...existingIncome };
        }
      }
    });
  }

  limpiarCamposDinamicos() {
    this.income.frequency = '';
    this.income.source = '';
    if(this.income.type === 'Sueldo') this.income.frequency = 'Mensual';
  }

  async guardar() {
    if (!this.income.amount || this.income.amount <= 0) return;

    const incomeData: Income = {
      id: this.isEditMode && this.editId ? this.editId : crypto.randomUUID(),
      amount: Number(this.income.amount),
      title: this.income.title || 'Ingreso',
      type: this.income.type,
      date: this.income.date,
      frequency: this.income.frequency,
      source: this.income.source
    };

    if (this.isEditMode) {
      this.expenseService.updateIncome(incomeData);
    } else {
      this.expenseService.addIncome(incomeData);
    }
    
    const toast = await this.toastCtrl.create({
      message: this.isEditMode ? 'Ingreso actualizado' : 'Ingreso registrado',
      duration: 2000,
      color: 'success'
    });
    await toast.present();

    this.navCtrl.navigateBack('/home'); // Volver al home o a gastos
  }
}