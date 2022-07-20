import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { addressValidator } from '../../addressValidator';
import { Order } from '../../order';
import { SmartcontractService } from '../../services/smartcontract.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {
  orders : Order[] = [];
  ordersToDisplay : Order[] = [];
  stateList : string[] = ["Created",	"Shipped", "Confirmed", "Deleted", "RefundAsked", "Refunded"];
  
  filters : FormGroup = new FormGroup({
    state: new FormControl(""),
    sellerAddress: new FormControl("", [
      addressValidator(),
    ])
  });

  constructor(private smartContract : SmartcontractService) {}

  async ngOnInit() : Promise<void> {
    await this.smartContract.setCurrentAddress();
    this.getOrders();
  }

  getOrders() : void {
    this.orders = this.smartContract.getOrdersOfUser();
    this.ordersToDisplay = this.orders;
  }

  get state() : any { return this.filters.get('state'); }
  get sellerAddress() : any { return this.filters.get('sellerAddress'); }

  filterOrders() : void {
    let state = this.filters.value.state;
    let sellerAddress = this.filters.value.sellerAddress;
    let res : Order[] = [];

    if (state !== "" && sellerAddress !== "") {
      this.orders.forEach((order) => {
        if (order.state === state && order.sellerAddress === sellerAddress)
          res.push(order);
      })
    } else if (state !== "") {
      this.orders.forEach((order) => {
        if (order.state === state)
          res.push(order);
      })
    } else if (sellerAddress !== "") {
      this.orders.forEach((order) => {
        if (order.sellerAddress === sellerAddress)
          res.push(order);
      })
    }

    this.ordersToDisplay = res;
  }

  resetFilters() : void {
    this.ordersToDisplay = this.orders;
  }
}