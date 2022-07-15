import React from "react";
import { getAddresWithDic } from "../utils/knownAddresses";
import { hasNotReceivedToken } from '../utils/token'
export class OwnersInfo extends React.PureComponent {
    renderYourWalletAddress() {
        const {
            yourWalletAddress,
            accountsConnected,
            balance,
            tokenSymbol
        } = this.props;

        if (!accountsConnected) {
            return null
        }
        return (
            <>
                <div className="mt-1">
                    <span className="mr-5">
                        <strong>👛 Wallet owner:</strong> {getAddresWithDic(yourWalletAddress)}{" "}
                    </span>
                </div>
                <div className="mt-1">
                    <span className="mr-5">
                        <strong>Balance:</strong> {balance} {tokenSymbol}
                    </span>
                </div>
            </>
        )
    }
    render() {
        if (hasNotReceivedToken()) {
            return null
        }
        const {
            tokenOwnerAddress,
            isWalletConnected
        } = this.props;
        if (!isWalletConnected) {
            return null
        }

        return (
            <>


                <div className="mt-1">
                    <span className="mr-5">
                        <strong>🏦 Token owner:</strong> {getAddresWithDic(tokenOwnerAddress)}
                    </span>

                </div>
                {this.renderYourWalletAddress()}
            </>
        );
    }
}
