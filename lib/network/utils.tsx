import chainIdList from '@/resources/data/networks/chainIds.json';
import { defaultNetworkSettings as defaultEthereumSettings } from './initialize/ethereum/defaultNetworkSettings'
import { defaultNetworkSettings as defaultPolygonSettings } from './initialize/polygon/defaultNetworkSettings'
import { defaultNetworkSettings as defaultSepoliaSettings } from './initialize/sepolia/defaultNetworkSettings'
import { exchangeContext } from "@/lib/context";
import { Address } from 'viem';
import { TokenContract } from '../structure/types';

const BURN_ADDRESS:Address = "0x0000000000000000000000000000000000000000"
const NETWORK_PROTOCOL_CRYPTO:Address = BURN_ADDRESS
// const NETWORK_PROTOCOL_CRYPTO = "NETWORK PROTOCOL CRYPTO"

// This should work
const imgHome = "/resources/images/chains/"
// const imgHome = "../../resources/images/chains"
const imgType = ".png"

const isNetworkProtocolToken = (tokenContract:TokenContract) => {
  return isNetworkProtocolAddress(tokenContract.address);
}

const isNetworkProtocolAddress = (address:Address|undefined) : boolean => {
  return address === NETWORK_PROTOCOL_CRYPTO;
}

const isActiveWalletAccount = (address:Address|undefined) : boolean => {
  alert(`address = ${address}\nexchangeContext.activeWalletAccount = ${exchangeContext.activeWalletAccount}`);
  return address === exchangeContext.activeWalletAccount;
}

const isNetworkOrWalletAccountAddress = (address:Address|undefined) : boolean => {
  return isNetworkProtocolAddress(address) || isActiveWalletAccount(address)
}

const isTransaction_A_Wrap = () : boolean => {
  const buyTokenAddress = exchangeContext.buyTokenContract?.address;
  const sellTokenAddress = exchangeContext.sellTokenContract?.address;
  return  buyTokenAddress && sellTokenAddress && (buyTokenAddress !== sellTokenAddress) ? 
          isNetworkOrWalletAccountAddress(sellTokenAddress) && isNetworkOrWalletAccountAddress(buyTokenAddress) :
          false
}

const getChainMap = (chainList: any[]) => {
  const chainMap = new Map();
  const tList = chainList.map((e: any, i: number) => {
      chainMap.set(chainList[i].chainId,chainList[i])
  })
  return chainMap
}

const chainIdMap = getChainMap(chainIdList)

const getNetworkName = (chainId:number) => {
  const networkName:string = chainIdMap.get(chainId)?.name;
  return networkName;
}

function getAvatarImageURL(chainId:number|string) {
  // console.debug(`getAvatarImageURL:chainId = (${chainId})`)
  let imgURL:string = imgHome+chainId + imgType;
  // console.debug(`getAvatarImageURL:imgURL = (${imgURL})`)
  return imgURL
}

  // This method is never executed in the main program but is a utility to create a default network json list
const createNetworkJsonList = () => {
  const defaultNetworkSettings = {
    ethereum : defaultEthereumSettings,
    polygon  : defaultPolygonSettings,
    sepolia  : defaultSepoliaSettings,
  }
  let networkSettings = "default json Network Settings for all Networks AS follows:\n"+ JSON.stringify(defaultNetworkSettings, null, 2);
  console.debug(networkSettings)
  alert("NetworkSettings: "+networkSettings)
}

function isLowerCase (input:string) {  
  return input === String(input).toLowerCase()
}


// This code is not used anywhere but is implemented for future use
async function catchPromiseError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
  return promise
    .then(data => {
      return [undefined, data] as [undefined, T]
    })
    .catch(error => {
      return [error]
    })
}

export {
  BURN_ADDRESS,
  NETWORK_PROTOCOL_CRYPTO,
  catchPromiseError,
  createNetworkJsonList,
  getAvatarImageURL,
  getNetworkName,
  isLowerCase,
  isNetworkProtocolAddress,
  isNetworkProtocolToken,
  isTransaction_A_Wrap
}
  