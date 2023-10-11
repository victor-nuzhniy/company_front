import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {handleSimpleChange} from './../common/Handlers';
import {getName, getCounterparties, getAgreements, getInvoices} from './../common/DataGetters';

const CreateSaleInvoice = (props) => {
    const [saleInvoice, setSaleInvoice] = React.useState({
        id: '',
        name: '',
        invoice_id: '',
    });
    const [agreements, setAgreements] = React.useState([]);
    const [counterparties, setCounterparties] = React.useState([]);
    const [counterpartyId, setCounterpartyId] = React.useState();
    const [agreementId, setAgreementId] = React.useState();
    const [invoices, setInvoices] = React.useState([]);
    const handleClose = () => props.setShow(false);
    const sendSaleInvoice = async () => {
        await axios.post(
            `${HOST}/sale-invoice/`,
            saleInvoice,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            props.setInvoice(response.data);
            props.setInvoiceId(response.data.id);
            handleClose();
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    function handleValueChange(event, setValue) {
        const {value} = event.target;
        setValue(value);
    };
    function handleSubmit(event) {
        event.preventDefault();
        sendSaleInvoice();
    };
    React.useEffect(() => {getName('SaleInvoice', setSaleInvoice, 'S')}, []);
    React.useEffect(() => {getCounterparties(setCounterparties)}, []);
    React.useEffect(() => {
        getAgreements(counterpartyId, setAgreements);
        getInvoices(counterpartyId, setInvoices);
    }, [counterpartyId]);
    return (
        <Modal show={props.show} onHide={handleClose}>
             <Modal.Header closeButton>
                <Modal.Title>Створити видаткову накладну</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="CreateSaleInvoiceModal"

                >
                    <label htmlFor="idInvoiceName">Назва видаткової накладної</label>
                    <input
                        type="text"
                        name="name"
                        maxLength="100"
                        required
                        id="idInvoiceName"
                        placeholder="Назва рахунку"
                        onChange={(event) => handleSimpleChange(event, setSaleInvoice)}
                        value={saleInvoice.name}
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
                    <label htmlFor="idInvoiceId">Угода</label>
                    <select
                        name="invoice_id"
                        id="idInvoiceId"
                        onChange={(event) => handleSimpleChange(event, setSaleInvoice)}
                        value={saleInvoice.invoice_id}
                    >
                        <option>Вибрати замовлення</option>
                        {invoices.map((order, i) => {
                            return(
                                <option
                                    value={order.id}
                                    key={i}
                                >{order.name}</option>
                            )
                        })}
                    </select>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="CreateSaleInvoiceModal">
                    Зберегти
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default CreateSaleInvoice;
