import { Component } from '@angular/core';
import { SmartcontractService } from './smartcontract.service';

function getNetwork() : any {
  return window;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ShopChain';
  public tx : any;

  constructor(private smartContract: SmartcontractService) {}

  ngOnInit() : void {}

  // async createOrder(sellerAdress : string, price : string) : Promise<boolean> {
  //   const tx = await this.smartContract.createOrder(sellerAdress, price);
  //   return tx;
  // }
}