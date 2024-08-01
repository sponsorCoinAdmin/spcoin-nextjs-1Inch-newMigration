import React from 'react'
import { Address } from 'viem'
import { useERC20WagmiClientTotalSupply  } from '@/lib/wagmi/erc20WagmiClientRead'

type Props = {
  TOKEN_CONTRACT:Address
}

const contractTotalSupply = ({ TOKEN_CONTRACT}: Props) => {
  let totalSupply    = useERC20WagmiClientTotalSupply(TOKEN_CONTRACT)
  return (
    <>
      <hr className="border-top: 3px dashed #bbb"/>
      <h2>Reading Wagmi Token TotalSupply for Contract({TOKEN_CONTRACT})</h2>
      Token TotalSupply   : {totalSupply?.toString()} <br/>
    </>
  )
}

export default contractTotalSupply
