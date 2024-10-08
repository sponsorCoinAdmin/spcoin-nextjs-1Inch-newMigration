'use client'

import React, { useEffect, useState } from "react";

import styles from '@/styles/Modal.module.css';
// import searchMagGlassBlack_png from './Resources/images/searchMagGlassBlack.png'
// import searchMagGlassWhite_png from './Resources/images/searchMagGlassWhite.png'
// import searchMagGlassGrey_png from '../../../resources/images/SearchMagGlassGrey.png'
// import searchMagGlassGrey_png from '@/public/resources/images/SearchMagGlassGrey.png'
import searchMagGlassGrey_png from '@/public/resources/images/SearchMagGlassGrey.png'
import Image from 'next/image'
import { useErc20ClientContract } from "@/lib/wagmi/erc20WagmiClientRead";

type Props = {
  placeHolder:string,
  newInputField:any,
  newInputFieldCallBack:(inputField:any) => void 
}

function InputSelect({ placeHolder, newInputField, newInputFieldCallBack }:Props) {
  const [ inputField, setInputField ] = useState<any>();
  const tokenContract = useErc20ClientContract(inputField)

  useEffect(() => {
    setInputField(newInputField || "")
  }, [newInputField])
  
  useEffect(() => {
    newInputFieldCallBack(tokenContract)
  }, [tokenContract])
  
  return (
    <div className={styles.modalElementSelect}>
      <div className={styles.leftH}>
        <Image src={searchMagGlassGrey_png} className={styles.searchImage} alt="Search Image Grey" />
        <input className={styles.modalElementSelect} 
               autoComplete="off" 
               placeholder={placeHolder} 
               value={inputField} 
               onChange={(e) => setInputField(e.target.value) }/>
               {/* onChange={ (e) => setInputField(e.target.value) }/> */}
      </div>
    </div>
  );
}

export default InputSelect;
