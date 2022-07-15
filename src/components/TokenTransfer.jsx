import React from "react";
import * as tokenUt from '../utils/token'
import {
    MDBInputGroup,
    MDBBtn
} from 'mdb-react-ui-kit';
import { hasNotReceivedToken } from '../utils/token'

export class TokenTransfer extends React.PureComponent {
    transferToken(event) {
        event.preventDefault();
        const {
            inputValue,
            setError,
            setBusy
        } = this.props
        tokenUt.transferToken({
            inputValue,
            setError,
            setBusy
        });
    }
    render() {
        if (hasNotReceivedToken()) {
            return null
        }
        const {
            handleInputChange,
            tokenSymbol,
            inputValue,
            accountsConnected
        } = this.props;

        if (!accountsConnected) {
            return null
        }
        return (
            <div className="bg-white border rounded-5 p-2 transferGroup">
                <input
                    type="text"
                    className="form-control walletAddress"
                    onChange={handleInputChange}
                    placeholder="0xAeB8Ff16DfCB042E3970bCa734cF706A4e34Ab73"
                    value={inputValue.walletAddress}
                    name="walletAddress"
                />
                <MDBInputGroup className='mb-3 '>

                    <input
                        type="text"
                        className="form-control transferAmount"
                        onChange={handleInputChange}
                        placeholder={`0.0000 ${tokenSymbol}`}
                        value={inputValue.transferAmount}
                        name="transferAmount"
                    />
                    <MDBBtn outline onClick={(e) => { this.transferToken(e) }}>📮 Transfer Tokens</MDBBtn>
                </MDBInputGroup>
            </div>

        );
    }
}
