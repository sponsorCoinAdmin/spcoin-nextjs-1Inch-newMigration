import React from 'react'
import { Address } from 'viem'
import {
  formatDecimals,
  getERC20WagmiClientDecimalRec,
  getERC20WagmiClientNameRec,
  getERC20WagmiClientSymbolRec,
  getERC20WagmiClientTotalSupplyRec } from '@/lib/wagmi/erc20WagmiClientRead'

type Props = {
  TOKEN_CONTRACT_ADDRESS:Address
}

const ReadWagmiEcr20RecordFields = ( { TOKEN_CONTRACT_ADDRESS }: Props) => {
  const nameRec = getERC20WagmiClientNameRec(TOKEN_CONTRACT_ADDRESS)
  const symbolRec = getERC20WagmiClientSymbolRec(TOKEN_CONTRACT_ADDRESS)
  const decimalRec = getERC20WagmiClientDecimalRec(TOKEN_CONTRACT_ADDRESS)
  const totalSupplyRec = getERC20WagmiClientTotalSupplyRec(TOKEN_CONTRACT_ADDRESS)

  let name = nameRec.status === 'success' ? nameRec.data : null
  let symbol = symbolRec.status === 'success' ?  symbolRec.data : null
  let decimals = decimalRec?.status === 'success' ? decimalRec?.data : null
  let totalSupply = totalSupplyRec.status === 'success' ? totalSupplyRec.data : null

  return (
    <>
      <hr className="border-top: 3px dashed #bbb"/>
      <h2>Read Wagmi ERC20 Record Fields for Token Contract({TOKEN_CONTRACT_ADDRESS})</h2>
      <div>{name === null ? null : "Token Name : " + name }</div>
      <div>{symbol === null ? null : "Symbol : " + symbol }</div>
      <div>{decimals === null ? null : "Decimals : " + decimals }</div>
      <div>{totalSupply === null ? null : "Total Supply : " + totalSupply }</div>
      <div>{(totalSupply === null || decimals === null) ? null : "Formatted Total Supply : " + formatDecimals(totalSupplyRec?.data, decimalRec?.data) }</div>
    </>
  )
}

export default ReadWagmiEcr20RecordFields
