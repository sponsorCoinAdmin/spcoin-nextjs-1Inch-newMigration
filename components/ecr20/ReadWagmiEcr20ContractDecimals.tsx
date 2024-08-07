import React from 'react'
import { Address } from 'viem'
import { getERC20WagmiClientDecimals  } from '@/lib/wagmi/erc20WagmiClientRead'

type Props = {
  TOKEN_CONTRACT_ADDRESS:Address
}

const contractDecimals = ({ TOKEN_CONTRACT}: Props) => {
  const decimals    = getERC20WagmiClientDecimals(TOKEN_CONTRACT)
  return (
    <>
      <hr className="border-top: 3px dashed #bbb"/>
      <h2>Reading Wagmi Token Decimals for Contract({TOKEN_CONTRACT})</h2>
      Token Decimals : {decimals} <br/>
    </>
  )
}

export default contractDecimals
