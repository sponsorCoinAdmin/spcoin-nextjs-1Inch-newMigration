import {  TokenContract } from '../../../structure/types'
 
 const defaultSellToken: TokenContract = { 
  chainId: 11155111,
  symbol: "WBTC",
  img: "/resources/images/tokens/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
  name: "Wrapped Bitcoin",
  address: "0x536BcBE548cef2cE493932fEFCeC059Dda4d5579",
  decimals: 8
 };

const defaultBuyToken: TokenContract = { 
  chainId: 11155111,
  symbol: "USDT",
  img: "/resources/images/tokens/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
  name: "Tether USD",
  address: "0xAdd8Ad605fE57064903a3DeFC3b4ed676992bba6",
  decimals: 6
};

const defaultRecipient = { 
  "symbol": "Tiger",
  "img": "/resources/images/recipients/SaveTheTiger4.png",
  "name": "Support The Tiger",
  "address": "SaveTheTiger4 Wallet Address",
  "url": "ToDo N/A"
};

const defaultAgent = {
  "symbol": "Stuge 3",
  "img": "/resources/images/agents/MoeHoward.png",
  "name": "Moe Howard",
  "address": "Moe's Wallet Address",
  "url": "ToDo N/A"
};

const defaultNetworkSettings = {
  defaultSellToken : defaultSellToken,
  defaultBuyToken  : defaultBuyToken,
  defaultRecipient : defaultRecipient,
  defaultAgent     : defaultAgent
}

export { defaultNetworkSettings };
