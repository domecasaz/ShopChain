import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SmartcontractService } from '../smartcontract.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent implements OnInit {

  constructor(private smartContract : SmartcontractService) {}

  public rightChain : boolean = true;
  price = new FormControl("");
  sellerAddress = new FormControl("");

  async ngOnInit() : Promise<void> {
    this.smartContract.connectWallet().subscribe(async (isConnected) => {
      if (isConnected) {
        if (this.smartContract.isRightChain()) {
          await this.smartContract.initializeContract();
          this.smartContract.listenerNetworkChange();
          this.rightChain = true;
        } else {
          this.rightChain = false;
          throw new Error("Please connect to Fuji testnet");
        }
      }
    }
    );
  }

  createOrder() {
    this.smartContract.createOrder(this.sellerAddress.value, this.price.value.toString());
  }
}