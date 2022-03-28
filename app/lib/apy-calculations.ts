import { BigNumber, ethers } from "ethers";
import sampleCTokenAbi from "~/config/sample-ctoken-abi";
import { Token, cToken } from "~/types/global";
import { JsonRpcSigner } from "@ethersproject/providers";

function formatApy(apy: number): string {
  return `${apy.toString()}%`;
}

// https://compound.finance/docs#protocol-math

function calculateApy(
  underlyingAssetMantissa: number,
  ratePerBlock: number
): BigNumber {
  const blocksPerDay: BigNumber = BigNumber.from(6570); // 13.15 seconds per block
  const daysPerYear = BigNumber.from(365);
  const ratePerBlock2: BigNumber = BigNumber.from(ratePerBlock);
  const underlyingAssetMantissa2: BigNumber = BigNumber.from(
    underlyingAssetMantissa
  );

  const r = ratePerBlock2
    .div(underlyingAssetMantissa2)
    .mul(blocksPerDay)
    .add(1);
  const apy = r.pow(daysPerYear);

  // @ts-ignore
  return apy;
}

async function calculateDepositApy(
  token: Token,
  cToken: cToken,
  signer: JsonRpcSigner
): Promise<number> {
  // TODO: Use different ABI for cEth and cWBTC
  const cTokenContract = new ethers.Contract(
    cToken.address,
    sampleCTokenAbi,
    signer
  );

  const supplyRatePerBlock = await cTokenContract.supplyRatePerBlock();
  const underlyingAssetMantissa = token.decimals;

  const apy = calculateApy(underlyingAssetMantissa, supplyRatePerBlock);

  return apy;
}

async function calculateBorrowApy(
  token: Token,
  cToken: cToken,
  signer: JsonRpcSigner
): Promise<number> {
  // TODO: Use different ABI for cEth and cWBTC
  const cTokenContract = new ethers.Contract(
    cToken.address,
    sampleCTokenAbi,
    signer
  );

  const borrowRatePerBlock = await cTokenContract.borrowRatePerBlock();
  const underlyingAssetMantissa = token.decimals;

  const apy = calculateApy(underlyingAssetMantissa, borrowRatePerBlock);

  return apy;
}

async function formattedDepositApy(
  token: Token,
  cToken: cToken,
  signer: JsonRpcSigner
): Promise<string> {
  let apy: number = await calculateDepositApy(token, cToken, signer);

  return formatApy(apy);
}

async function formattedBorrowApy(
  token: Token,
  cToken: cToken,
  signer: JsonRpcSigner
): Promise<string> {
  let apy: number = await calculateBorrowApy(token, cToken, signer);

  return formatApy(apy);
}

export { formattedDepositApy, formattedBorrowApy };
