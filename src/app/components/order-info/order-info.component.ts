import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SmartcontractService } from '../../services/smartcontract.service';
import { Order } from '../../order';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.css']
})
export class OrderInfoComponent implements OnInit {

  public isLoading : boolean = false;
  public order : Order = {id:1, sellerAddress:"", buyerAddress:"", amount:0, state:""};
  public txDeniend : boolean = false;

  constructor(
    private smartContract : SmartcontractService,
    private route : ActivatedRoute,
  ) {}

  async ngOnInit() : Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.order = await this.smartContract.getOrderById(id);
  }

  async askRefund(id : number) {
    if (await this.smartContract.askRefund(id, () => {this.isLoading = true})) {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      this.isLoading = false;
    } else {
      this.isLoading = false;
      this.txDeniend = true;
    }
  }
  

  // async confirmOrder(id : number) {
  //   await this.smartContract.confirmOrder(id);
  // }
  // async deleteOrder(id : number) {
  //   await this.smartContract.deleteOrder(id);
  // }
  // async shipOrder(id : number) {
  //   await this.smartContract.shipOrder(id);
  // }

  // async refundBuyer(id : number, amount : number) {
  //   await this.smartContract.refundBuyer(id, amount);
  // }
}
