import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {handleSimpleChange} from './../common/Handlers';
import {getCounterparties, getAgreements} from './../common/DataGetters';


const UpdateTaxInvoice = (props) => {
    const [taxInvoice, setTaxInvoice] = React.useState({
        id: '',
        name: '',
        sale_invoice_id: '',
        created_at: '',
    });
    const [agreements, setAgreements] = React.useState([]);
    const [agreementId, setAgreementId] = React.useState();
    const [counterparties, setCounterparties] = React.useState([]);
    const [counterpartyId, setCounterpartyId] = React.useState();
    const [saleInvoices, setSaleInvoices] = React.useState([]);
    const handleClose = () => props.setShow(false);
    const sendTaxInvoice = async () => {
        await axios.put(
            `${HOST}/invoice/${props.invoice.id}/`,
            taxInvoice,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            props.setInvoice(response.data)
            props.setShow(false)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
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
    React.useEffect(() => {getCounterparties(setCounterparties)}, []);
    React.useEffect(() => {
        if (Boolean(counterpartyId)) {
            getAgreements(counterpartyId, setAgreements)
        };
    }, [counterpartyId]);
    React.useEffect(() => {getSaleInvoices()}, [agreementId]);
    React.useEffect(() => {setTaxInvoice({
        name: props.invoice.name,
        sale_invoice_id: props.invoice.sale_invoice_id,
        created_at: props.invoice.created_at,
    })}, [props.invoice.name])
    return (
        <Modal show={props.show} onHide={handleClose}>
             <Modal.Header closeButton>
              <Modal.Title>Оновити податкову накладну</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="UpdateTaxInvoiceModal"
                >
                    <label htmlFor="idUpdateInvoiceName">Назва податкової накладної</label>
                    <input
                        type="text"
                        name="name"
                        maxLength="100"
                        required
                        id="idUpdateInvoiceName"
                        onChange={(event) => handleSimpleChange(event, setTaxInvoice)}
                        value={taxInvoice.name}
                    />
                    <label htmlFor="idUpdateCounterparty">Контрагент</label>
                    <select
                        name="counterpartyId"
                        value={counterpartyId}
                        id="idUpdateCounterparty"
                        onChange={(event) => handleValueChange(event, setCounterpartyId)}
                    >
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
                    <label htmlFor="idUpdateAgreementId">Угода</label>
                    <select
                        name="agreementId"
                        id="idUpdateAgreementId"
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
                    <label htmlFor="idUpdateSaleInvoiceId">Видаткова накладна</label>
                    <select
                        name="sale_invoice_id"
                        id="idUpdateSaleInvoiceId"
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
                    <label htmlFor="idInvoiceCreatedAt">Створено</label>
                    <input
                        type="text"
                        name="created_at"
                        maxLength="30"
                        required
                        id="idInvoiceCreatedAt"
                        onChange={(event) => handleSimpleChange(event, setTaxInvoice)}
                        value={taxInvoice.created_at}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="UpdateTaxInvoiceModal">
                    Зберегти зміни
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default UpdateTaxInvoice;