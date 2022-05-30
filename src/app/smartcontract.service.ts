import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import contract from '../../contracts/ShopChain.json';
import detectEthereumProvider from "@metamask/detect-provider";

@Injectable({
  providedIn: 'root'
})

export class SmartcontractService {
  public static smartContract : any;
  public static currentAddress : string;
  public static smartContractAddress : string = contract.contractAddress;

  constructor() {}

  async initializeContract() {
    const provider = await SmartcontractService.getWebProvider();
    SmartcontractService.smartContract = new ethers.Contract(
      contract.contractAddress,
      contract.abi,
      provider.getSigner(),
    );
  }

  private static async getWebProvider(requestAccounts = true) {
    const provider : any = await detectEthereumProvider()
    if (requestAccounts)
      SmartcontractService.currentAddress =  await provider.request({ method: 'eth_requestAccounts' })

    return new ethers.providers.Web3Provider(provider)
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
}