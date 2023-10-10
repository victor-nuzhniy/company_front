import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {getElementById} from './../common/Func';
import {getProducts} from './../common/DataGetters';
import {handleProductChange} from './../common/Handlers';

const UpdateInvoiceProduct = (props) => {
    const [invoiceProduct, setInvoiceProduct] = React.useState({
        product_id: '',
        quantity: '',
        price: '',
        invoice_id: '',
        changeFlag: 0,
    });
    const [products, setProducts] = React.useState([])
    const handleClose = () => props.setShow(false);
    const sendInvoiceProduct = async () => {
        await axios.put(
            `${HOST}/invoice-product/${props.product.id}/`,
            invoiceProduct,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            props.setProductNumber(prev => (prev + 1))
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    let currentProduct = getElementById(products, props.product.product_id)
    function handleSubmit(event) {
        event.preventDefault();
        setInvoiceProduct(prev => ({
            ...prev,
            changeFlag: prev.changeFlag + 1,
        }))
        props.setShow(false)
    };
    React.useEffect(() => {getProducts(setProducts)}, []);
    React.useEffect(() => {
        setInvoiceProduct((prev) => ({
            product_id: props.product.product_id,
            quantity: props.product.quantity,
            price: props.product.price,
            purchase_invoice_id: props.product.invoice_id,
            changeFlag: prev.changeFlag,
        }));
    }, [props.show]);
    React.useEffect(() => {
        if (Boolean(invoiceProduct.changeFlag)) sendInvoiceProduct()
    }, [invoiceProduct.changeFlag])
    return (
        <>
        {Boolean(products) &&
        <Modal show={props.show} onHide={handleClose}>
             <Modal.Header closeButton>
              <Modal.Title>Змінити деталі</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    id="UpdateInvoiceProductModal"
                    className="d-flex flex-column"
                >
                    <label htmlFor="idProductUpdate">Найменування товару</label>
                    <select
                        name="product_id"
                        id="idProductUpdate"
                        onChange={(event) => handleProductChange(event, setInvoiceProduct)}
                        value={invoiceProduct.product_id}
                    >
                        <option>{Boolean(currentProduct) ? `${currentProduct.code} ${currentProduct.name}` : null}</option>
                        {products.map((product, i) => {
                            return (
                                <option
                                    value={product.id}
                                    key={i}
                                >
                                    {Boolean(products) ? `${product.code} ${product.name}` : null}
                                </option>
                            )
                        })}
                    </select>
                    <label htmlFor="idQuantityUpdate">Кількість</label>
                    <input
                        type="number"
                        name="quantity"
                        required
                        min="0"
                        id="idQuantityUpdate"
                        onChange={(event) => handleProductChange(event, setInvoiceProduct)}
                        value={invoiceProduct.quantity}
                    />
                    <label htmlFor="idPriceUpdate">Ціна</label>
                    <input
                        type="number"
                        name="price"
                        required
                        step="0.01"
                        min="0"
                        id="idPriceUpdate"
                        onChange={(event) => handleProductChange(event, setInvoiceProduct)}
                        value={(invoiceProduct.price / 100).toFixed(2)}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="UpdateInvoiceProductModal">
                    Зберегти зміни
                </Button>
            </Modal.Footer>
        </Modal>}
        </>
    );
};

export default UpdateInvoiceProduct;
