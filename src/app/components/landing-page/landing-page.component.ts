import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SmartcontractService } from '../../services/smartcontract.service';

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
  public isHisOrder : boolean = true;
  public order : any = "";

  async ngOnInit() {
    await this.fetchOrder();
    if (this.smartContract.isRightChain()) {
      await this.smartContract.setCurrentAddress();
      this.smartContract.listenerNetworkChange();
      this.smartContract.listenerAccountChange();
      this.rightChain = true;
      this.isConnected = SmartcontractService.currentAddress[0] !== undefined;
    } else {
      this.rightChain = false;
    }

    setTimeout(() => {
      if (this.order.buyerAddress && this.order.buyerAddress.toLowerCase() !== SmartcontractService.currentAddress[0].toLowerCase()) {
        this.isHisOrder = false;
      }
    }, 750);    
  }

  hasConnected() : void {
    this.isConnected = true;
    window.location.reload();
  }

  async fetchOrder() : Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const fetchUrl = "http://localhost:8000/orders/" + id;
    const abortContr = new AbortController();
    fetch(fetchUrl, {
      signal: abortContr.signal
    }).then(async res => {
      if (res.ok) {
        this.order = await res.json();
      }
    })
  }
  
  async createTransaction() : Promise<void> {
    if (await this.smartContract.createOrder(this.order.sellerAddress, this.order.price.toString(), () => {this.isLoading = true})){
      this.isLoading = false;
      this.txConfirmed = true;
    }
  }
}