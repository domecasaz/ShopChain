import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import contract from '../../contracts/ShopChain.json';
import detectEthereumProvider from "@metamask/detect-provider";
import { from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SmartcontractService {
  public static smartContract : any = undefined;
  public static currentAddress : string;
  public static smartContractAddress : string = contract.contractAddress;
  private static ethereum : any = window.ethereum;
  private static provider : any = new ethers.providers.Web3Provider(SmartcontractService.ethereum);
  public static chainId : string = "0xa869";
  public static rightChain : boolean = true;
  constructor() {}

  private static async getWebProvider() {
    const provider : any = await detectEthereumProvider();
    return new ethers.providers.Web3Provider(provider);
  }

  public connectWallet() {
    return from(SmartcontractService.getWebProvider()).pipe(
      switchMap(async (provider) => {
        if (!provider)
          throw new Error("Please install MetaMask");
        
        SmartcontractService.currentAddress = await SmartcontractService.ethereum.request({ method: 'eth_requestAccounts' });
        return SmartcontractService.currentAddress !== undefined;
      }),
    );
  }

  async initializeContract() {
    if(SmartcontractService.smartContract === undefined) {
      SmartcontractService.smartContract = new ethers.Contract(
        contract.contractAddress,
        contract.abi,
        SmartcontractService.provider.getSigner(),
      );
    }
    SmartcontractService.currentAddress = await SmartcontractService.ethereum.request({ method: 'eth_requestAccounts' });
  }

  isRightChain() : boolean {
    return SmartcontractService.ethereum.chainId === SmartcontractService.chainId;
  }
  
  public async registerSeller() : Promise<any> {
    const transaction = await SmartcontractService.smartContract.registerAsSeller();
    const tx = await transaction.wait();

    return tx.status === 1;
  }

  public async getAllOrders() : Promise<any> {
    return await SmartcontractService.smartContract.getOrders();
  }

  public async getOrdersOfUser() : Promise<any> {
    return await SmartcontractService.smartContract.getOrdersOfUser(SmartcontractService.currentAddress[0]);
  }

  public async createOrder(sellerAddress : string, price : string) : Promise<boolean> {
    const amount = ethers.utils.parseEther(price);
    const transaction = await SmartcontractService.smartContract.createOrder(sellerAddress, { value: amount });
    const tx = await transaction.wait();
    return tx.status === 1;
  }

  public async getOrderById(id : number) : Promise<any> {
    return await SmartcontractService.smartContract.getOrder(id);
  }

  public listenerAccountChange() : void {
    SmartcontractService.ethereum.on("accountsChanged", async () => {
      await this.initializeContract();
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
      window.location.reload();
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

  public async askRefund(id : number) : Promise<void> {
    await SmartcontractService.smartContract.askRefund(id);
  }
}