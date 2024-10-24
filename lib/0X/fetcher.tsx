// 'use server'
import { PriceRequestParams, TokenContract, TRANSACTION_TYPE, ErrorMessage, WRAPPING_TYPE } from '@/lib/structure/types'
import qs from "qs";
import useSWR from 'swr';
import { exchangeContext } from '../context';
import { isNetworkProtocolAddress, NETWORK_PROTOCOL_CRYPTO } from '../network/utils';
import { Address } from 'viem';

const BUY_AMOUNT_UNDEFINED = 200;
const SELL_AMOUNT_ZERO = 300;
const BUY_AMOUNT_ZERO = 400;
const ERROR_0X_RESPONSE = 500;

const NEXT_PUBLIC_API_SERVER:string|undefined = process.env.NEXT_PUBLIC_API_SERVER

const apiPriceBase = "/0X/price";
const apiQuoteBase = "/0X/quote";
let apiCall:string;

const WRAPPED_ETHEREUM_ADDRESS ="0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

function validTokenOrNetworkCoin(address: any): any {
  if (isNetworkProtocolAddress(address)){
    return WRAPPED_ETHEREUM_ADDRESS;
  } else
    return address;
}

const fetcher = ([endpoint, params]: [string, PriceRequestParams]) => {
  endpoint = NEXT_PUBLIC_API_SERVER + endpoint
  let { sellAmount, buyAmount } = params;

  if (!sellAmount && !buyAmount) return;


  if (!sellAmount && buyAmount === "0") {
    throw {errCode: BUY_AMOUNT_ZERO, errMsg: 'Fetcher not executing remote price call: Buy Amount is 0'}
  }

  if (!buyAmount && (sellAmount === undefined || sellAmount === "0")) {
    throw {errCode: SELL_AMOUNT_ZERO, errMsg: 'Fetcher not executing remote price call: Sell Amount is 0'};
  }

try {
    // console.debug("fetcher([endpoint = " + endpoint + ",params = " + JSON.stringify(params,null,2) + "]")
    const query = qs.stringify(params);
    apiCall = endpoint + '?' + query;
    // console.debug(`BEFORE fetcher.apiCall:${apiCall}`);
    let result = fetch(`${apiCall}`).then((res) => res.json());
    // console.debug(`fetcher: ${endpoint}?${query}`);
    // alert("fetcher result = " + JSON.stringify(result,null,2) + "]")
    return result
  }
  catch (e) {
    alert("fetcher Error: "+JSON.stringify(e, null, 2))
    throw {errCode: ERROR_0X_RESPONSE, errMsg: JSON.stringify(e, null, 2)}
  }
}

const getApiErrorTransactionData = (sellTokenAddress:Address|undefined, buyTokenAddress:Address|undefined, sellAmount:any, data:any) => {
  let priceTransaction:string = `ERROR         : API Call\n`
            priceTransaction += `Server        : ${process.env.NEXT_PUBLIC_API_SERVER}\n`
            priceTransaction += `netWork       : ${exchangeContext.network.name.toLowerCase()}\n`
            priceTransaction += `apiPriceBase  : ${apiPriceBase}\n`
            priceTransaction += `sellToken     : ${sellTokenAddress}\n`
            priceTransaction += `buyToken      : ${buyTokenAddress}\n`
            priceTransaction += `sellAmount    : ${sellAmount?.toString()}\n`
            priceTransaction += `apiCall       : ${apiCall}\n`
            priceTransaction += `response data : ${JSON.stringify(data, null, 2)}`
  return priceTransaction;
}

const getPriceApiCall = (sellTokenAddress:Address|undefined, buyTokenAddress:Address|undefined, sellAmount:any, buyAmount:any, transactionType:any) => {
  let priceApiCall = (sellAmount === 0n && transactionType === TRANSACTION_TYPE.SELL_EXACT_OUT) ||
                     (buyAmount === 0n && transactionType === TRANSACTION_TYPE.BUY_EXACT_IN)? 
                      undefined :
                      [
                        exchangeContext.network.name.toLowerCase() + apiPriceBase,
                        {
                          sellToken: validTokenOrNetworkCoin(sellTokenAddress),
                          buyToken: validTokenOrNetworkCoin(buyTokenAddress),
                          sellAmount: (transactionType === TRANSACTION_TYPE.SELL_EXACT_OUT) ? sellAmount.toString() : undefined,
                          buyAmount: (transactionType ===  TRANSACTION_TYPE.BUY_EXACT_IN) ? buyAmount.toString() : undefined,
                          // The Slippage does not seam to pass check the api parameters with a JMeter Test then implement here
                          // slippagePercentage: slippage,
                          // expectedSlippage: slippage
                        },
                      ];
  return priceApiCall;
}



// ToDo This is to turn on off mandatory fetching
const shouldFetch = (sellTokenAddress:Address|undefined, buyTokenAddress:Address|undefined)  => {
  return true;
}

type Props = {
  sellTokenAddress:Address|undefined,
  buyTokenAddress:Address|undefined,
  transactionType:TRANSACTION_TYPE,
  sellAmount:bigint,
  buyAmount:bigint,
  setPriceResponse: (data:any) => void,
  setSellAmount: (sellAmount:bigint) => void,
  setBuyAmount: (buyAmount:bigint) => void,
  // setErrorMessage: (errMsg:ErrorMessage) => void
  apiErrorCallBack: (apiErrorObj:any) => void
}

const WETH = `0xae740d42e4ff0c5086b2b5b5d149eb2f9e1a754f`;

// const getRequiredWrapping = (sellTokenAddress:Address|undefined, buyTokenAddress:Address|undefined, amount:number)  => {
//   if (!isNetworkProtocolAddress(sellTokenAddress)) {
//     if (!isNetworkProtocolAddress(buyTokenAddress)) {
//       swap(sellTokenAddress, buyTokenAddress, amount)
//     } else if (sellTokenAddress !== WETH)) {
//       swap(sellTokenAddress, WETH, amount)
//       unWrap(WETH, amount)
//     } else {
//       wrap(sellTokenAddress, amount)
//       if (buyTokenAddress !== WETH)) {
//         swap(WETH, buyTokenAddress, amount)
//       }
//     }
//   }

function usePriceAPI({
  sellTokenAddress, 
  buyTokenAddress,
  transactionType,
  sellAmount,
  buyAmount,
  setPriceResponse,
  setSellAmount,
  setBuyAmount,
  apiErrorCallBack
}:Props) {
                        
  return useSWR(
    () => shouldFetch(sellTokenAddress, buyTokenAddress) ? getPriceApiCall(sellTokenAddress, buyTokenAddress, sellAmount, buyAmount, transactionType) : null,
    fetcher,
    {
      onSuccess: (data) => {
        if (!data.code) {
          // let dataMsg = `SUCCESS: apiCall => ${getApiErrorTransactionData(data, sellTokenContract, buyTokenContract, sellAmount)}`
          // console.log(dataMsg)
          // console.debug(`AFTER fetcher data =  + ${JSON.stringify(data,null,2)} + ]`)
          setPriceResponse(data);
          // console.debug(formatUnits(data.buyAmount, buyTokenContract.decimals), data);
          setBuyAmount(data.buyAmount);
        }
        else {
          // alert(data?.code)
          if (isNetworkProtocolAddress(sellTokenAddress) || isNetworkProtocolAddress(buyTokenAddress)) {
            // alert(`ERROR:sellTokenAddress = ${sellTokenaddress}\nbuyTokenAddress = ${buyTokenaddress}\nsellAmount = ${sellAmount}`)
            if(transactionType === TRANSACTION_TYPE.SELL_EXACT_OUT)
              setBuyAmount(sellAmount);
            else if (transactionType === TRANSACTION_TYPE.BUY_EXACT_IN)
              setSellAmount(buyAmount);
          }
          // else {
          //   const apiErrorObj = getApiErrorTransactionData(data, sellTokenAddress, buyTokenAddress, sellAmount)
          //   apiErrorCallBack(apiErrorObj);
          // }
        }
      },
      // onError: (error) => {
        // processError(
        //   error,
        //   setErrorMessage,
        //   buyTokenContract,
        //   sellTokenContract,
        //   setBuyAmount,
        //   setValidPriceInput
        // );
      // }
    }
  );
}

export {
    fetcher,
    // processError,
    usePriceAPI,
    BUY_AMOUNT_UNDEFINED,
    SELL_AMOUNT_ZERO,
    BUY_AMOUNT_ZERO,
    ERROR_0X_RESPONSE
}


//   let wrappingType:WRAPPING_TYPE = WRAPPING_TYPE.NO_WRAP_REQUIRED;
//   if (sellTokenAddress && buyTokenAddress) {
//     alert(`sellTokenAddress = ${sellTokenAddress}, buyTokenAddress = ${buyTokenAddress}`)
//     if (sellTokenAddress !== buyTokenAddress) {
//       const transactionType = exchangeContext.tradeData.transactionType;
//       alert(`transactionType = ${transactionType}`)
//       if (transactionType === TRANSACTION_TYPE.SELL_EXACT_OUT) {
//         if (validTokenOrNetworkCoin(sellTokenAddress) === buyTokenAddress) {
//           alert("HERE 1")
//           wrappingType = WRAPPING_TYPE.WRAP_SELL_TOKEN;
//         } else if (validTokenOrNetworkCoin(buyTokenAddress) === sellTokenAddress) {
//           alert("HERE 2")
//           wrappingType = WRAPPING_TYPE.UNWRAP_SELL_TOKEN
//         }
//       } else if (transactionType === TRANSACTION_TYPE.BUY_EXACT_IN) {
//         if (validTokenOrNetworkCoin(buyTokenAddress) === sellTokenAddress) {
//           alert("HERE 3")
//           wrappingType = WRAPPING_TYPE.WRAP_BUY_TOKEN
//         } else if (validTokenOrNetworkCoin(sellTokenAddress) === buyTokenAddress) {
//           alert("HERE 4")
//           wrappingType = WRAPPING_TYPE.UNWRAP_BUY_TOKEN
//         }
//       }
//     }
//   }
// return wrappingType;
// }

// const getEnumWrappingTypeText = (wrappingType:WRAPPING_TYPE) => {
//   switch(wrappingType) {
//     case WRAPPING_TYPE.WRAP_SELL_TOKEN   : return "WRAP_SELL_TOKEN";
//     case WRAPPING_TYPE.UNWRAP_SELL_TOKEN : return "UNWRAP_SELL_TOKEN";
//     case WRAPPING_TYPE.WRAP_BUY_TOKEN    : return "WRAP_BUY_TOKEN";
//     case WRAPPING_TYPE.UNWRAP_BUY_TOKEN  : return "UNWRAP_BUY_TOKEN";
//     case WRAPPING_TYPE.NO_WRAP_REQUIRED  :
//     default                              : return "NO_WRAP_REQUIRED";
//   }
// }

// const isWrapRequired = (sellTokenAddress:Address|undefined, buyTokenAddress:Address|undefined) => {
//   const requiredWrapping = getRequiredWrapping(sellTokenAddress, buyTokenAddress);
//   if (requiredWrapping !== WRAPPING_TYPE.NO_WRAP_REQUIRED )
//     alert(`WRAPPING REQUIRED = ${getEnumWrappingTypeText(requiredWrapping)}`);
//   return requiredWrapping === WRAPPING_TYPE.UNWRAP_BUY_TOKEN ? true : false;
// }
