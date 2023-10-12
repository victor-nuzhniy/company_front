import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {handleSimpleChange} from './../common/Handlers';
import {getName, getCounterparties, getAgreements, getOrders} from './../common/DataGetters';

const CreateTaxInvoice = (props) => {
    const [taxInvoice, setTaxInvoice] = React.useState({
        name: '',
        sale_invoice_id: '',
    });
    const [agreements, setAgreements] = React.useState([]);
    const [counterparties, setCounterparties] = React.useState([]);
    const [counterpartyId, setCounterpartyId] = React.useState();
    const [agreementId, setAgreementId] = React.useState();
    const [saleInvoices, setSaleInvoices] = React.useState([]);
    const handleClose = () => props.setShow(false);
    const sendTaxInvoice = async () => {
        await axios.post(
            `${HOST}/tax-invoice/`,
            taxInvoice,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            props.setInvoice(response.data);
            props.setInvoiceId(response.data.id);
            props.setShow(false);
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    const getSaleInvoices = async () => {
        let url = Boolean(agreementId) ? `agreement-sale-invoices/${agreementId}`: 'sale-invoice'
        await axios.get(
            `${HOST}/${url}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setSaleInvoices(response.data);
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    function handleValueChange(event, setValue) {
        const {value} = event.target
        setValue(value)
    };
    function handleSubmit(event) {
        event.preventDefault();
        sendTaxInvoice();
    };
    React.useEffect(() => {getName('TaxInvoice', setTaxInvoice, 'T')}, []);
    React.useEffect(() => {getCounterparties(setCounterparties)}, []);
    React.useEffect(() => {
        getAgreements(counterpartyId, setAgreements);
    }, [counterpartyId]);
    React.useEffect(() => {getSaleInvoices()}, [agreementId]);
    return (
        <Modal show={props.show} onHide={handleClose}>
             <Modal.Header closeButton>
                <Modal.Title>Створити податкову накладну</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="CreateTaxInvoiceModal"
                >
                    <label htmlFor="idInvoiceName">Назва рахунку</label>
                    <input
                        type="text"
                        name="name"
                        maxLength="100"
                        required
                        id="idInvoiceName"
                        placeholder="Назва податкової накладної"
                        onChange={(event) => handleSimpleChange(event, setTaxInvoice)}
                        value={taxInvoice.name}
                    />
                    <label htmlFor="idCounterparty">Контрагент</label>
                    <select
                        name="counterpartyId"
                        value={counterpartyId}
                        id="idCounterparty"
                        onChange={(event) => handleValueChange(event, setCounterpartyId)}
                    >
                        <option>Вибрати контрагента</option>
                        {counterparties.map((counterparty, j) => {
                            return(
                                <option
                                    value={counterparty.id}
                                    key={j}
                                >
                                    {`${counterparty.name} ${counterparty.city} ${counterparty.country}`}
                                </option>
                            )
                        })}
                    </select>
                    <label htmlFor="idAgreementId">Угода</label>
                    <select
                        name="agreementId"
                        id="idAgreementId"
                        onChange={(event) => handleValueChange(event, setAgreementId)}
                        value={agreementId}
                    >
                        <option>Вибрати угоду</option>
                        {agreements.map((agreement, i) => {
                            return(
                                <option
                                    value={agreement.id}
                                    key={i}
                                >{agreement.name}</option>
                            )
                        })}
                    </select>
                    <label htmlFor="idSaleInvoiceId">Видаткова накладна</label>
                    <select
                        name="sale_invoice_id"
                        id="idSaleInvoiceId"
                        onChange={(event) => handleSimpleChange(event, setTaxInvoice)}
                        value={taxInvoice.sale_invoice_id}
                    >
                        <option>Вибрати видаткову накладну</option>
                        {saleInvoices.map((invoice, i) => {
                            return(
                                <option
                                    value={invoice.id}
                                    key={i}
                                >{invoice.name}</option>
                            )
                        })}
                    </select>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="CreateTaxInvoiceModal">
                    Зберегти
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default CreateTaxInvoice;
