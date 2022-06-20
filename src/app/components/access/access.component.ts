import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SmartcontractService } from '../../services/smartcontract.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent implements OnInit {

  @Output() itemEvent = new EventEmitter<boolean>();

  constructor(private smartContract : SmartcontractService) {}

  ngOnInit() : void {}

  async connectWallet() {
    this.smartContract.connectWallet().subscribe((isConnected) => {
      if (isConnected)
        this.itemEvent.emit(true);
    });
  }
}