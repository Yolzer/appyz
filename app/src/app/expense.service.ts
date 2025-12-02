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

const STORAGE_KEY = 'gasto_rapido_v1';
const API_CACHE_KEY = 'api_users_cache';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private data: Expense[] = [];
  private _users: any[] = [];

  constructor(private store: StorageService, private http: HttpClient) {
    this.init();
  }

  async init() {
    // CORRECCIÓN: Añadido 'await' y tipo genérico explícito
    const storedData = await this.store.get<Expense[]>(STORAGE_KEY);
    this.data = storedData || [];
    
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      // Intento conexión a API
      const users = await lastValueFrom(
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      );
      this._users = users;
      // Guardar en persistencia local
      await this.store.set(API_CACHE_KEY, users);
      console.log('Usuarios cargados desde API');
    } catch (error) {
      console.warn('Error API, cargando offline', error);
      // CORRECCIÓN: Añadido 'await' y tipo genérico
      const storedUsers = await this.store.get<any[]>(API_CACHE_KEY);
      this._users = storedUsers || [];
    }
  }

  getUsers() {
    return this._users;
  }

  // --- CRUD ---

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