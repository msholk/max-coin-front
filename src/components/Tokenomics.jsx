import React from "react";
import {
    MDBInputGroup,
    MDBBtn
} from 'mdb-react-ui-kit';
import * as tokenUt from '../utils/token'
import _ from 'lodash'
export class Tokenomics extends React.Component {
    burnTokens(event) {
        event.preventDefault();
        const { inputValue, setTokenTotalSupply, setError, setBusy, registerEvent } = this.props
        try {

            tokenUt.burn({ inputValue, setTokenTotalSupply, setError, setBusy, registerEvent })

        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }

    mintTokens(event) {
        event.preventDefault();
        const { inputValue, setTokenTotalSupply, setError, setBusy, registerEvent } = this.props

        try {
            tokenUt.mint({ inputValue, setTokenTotalSupply, setError, setBusy, registerEvent })
        } catch (error) {
            console.log(error);
        }
    }
    renderEventsLog() {
        const { eventsLog } = this.props
        if (!eventsLog) return null

        return (
            <div>
                <table>
                    <tbody>
                        {_.map(eventsLog, (e, i) => {
                            return (
                                <tr key={i}>
                                    <td className="addressLog">{e[0]}</td>
                                    <td className="textLog px-1">{e[1]}</td>
                                    <td className="textLog px-1">{e[2]}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
        )
    }
    render() {
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
            <>
                <section>
                    <div className="bg-white border rounded-5 p-2 mw-330">
                        <MDBInputGroup className='mb-3 mw-300'>
                            <input
                                type="text"
                                className="form-control"
                                onChange={handleInputChange}
                                name="burnAmount"
                                placeholder={`0.0000 ${tokenSymbol}`}
                                value={inputValue.burnAmount}
                            />
                            <MDBBtn outline onClick={(e) => { this.burnTokens(e) }}>🔥 Burn Tokens</MDBBtn>
                        </MDBInputGroup>
                    </div>
                    <div className="bg-white border rounded-5 p-2 mw-330">
                        <MDBInputGroup className='mb-3 mw-300'>
                            <input
                                type="text"
                                className="form-control"
                                onChange={handleInputChange}
                                name="mintAmount"
                                placeholder={`0.0000 ${tokenSymbol}`}
                                value={inputValue.mintAmount}
                            />
                            <MDBBtn outline onClick={(e) => { this.mintTokens(e) }}>🖨 Mint Tokens</MDBBtn>
                        </MDBInputGroup>
                    </div>


                </section>
                {this.renderEventsLog()}
            </>
        );
    }
}
