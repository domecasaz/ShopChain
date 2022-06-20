import { Component, AfterContentInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from '../../order';
import { SmartcontractService } from '../../services/smartcontract.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


const ELEMENT_DATA1: Order[] = [
  {id: 1, sellerAddress: 'Hydrogen', buyerAddress: 'Hydrogen', amount: 1.0079, state: 'H'},
  {id: 1, sellerAddress: 'Hydrogen', buyerAddress: 'Hydrogen', amount: 1.0079, state: 'H'},
  {id: 1, sellerAddress: 'Hydrogen', buyerAddress: 'Hydrogen', amount: 1.0079, state: 'H'},
  {id: 1, sellerAddress: 'Hydrogen', buyerAddress: 'Hydrogen', amount: 1.0079, state: 'H'},
  {id: 1, sellerAddress: 'Hydrogen', buyerAddress: 'Hydrogen', amount: 1.0079, state: 'H'},
  {id: 1, sellerAddress: 'Hydrogen', buyerAddress: 'Hydrogen', amount: 1.0079, state: 'H'},
  {id: 1, sellerAddress: 'Hydrogen', buyerAddress: 'Hydrogen', amount: 1.0079, state: 'H'},
];
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterContentInit{

  @Input() orders : Order[] = [];

  displayedColumns: string[] = ['id', 'sellerAddress', 'buyerAddress', 'amount', 'state'];
  dataSource : any = [];

  constructor(private smartContract: SmartcontractService){}

  ngAfterContentInit() { 
    this.dataSource = new MatTableDataSource(this.orders)
    console.log(this.orders)
   }
}