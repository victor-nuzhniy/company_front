import React from 'react';
import axios from 'axios';
import HOST from './../../Constants.js';
import {pad} from './../common/Func';

const UpdatePurchaseInvoice = (props) => {
    const [invoice, setInvoice] = React.useState({
        name: '',
        agreement_id: '',
        created_at: '',
    });
    const [agreements, setAgreements] = React.useState([])
    const [counterparties, setCounterparties] = React.useState([])
    const [counterpartyId, setCounterpartyId] = React.useState()
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
        const {name, value} = event.target
        setCounterpartyId(value)
    };
    function handleSubmit(event) {
        event.preventDefault()
        sendPurchaseInvoice()
    };
    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="modal fade"
                id="UpdatePurchaseInvoiceModal"
                tabIndex="-1"
                aria-labelledby="UpdatePurchaseInvoiceModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1
                            className="modal-title fs-5"
                            id="UpdatePurchaseInvoiceModalLabel"
                        >Modal title</h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
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
                      </div>
                      <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >Close</button>
                        <button
                            type="button"
                            className="btn btn-primary"
                        >Save changes</button>
                      </div>
                    </div>
                </div>
            </form>
        </>
    )
};

export default UpdatePurchaseInvoice;
