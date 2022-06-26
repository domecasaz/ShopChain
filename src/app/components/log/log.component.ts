import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SmartcontractService } from '../../services/smartcontract.service';
import { Log } from '../../log';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  public logs : Log[] = [];
  private id = Number(this.route.snapshot.paramMap.get('id'));

  constructor(
    private smartContract : SmartcontractService,
    private route : ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.logs = this.smartContract.getLog(this.id);
  }
}