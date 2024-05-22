import styles from '@/app/styles/Exchange.module.css';
import AssetSelect from './AssetSelect';
import { TokenContract } from '@/app/lib/structure/types';
import { setValidPriceInput } from '@/app/lib/spCoin/utils';
import UseBalanceOf from '@/app/components/containers/UseBalanceOf';

type Props = {
    sellAmount: string,
    sellBalance: string,
    sellTokenContract: TokenContract, 
    setSellAmount: any,
    disabled: boolean
    // setSellAmount: (txt: string) => void|undefined,
  }
  
/* Sell Token Selection Module */
const SellContainer = ({sellAmount, sellBalance, sellTokenContract, setSellAmount, disabled} : Props) => {
    // if (disabled) {
    //   console.debug(`hideElement("downOutlinedSell2")`)
    //   hideElement("downOutlinedSell2")
    // } else {
    //   console.debug(`showElement("downOutlinedSell2")`)
    //   showElement("downOutlinedSell2")
    // }
  return (
    <div className={styles.inputs}>
      <input id="sell-amount-id" className={styles.priceInput} placeholder="0" disabled={disabled} value={sellAmount}
        onChange={(e) => { setValidPriceInput(e.target.value, sellTokenContract.decimals, setSellAmount); }} />
      <AssetSelect TokenContract={sellTokenContract} id={"sellTokenDialog"} disabled={disabled}></AssetSelect>
      {/* <div className={styles["assetSelect"]}>
          <img alt={sellTokenContract.name} className="h-9 w-9 mr-2 rounded-md cursor-pointer" src={sellTokenContract.img} onClick={() => alert("sellTokenContract " + JSON.stringify(sellTokenContract,null,2))}/>
          {sellTokenContract.symbol}
          <DownOutlined id="downOutlinedSell2" onClick={() => openDialog("#sellTokenDialog")}/>
      </div> */}
      <div className={styles["buySell"]}>
        You Pay
      </div>
      <div className={styles["assetBalance"]}>
        Balance: {sellBalance}
      </div>
      <div id="sponsoredBalance" className={styles["sponsoredBalance"]}>
        Sponsored Balance: {"{ToDo}"}
        {/* <UseBalanceOf accountAddress={'0xc2132D05D31c914a87C6611C10748AEb04B58e8F'} contractAddress={`0x858BDEe77B06F29A3113755F14Be4B23EE6D6e59`}/> */}
        <UseBalanceOf accountAddress={'0x858BDEe77B06F29A3113755F14Be4B23EE6D6e59'} contractAddress={`0xc2132D05D31c914a87C6611C10748AEb04B58e8F`}/>
      </div>
    </div>
  );
}

export default SellContainer;
