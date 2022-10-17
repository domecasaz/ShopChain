import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { addressValidator } from '../../addressValidator';


@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.css']
})
export class EcommerceComponent implements OnInit {

  constructor() {}

  ngOnInit(): void { 
    fetch('http://localhost:8000/orders')
    .then( res => res.json())
    .then( res => {
      this.id = res.length + 1;
    });
  }

  public rightChain : boolean = true;
  public isLoading : boolean = false;
  public POSTConfirmed : boolean = false;
  private id : number = 0;
 
  orderForm : FormGroup = new FormGroup({
    price: new FormControl(0, [
      Validators.required,
      Validators.min(0.0000001)
    ]),
    sellerAddress: new FormControl("", [
      Validators.required,
      addressValidator()
    ]),
    buyerAddress: new FormControl("", [
      Validators.required,
      addressValidator()
    ])
  });

  get price() : any { return this.orderForm.get('price'); }
  get sellerAddress() : any { return this.orderForm.get('sellerAddress'); }
  get buyerAddress() : any { return this.orderForm.get('buyerAddress'); }

  createOrder() : void {
    console.log("qui")
    const order = {
      id: this.id,
      price: this.orderForm.value.price.toString(),
      sellerAddress: this.orderForm.value.sellerAddress,
      buyerAddress: this.orderForm.value.buyerAddress
    }
    fetch('http://localhost:8000/orders', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    })
    .then((res) => {
      if (res.ok)
        window.location.href = 'landingpage/' + this.id;
    })
  }
}