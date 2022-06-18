import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import contract from '../../contracts/ShopChain.json';
import { Order, State } from './order';
import detectEthereumProvider from "@metamask/detect-provider";
import { from, Observable, Observer, switchMap } from 'rxjs';
import { Log } from './log';

@Injectable({
  providedIn: 'root'
})

export class SmartcontractService {
  private static ethereum : any = window.ethereum;
  private static provider : any = new ethers.providers.Web3Provider(SmartcontractService.ethereum);
  public static currentAddress : string;
  public static smartContractAddress : string = contract.contractAddress;
  public static chainId : string = "0xa869";
  public static rightChain : boolean = true;
  public static smartContract : any = SmartcontractService.getContract();
  constructor() {}

  private static async getWebProvider() {
    const provider : any = await detectEthereumProvider();
    return new ethers.providers.Web3Provider(provider);
  }

  private static getContract() {
    return new ethers.Contract(
      contract.contractAddress,
      contract.abi,
      SmartcontractService.provider.getSigner(),
    );
  }

  public connectWallet() {
    return from(SmartcontractService.getWebProvider()).pipe(
      switchMap(async (provider) => {
        if (!provider)
          throw new Error("Please install MetaMask");
        
        await this.setCurrentAddress();
        return SmartcontractService.currentAddress !== undefined;
      }),
    );
  }

  // async initializeContract() {
  //   if(SmartcontractService.smartContract === undefined) {
  //     SmartcontractService.smartContract = new ethers.Contract(
  //       contract.contractAddress,
  //       contract.abi,
  //       SmartcontractService.provider.getSigner(),
  //     );
  //   }
  //   SmartcontractService.currentAddress = await SmartcontractService.ethereum.request({ method: 'eth_requestAccounts' });
  // }

  public isRightChain() : boolean {
    return SmartcontractService.ethereum.chainId === SmartcontractService.chainId;
  }

  public async setCurrentAddress() {
    SmartcontractService.currentAddress = await SmartcontractService.ethereum.request({ method: 'eth_requestAccounts' });
  }
  
  public async registerSeller() : Promise<any> {
    const transaction = await SmartcontractService.smartContract.registerAsSeller();
    const tx = await transaction.wait();

    return tx.status === 1;
  }

  public async getAllOrders() : Promise<any> {
    return await SmartcontractService.smartContract.getOrders();
  }

  public getOrdersOfUser() : Order[] {
    let orders : Order[] = [];
    SmartcontractService.smartContract.getOrdersOfUser(SmartcontractService.currentAddress[0]).then(
      (res : any) => {
        res.map((element : any) => {
          var order : Order = {
            id: Number(element[0]),
            buyerAddress: element[1].toString(),
            sellerAddress: element[2].toString(),
            amount: Number(ethers.utils.formatEther(element[3].toString())),
            state: State[element[4]],
          }
          orders.push(order);
        });
      }
    )
    return orders;
  }
  
  public async getOrderById(id : number) : Promise<Order> {
    let tmp = await SmartcontractService.smartContract.getOrder(id);
    let order : Order = {
      id: Number(tmp[0]),
      buyerAddress: tmp[1].toString(),
      sellerAddress: tmp[2].toString(),
      amount: Number(ethers.utils.formatEther(tmp[3].toString())),
      state: State[tmp[4]],
    }
    return order;
  }

  public getLog(id : number) : Log[] {
    let logs : Log[] = [];
    SmartcontractService.smartContract.getLogsOfOrder(id)
    .then((res : any) => {
      res.map((element : any) => {
        var log : Log = {
          state: State[element[0]],
          date: new Date(parseInt(element[1].toString())*1000).toLocaleString(),
        }
        logs.push(log);
      })
    })
    return logs;
  }

  public async createOrder(sellerAddress : string, price : string, func : Function) : Promise<boolean> {
    func();
    const amount = ethers.utils.parseEther(price);
    const transaction = await SmartcontractService.smartContract.createOrder(sellerAddress, { value: amount });
    const tx = await transaction.wait();
    return tx.status === 1;
  }  

  public listenerAccountChange() : void {
    SmartcontractService.ethereum.on("accountsChanged", async () => {
      await this.setCurrentAddress();
      window.location.reload();
    });
  }

  public listenerNetworkChange() : void {
    SmartcontractService.ethereum.on("chainChanged", () => {
      console.log(SmartcontractService.ethereum.chainId);
      if (SmartcontractService.ethereum.chainId === SmartcontractService.chainId) {
        SmartcontractService.rightChain = true;
      } else {
        SmartcontractService.rightChain = false;
      }
      window.location.reload();
    });
  }

  public async changeNetwork() : Promise<void> {
    try {
      await SmartcontractService.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SmartcontractService.chainId }],
      });
    } catch (error : any) {
      console.log(error);
      if (error.code === 4902) {
        await SmartcontractService.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{ chainId: SmartcontractService.chainId }],
        });
      }
    }
  }

  public async askRefund(id : number, func : Function) : Promise<boolean> {
    func();
    const transaction = await SmartcontractService.smartContract.askRefund(id);
    const tx = await transaction.wait();
    return tx.status === 1;
  }


  //  OPERAZIONI VENDITORE
  // public async shipOrder(id : number) : Promise<void> {
  //   await SmartcontractService.smartContract.shipOrder(id);
  // }

  // public async confirmOrder(id : number) : Promise<void> {
  //   await SmartcontractService.smartContract.confirmOrder(id);
  // }

  // public async deleteOrder(id : number) : Promise<void> {
  //   await SmartcontractService.smartContract.deleteOrder(id);
  // }

  // public async refundBuyer(id : number, amount : number) : Promise<void> {
  //   console.log(ethers.utils.parseEther(amount.toString()))
  //   await SmartcontractService.smartContract.refundBuyer(id, ethers.utils.parseEther(amount.toString()));
  // }
}