import React from 'react';
import styles from '@/styles/Exchange.module.css';
import { openDialog } from '../Dialogs/Dialogs';
import Image from 'next/image';
import { DownOutlined } from "@ant-design/icons";
import cog_png from '../../public/resources/images/miscellaneous/cog.png';
import Link from 'next/link'
import { DISPLAY_STATE } from '@/lib/structure/types';

type Props = {
  recipientAccount: any,
  setDisplayState:(displayState:DISPLAY_STATE) => void
}

const toggleConfig = (setDisplayState:(displayState:DISPLAY_STATE) => void) => {
  const el = document.getElementById('recipientConfigDiv');
  if (el != null) {
    el.style.display === 'block' ? 
      setDisplayState(DISPLAY_STATE.RECIPIENT) :
      setDisplayState(DISPLAY_STATE.CONFIG);
  }
};

const RecipientContainer = ({recipientAccount, setDisplayState} : Props) => {
  // alert("RecipientContainer:\n" + JSON.stringify(recipientAccount,null,2))
  // let urlParms:string = `/Recipient?address=${recipientAccount.address}`
  let urlParms:string = `/Recipient/${recipientAccount.address}`
  urlParms += `?name=${recipientAccount.name}`
  urlParms += `&symbol=${recipientAccount.symbol}`
  urlParms += `&address=${recipientAccount.address}`
  urlParms += `&img=${recipientAccount.img}`
  urlParms += `&url=${recipientAccount.url}`

  // console.debug (`calling urlParms: ${urlParms}`)
  return (
    <div id="recipientSelectDiv" className={styles["inputs"] + " " + styles["hidden"]}>
      <div id="recipient-id" className={styles.sponsorCoinContainer}/>
      <div className={styles["yourRecipient"]}>
        You are sponsoring:
      </div>
      <Link href={`${urlParms}`} className={styles["recipientName"]}>
        {recipientAccount.name}
      </Link>
      <div className={styles["recipientSelect"]}>
        <img alt={recipientAccount.name} className="h-9 w-9 mr-2 rounded-md" src={recipientAccount.img} onClick={() => alert("Recipient Data " + JSON.stringify(recipientAccount,null,2))}/>
        {recipientAccount.symbol} 
        <DownOutlined onClick={() => openDialog("#recipientDialog")}/>
      </div>
      <div>
        <Image src={cog_png} className={styles["cogImg"]} width={20} height={20} alt="Info Image"  
        onClick={() => toggleConfig(setDisplayState)}/>
      </div>
      <div id="closeSponsorSelect" className={styles["closeSponsorSelect"]} onClick={() => setDisplayState(DISPLAY_STATE.SPONSOR_SELL_ON)}>
        X
      </div>
    </div>
  );
}

export default RecipientContainer;
