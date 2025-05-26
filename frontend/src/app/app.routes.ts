import { Routes } from '@angular/router';
import { ProductoListaComponent } from './producto-lista/producto-lista.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { ProveedorListaComponent } from './proveedores-lista/proveedores-lista.component';
import { AgregarProductoComponent } from './agregar-producto/agregar-producto.component';
import { ProveedoresAgregarComponent } from './proveedores-agregar/proveedores-agregar.component';
import { PagosListaComponent } from './pagos-lista/pagos-lista.component';
import { PagosRegistrarComponent } from './pagos-registrar/pagos-registrar.component';

export const routes: Routes = [
  {path: 'productos', component: ProductoListaComponent},
  {path: 'productos/nuevos', component: AgregarProductoComponent},
  {path: '', redirectTo: 'productos', pathMatch: 'full'},
  {path: 'productos/:id', component: ProductoDetalleComponent}, 
  {path: 'registro', component: RegistroComponent},
  {path: 'iniciar-sesion', component: LoginComponent},
  {path: 'perfil', component: PerfilComponent},
  {path: 'pagos', component: PagosListaComponent},
  {path: 'pagos/crear', component: PagosRegistrarComponent },
  {path: 'pagos/editar/:id', component: PagosRegistrarComponent },
  {path: 'pagos/:id', component: PagosRegistrarComponent },
  {path: 'usuarios/registrados', component: ListaUsuariosComponent},
  {path: 'proveedores', component: ProveedorListaComponent},
  {path: 'proveedores/agregar', component: ProveedoresAgregarComponent},
];