'use client';
import styles from '@/app/styles/Exchange.module.css';
import {
  openDialog,
  AgentDialog,
  RecipientDialog,
  SellTokenDialog,
  BuyTokenDialog,
  ErrorDialog
} from '@/app/components/Dialogs/Dialogs';
import useSWR from "swr";
import { useState, useEffect } from "react";
import { formatUnits, parseUnits } from "ethers";
import { useEstimateGas, useSendTransaction } from 'wagmi' 
import { WalletElement, TokenContract, EXCHANGE_STATE, ExchangeContext, DISPLAY_STATE } from '@/app/lib/structure/types';
import { fetcher, processError } from '@/app/lib/0X/fetcher';
import { isSpCoin, setValidPriceInput } from '@/app/lib/spCoin/utils';
import type { PriceResponse, QuoteResponse } from "@/app/api/types";
import {setDisplayPanels,} from '@/app/lib/spCoin/guiControl';
import TradeContainerHeader from '@/app/components/Popover/TradeContainerHeader';
import BuySellSwapButton from '@/app/components/Buttons/BuySellSwapButton';
import SellContainer from '@/app/components/containers/SellContainer';
import BuyContainer from '@/app/components/containers/BuyContainer';
import RecipientContainer from '@/app/components/containers/RecipientContainer';
import SponsorRateConfig from '@/app/components/containers/SponsorRateConfig';
import AffiliateFee from '@/app/components/containers/AffiliateFee';
import PriceButton from '@/app/components/Buttons/PriceButton';
import FeeDisclosure from '@/app/components/containers/FeeDisclosure';
import IsLoading from '@/app/components/containers/IsLoadingPrice';
import { exchangeContext, resetContextNetwork } from "@/app/lib/context";
import QuoteButton from '@/app/components/Buttons/QuoteButton';
import { Address, parseEther } from 'viem';


/*
import {
  useAccount,
  useChainId,
  useSendTransaction,
  usePrepareSendTransaction,
  type Address,
} from "wagmi";
import { getTokenDetails, fetchTokenDetails, isSpCoin, setValidPriceInput } from "@/app/lib/spCoin/utils";
import TradeContainerHeader from '@/app/components/Popover/TradeContainerHeader';
import SellContainer from '@/app/components/containers/SellContainer';
import BuyContainer from '@/app/components/containers/BuyContainer';
import FeeDisclosure from '@/app/components/containers/FeeDisclosure';
import AffiliateFee from '@/app/components/containers/AffiliateFee';
import QuoteButton from '@/app/components/Buttons/QuoteButton';
import { setDisplayPanels, showElement } from '@/app/lib/spCoin/guiControl';
import ErrorDialog from '@/app/components/Dialogs/ErrorDialog';
import { AgentDialog, BuyTokenDialog, RecipientDialog, SellTokenDialog, openDialog } from '@/app/components/Dialogs/Dialogs';
import SponsorRateConfig from '@/app/components/containers/SponsorRateConfig';
import RecipientContainer from '@/app/components/containers/RecipientContainer';
import IsLoading from '@/app/components/containers/IsLoading';
import { DISPLAY_STATE, EXCHANGE_STATE, TokenContract, WalletElement } from '@/app/lib/structure/types';
import { PriceResponse, QuoteResponse } from '@/app/api/types';
import { exchangeContext } from '@/app/lib/context';
import BuySellSwapButton from '@/app/components/Buttons/BuySellSwapButton';
import PriceButton from '@/app/components/Buttons/PriceButton';
*/

const AFFILIATE_FEE:any = process.env.NEXT_PUBLIC_AFFILIATE_FEE === undefined ? "0" : process.env.NEXT_PUBLIC_AFFILIATE_FEE
console.debug("QUOTE AFFILIATE_FEE = " + AFFILIATE_FEE)

//////////// Quote Code
export default function QuoteView({
  price,
  quote,
  setQuote,
  connectedWalletAddr,
}: {
  price: PriceResponse;
  quote: QuoteResponse | undefined;
  setQuote: (price: any) => void;
  connectedWalletAddr: Address;
}) {

  // alert("EXCHANGE/QUOTE HERE 1")
  console.debug("########################### QUOTE RERENDERED #####################################")

  // console.debug("chainId = "+chainId +"\nnetworkName = " + networkName)
  // fetch price here
  const [chainId, setChainId] = useState(exchangeContext.data.chainId);
  const [network, setNetwork] = useState(exchangeContext.data.networkName);
  const [sellAmount, setSellAmount] = useState<string>(exchangeContext.data.sellAmount);
  const [buyAmount, setBuyAmount] = useState<string>(exchangeContext.data.buyAmount);
  const [sellBalance, setSellBalance] = useState<string>("0");
  const [buyBalance, setBuyBalance] = useState<string>("0");
  const [tradeDirection, setTradeDirection] = useState(exchangeContext.data.tradeDirection);
  const [state, setState] = useState<EXCHANGE_STATE>(exchangeContext.data.state);
  const [slippage, setSlippage] = useState<string>(exchangeContext.data.slippage);
  const [displayState, setDisplayState] = useState<DISPLAY_STATE>(exchangeContext.data.displayState);

  const [sellTokenContract, setSellTokenContract] = useState<TokenContract>(exchangeContext.sellTokenContract);
  const [buyTokenContract, setBuyTokenContract] = useState<TokenContract>(exchangeContext.buyTokenContract);
  const [recipientWallet, setRecipientElement] = useState<WalletElement>(exchangeContext.recipientWallet);
  const [agentWallet, setAgentElement] = useState<WalletElement>(exchangeContext.agentWallet);
  const [errorMessage, setErrorMessage] = useState<Error>({ name: "", message: "" });

  useEffect(() => {
    console.debug("QUOTE:exchangeContext =\n" + JSON.stringify(exchangeContext,null,2))
    // ToDo Fix this makeshift, "Do TimeOut to Ensure Dom is loaded.""
    // For up to 15 seconds in half second increments set dom settings
    for(let i = 1; i <= 30; i++) {
      setTimeout(() => setDisplayPanels(displayState),i*500)
    }
  },[]);
  
  useEffect(() => {
    console.debug(`QUOTE: useEffect:chainId = ${chainId}`)
    exchangeContext.data.chainId = chainId;
  },[chainId]);

  useEffect(() => {
    console.debug(`QUOTE: setDisplayPanels(${displayState})`);
    setDisplayPanels(displayState);
    exchangeContext.data.displayState = displayState;
  },[displayState]);

  useEffect(() => {
    console.debug('QUOTE: slippage changed to  ' + slippage);
    exchangeContext.data.slippage = slippage;
  }, [slippage]);

  useEffect(() => {
    console.debug('QUOTE: state changed to  ' + state.toString);
    exchangeContext.data.state = state;
  }, [state]);

  useEffect(() => {
    // console.debug(`useEffect[connectedWalletAddr]:EXECUTING updateBuyBalance(${buyTokenContract.name});`)
  }, [connectedWalletAddr]);

  useEffect(() => {
    console.debug("sellTokenContract.symbol changed to " + sellTokenContract.name);
    exchangeContext.sellTokenContract = sellTokenContract;
  }, [sellTokenContract]);

  useEffect(() => {
    // alert(`useEffect[buyTokenContract]:EXECUTING updateBuyBalance(${buyTokenContract.name});`)
    if (displayState === DISPLAY_STATE.OFF && isSpCoin(buyTokenContract))
      setDisplayState(DISPLAY_STATE.SPONSOR_BUY) 
    else if (!isSpCoin(buyTokenContract)) 
      setDisplayState(DISPLAY_STATE.OFF)
    exchangeContext.buyTokenContract = buyTokenContract;
  }, [buyTokenContract]);

  useEffect(() => {
    console.debug("recipientWallet changed to " + recipientWallet.name);
    exchangeContext.recipientWallet = recipientWallet;
  }, [recipientWallet]);

  useEffect(() => {
    if (errorMessage.name !== "" && errorMessage.message !== "") {
      openDialog("#errorDialog");
    }
  }, [errorMessage]);

  useEffect(() => {
    if (errorMessage.name !== "" && errorMessage.message !== "") {
      openDialog("#errorDialog");
    }
  }, [errorMessage]);

  console.debug(`********* price.sellTokenAddress: ${price.sellTokenAddress}`)
  console.debug(`********* price.buyTokenAddress: ${price.buyTokenAddress}`)

  console.debug(`Executing Quote:setTokenDetails (${price.sellTokenAddress}, ${sellTokenContract})`)
  // setTokenDetails (price.sellTokenAddress, setSellTokenContract)

  // console.debug("price =\n" + JSON.stringify(price,null,2))
  // const sellTokenInfo =
  //   POLYGON_TOKENS_BY_ADDRESS[price.sellTokenAddress.toLowerCase()];

  // console.debug("sellTokenInfo =\n" + JSON.stringify(sellTokenInfo, null, 2))

  console.debug(`Executing Quote:setTokenDetails (${price.buyTokenAddress}, ${buyTokenContract})`)
  
  // setTokenDetails (price.buyTokenAddress, setBuyTokenContract)

  // const buyTokenInfo =
  //   POLYGON_TOKENS_BY_ADDRESS[price.buyTokenAddress.toLowerCase()];

  // console.debug("buyTokenInfo = \n" + JSON.stringify(buyTokenInfo,null,2))
  // setBuyTokenContract()
  
  // fetch quote here
  // const { address } = useAccount();

  const { isLoading: isLoadingPrice } = useSWR(
    [
      "/api/" + network + "/0X/quote",
      {
        sellToken: price.sellTokenAddress,
        buyToken: price.buyTokenAddress,
        sellAmount: price.sellAmount,
        slippagePercentage: slippage,
        // The Slippage does not seam to pass check the api parameters with a JMeter Test then implement here
        // slippagePercentage: slippage,
        // expectedSlippage: slippage,
        connectedWalletAddr,
      },
    ],
    fetcher,
    {
      onSuccess: (data) => {
        setQuote(data);
        console.log("quote", data);
        console.log(formatUnits(data.buyAmount, buyTokenContract.decimals), data);
      },
      onError: (error) => {
        processError(
          error,
          setErrorMessage,
          buyTokenContract,
          sellTokenContract,
          setBuyAmount,
          setValidPriceInput
        );
      },
    }
  );

  // const { config } = usePrepareSendTransaction({
  //   to: quote?.to, // The address of the contract to send call data to, in this case 0x Exchange Proxy
  //   data: quote?.data, // The call data required to be sent to the to contract address.
  // });

  const { sendTransaction } = useSendTransaction();

  const { data } = useEstimateGas({
    // to: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    to: quote?.to,
    value: parseEther('0.01'),
  })
  
  if (!quote) {
    return <div>Getting best quote...</div>;
  }

  console.log("quote" + JSON.stringify(quote,null,2));
  console.log(formatUnits(quote.sellAmount, sellTokenContract.decimals));

  return (
    <form autoComplete="off">
      <SellTokenDialog connectedWalletAddr={connectedWalletAddr} buyTokenContract={buyTokenContract} callBackSetter={setSellTokenContract} />
      <BuyTokenDialog connectedWalletAddr={connectedWalletAddr} sellTokenContract={sellTokenContract} callBackSetter={setBuyTokenContract} />
      <RecipientDialog agentWallet={agentWallet} setRecipientElement={setRecipientElement} />
      <AgentDialog recipientWallet={recipientWallet} callBackSetter={setAgentElement} />
      <ErrorDialog errMsg={errorMessage} />
      <div className={styles.tradeContainer}>
        <TradeContainerHeader slippage={slippage} setSlippageCallback={setSlippage}/>
        <SellContainer sellAmount={formatUnits(quote.sellAmount, sellTokenContract.decimals)} sellBalance={"ToDo: sellBalance"} sellTokenContract={sellTokenContract} setSellAmount={undefined} disabled={true}/>
        <BuyContainer buyAmount={formatUnits(quote.buyAmount, buyTokenContract.decimals)} buyBalance={"ToDo: sellBalance"} buyTokenContract={buyTokenContract} setBuyAmount={undefined} disabled={true} setDisplayState={setDisplayState}/>          
        {/* <BuySellSwapButton  sellTokenContract={sellTokenContract} buyTokenContract={buyTokenContract} setSellTokenContract={setSellTokenContract} setBuyTokenContract={setBuyTokenContract} /> */}
        {/* <PriceButton connectedWalletAddr={connectedWalletAddr} sellTokenContract={sellTokenContract} buyTokenContract={buyTokenContract} sellBalance={sellBalance} disabled={disabled} slippage={slippage} /> */}
        <button
  // disabled={!Boolean(sendTransaction)} 
  // onClick={() => sendTransaction()} 
  // disabled={!Boolean(data)} 
  // onClick={() => sendTransaction({ 
  //   gas: data, 
  //   to: quote?.to, 
  //   value: parseEther('0.01'), 
  // })} 
>
  Send transaction
</button>
        <QuoteButton sendTransaction={sendTransaction}/>
        <RecipientContainer recipientWallet={recipientWallet} setDisplayState={setDisplayState}/>
        <SponsorRateConfig setDisplayState={setDisplayState}/>
        <AffiliateFee price={price} sellTokenContract={sellTokenContract} buyTokenContract= {buyTokenContract} />
      </div>
      <FeeDisclosure/>
      <IsLoading isLoadingPrice={isLoadingPrice} />
    </form>
  );
}

/*
return (
  <div className="p-3 mx-auto max-w-screen-sm ">
    <form autoComplete="off">
    <RecipientDialog agentWallet={agentWallet} setRecipientElement={setRecipientElement} />
      <ErrorDialog errMsg={errorMessage} />
      <div className={styles.tradeContainer}>
        <TradeContainerHeader slippage={slippage} setSlippageCallback={setSlippage}/>
        <SellContainer sellAmount={formatUnits(quote.sellAmount, sellTokenContract.decimals)} sellBalance={"ToDo: sellBalance"} sellTokenContract={sellTokenContract} setSellAmount={undefined} disabled={true}/>
        <BuyContainer buyAmount={formatUnits(quote.buyAmount, buyTokenContract.decimals)} buyBalance={"ToDo: sellBalance"} buyTokenContract={buyTokenContract} setBuyAmount={undefined} disabled={true} setDisplayState={setDisplayState}/>          
        <QuoteButton sendTransaction={sendTransaction}/>
        <RecipientContainer recipientWallet={recipientWallet} setDisplayState={setDisplayState}/>
        <SponsorRateConfig setDisplayState={setDisplayState}/>
        <AffiliateFee price={price} sellTokenContract={sellTokenContract} buyTokenContract= {buyTokenContract} />
      </div>
      <FeeDisclosure/>
      <IsLoading isLoadingPrice={isLoadingPrice} />
    </form>
  </div>
);
*/