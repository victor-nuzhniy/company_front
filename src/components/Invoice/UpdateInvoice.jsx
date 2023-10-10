import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {handleSimpleChange} from './../common/Handlers';
import {getCounterparties, getAgreements, getOrders, getInstance} from './../common/DataGetters';


const UpdateInvoice = (props) => {
    const [invoice, setInvoice] = React.useState({
        id: '',
        name: '',
        agreement_id: '',
        order_id: '',
        paid: false,
        created_at: '',
    });
    const [agreements, setAgreements] = React.useState([]);
    const [agreement, setAgreement] = React.useState()
    const [counterparties, setCounterparties] = React.useState([]);
    const [counterpartyId, setCounterpartyId] = React.useState();
    const [orders, setOrders] = React.useState([]);
    const handleClose = () => props.setShow(false);
    const sendInvoice = async () => {
        await axios.put(
            `${HOST}/invoice/${props.invoice.id}/`,
            invoice,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            props.setInvoice(response.data)
            props.setShow(false)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    };
    function handleCounterpartyChange(event) {
        const {value} = event.target;
        setCounterpartyId(value);
    };
    function handleChange(event) {
        const {name, value, type, checked} = event.target;
        setInvoice(prev =>({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    }
    function handleSubmit(event) {
        event.preventDefault();
        sendInvoice();
    };
    React.useEffect(() => {
        getInstance(`agreement/${props.invoice.agreement_id}`, setAgreement);
        }, []);
    React.useEffect(() => {
        if (Boolean(agreement)) setCounterpartyId(agreement.counterparty_id)
    },[agreement]);
    React.useEffect(() => {getCounterparties(setCounterparties)}, []);
    React.useEffect(() => {
        if (Boolean(counterpartyId)) {
            getAgreements(counterpartyId, setAgreements)
            getOrders(counterpartyId, setOrders);
        };
    }, [counterpartyId]);
    React.useEffect(() => {setInvoice({
        name: props.invoice.name,
        agreement_id: props.invoice.agreement_id,
        created_at: props.invoice.created_at,
        order_id: props.invoice.order_id,
        paid: props.invoice.paid,
    })}, [props.invoice.name])
    return (
        <Modal show={props.show} onHide={handleClose}>
             <Modal.Header closeButton>
              <Modal.Title>Оновити рахунок</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="UpdateInvoiceModal"
                >
                    <label htmlFor="idUpdateInvoiceName">Назва рахунку</label>
                    <input
                        type="text"
                        name="name"
                        maxLength="100"
                        required
                        id="idUpdateInvoiceName"
                        onChange={(event) => handleSimpleChange(event, setInvoice)}
                        value={invoice.name}
                    />
                    <label htmlFor="idUpdateCounterparty">Контрагент</label>
                    <select
                        name="counterpartyId"
                        value={counterpartyId}
                        id="idUpdateCounterparty"
                        onChange={handleCounterpartyChange}
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
                        name="agreement_id"
                        id="idUpdateAgreementId"
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
                    <label htmlFor="idUpdateOrderId">Угода</label>
                    <select
                        name="order_id"
                        id="idUpdateOrderId"
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
                    <label htmlFor="idInvoiceCreatedAt">Створено</label>
                    <input
                        type="text"
                        name="created_at"
                        maxLength="30"
                        required
                        id="idInvoiceCreatedAt"
                        placeholder="2023-10-01 10:00:00"
                        onChange={(event) => handleSimpleChange(event, setInvoice)}
                        value={invoice.created_at}
                    />
                    <label htmlFor="idUpdateInvoicePaid">Оплачено</label>
                    <input
                        type="checkbox"
                        name="paid"
                        id="idUpdateInvoicePaid"
                        onChange={handleChange}
                        checked={invoice.paid}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="UpdateInvoiceModal">
                    Зберегти зміни
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default UpdateInvoice;