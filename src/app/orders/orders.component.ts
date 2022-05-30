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

  constructor(private smartContract : SmartcontractService) { }

  async ngOnInit() : Promise<void> {
    if(await this.smartContract.isRightChain()) {
      await this.smartContract.initializeContract();
      await this.getOrders();
      await this.getOrderById();
    }
  }

  async getOrders() : Promise<void> {
    const orders = await this.smartContract.getOrdersOfUser();
    orders.map((element : any) => {
      var order : Order = {
        id: element[0],
        buyerAddress: element[1].toString(),
        sellerAddress: element[2].toString(),
        amount: Number(ethers.utils.formatEther(element[3].toString())),
        state: State[element[4]],
      }
      this.orders.push(order)
    })
  }

  async getOrderById() {
    this.actualOrder = await this.smartContract.getOrderById(1);
  }
}