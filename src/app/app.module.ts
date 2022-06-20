import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { OrdersComponent } from './components/orders/orders.component';
import { BuyerComponent } from './components/buyer/buyer.component';
import { HeaderComponent } from './components/header/header.component';
import { SwitchNetworkComponent } from './components/switch-network/switch-network.component';
import { AccessComponent } from './components/access/access.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { TableComponent } from './components/table/table.component';
import { OrderInfoComponent } from './components/order-info/order-info.component';
import { EcommerceComponent } from './components/ecommerce/ecommerce.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    BuyerComponent,
    HeaderComponent,
    SwitchNetworkComponent,
    AccessComponent,
    LandingPageComponent,
    TableComponent,
    OrderInfoComponent,
    EcommerceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatToolbarModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}