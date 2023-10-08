import React from 'react';
import axios from 'axios';
import { Link, Outlet } from "react-router-dom";
import { Button } from "react-bootstrap";
import HOST from './../../Constants.js';
import {ArrowLeft, ArrowRight} from './../common/Svg';


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
                            <ArrowLeft />
                        </button>
                        <button
                            onClick={handleRightClick}
                            className={purchaseRegistry.length % pagin.limit === 0 ? "text-dark" : "text-info"}
                        >
                            <ArrowRight />
                        </button>
                    </div>
                    <h6>Надходження товарів і послуг</h6>
                </div>
                <div>
                    <button>Надходження товарів</button>
                    <button>Знайти</button>
                </div>
                <Button>
                    <Link
                        to="/purchase-invoice"
                        style={{ textDecoration: 'none', color: 'white' }}
                        state={{ purchaseInvoiceId: ''}}
                    >Нова прибуткова накладна</Link>
                </Button>
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
            <Outlet />
        </div>
    )
};

export default PurchaseInvoiceRegistry;