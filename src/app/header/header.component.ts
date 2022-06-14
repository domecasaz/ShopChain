import { Component, OnInit } from '@angular/core';
import { SmartcontractService } from '../smartcontract.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentAddress : string = "";
  smartContractAdress : string = SmartcontractService.smartContractAddress;

  constructor(private smartContract : SmartcontractService) {}

  async ngOnInit() : Promise<void> {
    await this.smartContract.setCurrentAddress();
    this.currentAddress = SmartcontractService.currentAddress;
  }
}