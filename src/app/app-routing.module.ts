import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccessComponent } from './access/access.component';
import { BuyerComponent } from './buyer/buyer.component';

const routes : Routes = [
  { path: 'autentication', component: AccessComponent },
  { path: 'home', component: BuyerComponent },
  { path: '', redirectTo: '/autentication', pathMatch: 'full' },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}