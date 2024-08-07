import { isAddress } from "ethers";
import { getWagmiBalanceOfRec, readContractBalanceOf } from "@/lib/wagmi/getWagmiBalanceOfRec";
import { TokenContract } from "@/lib/structure/types";
import { toggleElement } from "./guiControl";
import { Address } from "viem";
import { exchangeContext } from "../context";

function getQueryVariable(_urlParams:string, _searchParam:string)
{
  console.debug("Searching " + _searchParam + " in _urlParams " + _urlParams)
   var vars = _urlParams.split("&");
   for (var i=0; i<vars.length; i++) {
           var pair = vars[i].split("=");
           if(pair[0] == _searchParam){
            console.debug("FOUND Search Param " + _searchParam + ": " + pair[1])
            return pair[1];
          }
   }
   console.debug("*** ERROR *** Search Param " + _searchParam + " Not Found")
   return "";
}

const setValidPriceInput = (txt: string, decimals: number, setSellAmount: (txt:string) => void ) => {
  txt = validatePrice(txt, decimals);
  if (txt !== "")
    setSellAmount(txt);
  return txt;
};

const  validatePrice = (price:string, decimals:number) => {
  // Allow only numbers and '.'
  const re = /^-?\d+(?:[.,]\d*?)?$/;
  if (price === '' || re.test(price)) {
    let splitText = price.split(".");
    // Remove leading zeros
    let formattedPrice = splitText[0].replace(/^0+/, "");
    if (formattedPrice === "" )
      formattedPrice = "0";
    if(splitText[1] != undefined) {
      // Validate Max allowed decimal size
      formattedPrice += '.' + splitText[1]?.substring(0, decimals);
    }
    return formattedPrice
  } 
  return "";
 }

const getTokenDetails = async(connectedWalletAddr:any, chainId:any, tokenAddr: any, setTokenContract:any) => {
  let td:any = fetchTokenDetails(connectedWalletAddr, chainId, tokenAddr)
  if (td !== false)
    setTokenContract(td);
  return td
}

const fetchTokenDetails = async(connectedWalletAddr:any, chainId:any, tokenAddr: any) => {
  try {
    if (isAddress(tokenAddr)) {
      let retResponse:any = await getWagmiBalanceOfRec (tokenAddr)
      // console.debug("retResponse = " + JSON.stringify(retResponse))
      // alert(JSON.stringify(retResponse,null,2))
      let td:TokenContract = {
        chainId: chainId,
        address: tokenAddr,
        symbol: retResponse.symbol,
        img: '/resources/images/miscellaneous/QuestionWhiteOnRed.png',
        name: retResponse.symbol,
        decimals: retResponse.decimals,
        totalSupply: undefined
      }
      return td
    }
 // return ELEMENT_DETAILS
  } catch (e:any) {
      console.debug("SELL_ERROR:setTokenDetails e.message" + e.message)
  }
  return false
}

const updateBalance = async (connectedWalletAddr: Address|undefined|null, TokenContract: TokenContract, setBalance:any) => {
  let success = true;
  let balance:string = "N/A";
  let errMsg = "N/A";
  let tokenAddr = TokenContract.address;
  console.debug("updateBalance(wallet Address = " + connectedWalletAddr + " TokenContract = " + JSON.stringify(TokenContract,null,2) + ")");
  if (connectedWalletAddr != null && connectedWalletAddr !== undefined)
  {
    let retResponse: any = await getWagmiBalanceOfRec(tokenAddr);

    // TESTING FIX UP
    // readContractBalanceOf(tokenAddr)
    // END TESTING
    // console.debug("retResponse = " + JSON.stringify(retResponse))
    balance = retResponse.formatted;
    setBalance(balance);
  }
  else {
    errMsg = "Wallet Connection Required for Balance"
    success = true
  }
  return {success, errMsg, balance} ;
};

const isSpCoin = (TokenContract:TokenContract) => {
  // alert(`isSpCoin = ${JSON.stringify(TokenContract,null,2)}`)
  return TokenContract.symbol === "SpCoin" ? true:false
}

const stringifyBigInt = (obj:any) => {
  return JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v,2)
}

const exchangeContextDump = () => {
  const exchangeData = stringifyBigInt(exchangeContext);
  alert(exchangeData);
  toggleElement("addSponsorshipDiv")
  console.debug(exchangeData);
}

export { 
  fetchTokenDetails,
  exchangeContextDump,
  getQueryVariable,
  getTokenDetails,
  isSpCoin,
  setValidPriceInput,
  stringifyBigInt,
  validatePrice,
  updateBalance
}
