import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import contract from '../../contracts/ShopChain.json';
import detectEthereumProvider from "@metamask/detect-provider";

function getWindow (): any {
  return window;
}

@Injectable({
  providedIn: 'root'
})

export class SmartcontractService {

  public SmartContract : any;

  constructor() {}

  public async registerSeller(): Promise<any> {
    const transaction = await this.SmartContract.registerAsSeller();
    const tx = await transaction.wait();

    return tx.status === 1;
  }

  initializeContract() {
      const provider = new ethers.providers.Web3Provider(getWindow().ethereum);
      this.SmartContract = new ethers.Contract(
        contract.contractAddress,
        contract.abi,
        provider.getSigner(),
      );
      console.log(this.SmartContract)
  }

  private static async getWebProvider(requestAccounts = true) {
    const provider: any = await detectEthereumProvider()

    if (requestAccounts) {
      await provider.request({ method: 'eth_requestAccounts' })
    }

    return new ethers.providers.Web3Provider(provider)
  }
}