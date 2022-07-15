import { ethers, utils } from "ethers";
import { contractAddress } from './contractAddress'
import abi from "../contracts/MaxCoin.json";
import _ from 'lodash'
const contractABI = abi.abi;


export const onAccountChanged = async ({ account, setIsTokenOwner, setBalance, registerEvent }) => {
    const isOwner = account.toLowerCase() === tokenInfo.tokenOwner;
    setIsTokenOwner(isOwner);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    );

    tokenContract.on("additionalTokensMinted", (owner, amount, message) => {
        amount = utils.formatEther(amount);
        console.log("additionalTokensMinted: ", owner, amount, message)
        registerEvent(["" + owner, amount, message])
    })
    tokenContract.on("tokensBurned", (owner, amount, message) => {
        amount = utils.formatEther(amount);
        console.log("tokensBurned: ", owner, amount, message)
        registerEvent(["" + owner, amount, message])
    })
    let balance = await tokenContract.balanceOf(account);
    balance = utils.formatEther(balance);
    setBalance(balance)
}

let tokenInfo = null
export const hasNotReceivedToken = () => {
    if (_.get(tokenInfo, 'tokenSymbol')) {
        return false
    }
    return true
}
export const getTokenInfo = async ({
    setTokenName,
    setTokenSymbol,
    setTokenTotalSupply,
    setTokenOwnerAddress,
    setIsTokenOwner,
    isWalletConnected,
    account,
    setBalance,
    registerEvent
}) => {
    try {
        if (!isWalletConnected) {
            return
        }
        if (tokenInfo) {
            return
        }
        tokenInfo = {}
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            console.log(`Requesting token info: ${contractAddress}`, contractABI, signer)
            const tokenContract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            );


            let tokenName = await tokenContract.name();
            let tokenSymbol = await tokenContract.symbol();
            let tokenOwner = await tokenContract.owner();
            let tokenSupply = await tokenContract.totalSupply();
            let balance = await tokenContract.balanceOf(account);

            tokenSupply = utils.formatEther(tokenSupply);
            balance = utils.formatEther(balance);
            console.log(balance)
            tokenOwner = tokenOwner.toLowerCase()
            tokenInfo = { tokenName, tokenSymbol, tokenOwner, tokenSupply }

            setTokenName(`${tokenName} 👍`);
            setTokenSymbol(tokenSymbol);
            setTokenTotalSupply(tokenSupply);
            setTokenOwnerAddress(tokenOwner);
            setBalance(balance)



            if (isWalletConnected) {
                const [account] = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                onAccountChanged({ account, setIsTokenOwner, setBalance, registerEvent })
            }


            console.log("Token Name: ", tokenName);
            console.log("Token Symbol: ", tokenSymbol);
            console.log("Token Supply: ", tokenSupply);
            console.log("Token Owner: ", tokenOwner);
        }
    } catch (error) {
        console.log(error);
    }
};

export const transferToken = async ({

    inputValue,
    setError,
    setBusy
}) => {

    try {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const tokenContract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            );
            setBusy("Authorizing transfer...")
            const txn = await tokenContract.transfer(
                inputValue.walletAddress,
                utils.parseEther(inputValue.transferAmount)
            );
            console.log("Transfering tokens...");
            setBusy("Transfering tokens...")
            await txn.wait();
            setBusy("Tokens Transfered...")
            console.log("Tokens Transfered", txn.hash);
            setTimeout(() => {
                setBusy("");
            }, 3000)
        } else {
            console.log("Ethereum object not found, install Metamask.");
            setError("Install a MetaMask wallet to get our token.");
        }
    } catch (error) {
        console.log(error);
        setBusy("")
        setError(error.message);
        setTimeout(() => {
            setError("");
        }, 3000)
    }
};

export const burn = async ({
    inputValue, setTokenTotalSupply, setError, setBusy
}) => {

    try {
        if (window.ethereum) {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const tokenContract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            );

            const txn = await tokenContract.burn(
                utils.parseEther(inputValue.burnAmount)
            );
            console.log("Burning tokens...");
            setBusy("Burning tokens...");
            await txn.wait();
            console.log("Tokens burned...", txn.hash);
            setBusy("Tokens burned...");
            setTimeout(() => {
                setBusy("");
            }, 3000)

            let tokenSupply = await tokenContract.totalSupply();
            tokenSupply = utils.formatEther(tokenSupply);
            setTokenTotalSupply(tokenSupply);
        } else {
            console.log("Ethereum object not found, install Metamask.");
            setError("Install a MetaMask wallet to get our token.");
        }
    } catch (error) {
        console.log(error);
        setError(error.message);
        setBusy("");
        setTimeout(() => {
            setError("");
        }, 3000)
    }
};
export const mint = async ({
    inputValue, setTokenTotalSupply, setError, setBusy
}) => {

    try {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const tokenContract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            );
            let tokenOwner = await tokenContract.owner();
            const txn = await tokenContract.mint(
                tokenOwner,
                utils.parseEther(inputValue.mintAmount)
            );
            console.log("Minting tokens...");
            setBusy("Minting tokens...");
            await txn.wait();
            console.log("Tokens minted...", txn.hash);
            setBusy("Tokens minted...");
            setTimeout(() => {
                setBusy("");
            }, 3000)

            let tokenSupply = await tokenContract.totalSupply();
            tokenSupply = utils.formatEther(tokenSupply);
            setTokenTotalSupply(tokenSupply);
        } else {
            console.log("Ethereum object not found, install Metamask.");
            setError("Install a MetaMask wallet to get our token.");
        }
    } catch (error) {
        console.log(error);
        setError(error.message);
        setBusy("");
        setTimeout(() => {
            setError("");
        }, 3000)
    }
};