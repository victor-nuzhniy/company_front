import React from 'react';
import axios from 'axios';
import { Link, Outlet } from "react-router-dom";
import { Button } from "react-bootstrap";
import HOST from './../../Constants.js';
import {getCurrentDateWithOffset} from './../common/Func';
import PaginationArrows from './../common/PaginationArrows';
import {handleSimpleChange} from './../common/Handlers';

const OrderRegistry = () => {
    const [orderRegistry, setOrderRegistry] = React.useState([])
    const [pagin, setPagin] = React.useState({
        offset: 0,
        limit: 20,
    });
    const [dates, setDates] = React.useState({
        date_from: '2018-01-01',
        date_to: getCurrentDateWithOffset(),
    });
    const getOrderRegistry = async () => {
        await axios.get(
        `${HOST}/order-registry/?offset=${pagin.offset}&limit=${pagin.limit}&date_from=${dates.date_from}&date_to=${dates.date_to}`,
        {
            headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
        },
        ).then((response) => {
            setOrderRegistry(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    React.useEffect(() => {getOrderRegistry()}, [pagin, dates]);
    return (
        <div>
            <div>
                <PaginationArrows pagin={pagin} setPagin={setPagin} array={orderRegistry} />
                <div>
                    <label htmlFor="idDateFromRegistry" className="pe-2">Починаючи з дати</label>
                    <input
                        type="date"
                        name="date_from"
                        id="idDateFromRegistry"
                        onChange={(event) => handleSimpleChange(event, setDates)}
                        value={dates.date_from}
                    />
                    <label htmlFor="idDateToRegistry" className="pe-2">Закінчиючи датою</label>
                    <input
                        type="date"
                        name="date_to"
                        id="idDateToRegistry"
                        onChange={(event) => handleSimpleChange(event, setDates)}
                        value={dates.date_to}
                    />
{/*                     <Button className="ms-2"> */}
{/*                         <Link */}
{/*                             to="/purchase-invoice" */}
{/*                             style={{ textDecoration: 'none', color: 'white' }} */}
{/*                             state={{ purchaseInvoiceId: ''}} */}
{/*                         >Нова прибуткова накладна</Link> */}
{/*                     </Button> */}
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">№</th>
                        <th scope="col">Дата</th>
                        <th scope="col">Номер</th>
                        <th scope="col">Сума</th>
                        <th scope="col">Валюта</th>
                        <th scope="col">Контрагент</th>
                        <th scope="col">Відповідальний</th>
                        <th>Детально</th>
                    </tr>
                </thead>
                {orderRegistry.map((item, j) => {
                    return (
                        <tbody key={j}>
                            <tr>
                                <th scope="row">{pagin.offset + j + 1}</th>
                                <th scope="row">{item.created_at}</th>
                                <th>{item.order_name}</th>
                                <th>{(item.summ / 100).toFixed(2)}</th>
                                <th>{item.currency}</th>
                                <th>{item.customer}</th>
                                <th>{item.username}</th>
                                <th>
{/*                                     <Link to="/purchase-invoice" state={{ purchaseInvoiceId: `${item.id}` }}> */}
{/*                                     + */}
{/*                                     </Link> */}
                                </th>
                            </tr>
                        </tbody>
                    )
                })}
            </table>
            <Outlet />
        </div>
    );
};

export default OrderRegistry;
