import { Component, OnInit } from '@angular/core';
import { SmartcontractService } from '../smartcontract.service';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.css']
})
export class BuyerComponent implements OnInit {

  constructor(private smartContract : SmartcontractService) { }

  async ngOnInit() : Promise<void> {
    await this.smartContract.initializeContract();
  }

}
