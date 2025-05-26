import { Routes } from '@angular/router';
import { ProductoListaComponent } from './components/producto-lista/producto-lista.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle.component';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { ProveedorListaComponent } from './components/proveedores-lista/proveedores-lista.component';
import { AgregarProductoComponent } from './components/agregar-producto/agregar-producto.component';
import { ProveedoresAgregarComponent } from './components/proveedores-agregar/proveedores-agregar.component';
import { PagosListaComponent } from './components/pagos-lista/pagos-lista.component';
import { PagosRegistrarComponent } from './components/pagos-registrar/pagos-registrar.component';
import { RoleGuard } from './guard/role.guard';

export const routes: Routes = [
  { path: 'productos', component: ProductoListaComponent },
  { path: 'productos/nuevos', component: AgregarProductoComponent, canActivate: [RoleGuard] },
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos/:id', component: ProductoDetalleComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'iniciar-sesion', component: LoginComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'pagos', component: PagosListaComponent, canActivate: [RoleGuard], data: { roles: ['CLIENTE', 'ADMINISTRADOR'] } },
  { path: 'pagos/crear', component: PagosRegistrarComponent, canActivate: [RoleGuard], data: { roles: ['CLIENTE', 'ADMINISTRADOR'] } },
  { path: 'pagos/editar/:id', component: PagosRegistrarComponent, canActivate: [RoleGuard] },
  { path: 'pagos/:id', component: PagosRegistrarComponent, canActivate: [RoleGuard] },
  { path: 'usuarios/registrados', component: ListaUsuariosComponent, canActivate: [RoleGuard] },
  { path: 'proveedores', component: ProveedorListaComponent, canActivate: [RoleGuard] },
  { path: 'proveedores/agregar', component: ProveedoresAgregarComponent, canActivate: [RoleGuard] },
];