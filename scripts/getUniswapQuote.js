const { ethers } = require("hardhat");
require("dotenv").config();

// Create provider using ethers v6 syntax
const provider = new ethers.JsonRpcProvider(process.env.API_URL);

// Uniswap V3 QuoterV2 contract on Sepolia (their deployed contract)
const quoterAddress = "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3";
const quoterAbi = [
  {"inputs":[{"internalType":"address","name":"_factory","type":"address"},
  {"internalType":"address","name":"_WETH9","type":"address"}],
  "stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[],"name":"WETH9","outputs":[{"internalType":"address","name":"","type":"address"}],
  "stateMutability":"view","type":"function"},
  {"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],
  "stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"bytes","name":"path","type":"bytes"},
  {"internalType":"uint256","name":"amountIn","type":"uint256"}],
    "name":"quoteExactInput","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},
  {"internalType":"uint160[]","name":"sqrtPriceX96AfterList","type":"uint160[]"},
  {"internalType":"uint32[]","name":"initializedTicksCrossedList","type":"uint32[]"},
  {"internalType":"uint256","name":"gasEstimate","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},
  {"internalType":"address","name":"tokenOut","type":"address"},
  {"internalType":"uint256","name":"amountIn","type":"uint256"},
  {"internalType":"uint24","name":"fee","type":"uint24"},
  {"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],
  "internalType":"struct IQuoterV2.QuoteExactInputSingleParams","name":"params","type":"tuple"}],
  "name":"quoteExactInputSingle","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},
  {"internalType":"uint160","name":"sqrtPriceX96After","type":"uint160"},
  {"internalType":"uint32","name":"initializedTicksCrossed","type":"uint32"},
  {"internalType":"uint256","name":"gasEstimate","type":"uint256"}],
  "stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"bytes","name":"path","type":"bytes"},
  {"internalType":"uint256","name":"amountOut","type":"uint256"}],
  "name":"quoteExactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},
  {"internalType":"uint160[]","name":"sqrtPriceX96AfterList","type":"uint160[]"},
  {"internalType":"uint32[]","name":"initializedTicksCrossedList","type":"uint32[]"},
  {"internalType":"uint256","name":"gasEstimate","type":"uint256"}],
  "stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},
  {"internalType":"address","name":"tokenOut","type":"address"},
  {"internalType":"uint256","name":"amount","type":"uint256"},
  {"internalType":"uint24","name":"fee","type":"uint24"},
  {"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],
  "internalType":"struct IQuoterV2.QuoteExactOutputSingleParams","name":"params","type":"tuple"}],
  "name":"quoteExactOutputSingle","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},
  {"internalType":"uint160","name":"sqrtPriceX96After","type":"uint160"},
  {"internalType":"uint32","name":"initializedTicksCrossed","type":"uint32"},
  {"internalType":"uint256","name":"gasEstimate","type":"uint256"}],
  "stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"int256","name":"amount0Delta","type":"int256"},
  {"internalType":"int256","name":"amount1Delta","type":"int256"},
  {"internalType":"bytes","name":"path","type":"bytes"}],
  "name":"uniswapV3SwapCallback","outputs":[],"stateMutability":"view","type":"function"}
];

// Token addresses on Sepolia
const ethAddress = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";


async function main() {
  const quoter = new ethers.Contract(quoterAddress, quoterAbi, provider);

  const fee = 3000; // 0.3% pool
  const amountIn = ethers.parseUnits("1", 18); // 1 WETH


  try {
    const amountOutStruct = await quoter.getFunction("quoteExactInputSingle").staticCall({
      tokenIn: ethAddress,
      tokenOut: usdcAddress,
      amountIn,
      fee,
      sqrtPriceLimitX96: 0n
    });

    console.log(`Quoter output for 1 ETH → USDC: ${ethers.formatUnits(amountOutStruct.amountOut, 6)} USDC`);
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
}

main().catch(console.error);