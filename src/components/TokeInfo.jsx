import React from "react";
import { hasNotReceivedToken } from '../utils/token'
import { contractAddress } from '../utils/contractAddress'
export class TokenInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    getAddress() {
        if (this.state.isCopied) {
            return (
                <div>
                    <strong>Token Address is copied to clipboard...</strong>
                </div>
            )
        }
        return (
            <div>
                <strong className="mr-5">Token Address:</strong>
                <a href={"void (0)"} onClick={(e) => {
                    e.preventDefault()
                    navigator.clipboard.writeText(contractAddress)
                    this.setState({ isCopied: true })
                    setTimeout(() => {
                        this.setState({ isCopied: false })
                    }, 1500)
                }}>{contractAddress}</a>
            </div>
        )
    }
    render() {
        const {
            tokenName,
            tokenSymbol,
            tokenTotalSupply,
            isWalletConnected
        } = this.props;

        if (!isWalletConnected) {
            return (
                <div className="mw-50p alert alert-secondary" role="alert" data-mdb-color="secondary">
                    Use MetaMask to connect a wallet!
                </div>
            )
        }
        if (hasNotReceivedToken()) {
            return (
                <div className="mw-50p alert alert-secondary" role="alert" data-mdb-color="secondary">
                    Waiting for token info...
                </div>
            )
        }

        return (
            <div className="mt-1">
                <span className="mr-5">
                    <strong>Coin:</strong> {tokenName}{" "}
                </span>
                <span className="mr-5">
                    <strong>Ticker:</strong> {tokenSymbol}{" "}
                </span>
                <span className="mr-5">
                    <strong>Total Supply:</strong> {tokenTotalSupply}
                </span>
                {this.getAddress()}
            </div>
        );
    }
}
