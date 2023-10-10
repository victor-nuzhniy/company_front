import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {handleSimpleChange} from './../common/Handlers';
import {getName, getCounterparties, getAgreements, getOrders} from './../common/DataGetters';

const CreateInvoice = (props) => {
    const [invoice, setInvoice] = React.useState({
        id: '',
        name: '',
        agreement_id: '',
        order_id: '',
    });
    const [agreements, setAgreements] = React.useState([]);
    const [counterparties, setCounterparties] = React.useState([]);
    const [counterpartyId, setCounterpartyId] = React.useState();
    const [orders, setOrders] = React.useState([]);
    const handleClose = () => props.setShow(false);
    const sendInvoice = async () => {
        await axios.post(
            `${HOST}/invoice/`,
            invoice,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            props.setInvoice(response.data);
            props.setInvoiceId(response.data.id);
            props.setShow(false);
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    function handleCounterpartyChange(event) {
        const {value} = event.target;
        setCounterpartyId(value);
    };
    function handleSubmit(event) {
        event.preventDefault();
        sendInvoice();
    };
    React.useEffect(() => {getName('Invoice', setInvoice, 'I')}, []);
    React.useEffect(() => {getCounterparties(setCounterparties)}, []);
    React.useEffect(() => {
    getAgreements(counterpartyId, setAgreements);
    getOrders(counterpartyId, setOrders);
    }, [counterpartyId]);
    return (
        <Modal show={props.show} onHide={handleClose}>
             <Modal.Header closeButton>
                <Modal.Title>Створити рахунок</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="CreateInvoiceModal"

                >
                    <label htmlFor="idInvoiceName">Назва рахунку</label>
                    <input
                        type="text"
                        name="name"
                        maxLength="100"
                        required
                        id="idInvoiceName"
                        placeholder="Назва рахунку"
                        onChange={(event) => handleSimpleChange(event, setInvoice)}
                        value={invoice.name}
                    />
                    <label htmlFor="idCounterparty">Контрагент</label>
                    <select
                        name="counterpartyId"
                        value={counterpartyId}
                        id="idCounterparty"
                        onChange={handleCounterpartyChange}
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
                        name="agreement_id"
                        id="idAgreementId"
                        onChange={(event) => handleSimpleChange(event, setInvoice)}
                        value={invoice.agreement_id}
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
                    <label htmlFor="idOrderId">Угода</label>
                    <select
                        name="order_id"
                        id="idOrderId"
                        onChange={(event) => handleSimpleChange(event, setInvoice)}
                        value={invoice.order_id}
                    >
                        <option>Вибрати замовлення</option>
                        {orders.map((order, i) => {
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
                <Button variant="primary" type="submit" form="CreateInvoiceModal">
                    Зберегти
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default CreateInvoice;
