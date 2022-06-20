import { Component, OnInit } from '@angular/core';
import { SmartcontractService } from '../../services/smartcontract.service';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.css']
})
export class BuyerComponent implements OnInit {
  public rightChain : boolean = true;
  public isConnected : boolean = false;

  constructor(private smartContract : SmartcontractService) {}

  async ngOnInit() : Promise<void> {
    if (this.smartContract.isRightChain()) {
      await this.smartContract.setCurrentAddress();
      this.smartContract.listenerNetworkChange();
      this.smartContract.listenerAccountChange();
      this.rightChain = true;
      this.isConnected = this.setIsConnected();
    } else {
      this.rightChain = false;
    }
  }

  setIsConnected() : boolean {
    return SmartcontractService.currentAddress[0] !== undefined;
  }

  hasConnected() : void {
    this.isConnected = true;
    window.location.reload();
  }
}