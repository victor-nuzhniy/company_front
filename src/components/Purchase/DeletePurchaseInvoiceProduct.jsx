import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';

const DeletePurchaseInvoiceProduct = (props) => {
    const handleClose = () => props.setShow(false);
    const deletePurchaseInvoice = async () => {
        await axios.delete(
            `${HOST}/purchase-invoice-product/${props.productId}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            props.setProductNumber(prev => (prev + 1))
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    };
    function handleClick(event) {
        deletePurchaseInvoice()
        handleClose()
    };
    return (
        <Modal show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Видалити товар</Modal.Title>
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
    );
};

export default DeletePurchaseInvoiceProduct;
