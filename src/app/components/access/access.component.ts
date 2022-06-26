import { Component, Output, EventEmitter } from '@angular/core';
import { SmartcontractService } from '../../services/smartcontract.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent{

  @Output() itemEvent = new EventEmitter<boolean>();

  constructor(private smartContract : SmartcontractService) {}

  async connectWallet() {
    this.smartContract.connectWallet().subscribe((isConnected) => {
      if (isConnected)
        this.itemEvent.emit(true);
    });
  }
}