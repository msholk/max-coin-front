
import * as tokenUt from './token'

let ethInitialized
export const checkIfWalletIsConnected = async (opts) => {
    try {
        if (window.ethereum) {
            if (!ethInitialized) {
                ethInitialized = true
                window.ethereum.on('accountsChanged', (accounts) => {
                    opts.setAccountsConnected(accounts.length)
                    if (!accounts.length) {
                        opts.setIsWalletConnected(false);
                        return
                    }
                    const account = accounts[0];
                    opts.setYourWalletAddress(account);
                    opts.setIsWalletConnected(true);
                    tokenUt.getTokenInfo({ ...opts, isWalletConnected: true, account });
                    tokenUt.onAccountChanged({
                        account,
                        setIsTokenOwner: opts.setIsTokenOwner,
                        setBalance: opts.setBalance,
                        registerEvent: opts.registerEvent
                    })
                });
            }
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            if (accounts.length) {
                const account = accounts[0];
                opts.setIsWalletConnected(true);
                opts.setYourWalletAddress(account);
                opts.setAccountsConnected(accounts.length)
                console.log("Account Connected: ", account);

                tokenUt.getTokenInfo({ ...opts, isWalletConnected: true, account });
                tokenUt.onAccountChanged({
                    account,
                    setIsTokenOwner: opts.setIsTokenOwner,
                    setBalance: opts.setBalance,
                    registerEvent: opts.registerEvent
                })
            }


        } else {
            opts.setError("Install a MetaMask wallet to get our token.");
            console.log("No Metamask detected");
        }
    } catch (error) {
        console.log(error);
    }
};