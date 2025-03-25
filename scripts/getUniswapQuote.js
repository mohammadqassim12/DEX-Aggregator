const { ethers } = require("hardhat");
require("dotenv").config();

// Create provider using ethers v6 syntax
const provider = new ethers.JsonRpcProvider(process.env.API_URL);

// Uniswap V3 QuoterV2 contract on Sepolia
const quoterAddress = "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3";
const quoterAbi = [
    {
      "constant": true,
      "inputs": [
        { "name": "tokenIn", "type": "address" },
        { "name": "tokenOut", "type": "address" },
        { "name": "fee", "type": "uint24" },
        { "name": "amountIn", "type": "uint256" },
        { "name": "sqrtPriceLimitX96", "type": "uint160" }
      ],
      "name": "quoteExactInputSingle",
      "outputs": [
        { "name": "amountOut", "type": "uint256" },
        { "name": "sqrtPriceX96After", "type": "uint160" },
        { "name": "initializedTicksCrossed", "type": "uint32" },
        { "name": "gasEstimate", "type": "uint256" }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

// Token addresses on Sepolia
const wethAddress = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
const usdcAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";

async function main() {
  const quoter = new ethers.Contract(quoterAddress, quoterAbi, provider);

  // Use parseUnits directly from ethers in v6
  const amountIn = ethers.parseUnits("1", 18); // 1 WETH
  const fee = 3000; // 0.3% pool

  try {
    const amountOut = await quoter.quoteExactInputSingle(
      wethAddress,
      usdcAddress,
      fee,
      amountIn,
      0
    );

    // Use formatUnits directly from ethers in v6
    console.log(`Estimated output for 1 WETH → USDC: ${ethers.formatUnits(amountOut, 6)} USDC`);
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
}

main().catch(console.error);