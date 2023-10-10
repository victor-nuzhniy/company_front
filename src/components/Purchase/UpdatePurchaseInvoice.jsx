import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {handleSimpleChange} from './../common/Handlers';
import {getCounterparties, getAgreements} from './../common/DataGetters';


const UpdatePurchaseInvoice = (props) => {
    const [invoice, setInvoice] = React.useState({
        name: '',
        agreement_id: '',
        created_at: '',
    });
    const [agreements, setAgreements] = React.useState([]);
    const [counterparties, setCounterparties] = React.useState([]);
    const [counterpartyId, setCounterpartyId] = React.useState();
    const handleClose = () => props.setShow(false);
    const sendPurchaseInvoice = async () => {
        await axios.put(
            `${HOST}/purchase-invoice/${props.invoice.id}/`,
            invoice,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            props.setPurchaseInvoice(response.data);
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
        sendPurchaseInvoice();
    };
    React.useEffect(() => {getCounterparties(setCounterparties)}, []);
    React.useEffect(() => {getAgreements(counterpartyId, setAgreements)}, [counterpartyId]);
    React.useEffect(() => {setInvoice({
        name: props.invoice.name,
        agreement_id: props.invoice.agreement_id,
        created_at: props.invoice.created_at,
    })}, [props.invoice.name]);
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
                    <label htmlFor="idUpdatePurchaseInvoiceName">Назва накладної</label>
                    <input
                        type="text"
                        name="name"
                        maxLength="100"
                        required
                        id="idUpdatePurchaseInvoiceName"
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
                    <label htmlFor="idPurchaseInvoiceCreatedAt">Створено</label>
                    <input
                        type="text"
                        name="created_at"
                        maxLength="30"
                        required
                        id="idPurchaseInvoiceCreatedAt"
                        placeholder="2023-10-01 10:00:00"
                        onChange={(event) => handleSimpleChange(event, setInvoice)}
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
