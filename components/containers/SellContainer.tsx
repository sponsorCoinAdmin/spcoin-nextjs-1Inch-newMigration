import React, { useEffect, useState } from 'react';
import { exchangeContext } from "@/lib/context";

import styles from '@/styles/Exchange.module.css';
import AssetSelect from './AssetSelect';
import { TokenContract, TRANSACTION_TYPE } from '@/lib/structure/types';
import { decimalAdjustTokenAmount, getValidBigIntToFormattedPrice, getValidFormattedPrice, isSpCoin , stringifyBigInt  } from '@/lib/spCoin/utils';
import { parseUnits } from "ethers";
import { useAccount } from 'wagmi';

import useERC20WagmiBalances from '@/components/ERC20/useERC20WagmiBalances'
import ManageSponsorsButton from '../Buttons/ManageSponsorsButton';

type Props = {
  updateSellAmount: bigint,
  sellTokenContract: TokenContract | undefined, 
  buyTokenContract: TokenContract | undefined, 
  setSellAmountCallback: (sellAmount:bigint) => void,
  setTokenContractCallback: (tokenContract:TokenContract|undefined) => void,
}

/* Sell Token Selection Module */
const SellContainer = ({updateSellAmount,
                        sellTokenContract,
                        buyTokenContract,
                        setSellAmountCallback,
                        setTokenContractCallback} : Props) => {
  const ACTIVE_ACCOUNT = useAccount();
  const [sellAmount, setSellAmount] = useState<bigint>(exchangeContext.tradeData.sellAmount);
  const [formattedSellAmount, setFormattedSellAmount] = useState<string>("0");
  const [tokenContract, setTokenContract] = useState<TokenContract|undefined>(sellTokenContract);
  const {formattedBalance} = useERC20WagmiBalances("***SellContainer", tokenContract?.address);

  useEffect(() =>  {
    const formattedSellAmount = getValidFormattedPrice(sellAmount, tokenContract?.decimals);
    setFormattedSellAmount(formattedSellAmount)
  }, []);

  useEffect(() =>  {
    // alert (`useEffect(() => tokenContract(${stringifyBigInt(tokenContract)})`)
    // alert (` balance = ${balance}\formattedNetworkBalance = ${stringifyBigInt(balance)}`)
    console.debug(`***SellContainer.useEffect([tokenContract]):tokenContract = ${tokenContract?.name}`)
    exchangeContext.sellTokenContract = tokenContract;
    console.debug(`***SellContainer.useEffect([tokenContract]):tokenContract = ${stringifyBigInt(exchangeContext)}`)
    setTokenContractCallback(tokenContract);
  }, [tokenContract?.address]);

  useEffect(() =>  {
    // alert (`useEffect(() => sellTokenContract(${stringifyBigInt(sellTokenContract)})`)
    console.debug(`SellContainer.useEffect([sellTokenContract]):sellTokenContract = ${sellTokenContract?.name}`)
    setDecimalAdjustedContract(sellTokenContract)
  }, [sellTokenContract]);

  useEffect (() => {
    console.debug(`%%%% SellContainer.useEffect[sellAmount = ${sellAmount}])`);
    exchangeContext.tradeData.sellAmount = sellAmount;
    setSellAmountCallback(sellAmount);
  }, [sellAmount])

  useEffect(() =>  {
    const decimals:number = sellTokenContract?.decimals || 0;
    const stringValue:string = getValidBigIntToFormattedPrice(updateSellAmount, decimals)
    if (!stringValue && stringValue !== "") {
      setFormattedSellAmount(stringValue);
    }
    if (updateSellAmount) 
      setSellAmount(updateSellAmount);
  }, [updateSellAmount]);

  const  setDecimalAdjustedContract = (newTokenContract: TokenContract|undefined) => {
    console.debug(`SellContainer.setDecimalAdjustedContract(sellContainer:${stringifyBigInt(newTokenContract)})`)
    // console.debug(`setDecimalAdjustedContract(sellContainer:${newTokenContract?.name})`)
    // console.debug(`!!!!!!!!!!!!!!!! BEFORE ADJUST sellAmount = ${sellAmount})`)
    const decimalAdjustedAmount:bigint = decimalAdjustTokenAmount(sellAmount, newTokenContract, tokenContract);
    // console.debug(`setDecimalAdjustedContract(sellContainer:${decimalAdjustedAmount})`)
    setSellAmount(decimalAdjustedAmount);
    // console.debug(`***SellContainer.newTokenContract = ${stringifyBigInt(newTokenContract)}`)
    setTokenContract(newTokenContract);
  }

  const setStringToBigIntStateValue = (stringValue:string) => {
    exchangeContext.tradeData.transactionType = TRANSACTION_TYPE.SELL_EXACT_OUT;
    const decimals = tokenContract?.decimals;
    stringValue = getValidFormattedPrice(stringValue, decimals);
    const bigIntValue = parseUnits(stringValue, decimals);
    console.debug(`SellContainer.setStringToBigIntStateValue setSellAmount(${bigIntValue})`);
    setSellAmount(bigIntValue);
    setFormattedSellAmount(stringValue);
  }

  let disabled = false;
  try {
    const IsSpCoin = isSpCoin(tokenContract);
    return (
      <div className={styles.inputs}>
        <input id="SellBuyAmount_ID" className={styles.priceInput} placeholder="0" disabled={disabled} value={formattedSellAmount}
          onChange={(e) => { setStringToBigIntStateValue(e.target.value); }}
          onBlur={(e) => { setFormattedSellAmount(parseFloat(e.target.value).toString()); }}
        />
        <AssetSelect tokenContract={tokenContract} 
                      altTokenContract={buyTokenContract} 
                      setDecimalAdjustedContract={setDecimalAdjustedContract} />
        <div className={styles["buySell"]}>
          You Pay
        </div>
        <div className={styles["assetBalance"]}>
          Balance: {formattedBalance || "0.0"}
        </div>
        {IsSpCoin ? <ManageSponsorsButton activeAccount={ACTIVE_ACCOUNT} tokenContract={tokenContract} /> : null}
      </div>
    )
  } catch (err:any) {
    console.debug (`Sell Container Error:\n ${err.message}\n${stringifyBigInt(exchangeContext)}`)
    // alert(`Sell Container Error:\n ${err.message}\n${JSON.stringify(exchangeContext,null,2)}`)
  }
}

export default SellContainer;
