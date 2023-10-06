import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import HOST from './../../Constants.js';
import {pad} from './../common/Func';
import CreatePurchaseInvoiceModal from './CreatePurchaseInvoiceModal';


const PurchaseInvoiceRegistry = () => {
    const [purchaseRegistry, setPurchaseRegistry] = React.useState([])
    const [pagin, setPagin] = React.useState({
        offset: 0,
        limit: 20,
    })
    const getPurchaseRegistry = async () => {
        await axios.get(
        `${HOST}/purchase-registry/?offset=${pagin.offset}&limit=${pagin.limit}`,
        {
            headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
        },
        ).then((response) => {
            setPurchaseRegistry(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    }
    function handleLeftClick(event) {
        if (pagin.offset > 0) {
            setPagin(prevPagin => ({
                ...prevPagin,
                offset: prevPagin.offset - prevPagin.limit > 0 ? prevPagin.offset - prevPagin.limit : 0,
            }))
        }
    }
    function handleRightClick(event){
        if (purchaseRegistry.length % pagin.limit === 0) {
            setPagin(prevPagin => ({
                ...prevPagin,
                offset: prevPagin.offset + prevPagin.limit
            }))
        }
    }
    React.useEffect(() => {
        getPurchaseRegistry()
    }, [pagin])
    return (
        <div>
            <div>
                <div className="d-flex flex-row align-items-center">
                    <div>
                        <button
                            onClick={handleLeftClick}
                            className={pagin.offset > 0 ? "text-dark": "text-info"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                            </svg>
                        </button>
                        <button
                            onClick={handleRightClick}
                            className={purchaseRegistry.length % pagin.limit === 0 ? "text-dark" : "text-info"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </button>
                    </div>
                    <h6>Надходження товарів і послуг</h6>
                </div>
                <div>
                    <button>Надходження товарів</button>
                    <button>Знайти</button>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Дата</th>
                        <th scope="col">Номер</th>
                        <th scope="col">Сума</th>
                        <th scope="col">Валюта</th>
                        <th scope="col">Контрагент</th>
                        <th scope="col">Договір</th>
                        <th>Детально</th>
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
                                <th>
                                    <Link to="/purchase-invoice" state={{ purchaseInvoiceId: `${item.id}` }}>
                                    ++
                                    </Link>
                                </th>
                            </tr>
                        </tbody>
                    )
                })}
            </table>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#CreatePurchaseInvoiceModal">
              Launch demo modal
            </button>
            <CreatePurchaseInvoiceModal />
        </div>
    )
};

export default PurchaseInvoiceRegistry;