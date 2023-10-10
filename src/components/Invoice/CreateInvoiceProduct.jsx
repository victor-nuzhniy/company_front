import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {handleSimpleChange} from './../common/Handlers';
import {getProducts} from './../common/DataGetters';

const CreateInvoiceProduct = (props) => {
    const [invoiceProduct, setInvoiceProduct] = React.useState({
        product_id: '',
        quantity: '',
        price: '',
        invoice_id: '',
    });
    const [products, setProducts] = React.useState([])
    const handleClose = () => props.setShow(false);
    const sendInvoiceProduct = async () => {
        await axios.post(
            `${HOST}/invoice-product/`,
            invoiceProduct,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setInvoiceProduct({
                product_id: '',
                quantity: '',
                price: '',
                invoice_id: '',
            })
            props.setProductNumber(prev => (prev + 1))
            props.setShow(false)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    function handleSubmit(event) {
        event.preventDefault();
        setInvoiceProduct(prev => ({
            ...prev,
            price: prev.price * 100,
            invoice_id: props.invoiceId
        }));
    };
    React.useEffect(() => {getProducts(setProducts)}, [])
    React.useEffect(() => {
        if (Boolean(invoiceProduct.invoice_id)) sendInvoiceProduct()
    }, [invoiceProduct.invoice_id])
    return (
        <Modal show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Додати товар</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="CreateInvoiceProductModal"
                >
                    <label htmlFor="idCreateProduct">Код та найменування товару</label>
                    <select
                        name="product_id"
                        id="idCreateProduct"
                        onChange={(event) => handleSimpleChange(event, setInvoiceProduct)}
                        value={invoiceProduct.product_id}
                    >
                        <option>Вибрати продукт</option>
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
                    <label htmlFor="idCreateQuantity">Кількість</label>
                    <input
                        type="number"
                        name="quantity"
                        required
                        min="0"
                        id="idCreateQuantity"
                        placeholder="Кількість"
                        onChange={(event) => handleSimpleChange(event, setInvoiceProduct)}
                        value={invoiceProduct.quantity}
                    />
                    <label htmlFor="idCreatePrice">Ціна</label>
                    <input
                        type="number"
                        name="price"
                        required
                        step="0.01"
                        min="0"
                        id="idCreatePrice"
                        placeholder="Ціна"
                        onChange={(event) => handleSimpleChange(event, setInvoiceProduct)}
                        value={invoiceProduct.price}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="CreateInvoiceProductModal">
                    Зберегти зміни
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default CreateInvoiceProduct;
