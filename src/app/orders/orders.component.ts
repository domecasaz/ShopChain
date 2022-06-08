import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { Order, State } from '../order';
import { SmartcontractService } from '../smartcontract.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  actualOrder : Order = {
    id: 1,
    buyerAddress: "0xc1ea9dA9bb25B68b084c16d082D2077596fd06f9",
    sellerAddress: "0xEbDC67e05348AB26BF1a5662B3C7129BE08a601f",
    amount: 0.5,
    state: State[1],
  }
  order?: Order;
  orders : Array<Order> = [];

  constructor(private smartContract : SmartcontractService) {}

  async ngOnInit() : Promise<void> {
    await this.smartContract.setCurrentAddress();
    this.getOrders();
    await this.getOrderById();
  }

  getOrders() : void {
    this.orders = this.smartContract.getOrdersOfUser();
  }

  async getOrderById() {
    this.actualOrder = await this.smartContract.getOrderById(1);
  }

  async askRefund(id : number) {
    await this.smartContract.askRefund(id);
  }
}