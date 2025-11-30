import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseService } from '../../expense.service';


@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
  standalone: false
  
})
export class GastosPage {
  addOpen = false;

  alertInputs = [
    { name: 'title',    placeholder: 'Título (p.ej., Almuerzo)' },
    { name: 'amount',   type: 'number', placeholder: 'Monto' },
    { name: 'category', placeholder: 'Categoría (opcional)' },
    { name: 'notes',    placeholder: 'Notas (opcional)' }
  ];

  alertButtons = [
    { text: 'Cancelar', role: 'cancel' },
    {
      text: 'Agregar',
      role: 'confirm',
      handler: (data: any) => this.addExpense(data)
    }
  ];

  constructor(public exp: ExpenseService, private router: Router) {}

    goHome() {
    this.router.navigateByUrl('/home');
  }


  openAdd() { this.addOpen = true; }

  private addExpense(data: any) {
    const amount = Number(data?.amount);
    const title  = (data?.title ?? '').trim();
    if (!title || !amount || amount <= 0) return;
    this.exp.add({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title,
      amount,
      date: new Date().toISOString(),
      notes: data?.notes ?? '',
      category: data?.category ?? ''
    });
  }

  go(id: string) { this.router.navigate(['/detalle-gasto', id]); }
}
