import { Component } from '@angular/core';
import { SmartcontractService } from './smartcontract.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ShopChain';
  public tx: any;
  public orders: any;

  constructor(private smartContract: SmartcontractService) {}

  async ngOnInit(): Promise<void> {
    await this.smartContract.initializeContract();
  }

  async registerSeller() : Promise<boolean> {
    const tx = await this.smartContract.registerSeller();
    return tx;
  }

  async createOrder(sellerAdress : string, price : string) : Promise<boolean> {
    const tx = await this.smartContract.createOrder(sellerAdress, price);
    return tx;
  }

  async getAllOrders() : Promise<any> {
    this.orders = await this.smartContract.getAllOrders();
  }

  async getOrderById(id: number) : Promise<any> {
    return await this.smartContract.getOrderById(id);
  }
}