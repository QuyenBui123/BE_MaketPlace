//0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
// 0x5FbDB2315678afecb367f032d93F642f64180aa3
//0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
import nftMarketplace from './NFTMarketplace.json';
import transferFunds from './TransferFunds.json';
import nftAuction from './NFTAuction.json';
import nft from './NFT.json';

export const NFTAddress = "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F"
export const NFTABI = nft.abi
export const NFTMarketplaceAddress = "0x40e4E2E7f4851b3835e23e70B7a5f7c91E3F7E1e"
export const NFTMarketplaceABI = nftMarketplace.abi

export const NFTAuctionAddress = "0x4CdAD35Ccb370786D49bfaB062B01d8d66794d1d"
export const NFTAuctionABI = nftAuction.abi

export const TransferFundsAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
export const TransferFundsABI = transferFunds.abi