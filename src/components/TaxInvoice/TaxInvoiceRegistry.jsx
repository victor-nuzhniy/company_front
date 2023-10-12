import React from 'react';
import axios from 'axios';
import { Link, Outlet } from "react-router-dom";
import { Button } from "react-bootstrap";
import HOST from './../../Constants.js';
import {getCurrentDateWithOffset} from './../common/Func';
import PaginationArrows from './../common/PaginationArrows';
import {handleSimpleChange} from './../common/Handlers';

const TaxInvoiceRegistry = () => {
    const [invoiceRegistry, setInvoiceRegistry] = React.useState([])
    const [pagin, setPagin] = React.useState({
        offset: 0,
        limit: 20,
    });
    const [dates, setDates] = React.useState({
        date_from: '2018-01-01',
        date_to: getCurrentDateWithOffset(),
    });
    const getTaxRegistry = async () => {
        await axios.get(
        `${HOST}/tax-registry/?offset=${pagin.offset}&limit=${pagin.limit}&date_from=${dates.date_from}&date_to=${dates.date_to}`,
        {
            headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
        },
        ).then((response) => {
            setInvoiceRegistry(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    React.useEffect(() => {getTaxRegistry()}, [pagin, dates]);
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
                            to="/invoice"
                            style={{ textDecoration: 'none', color: 'white' }}
                            state={{ invoiceId: ''}}
                        >Нова податкова накладна</Link>
                    </Button>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">№</th>
                        <th>Дата</th>
                        <th>Номер</th>
                        <th>Контрагент</th>
                        <th>Угода</th>
                        <th>Рахунок</th>
                        <th>Видаткова накладна</th>
                        <th>Прибуткова накладна</th>
                        <th>Прибуткова сума</th>
                        <th>Видаткова сума</th>
                        <th>Детально</th>
                    </tr>
                </thead>
                {invoiceRegistry.map((item, j) => {
                    return (
                        <tbody key={j}>
                            <tr>
                                <th scope="row">{pagin.offset + j + 1}</th>
                                <th scope="row">{item.created_at}</th>
                                <th>{item.tax_invoice_name}</th>
                                <th>{item.counterparty}</th>
                                <th>{item.agreement}</th>
                                <th>{item.invoice}</th>
                                <th>{item.sale_invoice}</th>
                                <th>{item.purchase_invoice}</th>
                                <th>{(item.purchase_summ / 100).toFixed(2)}</th>
                                <th>{(item.sale_summ / 100).toFixed(2)}</th>
                                <th>
                                    <Link to="/invoice" state={{ invoiceId: `${item.id}` }}>
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

export default TaxInvoiceRegistry;
