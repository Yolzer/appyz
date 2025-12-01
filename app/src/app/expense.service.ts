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
  image?: string; // Propiedad para la foto del recibo
}

const STORAGE_KEY = 'gasto_rapido_v1';
const API_CACHE_KEY = 'api_users_cache';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private data: Expense[] = [];
  private _users: any[] = []; // Datos de API externa

  constructor(private store: StorageService, private http: HttpClient) {
    this.init();
  }

  async init() {
    this.data = this.store.get<Expense[]>(STORAGE_KEY, []);
    await this.loadUsers();
  }

  // --- Requerimiento: API REST + Persistencia Offline ---
  async loadUsers() {
    try {
      console.log('Conectando a API Rest...');
      // Consumo de API real (JSONPlaceholder)
      const users = await lastValueFrom(
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      );
      this._users = users;

      // Guardar copia local (Persistencia)
      this.store.set(API_CACHE_KEY, users);
      console.log('API Online: Usuarios actualizados');

    } catch (error) {
      console.warn('API Offline: Cargando datos guardados', error);
      // Si falla (código 404), recuperar del storage local
      this._users = this.store.get(API_CACHE_KEY, []);
    }
  }

  getUsers() {
    return this._users;
  }

  // --- Métodos CRUD (Existentes) ---

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