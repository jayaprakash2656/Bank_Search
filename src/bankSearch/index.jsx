import React, { Component } from 'react';
import BankSearch from './bankSearch'


//Import style
import '../asset/style/card.css'

class BankIndex extends Component {
    render() {
        return (
            <div>
                <br />
                <br />
                <BankSearch />
            </div>
        );
    }
}

export default BankIndex;