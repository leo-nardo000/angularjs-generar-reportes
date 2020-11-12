import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { TokenInterceptorService } from './services/token-interceptor.service';
import { AuthService } from './services/auth.service';

import { AppComponent } from './app.component';
import { SigninComponent } from './components/signin/signin.component';
import { InicioComponent } from './components/inicio/inicio.component';

import { AuthGuard } from './guards/auth.guard';
import { SignupComponent } from './components/signup/signup.component';
import { RegistrarEmpresaComponent } from './components/registrar-empresa/registrar-empresa.component';
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { AlertaComponent } from './components/alerta/alerta.component';
import { ModificarEmpresaComponent } from './components/modificar-empresa/modificar-empresa.component';
import { ReportesComponent } from './components/reportes/reportes.component';

@NgModule({
  declarations: [AppComponent, SigninComponent, InicioComponent, SignupComponent, RegistrarEmpresaComponent, NavegacionComponent, AlertaComponent, ModificarEmpresaComponent, ReportesComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
