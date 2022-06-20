import { Component, OnInit } from '@angular/core';
import { SmartcontractService } from '../../services/smartcontract.service';

@Component({
  selector: 'app-switch-network',
  templateUrl: './switch-network.component.html',
  styleUrls: ['./switch-network.component.css']
})
export class SwitchNetworkComponent implements OnInit {

  constructor(private smartContract : SmartcontractService) {}

  ngOnInit() : void {}

  async changeNetwork() : Promise<any> {
    await this.smartContract.changeNetwork();
    window.location.reload();
  }
}