import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;     // ISO
  notes?: string;
  category?: string;
}

const STORAGE_KEY = 'gasto_rapido_v1';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private data: Expense[] = [];

  constructor(private store: StorageService) {
    this.data = this.store.get<Expense[]>(STORAGE_KEY, []);
  }

  list(): Expense[] {
    return [...this.data].sort(
      (a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  byId(id: string): Expense | undefined {
    return this.data.find(x => x.id === id);
  }

  add(e: Expense): void {
    this.data.push(e);
    this.save();
  }

  update(e: Expense): void {
    const i = this.data.findIndex(x => x.id === e.id);
    if (i >= 0) { this.data[i] = e; this.save(); }
  }

  remove(id: string): void {
    this.data = this.data.filter(x => x.id !== id);
    this.save();
  }

  // Totales
  totalByDay(d: Date): number {
    const y=d.getFullYear(), m=d.getMonth(), day=d.getDate();
    return this.data.filter(e => {
      const t = new Date(e.date);
      return t.getFullYear()===y && t.getMonth()===m && t.getDate()===day;
    }).reduce((s,e)=>s+e.amount,0);
  }
  totalByMonth(d: Date): number {
    const y=d.getFullYear(), m=d.getMonth();
    return this.data.filter(e => {
      const t = new Date(e.date);
      return t.getFullYear()===y && t.getMonth()===m;
    }).reduce((s,e)=>s+e.amount,0);
  }
  totalByYear(d: Date): number {
    const y=d.getFullYear();
    return this.data.filter(e => (new Date(e.date)).getFullYear()===y)
      .reduce((s,e)=>s+e.amount,0);
  }
  totalAll(): number {
    return this.data.reduce((s,e)=>s+e.amount,0);
  }

  private save(): void { this.store.set(STORAGE_KEY, this.data); }
}
