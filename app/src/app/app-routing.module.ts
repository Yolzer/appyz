import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; 

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule) },
  { path: 'registro', loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule) },
  { path: 'recuperar', loadChildren: () => import('./pages/recuperar/recuperar.module').then( m => m.RecuperarPageModule) },
  { path: 'cambiar-password', loadChildren: () => import('./pages/cambiar-password/cambiar-password.module').then( m => m.CambiarPasswordPageModule) },
  
  // ÁREA PRIVADA
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuard] },
  { path: 'gastos', loadChildren: () => import('./pages/gastos/gastos.module').then( m => m.GastosPageModule), canActivate: [AuthGuard] },
  { path: 'detalle-gasto/:id', loadChildren: () => import('./pages/detalle-gasto/detalle-gasto.module').then( m => m.DetalleGastoPageModule), canActivate: [AuthGuard] },
  { path: 'config', loadChildren: () => import('./pages/config/config.module').then( m => m.ConfigPageModule), canActivate: [AuthGuard] },
  { path: 'ingreso', loadChildren: () => import('./pages/ingreso/ingreso.module').then( m => m.IngresoPageModule), canActivate: [AuthGuard] },
  
  // CORRECCIÓN AQUÍ: Importar AgregarGastoPageModule
  { 
    path: 'agregar-gasto', 
    loadChildren: () => import('./pages/agregar-gasto/agregar-gasto.module').then( m => m.AgregarGastoPageModule), 
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }