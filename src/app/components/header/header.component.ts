import { Component, OnInit } from '@angular/core';
import { SmartcontractService } from '../../services/smartcontract.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentAddress : string = "";
  currentAddressShort : string = "";
  smartContractAdress : string = SmartcontractService.smartContractAddress;
  smartContractAdressShort : string = this.smartContractAdress.substring(0, 8) + "..." + this.smartContractAdress.substring(this.smartContractAdress.length-8, this.smartContractAdress.length);

  constructor(private smartContract : SmartcontractService) {}

  async ngOnInit() : Promise<void> {
    await this.smartContract.setCurrentAddress();
    this.currentAddress = SmartcontractService.currentAddress[0];
    this.currentAddressShort = this.currentAddress.substring(0, 8) + "..." + this.currentAddress.substring(this.currentAddress.length-8, this.currentAddress.length);
  }
}