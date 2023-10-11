import React from 'react';
import axios from 'axios';
import { Link, Outlet } from "react-router-dom";
import { Button } from "react-bootstrap";
import HOST from './../../Constants.js';
import {getCurrentDateWithOffset} from './../common/Func';
import PaginationArrows from './../common/PaginationArrows';
import {handleSimpleChange} from './../common/Handlers';

const SaleInvoiceRegistry = () => {
    const [invoiceRegistry, setInvoiceRegistry] = React.useState([])
    console.log(invoiceRegistry, 1111111111)
    const [pagin, setPagin] = React.useState({
        offset: 0,
        limit: 20,
    });
    const [dates, setDates] = React.useState({
        date_from: '2018-01-01',
        date_to: getCurrentDateWithOffset(),
    });
    const getInvoiceRegistry = async () => {
        await axios.get(
        `${HOST}/sale-invoice-registry/?offset=${pagin.offset}&limit=${pagin.limit}&date_from=${dates.date_from}&date_to=${dates.date_to}`,
        {
            headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
        },
        ).then((response) => {
            setInvoiceRegistry(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    React.useEffect(() => {getInvoiceRegistry()}, [pagin, dates]);
    return (
        <div>
            <div>
                <PaginationArrows pagin={pagin} setPagin={setPagin} array={invoiceRegistry} />
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
                    <Button className="ms-2">
                        <Link
                            to="/sale-invoice"
                            style={{ textDecoration: 'none', color: 'white' }}
                            state={{ saleInvoiceId: ''}}
                        >Нова видаткова накладна</Link>
                    </Button>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">№</th>
                        <th>Дата</th>
                        <th>Номер</th>
                        <th>Сума</th>
                        <th>Валюта</th>
                        <th>Контрагент</th>
                        <th>Угода</th>
                        <th>Рахунок</th>
                        <th>Проведений</th>
                        <th>Детально</th>
                    </tr>
                </thead>
                {invoiceRegistry.map((item, j) => {
                    return (
                        <tbody key={j}>
                            <tr>
                                <th scope="row">{pagin.offset + j + 1}</th>
                                <th scope="row">{item.created_at}</th>
                                <th>{item.name}</th>
                                <th>{(item.summ / 100).toFixed(2)}</th>
                                <th>{item.currency}</th>
                                <th>{item.counterparty}</th>
                                <th>{item.agreement}</th>
                                <th>{item.invoice}</th>
                                <th>{Boolean(item.done)? "Так" : "Ні"}</th>
                                <th>
                                    <Link to="/sale-invoice" state={{ invoiceId: `${item.id}` }}>
                                    +
                                    </Link>
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

export default SaleInvoiceRegistry;
