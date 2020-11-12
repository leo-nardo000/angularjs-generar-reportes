import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from './components/signin/signin.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { SignupComponent } from './components/signup/signup.component';
import { RegistrarEmpresaComponent } from './components/registrar-empresa/registrar-empresa.component';
import { ModificarEmpresaComponent } from './components/modificar-empresa/modificar-empresa.component';
import {ReportesComponent} from './components/reportes/reportes.component'

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  {
    path: 'inicio/persona',
    component: InicioComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'inicio/signup',
    component: SignupComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'inicio/registrar_empresa',
    component: RegistrarEmpresaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'inicio/modificar_empresa',
    component: ModificarEmpresaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'inicio/asistencia',
    component: ReportesComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
