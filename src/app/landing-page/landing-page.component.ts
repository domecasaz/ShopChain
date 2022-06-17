import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SmartcontractService } from '../smartcontract.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent implements OnInit {

  constructor(
    private smartContract : SmartcontractService,
    private route : ActivatedRoute,
  ) {}

  public rightChain : boolean = true;
  public isLoading : boolean = false;
  public txConfirmed : boolean = false;
  public isConnected : boolean = false;
  public order : any = "";

  ngOnInit() : void {
    if (this.smartContract.isRightChain()) {
      this.smartContract.listenerNetworkChange();
      this.smartContract.listenerAccountChange();
      this.rightChain = true;
    } else {
      this.rightChain = false;
    }
    this.fetchOrder();
  }

  setConnection(value : boolean) : void {
    this.isConnected = value;
  }

  fetchOrder() : void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const fetchUrl = "http://localhost:8000/orders/" + id;
    const abortContr = new AbortController();
    fetch(fetchUrl, {
      signal: abortContr.signal
    }).then(async res => {
      if (res.ok) {
        this.order = await res.json();
        console.log(this.order)
      }
    })
  }

  toHome() : void {
    window.location.href = "/home";
  }

  async createOrder() : Promise<void> {
    if (await this.smartContract.createOrder(this.order.sellerAddress, this.order.price.toString(), () => {this.isLoading = true})){
      this.isLoading = false;
      this.txConfirmed = true;
    }
  }
}