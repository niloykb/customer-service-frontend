import { NgModule } from '@angular/core';
import { authGuard } from '../../guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent } from './customers/customers.component';

const routes: Routes = [
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  { path: 'invoices', component: InvoicesComponent, canActivate: [authGuard] },
  { path: 'customers', component: CustomersComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
