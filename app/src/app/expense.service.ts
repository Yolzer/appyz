import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  notes?: string;
  category?: string;
  image?: string;
}

export interface Income {
  id: string;
  amount: number;
  title: string;
  date: string;
  type: 'Sueldo' | 'Esporadico' | 'Inversion';
  frequency?: 'Semanal' | 'Mensual'; 
  source?: string;
}

const EXPENSE_KEY = 'gasto_rapido_v1';
const INCOME_KEY = 'ingresos_rapido_v1';
const API_CACHE_KEY = 'api_users_cache';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private expenses: Expense[] = [];
  private incomes: Income[] = [];
  private _users: any[] = [];

  constructor(private store: StorageService, private http: HttpClient) {
    this.init();
  }

  async init() {
    this.expenses = await this.store.get<Expense[]>(EXPENSE_KEY) || [];
    this.incomes = await this.store.get<Income[]>(INCOME_KEY) || [];
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      const users = await lastValueFrom(this.http.get<any[]>('https://jsonplaceholder.typicode.com/users'));
      this._users = users;
      this.store.set(API_CACHE_KEY, users);
    } catch (error) {
      this._users = await this.store.get(API_CACHE_KEY) || [];
    }
  }

  getUsers() { return this._users; }

  // ========================
  // GASTOS (Métodos Restaurados)
  // ========================
  
  list(): Expense[] {
    return [...this.expenses].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  // Alias para compatibilidad
  listExpenses(): Expense[] { return this.list(); }

  byId(id: string): Expense | undefined {
    return this.expenses.find(x => x.id === id);
  }

  add(e: Expense): void {
    this.expenses.push(e);
    this.saveExpenses();
  }

  update(e: Expense): void {
    const index = this.expenses.findIndex(x => x.id === e.id);
    if (index >= 0) {
      this.expenses[index] = e;
      this.saveExpenses();
    }
  }

  remove(id: string): void {
    this.expenses = this.expenses.filter(x => x.id !== id);
    this.saveExpenses();
  }

  // ========================
  // INGRESOS
  // ========================
  
  listIncomes(): Income[] {
    return [...this.incomes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  byIdIncome(id: string): Income | undefined {
    return this.incomes.find(x => x.id === id);
  }

  addIncome(i: Income): void {
    this.incomes.push(i);
    this.saveIncomes();
  }

  updateIncome(i: Income): void {
    const index = this.incomes.findIndex(x => x.id === i.id);
    if (index >= 0) {
      this.incomes[index] = i;
      this.saveIncomes();
    }
  }

  removeIncome(id: string): void {
    this.incomes = this.incomes.filter(x => x.id !== id);
    this.saveIncomes();
  }

  // ========================
  // CÁLCULOS
  // ========================

  getTotalsByDate(date: Date, view: 'day' | 'month' | 'year'): { expense: number, income: number, incomeBreakdown: any, expenseBreakdown: any } {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();

    // Filtro Gastos
    const filteredExpenses = this.expenses.filter(e => {
      const t = new Date(e.date);
      if (view === 'day') return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
      if (view === 'month') return t.getFullYear() === y && t.getMonth() === m;
      return t.getFullYear() === y;
    });

    const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Filtro Ingresos
    let totalIncome = 0;
    const incomeMap: any = {}; 

    this.incomes.forEach(inc => {
      const t = new Date(inc.date);
      let amountToAdd = 0;
      let shouldCount = false;

      if (inc.type === 'Sueldo' && inc.frequency === 'Mensual') {
        if (view === 'day') {
          if (t.getMonth() <= m && t.getFullYear() <= y) {
             amountToAdd = inc.amount / 30; shouldCount = true; 
          }
        } else if (view === 'month') {
           if (t.getMonth() === m && t.getFullYear() === y) {
             amountToAdd = inc.amount; shouldCount = true;
           }
        } else {
           if (t.getFullYear() === y) {
             amountToAdd = inc.amount; shouldCount = true;
           }
        }
      } else {
        if (view === 'day') {
          if (t.getDate() === d && t.getMonth() === m && t.getFullYear() === y) {
            amountToAdd = inc.amount; shouldCount = true;
          }
        } else if (view === 'month') {
          if (t.getMonth() === m && t.getFullYear() === y) {
            amountToAdd = inc.amount; shouldCount = true;
          }
        } else {
          if (t.getFullYear() === y) {
            amountToAdd = inc.amount; shouldCount = true;
          }
        }
      }

      if (shouldCount) {
        totalIncome += amountToAdd;
        const label = inc.type === 'Esporadico' || inc.type === 'Inversion' ? (inc.source || inc.type) : inc.type;
        incomeMap[label] = (incomeMap[label] || 0) + amountToAdd;
      }
    });

    const expenseMap: any = {};
    filteredExpenses.forEach(e => {
      const cat = e.category || 'Otros';
      expenseMap[cat] = (expenseMap[cat] || 0) + e.amount;
    });

    return {
      expense: totalExpense,
      income: totalIncome,
      incomeBreakdown: incomeMap,
      expenseBreakdown: expenseMap
    };
  }

  private saveExpenses(): void { this.store.set(EXPENSE_KEY, this.expenses); }
  private saveIncomes(): void { this.store.set(INCOME_KEY, this.incomes); }
}