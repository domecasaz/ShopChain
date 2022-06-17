import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccessComponent } from './access/access.component';
import { BuyerComponent } from './buyer/buyer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { OrderInfoComponent } from './order-info/order-info.component';
import { EcommerceComponent } from './ecommerce/ecommerce.component';

const routes : Routes = [
  { path: 'ecommerce', component: EcommerceComponent },
  { path: 'autentication', component: AccessComponent },
  { path: 'home', component: BuyerComponent },
  { path: 'landingpage/:id', component: LandingPageComponent },
  { path: 'info/:id', component: OrderInfoComponent },
  { path: '', redirectTo: '/ecommerce', pathMatch: 'full' },
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