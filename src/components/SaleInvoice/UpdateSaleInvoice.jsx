import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {handleSimpleChange} from './../common/Handlers';
import {getElementById} from './../common/Func';
import {getCounterparties, getAgreements, getInvoices, getInstance} from './../common/DataGetters';


const UpdateSaleInvoice = (props) => {
    const [saleInvoice, setSaleInvoice] = React.useState({
        id: '',
        name: '',
        invoice_id: '',
        done: false,
        created_at: '',
    });
    console.log(saleInvoice, 1111111111111)
    const [agreements, setAgreements] = React.useState([]);
    const [agreement, setAgreement] = React.useState()
    const [counterparties, setCounterparties] = React.useState([]);
    const [counterpartyId, setCounterpartyId] = React.useState();
    const [counterparty, setCounterparty] = React.useState();
    const [agreementId, setAgreementId] = React.useState();
    const [invoices, setInvoices] = React.useState([]);
    const [invoice, setInvoice] = React.useState([])
    const [invoiceId, setInvoiceId] = React.useState();
    const handleClose = () => props.setShow(false);
    const sendSaleInvoice = async () => {
        await axios.put(
            `${HOST}/sale-invoice/${props.saleInvoice.id}/`,
            saleInvoice,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            props.setSaleInvoice(response.data)
            props.setShow(false)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    };
    function handleCounterpartyChange(event) {
        const {value} = event.target;
        setCounterpartyId(value);
        setAgreement();
        setInvoice();
    };
    function handleAgreementChange(event) {
        const {value} = event.target;
        setAgreementId(value);
        setInvoice();
    };
    function handleChange(event) {
        const {name, value, type, checked} = event.target;
        setSaleInvoice(prev =>({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };
    function handleSubmit(event) {
        event.preventDefault();
        sendSaleInvoice();
    };
    React.useEffect(() => {
        getInstance(`invoice/${props.saleInvoice.invoice_id}`, setInvoice);
        }, []);
    React.useEffect(() => {
        if (Boolean(invoice)) setAgreementId(invoice.agreement_id)
    }, [invoice]);
    React.useEffect(() => {
        if (Boolean(agreementId)) getInstance(`agreement/${agreementId}`, setAgreement)
    }, [agreementId]);
    React.useEffect(() => {
        if (Boolean(agreement)) {
            setCounterpartyId(agreement.counterparty_id)
            getInvoices(agreement.id, setInvoices)
        }
    },[agreement]);
    React.useEffect(() => {getCounterparties(setCounterparties)}, []);
    React.useEffect(() => {
        if (Boolean(counterpartyId)) {
            getAgreements(counterpartyId, setAgreements)
        };
    }, [counterpartyId]);
    React.useEffect(() => {
        if (Boolean(counterpartyId) && Boolean(counterparties)) {
            setCounterparty(getElementById(counterparties, counterpartyId))
        }
    }, [counterpartyId, counterparties]);
    React.useEffect(() => {setSaleInvoice({
        name: props.saleInvoice.name,
        invoice_id: props.saleInvoice.invoice_id,
        created_at: props.saleInvoice.created_at,
        done: props.saleInvoice.done,
    })}, [props.saleInvoice.name])
    return (
        <Modal show={props.show} onHide={handleClose}>
             <Modal.Header closeButton>
              <Modal.Title>Оновити видаткову накладну</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="UpdateSaleInvoiceModal"
                >
                    <label htmlFor="idUpdateInvoiceName">Назва видаткової накладної</label>
                    <input
                        type="text"
                        name="name"
                        maxLength="100"
                        required
                        id="idUpdateInvoiceName"
                        onChange={(event) => handleSimpleChange(event, setSaleInvoice)}
                        value={saleInvoice.name}
                    />
                    <label htmlFor="idUpdateCounterparty">Контрагент</label>
                    <select
                        name="counterpartyId"
                        value={counterpartyId}
                        id="idUpdateCounterparty"
                        onChange={handleCounterpartyChange}
                    >
                        <option>
                            {Boolean(counterparty)
                             ?
                             `${counterparty.name} ${counterparty.city} ${counterparty.country}`
                             :
                             "Вибрати контрагента"}
                        </option>
                        {counterparties.map((company, j) => {
                            return(
                                <option
                                    value={company.id}
                                    key={j}
                                >
                                    {`${company.name} ${company.city} ${company.country}`}
                                </option>
                            )
                        })}
                    </select>
                    <label htmlFor="idUpdateAgreementId">Угода</label>
                    <select
                        name="agreementId"
                        id="idUpdateAgreementId"
                        onChange={handleAgreementChange}
                        value={agreementId}
                    >
                        <option>
                            {Boolean(agreement) ? agreement.name : "Вибрати угоду"}
                        </option>
                        {agreements.map((agreement, i) => {
                            return(
                                <option
                                    value={agreement.id}
                                    key={i}
                                >{agreement.name}</option>
                            )
                        })}
                    </select>
                    <label htmlFor="idUpdateInvoiceId">Рахунок</label>
                    <select
                        name="invoice_id"
                        id="idUpdateInvoiceId"
                        onChange={(event) => handleSimpleChange(event, setSaleInvoice)}
                        value={saleInvoice.invoice_id}
                    >
                        <option>
                            {Boolean(invoice) ? invoice.name : "Вибрати рахунок"}
                        </option>
                        {invoices.map((order, i) => {
                            return(
                                <option
                                    value={order.id}
                                    key={i}
                                >{order.name}</option>
                            )
                        })}
                    </select>
                    <label htmlFor="idUpdateInvoiceCreatedAt">Створено</label>
                    <input
                        type="text"
                        name="created_at"
                        maxLength="30"
                        required
                        id="idUpdateInvoiceCreatedAt"
                        placeholder="2023-10-01 10:00:00"
                        onChange={(event) => handleSimpleChange(event, setInvoice)}
                        value={saleInvoice.created_at}
                    />
                    <label htmlFor="idUpdateInvoicePaid">Проведено</label>
                    <input
                        type="checkbox"
                        name="done"
                        id="idUpdateInvoicePaid"
                        onChange={handleChange}
                        checked={saleInvoice.done}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="UpdateSaleInvoiceModal">
                    Зберегти зміни
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default UpdateSaleInvoice;