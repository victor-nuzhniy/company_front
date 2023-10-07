import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';

const UpdatePurchaseInvoice = (props) => {
    const [invoice, setInvoice] = React.useState({
        name: '',
        agreement_id: '',
        created_at: '',
    });
    const [agreements, setAgreements] = React.useState([])
    const [counterparties, setCounterparties] = React.useState([])
    const [counterpartyId, setCounterpartyId] = React.useState()
    const handleClose = () => props.setShow(false);
    const getAgreements = async () => {
        let url = counterpartyId ? `agreements/${counterpartyId}` : 'agreement'
        await axios.get(
            `${HOST}/${url}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setAgreements(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    };
    const getCounterparties = async () => {
        await axios.get(
            `${HOST}/counterparty/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setCounterparties(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    };
    React.useEffect(() => {getCounterparties()}, []);
    React.useEffect(() => {getAgreements()}, [counterpartyId]);
    React.useEffect(() => setInvoice({
        name: props.invoice.name,
        agreement_id: props.invoice.agreement_id,
        created_at: props.invoice.created_at,
    }), [props.invoice.name])
    const sendPurchaseInvoice = async () => {
        await axios.put(
            `${HOST}/purchase-invoice/${props.invoice.id}/`,
            invoice,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            props.setPurchaseInvoice(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    };
    function handleChange(event) {
        const {name, value} = event.target
        setInvoice(prev => ({
            ...prev,
            [name]: value
        }))
    };
    function handleCounterpartyChange(event) {
        const {value} = event.target
        setCounterpartyId(value)
    };
    function handleSubmit(event) {
        event.preventDefault()
        sendPurchaseInvoice()
        props.setShow(false)
    };
    return (
        <Modal show={props.show} onHide={handleClose}>
             <Modal.Header closeButton>
              <Modal.Title>Оновити накладну</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="UpdatePurchaseInvoiceModal"
                >
                    <label for="idUpdatePurchaseInvoiceName">Назва накладної</label>
                    <input
                        type="text"
                        name="name"
                        maxLength="100"
                        required
                        id="idUpdatePurchaseInvoiceName"
                        placeholder="Purchase invoice name"
                        onChange={handleChange}
                        value={invoice.name}
                    />
                    <label for="idUpdateCounterparty">Контрагент</label>
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
                    <label for="idUpdateAgreementId">Угода</label>
                    <select
                        name="agreement_id"
                        id="idUpdateAgreementId"
                        onChange={handleChange}
                        value={invoice.agreement_id}
                    >
                        <option>Select agreement</option>
                        {agreements.map((agreement, i) => {
                            return(
                                <option
                                    value={agreement.id}
                                    key={i}
                                >{agreement.name}</option>
                            )
                        })}
                    </select>
                    <label for="idPurchaseInvoiceCreatedAt">Створено</label>
                    <input
                        type="text"
                        name="created_at"
                        maxLength="30"
                        required
                        id="idPurchaseInvoiceCreatedAt"
                        placeholder="2023-10-01 10:00:00"
                        onChange={handleChange}
                        value={invoice.created_at}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="UpdatePurchaseInvoiceModal">
                    Зберегти зміни
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default UpdatePurchaseInvoice;
