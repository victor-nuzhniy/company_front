import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {handleSimpleChange} from './../common/Handlers';

const CreatePurchaseInvoiceProduct = (props) => {
    const [invoiceProduct, setInvoiceProduct] = React.useState({
        product_id: '',
        quantity: '',
        price: '',
        purchase_invoice_id: '',
        products_left: '',
    });
    const [products, setProducts] = React.useState([])
    const handleClose = () => props.setShow(false);
    const sendPurchaseInvoiceProduct = async () => {
        await axios.post(
            `${HOST}/purchase-invoice-product/`,
            invoiceProduct,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setInvoiceProduct({
                product_id: '',
                quantity: '',
                price: '',
                purchase_invoice_id: '',
                products_left: '',
            })
            props.setProductNumber(prev => (prev + 1))
            props.setShow(false)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    };
    const getProducts = async () => {
        await axios.get(
            `${HOST}/product/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setProducts(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    }
    function handleSubmit(event) {
        event.preventDefault();
        setInvoiceProduct(prev => ({
            ...prev,
            products_left: prev.quantity,
            price: prev.price * 100,
            purchase_invoice_id: props.invoiceId
        }))
    };
    React.useEffect(() => {getProducts()}, [])
    React.useEffect(() => {
        if (Boolean(invoiceProduct.purchase_invoice_id)) sendPurchaseInvoiceProduct()
    }, [invoiceProduct.purchase_invoice_id])
    return (
        <Modal show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Додати товар</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="CreatePurchaseInvoiceProductModal"
                >
                    <label htmlFor="idProduct">Код та найменування товару</label>
                    <select
                        name="product_id"
                        id="idProduct"
                        onChange={(event) => handleSimpleChange(event, setInvoiceProduct)}
                        value={invoiceProduct.product_id}
                    >
                        <option>Select product</option>
                        {products.map((product, i) => {
                            return (
                                <option
                                    value={product.id}
                                    key={i}
                                >
                                    {`${product.code} ${product.name}`}
                                </option>
                            )
                        })}
                    </select>
                    <label htmlFor="idQuantity">Кількість</label>
                    <input
                        type="number"
                        name="quantity"
                        required
                        min="0"
                        id="idQuantity"
                        placeholder="Quantity"
                        onChange={(event) => handleSimpleChange(event, setInvoiceProduct)}
                        value={invoiceProduct.quantity}
                    />
                    <label htmlFor="idPrice">Ціна</label>
                    <input
                        type="number"
                        name="price"
                        required
                        step="0.01"
                        min="0"
                        id="idPrice"
                        placeholder="Price"
                        onChange={(event) => handleSimpleChange(event, setInvoiceProduct)}
                        value={invoiceProduct.price}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="CreatePurchaseInvoiceProductModal">
                    Зберегти зміни
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default CreatePurchaseInvoiceProduct;