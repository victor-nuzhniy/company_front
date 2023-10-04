import React from 'react';
import axios from 'axios';
import HOST from './../../Constants.js';


const PurchaseInvoicePage = () => {
    const [purchaseRegistry, setPurchaseRegistry] = React.useState([])
    const getPurchaseRegistry = async () => {
        const response = await axios.get(
        `${HOST}/purchase-registry/`,
        {
            headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
        },
        ).then((response) => {
            setPurchaseRegistry(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    }
    React.useEffect(() => {
        getPurchaseRegistry()
    }, [])
    return (
        <div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Дата</th>
                        <th scope="col">Номер</th>
                        <th scope="col">Сума</th>
                        <th scope="col">Валюта</th>
                        <th scope="col">Контрагент</th>
                        <th scope="col">Договір</th>
                    </tr>
                </thead>
                {purchaseRegistry.map((item, j) => {
                    return (
                        <tbody key={j}>
                            <tr>
                                <th scope="row">{item.created_at}</th>
                                <th>{item.purchase_name}</th>
                                <th>{(item.summ / 100).toFixed(2)}</th>
                                <th>{item.currency}</th>
                                <th>{item.counterparty}</th>
                                <th>{item.agreement}</th>
                            </tr>
                        </tbody>
                    )
                })}
            </table>
        </div>
    )
};

export default PurchaseInvoicePage;