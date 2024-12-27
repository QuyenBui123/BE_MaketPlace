import React, { useEffect, useState, useCallback } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
const dotenv = require("dotenv");
dotenv.config();
const api_key = process.env.NEXT_PUBLIC_API_PINATA;
const api_secret = process.env.NEXT_PUBLIC_API_SECRET_PINATA;
const pinata_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
//INTERNAL IMPORT
import {
  NFTMarketplaceAddress,
  NFTMarketplaceABI,
  TransferFundsAddress,
  TransferFundsABI,
  NFTAuctionABI,
  NFTAuctionAddress,
  NFTABI,
  NFTAddress,
} from "./Constants";

//Fetching smart contract
const fetchContract = (address, abi, signerOrProvider) =>
  new ethers.Contract(address, abi, signerOrProvider);

// ---Connecting width smart contract

const connectingWithSmartContract = async (contractType) => {
  try {
    const web3ModalInstance = new Web3Modal();
    const connection = await web3ModalInstance.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract;
    switch (contractType) {
      case "nft":
        contract = fetchContract(NFTAddress, NFTABI, signer);
        break;
      case "marketplace":
        contract = fetchContract(
          NFTMarketplaceAddress,
          NFTMarketplaceABI,
          signer
        );
        break;
      case "transferFunds":
        contract = fetchContract(
          TransferFundsAddress,
          TransferFundsABI,
          signer
        );
        break;
      case "auction":
        contract = fetchContract(NFTAuctionAddress, NFTAuctionABI, signer);
        break;
      default:
        throw new Error("Unknown contract type");
    }
    return contract;
  } catch (error) {
    console.log(
      "Something went wrong while connecting with smart contract:",
      error
    );
    throw error; // Rethrow the error to handle it upstream if needed
  }
};

const fetchTransferFundsContract = (signerOrProvider) =>
  new ethers.Contract(TransferFundsAddress, TransferFundsABI, signerOrProvider);
// transferfunds
const connectToTransferFunds = async () => {
  try {
    const web3ModalInstance = new Web3Modal();
    const connection = await web3ModalInstance.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchTransferFundsContract(signer); // Assuming fetchContract is defined elsewhere
    return contract;
  } catch (error) {
    console.log(
      "Something went wrong while connecting with smart contract:",
      error
    );
  }
};

export const NFTMarketplaceContext = React.createContext();
export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Discover, collect, and sell NFTS ";
  // --USESTAT
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [allOffers, setAllOffers] = useState([]);
  // TRANSFER FUNDs
  const [transactionCount, setTransactionCount] = useState("");
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const router = useRouter();

  // ==USESTATE

  const handleCreateNewUser = async (address) => {
    const userData = {
      name: "Unnamed",
      wallet_address: address,
      avatar: "",
      cover_photo: "",
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/create_user",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGetUser = async (addressWallet) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/get_user/${addressWallet}`
      );
      const data = response.data;
      console.log("data", data.user);
      setUser(data.user);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const checkIfWalletConnected = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      }
      localStorage.setItem("address", accounts[0]);
      if (accounts[0] !== null && accounts[0] !== undefined) {
        handleCreateNewUser(accounts[0]);
        // Toast
        handleGetUser(accounts[0]);
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const getBalance = await provider.getBalance(accounts[0]);
      const bal = ethers.utils.formatEther(getBalance);
      // console.log("api key", api_key ,api_serect, pinata_JWT);
      setAccountBalance(bal);
    } catch (error) {
      console.log("check if wallet connect error", error);
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);
  // connect wallet function
  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log("connectWallet error", error);
    }
  };

  // upload to ipfs function
  // const uploadFileToIPFS = async (file) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     const resFile = await axios({
  //       method: "post",
  //       url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
  //       data: formData,
  //       headers: {
  //         pinata_api_key: api_key,
  //         pinata_secret_key: api_secret,
  //         Authorization: `Bearer ${pinata_JWT}`,
  //         // Set appropriate Content-Type header for FormData
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     const imgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
  //     return imgHash;
  //   } catch (error) {
  //     console.error("Error while uploading to IPFS:", error);
  //     throw error;
  //   }
  // };
  const uploadFileToIPFS = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const reponse = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `0ce802ea91e25b14265c`, // Make sure this is your correct API key
            pinata_secret_api_key: `1a116fc10f8638b3277e24169b60d8b4dd9e805d6827a8794e4a8d41471df379`, // Corrected spelling here
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${reponse.data.IpfsHash}`;
        return ImgHash;
      } catch (error) {
        console.log("Unable to upload image to Pinata");
      }
    }
  };
  const uploadJSONToPinata = async (data) => {
    try {
      const resFile = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: JSON.stringify(data),
        headers: {
          pinata_api_key: api_key,
          pinata_secret_key: api_secret,
          Authorization: `Bearer ${pinata_JWT}`,
        },
      });

      const ipfsHash = resFile.data.IpfsHash;
      const imgHash = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      return imgHash;
    } catch (error) {
      console.error("Error while uploading to Pinata:", error);
      throw new Error("Failed to upload to Pinata");
    }
  };

  const unpinFromPinata = async (ipfsHash) => {
    try {
      const response = await axios.delete(
        `https://api.pinata.cloud/pinning/unpin/${ipfsHash}`,
        {
          headers: {
            pinata_api_key: api_key,
            pinata_secret_key: api_secret,
            Authorization: `Bearer ${pinata_JWT}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(`Successfully unpinned ${ipfsHash}`);
      } else {
        throw new Error(
          `Failed to unpin from Pinata. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error while unpinning from Pinata:", error);
      throw new Error("Failed to unpin from Pinata");
    }
  };

  // Function to get gas price from Ethereum network

  // const getGasPrice = async () => {
  //   try {
  //     const gasPrice = await ethereum.request({
  //       method: "eth_gasPrice",
  //     });
  //     return ethers.utils.hexlify(gasPrice); // Convert gas price to hex format
  //   } catch (error) {
  //     console.error("Error fetching gas price:", error);
  //     throw error;
  //   }
  // };
  const getGasPrice = async () => {
    try {
      const gasPrice = await ethereum.request({
        method: "eth_gasPrice",
      });

      // Ensure the gas price has an even length
      if (gasPrice.length % 2 === 1) {
        return `0x0${gasPrice.slice(2)}`; // Add a leading zero if necessary
      }

      return gasPrice; // Return as is if already valid
    } catch (error) {
      console.error("Error fetching gas price:", error);
      throw error;
    }
  };
  // createNFT function
  const createNFT = async (
    name,
    price,
    imageurl,
    description,
    category,
    timeActions,
    router
  ) => {
    if (!category || !name || !description || !price || !imageurl) {
      console.log("Data Is Missing");
      setError("Data Is Missing");
      setOpenError(true);
      return;
    }

    const data = { name, description, imageurl, category, timeActions };
    console.log("Data to upload:", data, timeActions);

    try {
      const response = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `0ce802ea91e25b14265c`, // Make sure this is your correct API key
          pinata_secret_api_key: `1a116fc10f8638b3277e24169b60d8b4dd9e805d6827a8794e4a8d41471df379`, // Corrected spelling here
          "Content-Type": "application/json",
        },
      });
      const imgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log(imgHash);
      await createSale(imgHash, price, timeActions);
      router.push("/NFTPage");
    } catch (error) {
      setError("Error while creating NFT");
      setOpenError(true);
    }
  };

  // createSale function
  // const createSale = async (
  //   url,
  //   formInputPrice,
  //   timeActions,
  //   isReselling,
  //   id
  // ) => {
  //   try {
  //     const price = ethers.utils.parseUnits(formInputPrice, "ether");
  //     const contract = await connectingWithSmartContract("marketplace");
  //     const listingPrice = await contract.getListingPrice();
  //     const maxFeePerGas = await getGasPrice(); // tránh lỗi ga
  //     let transaction;
  //     if (isReselling) {
  //       transaction = await contract.resellToken(id, price, timeActions, {
  //         value: listingPrice.toString(),
  //         gasPrice: maxFeePerGas, // tránh lỗi gas
  //       });
  //     } else {
  //       transaction = await contract.createToken(url, price, timeActions, {
  //         value: listingPrice.toString(),
  //         gasPrice: maxFeePerGas, // tránh lỗi gas
  //       });
  //     }
  //     await transaction.wait();
  //   } catch (error) {
  //     console.error("Error while creating sale", error);
  //     if (error.data && error.data.message) {
  //       setError("Error while creating sale: " + error.data.message);
  //     } else {
  //       setError("Error while creating sale: " + error.message);
  //     }
  //     setOpenError(true);
  //   }
  // };
  const createSale = async (
    url,
    formInputPrice,
    timeActions,
    isReselling,
    id
  ) => {
    try {
      const price = ethers.utils.parseUnits(formInputPrice, "ether");
      const contract = await connectingWithSmartContract("marketplace");
      const listingPrice = await contract.getListingPrice();
      const maxFeePerGas = await getGasPrice(); // Valid gas price

      let transaction;
      if (isReselling) {
        transaction = await contract.resellToken(id, price, timeActions, {
          value: listingPrice.toString(),
          gasPrice: maxFeePerGas,
        });
      } else {
        transaction = await contract.createToken(url, price, timeActions, {
          value: listingPrice.toString(),
          gasPrice: maxFeePerGas,
        });
      }
      await transaction.wait();
    } catch (error) {
      console.error("Error while creating sale", error);
      const errorMessage =
        error.data && error.data.message ? error.data.message : error.message;
      setError("Error while creating sale: " + errorMessage);
      setOpenError(true);
    }
  };

  const transferNFT = async (nft, address) => {
    try {
      const contract = await connectingWithSmartContract("marketplace");
      const maxFeePerGas = await getGasPrice();
      const transaction = await contract.transferNFT(nft.tokenId, address, {
        gasPrice: maxFeePerGas,
      });
      await transaction.wait();
      router.push("/author");
    } catch (error) {
      console.log("error while your transfer", error);
    }
  };

  const fetchNFTS = async () => {
    try {
      // const contract = await connectingWithSmartContract("marketplace");
      // const data = await contract.fetchMarketItem(); // Lấy danh sách NFT

      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc-amoy.polygon.technology"
      );
      const marketplace = new ethers.Contract(
        NFTMarketplaceAddress,
        NFTMarketplaceABI,
        provider
      );

      const data = await marketplace.fetchMarketItem();
      console.log("data....", data);
      const items = await Promise.all(
        data.map(
          async ({
            tokenId,
            seller,
            owner,
            timestamp,
            price: unfomattedPrice,
          }) => {
            try {
              const tokenURI = await marketplace.tokenURI(tokenId); // Lấy tokenURI cho từng tokenId
              const response = await fetch(tokenURI); // Gửi yêu cầu đến tokenURI

              if (!response.ok) {
                throw new Error(
                  `Failed to fetch tokenURI data for tokenId: ${tokenId}`
                );
              }

              // Lấy dữ liệu thô từ tokenURI
              const rawData = await response.text(); // Sử dụng text() thay vì json()
              console.log(`Raw data for tokenId ${tokenId}:`, rawData);

              // Nếu muốn tiếp tục parse JSON (có thể có lỗi trong dữ liệu gốc):
              let parsedData;
              try {
                parsedData = JSON.parse(rawData);
              } catch (parseError) {
                console.error(
                  `Error parsing JSON for tokenId ${tokenId}:`,
                  parseError
                );
                parsedData = {}; // Xử lý lỗi, cung cấp dữ liệu mặc định
              }

              // Trích xuất thông tin từ parsedData
              const name = parsedData.name || "Name not available";
              const description =
                parsedData.description || "Description not available";
              const imageurl = parsedData.imageurl || "Image URL not available";
              const category = parsedData.category || "Category not available";
              const formattedPrice = ethers.utils.formatUnits(
                unfomattedPrice.toString(),
                "ether"
              );

              return {
                price: formattedPrice,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                name,
                description,
                category,
                imageurl,
                tokenURI,
                timestamp: new Date(timestamp.toNumber() * 1000).toISOString(),
                rawData, // Lưu dữ liệu thô (nếu bạn muốn sử dụng sau)
              };
            } catch (error) {
              console.error(
                `Error fetching data for tokenId ${tokenId}:`,
                error
              );
              return null; // Xử lý lỗi
            }
          }
        )
      );
      const validItems = items.filter((item) => item !== null);
      return validItems;
    } catch (error) {
      console.error("Error fetching NFT data:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchNFTS();
  }, []);
  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      // const contract = await connectingWithSmartContract("marketplace");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const marketplace = new ethers.Contract(
        NFTMarketplaceAddress,
        NFTMarketplaceABI,
        signer
      );

      let data;

      if (type === "fetchItemsListed") {
        data = await marketplace.fetchItemsListed();
      } else {
        data = await marketplace.fetchMyNFTs();
      }

      const items = await Promise.all(
        data.map(async ({ tokenId, seller, owner, price: unfomattedPrice }) => {
          const tokenURI = await marketplace.tokenURI(tokenId);
          try {
            const response = await fetch(tokenURI);

            if (!response.ok) {
              throw new Error(
                `Failed to fetch tokenURI data for tokenId: ${tokenId}`
              );
            }

            // Lấy dữ liệu thô từ tokenURI
            const rawData = await response.text(); // Sử dụng .text() thay vì .json()
            console.log(`Raw data for tokenId ${tokenId}:`, rawData);

            // Nếu cần, bạn có thể tiếp tục parse JSON từ rawData
            let parsedData = {};
            try {
              parsedData = JSON.parse(rawData);
            } catch (parseError) {
              console.error(
                `Error parsing JSON for tokenId ${tokenId}:`,
                parseError
              );
            }

            // Trích xuất thông tin từ parsedData
            const category = parsedData.category || "Category not available";
            const name = parsedData.name || "Name not available";
            const description =
              parsedData.description || "Description not available";
            const imageurl = parsedData.imageurl || "Image URL not available";
            const price = ethers.utils.formatUnits(
              unfomattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              imageurl,
              category,
              name,
              description,
              tokenURI,
              rawData, // Bao gồm dữ liệu thô để sử dụng nếu cần
            };
          } catch (error) {
            console.error("Error fetching tokenURI data:", error);
            return null; // Quay lại null nếu có lỗi
          }
        })
      );

      // Lọc các mục hợp lệ (loại bỏ null nếu có lỗi)
      const validItems = items.filter((item) => item !== null);
      return validItems;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchMyNFTs"); // Hoặc "fetchItemsListed" tùy mục đích
  }, []);

  // BUY NFTs FUNCTION
  const buyNFT = async (nft) => {
    try {
      const contract = await connectingWithSmartContract("marketplace");
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const maxFeePerGas = await getGasPrice(); // tránh lỗi ga
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
        gasPrice: maxFeePerGas,
      });
      await transaction.wait();
      router.push("/author");
    } catch (error) {
      setError("Error while buying NFT");
      throw error;
    }
  };
  // Make offer function
  const makeOffer = async (nft, price, desiredTimestamp) => {
    try {
      const contract = await connectingWithSmartContract("auction");
      const formattedPrice = ethers.utils.parseUnits(price.toString(), "ether");
      // Chuyển desiredTimestamp thành Unix timestamp
      const unixTimestamp = Math.floor(
        new Date(desiredTimestamp).getTime() / 1000
      );
      // Gọi hàm makeOffer từ smart contract và truyền value vào transaction
      console.log("unixTimestamp", unixTimestamp);
      const maxFeePerGas = await getGasPrice(); // tránh lỗi gas
      const transaction = await contract.makeOffer(
        nft.tokenId,
        formattedPrice,
        unixTimestamp,
        {
          value: formattedPrice,
          gasPrice: maxFeePerGas,
        }
      );
      await transaction.wait();
      console.log("Offer made successfully");
    } catch (error) {
      setError("Error making offer");
      console.error("Error making offer:", error);
      throw error;
    }
  };

  // unMake offer function
  const unMakeOffer = async (nft) => {
    try {
      const contract = await connectingWithSmartContract("auction");
      const maxFeePerGas = await getGasPrice(); // tránh lỗi gas
      const transaction = await contract.unmakeOffer(nft.tokenId, {
        gasPrice: maxFeePerGas,
      });
      await transaction.wait();
      // Xử lý sau khi hủy giá thành công (nếu cần)
    } catch (error) {
      console.error("Error canceling offer:", error);
      throw error; // Ném lại lỗi để bắt ở nơi gọi hàm unMakeOffer
    }
  };
  const acceptOffer = async (tokenId) => {
    try {
      const contract = await connectingWithSmartContract("marketplace");
      const maxFeePerGas = await getGasPrice();
      const transaction = await contract.acceptOffer(tokenId, {
        gasPrice: maxFeePerGas,
      });
      await transaction.wait();
      router.push("/author");
    } catch (error) {
      console.error("Error canceling offer:", error);
      throw error;
    }
  };
  // Fetch all offers
  const fetchOffers = useCallback(async (tokenId) => {
    try {
      const contract = await connectingWithSmartContract("auction");
      const offers = await contract.getOffers(tokenId);
      const formattedOffers = offers.map((offer) => ({
        bidder: offer.bidder,
        price: ethers.utils.formatUnits(offer.price.toString(), "ether"),
        active: offer.active,
        timestamp: new Date(offer.timestamp * 1000).toISOString(),
      }));
      setAllOffers(formattedOffers);
      console.log("list offer", formattedOffers);
      return formattedOffers;
    } catch (error) {
      console.error("Error fetching offers:", error);
      return [];
    }
  }, []);
  // cancelMarketItem
  const cancelMarketItem = async (nft) => {
    try {
      const contract = await connectingWithSmartContract("marketplace");
      const maxFeePerGas = await getGasPrice(); // tránh lỗi gas
      const transaction = await contract.cancelMarketItem(nft.tokenId, {
        gasPrice: maxFeePerGas,
      });
      await transaction.wait();
      router.push("/author");
    } catch (error) {
      setError("Error while unlisting token");
      console.log("Error while unlisting token", error);
      throw error;
    }
  };
  // TRANSFER FUNDs
  const transferEther = async (address, ether, message) => {
    try {
      if (currentAccount) {
        const contract = await connectToTransferFunds();
        const unfomattedPrice = ethers.utils.parseEther(ether);
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: address,
              gas: "",
              value: unfomattedPrice._hex,
            },
          ],
        });
        const transaction = await contract.addDataToBlockChain(
          address,
          unfomattedPrice,
          message
        );
        setLoading(true);
        transaction.wait();
        setLoading(false);
        // number of transaction happened
        const transactionCount = await contract.getTransactionCount();
        setTransactionCount(transactionCount.toNumber());
        window.location.reload();
      } else {
        console.log("On etherum");
      }
    } catch (error) {
      console.log("have a eroor transfer", error);
    }
  };

  // fetch all transaction
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const contract = await connectToTransferFunds();
        const availableTransaction = await contract.getAllTransaction();
        const readTransaction = availableTransaction.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamps.toNumber() * 1000
          ).toLocaleDateString(),
          message: transaction.message,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        }));
        console.log("read Transaction", readTransaction);
        setTransaction(readTransaction);
      }
    } catch (error) {
      console.log("getAlltransaction", error);
    }
  };

  return (
    <NFTMarketplaceContext.Provider
      value={{
        titleData,
        // checkContract
        checkIfWalletConnected,
        connectWallet,
        uploadFileToIPFS,
        uploadJSONToPinata,
        unpinFromPinata,
        createNFT,
        transferNFT,
        fetchNFTS,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        createSale,
        currentAccount,
        setError,
        error,
        openError,
        setOpenError,
        transferEther,
        accountBalance,
        transactionCount,
        transaction,
        loading,
        getAllTransactions,
        cancelMarketItem,
        makeOffer,
        unMakeOffer,
        fetchOffers,
        allOffers,
        acceptOffer,
        user,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};

export default NFTMarketplaceContext;
