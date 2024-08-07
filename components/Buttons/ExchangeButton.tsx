import React from 'react'
import styles from '@/styles/Exchange.module.css'
import { ExchangeContext, TradeData } from '@/lib/structure/types'
import { formatUnits, parseUnits } from "ethers";
import { stringifyBigInt } from '@/lib/spCoin/utils';

type Props = {
  exchangeContext:ExchangeContext,
  tradeData:TradeData
}

const CustomConnectButton = ({ exchangeContext}:Props) => {
  const tradeData:TradeData = exchangeContext.tradeData;

  const show = () => {
    alert(`CustomConnectButton:useEffect(() => exchangeContext = ${stringifyBigInt(exchangeContext)}`);
  }

  const insufficientSellAmount = () => {
    let noTradingAmount:boolean = false;
    try {
    // let noTradingAmount:boolean = !( exchangeContext.sellAmount === "0"  || exchangeContext.buyAmount === "0" )
    noTradingAmount = ( tradeData.sellAmount === "0" )
    // console.log(`ExchangeButton => exchangeContext.sellAmount = ${exchangeContext.sellAmount}\noTradingAmount = ${noTradingAmount}`);
    // alert (validTradingAmount)
    } catch(err:any) {
      console.debug(`ERROR: CustomConnectButton.insufficientSellAmount: ${err.message}`)
    }
    return noTradingAmount;
  }

  const insufficientSellBalance = () => {
    let insufficientSellBalance:boolean = false;
     try {
      console.debug(`EXCHANGE_BUTTON.exchangeContext = \n${stringifyBigInt(exchangeContext)}`);
      const sellAmount = tradeData.sellAmount;
      const bigIntSellBalanceOf = tradeData.sellBalanceOf;
      const sellDecimals = exchangeContext.sellTokenContract.decimals;
      const sellBalanceOf = tradeData.sellBalanceOf;
      const bigIntSellAmount = parseUnits(sellAmount, sellDecimals)
      insufficientSellBalance = bigIntSellBalanceOf <  bigIntSellAmount

      // let bigIntSellBalanceOf:BigInt  = BigInt(exchangeContext.sellBalanceOf);
      // let bigIntSellAmount:BigInt  = BigInt(exchangeContext.sellAmount);

      console.debug(`CustomConnectButton.insufficientSellBalance: sellBalanceOf = "${bigIntSellBalanceOf}"`);
      console.debug(`sellAmount              = "${sellAmount}"`);
      console.debug(`sellDecimals            = "${sellDecimals}"`);
      console.debug(`sellBalanceOf           = "${sellBalanceOf}"`);
      console.debug(`bigIntSellAmount        = "${bigIntSellAmount}"`);
      console.debug(`bigIntSellBalanceOf     = "${bigIntSellBalanceOf}"`);
      console.debug(`insufficientSellBalance = "${insufficientSellBalance}"`);

    } catch(err:any) {
      console.debug(`ERROR: CustomConnectButton.insufficientSellBalance: ${err.message}`)
    }
    return insufficientSellBalance;
  }

  return (
    <div>
      <button
        onClick={show}
        // disabled={true}
        type="button"
        className={styles["exchangeButton"]}
        >
        {/* {insufficientSellAmount() ? "Enter an Amount" : "Insufficient Balance"} */}

        {insufficientSellAmount() ? "Enter an Amount" : 
        insufficientSellBalance() ? "Insufficient Sell Balance" :
        "SWAP"}
      </button>
    </div>
  )
}

export default CustomConnectButton