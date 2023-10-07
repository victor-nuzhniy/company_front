import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {getElementById} from './../common/Func';

const UpdatePurchaseInvoiceProduct = (props) => {
    const [invoiceProduct, setInvoiceProduct] = React.useState({
        product_id: '',
        quantity: '',
        price: '',
        purchase_invoice_id: '',
        products_left: '',
        changeFlag: 0,
    });
    const [products, setProducts] = React.useState([])
    const handleClose = () => props.setShow(false);
    const sendPurchaseInvoiceProduct = async () => {
        await axios.put(
            `${HOST}/purchase-invoice-product/${props.product.id}/`,
            invoiceProduct,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            props.setProductNumber(prev => (prev + 1))
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
    };
    React.useEffect(() => {getProducts()}, [])
    React.useEffect(() => {
        setInvoiceProduct((prev) => ({
            product_id: props.product.product_id,
            quantity: props.product.quantity,
            price: props.product.price,
            purchase_invoice_id: props.product.purchase_invoice_id,
            products_left: props.product.products_left,
            changeFlag: prev.changeFlag,
        }));
    }, [props.show]);
    React.useEffect(() => {
        if (Boolean(invoiceProduct.changeFlag)) sendPurchaseInvoiceProduct()
    }, [invoiceProduct.changeFlag])
    let currentProduct = getElementById(products, props.product.product_id)
    function handleChange(event) {
        const {name, value} = event.target
        setInvoiceProduct(prev => ({...prev, [name]: name === "price" ? value * 100 : value}))
    }
    function handleSubmit(event) {
        event.preventDefault();
        setInvoiceProduct(prev => ({
            ...prev,
            changeFlag: prev.changeFlag + 1,
        }))
        props.setShow(false)
    };
    React.useEffect(() => {
        if (Boolean(invoiceProduct.changeFlag)) sendPurchaseInvoiceProduct()
    }, [invoiceProduct.changeFlag]);
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
                    id="UpdatePurchaseInvoiceProductModal"
                    className="d-flex flex-column"
                >
                    <label for="idProductUpdate">Найменування товару</label>
                    <select
                        name="product_id"
                        id="idProductUpdate"
                        onChange={handleChange}
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
                    <label for="idQuantityUpdate">Кількість</label>
                    <input
                        type="number"
                        name="quantity"
                        required
                        min="0"
                        id="idQuantityUpdate"
                        onChange={handleChange}
                        value={invoiceProduct.quantity}
                    />
                    <label for="idPriceUpdate">Ціна</label>
                    <input
                        type="number"
                        name="price"
                        required
                        step="0.01"
                        min="0"
                        id="idPriceUpdate"
                        onChange={handleChange}
                        value={(invoiceProduct.price / 100).toFixed(2)}
                    />
                    <label for="idProductsLeftUpdate">Залишилось на складі</label>
                    <input
                        type="number"
                        name="products_left"
                        required
                        min="0"
                        id="idProductsLeftUpdate"
                        onChange={handleChange}
                        value={invoiceProduct.products_left}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="UpdatePurchaseInvoiceProductModal">
                    Зберегти зміни
                </Button>
            </Modal.Footer>
        </Modal>}
        </>
    );
};

export default UpdatePurchaseInvoiceProduct;
