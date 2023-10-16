import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import {useNavigate} from 'react-router-dom';
import HOST from './../../Constants.js';

const DeleteTaxInvoice = (props) => {
    const handleClose = () => props.setShow(false);
    const navigate = useNavigate()
    const deleteTaxInvoice = async () => {
        await axios.delete(
            `${HOST}/tax-invoice-delete/${props.invoiceId}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {

        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    function handleClick(event) {
        deleteTaxInvoice()
        navigate("/tax-invoice-registry")
    };
    return (
        <Modal show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Видалити податкову накладну</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Ви впевнені, що хочете видалити?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" onClick={handleClick}>
                    Видалити
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default DeleteTaxInvoice;
