import { Component, OnInit } from '@angular/core';
import { SmartcontractService } from '../smartcontract.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent implements OnInit {

  constructor(private smartContract : SmartcontractService) {}

  ngOnInit() : void {}

  async connectWalletHome() {
    this.smartContract.connectWallet().subscribe((isConnected) => {
      if (isConnected) {
        window.location.href = '/home';
      } 
    }
    );
  }

  async connectWalletLanding() {
    this.smartContract.connectWallet().subscribe((isConnected) => {
      if (isConnected) {
        window.location.href = '/landingpage';
      } 
    }
    );
  }
}