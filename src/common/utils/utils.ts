import { BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { LiquidityPool, Transaction } from "../../../generated/schema";
import {
  BIGDECIMAL_HUNDRED,
  BIGDECIMAL_ONE,
  INT_ZERO,
  INT_ONE,
  BIGDECIMAL_TEN,
  BIGDECIMAL_TEN_THOUSAND,
  BIGDECIMAL_ZERO,
  BIGINT_ZERO,
  BIGINT_ONE,
  BIGINT_TEN,
} from "../constants";
import { getLiquidityPoolFee } from "../getters";
import { ZERO_BI, ONE_BI } from "./constants";

export function percToDec(percentage: BigDecimal): BigDecimal {
  return percentage.div(BIGDECIMAL_HUNDRED);
}

export function isNullEthValue(value: string): boolean {
  return value == '0x0000000000000000000000000000000000000000000000000000000000000001'
}

export function loadTransaction(event: ethereum.Event): Transaction {
  let transaction = Transaction.load(event.transaction.hash.toHexString())
  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHexString())
  }
  transaction.blockNumber = event.block.number
  transaction.timestamp = event.block.timestamp
  // transaction.gasUsed = event.transaction.gasUsed
  transaction.gasPrice = event.transaction.gasPrice
  transaction.save()
  return transaction as Transaction
}

export function calculateFee(
  pool: LiquidityPool,
  trackedAmountUSD: BigDecimal
): BigDecimal[] {
  let tradingFee = getLiquidityPoolFee(pool.fees[0]);
  let protocolFee = getLiquidityPoolFee(pool.fees[1]);
  let tradingFeeAmount = trackedAmountUSD.times(
    percToDec(tradingFee.feePercentage)
  );
  let protocolFeeAmount = trackedAmountUSD.times(
    percToDec(protocolFee.feePercentage)
  );

  return [tradingFeeAmount, protocolFeeAmount];
}

export function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BIGDECIMAL_ONE;
  for (let i = INT_ZERO; i < (decimals as i32); i = i + INT_ONE) {
    bd = bd.times(BIGDECIMAL_TEN);
  }
  return bd;
}

export function exponentToBigDecimalNew(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function exponentToBigInt(decimals: i32): BigInt {
  let bd = BIGINT_ONE;
  for (let i = INT_ZERO; i < (decimals as i32); i = i + INT_ONE) {
    bd = bd.times(BIGINT_TEN);
  }
  return bd;
}

export function exponentToBigDecimalBi(decimals: BigInt): BigDecimal {
  let bd = BIGDECIMAL_ONE;
  for (let i = BIGINT_ZERO; i.lt(decimals as BigInt); i = i.plus(BIGINT_ONE)) {
    bd = bd.times(BIGDECIMAL_TEN);
  }
  return bd;
}

export function convertTokenToDecimal(
  tokenAmount: BigInt,
  exchangeDecimals: i32
): BigDecimal {
  if (exchangeDecimals == INT_ZERO) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function convertTokenToDecimalNew(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimalNew(exchangeDecimals))
}

export function convertFeeToPercent(fee: i64): BigDecimal {
  return BigDecimal.fromString(fee.toString()).div(BIGDECIMAL_TEN_THOUSAND);
}

// return 0 if denominator is 0 in division
export function safeDiv(amount0: BigDecimal, amount1: BigDecimal): BigDecimal {
  if (amount1.equals(BIGDECIMAL_ZERO)) {
    return BIGDECIMAL_ZERO;
  } else {
    return amount0.div(amount1);
  }
}

// return 0 if denominator is 0 in division
export function safeDivBigInt(amount0: BigInt, amount1: BigInt): BigInt {
  if (amount1.equals(BIGINT_ZERO)) {
    return BIGINT_ZERO;
  } else {
    return amount0.div(amount1);
  }
}

// convert list array to lowercase
export function toLowerCase(list: string[]): string[] {
  for (let i = 0; i < list.length; i++) {
    list[i] = list[i].toLowerCase();
  }
  return list;
}
