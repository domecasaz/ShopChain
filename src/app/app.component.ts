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
  public orders : any;
  public rightChain : boolean = true;

  constructor(private smartContract: SmartcontractService) {
  }

  async ngOnInit(): Promise<void> {
    if (await this.smartContract.isRightChain()) {
      await this.smartContract.initializeContract();
      this.smartContract.listenerAccountChange();
      this.smartContract.listenerNetworkChange();
      this.rightChain = true;
    } else {
      console.log("Sbagliato")
      this.rightChain = false;
    }
    
    console.log(this.rightChain)
  }

  async createOrder(sellerAdress : string, price : string) : Promise<boolean> {
    const tx = await this.smartContract.createOrder(sellerAdress, price);
    return tx;
  }
}