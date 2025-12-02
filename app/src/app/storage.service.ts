import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // Guardar datos (Convierte objetos a texto para guardar)
  async set(key: string, value: any): Promise<void> {
    try {
      await localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error guardando en storage', e);
    }
  }

  // Obtener datos (Convierte texto a objetos reales)
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await localStorage.getItem(key);
      if (!value) {
        return null;
      }
      return JSON.parse(value);
    } catch (e) {
      console.error('Error leyendo storage', e);
      return null;
    }
  }

  // Eliminar un dato
  async remove(key: string): Promise<void> {
    await localStorage.removeItem(key);
  }

  // Limpiar todo (útil para cerrar sesión o resetear)
  async clear(): Promise<void> {
    await localStorage.clear();
  }
}