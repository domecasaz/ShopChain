import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccessComponent } from './components/access/access.component';
import { BuyerComponent } from './components/buyer/buyer.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { OrderInfoComponent } from './components/order-info/order-info.component';
import { EcommerceComponent } from './components/ecommerce/ecommerce.component';

const routes : Routes = [
  { path: 'ecommerce', component: EcommerceComponent },
  { path: 'home', component: BuyerComponent },
  { path: 'landingpage/:id', component: LandingPageComponent },
  { path: 'info/:id', component: OrderInfoComponent },
  { path: '', redirectTo: '/ecommerce', pathMatch: 'full' },
  { path: 'autentication', component: AccessComponent },
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