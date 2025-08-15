import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { ProductosListaComponent } from './components/productos-lista/productos-lista.component';
import { ProductosComponent } from './components/productos/productos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CarritoComprasComponent } from './components/carrito-compras/carrito-compras.component';
import { CarritoModeradorComponent } from './components/carrito-moderador/carrito-moderador.component';
import { CrearProductosComponent } from './components/crear-productos/crear-productos.component';
import { MenuComponent } from './components/menu/menu.component';
import { AIChatComponent } from './components/ai-chat/ai-chat.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './services/auth.guard'; 
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { VentasComponent } from './components/ventas/ventas.component'; 
import { ProductosInvitadoComponent } from './components/productos-invitado/productos-invitado.component';
import { VentasListaComponent } from './components/ventas-lista/ventas-lista.component';
export const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'productos-invitado', component: ProductosInvitadoComponent },
  { path: 'usuario', component: UsersComponent, canActivate: [AuthGuard], data: { role: 1 }},  
  { path: 'productos-lista', component: ProductosListaComponent}, 
  { path: 'productos', component: ProductosComponent, canActivate: [AuthGuard]},  
  { path: 'register', component: RegisterComponent},  
  { path: 'ventas', component: VentasComponent, canActivate: [AuthGuard], data: { role: 3 } }, // Ruta para el componente de ventas
  { path: 'ventas-lista', component: VentasListaComponent, canActivate: [AuthGuard], data: { role: 2 } }, // Ruta para el componente de lista de ventas
  { path: 'edit-product/:idproductos', component: EditProductComponent, canActivate: [AuthGuard] },
  { path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard], data: { role: 1 } },
  { path: 'edit-user/:idusuarios', component: EditUserComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'crear-productos', component: CrearProductosComponent, canActivate: [AuthGuard] },
  { path: 'menu', component: MenuComponent },
  { path: 'carrito-compras', component: CarritoComprasComponent, canActivate: [AuthGuard], data: { role: 3 } },
  { path: 'carrito-moderador', component: CarritoModeradorComponent, canActivate: [AuthGuard], data: { role: 2 } },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'ai-chat', component: AIChatComponent },
  { path: '**', redirectTo: 'login' },  
];
