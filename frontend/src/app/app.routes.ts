import { Routes } from '@angular/router';
import { ProductoListaComponent } from './producto-lista/producto-lista.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PagosComponent } from './pagos/pagos.component';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { ProveedorListaComponent } from './proveedores-lista/proveedores-lista.component';

export const routes: Routes = [
  {path: 'productos', component: ProductoListaComponent},
  {path: '', redirectTo: 'productos', pathMatch: 'full'},
  {path: 'productos/:id', component: ProductoDetalleComponent}, 
  {path: 'registro', component: RegistroComponent},
  {path: 'iniciar-sesion', component: LoginComponent},
  {path: 'perfil', component: PerfilComponent},
  {path: 'pagos', component: PagosComponent},
  {path: 'usuarios/registrados', component: ListaUsuariosComponent},
  {path: 'proveedores', component: ProveedorListaComponent}
];
