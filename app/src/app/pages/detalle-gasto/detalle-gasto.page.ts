import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Expense, ExpenseService } from '../../expense.service';


@Component({
  selector: 'app-detalle-gasto',
  templateUrl: './detalle-gasto.page.html',
  styleUrls: ['./detalle-gasto.page.scss'],
  standalone: false
})
export class DetalleGastoPage {
  e?: Expense;

  constructor(
    private route: ActivatedRoute,
    private exp: ExpenseService,
    private router: Router
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.e = this.exp.byId(id);
  }

  save() {
    if (!this.e) return;
    this.exp.update(this.e);
    this.router.navigateByUrl('/gastos');
  }

  del() {
    if (!this.e) return;
    this.exp.remove(this.e.id);
    this.router.navigateByUrl('/gastos');
  }
}
