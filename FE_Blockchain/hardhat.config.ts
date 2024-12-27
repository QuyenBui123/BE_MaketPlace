require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  // networks: {
  //   localhost: {
  //           url: "http://127.0.0.1:8545"
  //   },
  //   hardhat: {
  //     chainId: 1337,
  //   },
  // },
  // networks: {
  //   hardhat: {},
  //   polygon_amoy: {
  //     url: "https://polygon-amoy.g.alchemy.com/v2/3atUr_8EYG2vhyoTZnP8DP2SefN_hpV1",
  //     accounts: [
  //       `0x${"e578aeaeb29f8d64d413e7001a64b96e0ae99d6b09c90cba1a99566d9dd7517b"}`, // Khóa riêng để triển khai
  //     ],
  //   },
  // },
  networks: {
    hardhat: {},
    polygon_amoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/rbA-zva8vK5mqJMRW5G3hZXXp4DXg_Jn",
      accounts: [
        `0x${"2deb7a6e15fcefc275f7d1ee45616ea0773d57a66cd310db192132f653c31428"}`, // Khóa riêng để triển khai
      ],
    },
  },
  // networks: {
  //   bsctest: {
  //     url : "https://data-seed-prebsc-1-s1.binance.org:8545/",
  //     accounts: [process.env.PRIV_KEY]
  //   }
  // },
  // etherscan: {
  //   apiKey: process.env.API_KEY
  // },
  // networks: {
  //   hardhat: {},
  //   eth_mumbai: {
  //     url : "https://eth-sepolia.g.alchemy.com/v2/Yu1GpgDLTCPaUgiUPU-YUjVY8D68yPOe",
  //     accounts: [
  //       `0x${"ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"}`
  //     ],
  //   }
  // },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
