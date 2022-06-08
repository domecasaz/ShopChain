import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { addressValidator } from '../addressValidator';
import { SmartcontractService } from '../smartcontract.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent implements OnInit {

  constructor(private smartContract : SmartcontractService, private formBuilder : FormBuilder) {}

  public rightChain : boolean = true;
  public isLoading : boolean = false;
  public txConfirmed : boolean = false;
 
  order : FormGroup = new FormGroup({
    price: new FormControl(0, [
      Validators.required,
      Validators.min(0.0000001)
    ]),
    sellerAddress: new FormControl("", [
      Validators.required,
      addressValidator()
    ])
  });

  ngOnInit() : void {
    this.smartContract.connectWallet().subscribe((isConnected) => {
      if (isConnected) {
        if (this.smartContract.isRightChain()) {
          this.smartContract.listenerNetworkChange();
          this.smartContract.listenerAccountChange();
          this.rightChain = true;
        } else {
          this.rightChain = false;
          throw new Error("Please connect to Fuji testnet");
        }
      }
    });
  }

  get price() : any { return this.order.get('price'); }
  get sellerAddress() : any { return this.order.get('sellerAddress'); }

  async createOrder() {
    if (await this.smartContract.createOrder(this.order.value.sellerAddress, this.order.value.price.toString(), () => {this.isLoading = true})){
      this.order.reset();
      this.isLoading = false;
      this.txConfirmed = true;
    }
  }
}