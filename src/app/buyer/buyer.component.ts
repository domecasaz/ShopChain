import { Component, OnInit } from '@angular/core';
import { SmartcontractService } from '../smartcontract.service';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.css']
})
export class BuyerComponent implements OnInit {
  public rightChain : boolean = true;

  constructor(private smartContract : SmartcontractService) {}

  async ngOnInit() : Promise<void> {
    this.smartContract.connectWallet().subscribe(async (isConnected) => {
      if (isConnected) {
        if (this.smartContract.isRightChain()) {
          this.smartContract.listenerAccountChange();
          this.smartContract.listenerNetworkChange();
          this.rightChain = true;
        } else {
          this.rightChain = false;
        }
      }
    }
    );
  }
}