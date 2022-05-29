declare let window: any;
import { Component, OnInit } from '@angular/core';
import { SmartcontractService } from './smartcontract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ShopChain';
  public tx: any;

  constructor(private smartContract: SmartcontractService) {}

  async ngOnInit(): Promise<void>{
  
    this.smartContract.initializeContract();
  }

  async registerSeller() : Promise<any> {
    this.tx = await this.smartContract.registerSeller();
  }
}
