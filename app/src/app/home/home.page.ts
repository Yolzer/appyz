import { Component, OnInit } from '@angular/core';
import { Expense, ExpenseService } from '../expense.service';

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

  constructor(private exp: ExpenseService) {}

  ngOnInit(): void {
    this.refreshTotals();
  }

  refreshTotals(): void {
    const now = new Date();
    switch (this.scope) {
      case 'day':  this.total = this.exp.totalByDay(now);  this.label = 'de hoy'; break;
      case 'month':this.total = this.exp.totalByMonth(now);this.label = 'del mes'; break;
      case 'year': this.total = this.exp.totalByYear(now); this.label = 'del año'; break;
      default:     this.total = this.exp.totalAll();       this.label = 'acumulado';
    }
    this.animateCounter(this.display, this.total, 240);
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
}
