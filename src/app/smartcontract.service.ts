import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import contract from '../../contracts/ShopChain.json';
import detectEthereumProvider from "@metamask/detect-provider";

@Injectable({
  providedIn: 'root'
})

export class SmartcontractService {
  public static smartContract : any = undefined;
  public static currentAddress : string;
  public static smartContractAddress : string = contract.contractAddress;
  public static provider : any;
  public static chainId : number = 43113;
  public static rightChain : boolean = true;
  constructor() {}

  async initializeContract() {
    if(SmartcontractService.smartContract === undefined) {
      const provider = await SmartcontractService.getWebProvider();
      SmartcontractService.smartContract = new ethers.Contract(
        contract.contractAddress,
        contract.abi,
        provider.getSigner(),
      );
    }
  }

  async isRightChain() : Promise<boolean> {
    const provider = await SmartcontractService.getWebProvider();
    return (await provider.getNetwork()).chainId === SmartcontractService.chainId;
  }

  private static async getWebProvider(requestAccounts = true) {
    SmartcontractService.provider = await detectEthereumProvider();
    if (requestAccounts)
      SmartcontractService.currentAddress =  await SmartcontractService.provider.request({ method: 'eth_requestAccounts' })

    return new ethers.providers.Web3Provider(SmartcontractService.provider)
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
    SmartcontractService.provider.on("accountsChanged",async () => {
      await this.initializeContract();
      window.location.reload();
    })
  }

  public listenerNetworkChange() : void {
    SmartcontractService.provider.on("chainChanged", () => {
      console.log(SmartcontractService.provider.chainId);
      if (SmartcontractService.provider.chainId === SmartcontractService.chainId) {
        SmartcontractService.rightChain = true;
      } else {
        SmartcontractService.rightChain = false;
      }
      window.location.reload();
    })
  }

  public async changeNetwork() : Promise<void> {
    console.log("ci sono")
    console.log("0x" + SmartcontractService.chainId.toString(16))
    try {
      await SmartcontractService.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0x" + SmartcontractService.chainId.toString(16) }],
      });
      window.location.reload();
    } catch (error : any) {
      console.log(error);
      if (error.code === 4902) {
        await SmartcontractService.provider.request({
          method: "wallet_addEthereumChain",
          params: [{ chainId: SmartcontractService.chainId }],
        });
      }
    }
  }
}