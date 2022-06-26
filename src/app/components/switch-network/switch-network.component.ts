import { Component } from '@angular/core';
import { SmartcontractService } from '../../services/smartcontract.service';

@Component({
  selector: 'app-switch-network',
  templateUrl: './switch-network.component.html',
  styleUrls: ['./switch-network.component.css']
})
export class SwitchNetworkComponent {

  constructor(private smartContract : SmartcontractService) {}

  async changeNetwork() : Promise<any> {
    await this.smartContract.changeNetwork();
    window.location.reload();
  }
}