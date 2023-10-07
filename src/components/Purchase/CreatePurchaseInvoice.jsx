import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {pad} from './../common/Func';

const CreatePurchaseInvoice = (props) => {
    const [invoice, setInvoice] = React.useState({
        name: '',
        agreement_id: '',
    });
    const getName = async () => {
        await axios.get(
            `${HOST}/account/PurchaseInvoice/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setInvoice(prev => ({
                ...prev, name: `P-${pad(response.data.number, 10)}`
            }))
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    }
    React.useEffect(() => {getName()}, [])
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
    }
    const getCounterparties = async () => {
        await axios.get(
            `${HOST}/counterparty/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setCounterparties(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    }
    React.useEffect(() => {getCounterparties()}, [])
    React.useEffect(() => {getAgreements()}, [counterpartyId])
    const sendPurchaseInvoice = async () => {
        await axios.post(
            `${HOST}/purchase-invoice/`,
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
                <Modal.Title>Створити накладну</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="CreatePurchaseInvoiceModal"

                >
                    <label for="idPurchaseInvoiceName">Назва накладної</label>
                    <input
                        type="text"
                        name="name"
                        maxLength="100"
                        required
                        id="idPurchaseInvoiceName"
                        placeholder="Purchase invoice name"
                        onChange={handleChange}
                        value={invoice.name}
                    />
                    <label for="idCounterparty">Контрагент</label>
                    <select
                        name="counterpartyId"
                        value={counterpartyId}
                        id="idCounterparty"
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
                    <label for="idAgreementId">Угода</label>
                    <select
                        name="agreement_id"
                        id="idAgreementId"
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="CreatePurchaseInvoiceModal">
                    Зберегти зміни
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default CreatePurchaseInvoice;
