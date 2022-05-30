import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { BuyerComponent } from './buyer/buyer.component';
import { HeaderComponent } from './header/header.component';
import { SwitchNetworkComponent } from './switch-network/switch-network.component';

@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    BuyerComponent,
    HeaderComponent,
    SwitchNetworkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
