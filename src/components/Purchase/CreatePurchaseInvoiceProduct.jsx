import React from 'react';
import axios from 'axios';
import HOST from './../../Constants.js';
import {pad} from './../common/Func';

const CreatePurchaseInvoiceProduct = () => {
    const [invoiceProduct, setInvoiceProduct] = React.useState({
        product_id: '',
        quantity: '',
        price: '',
        purchase_invoice_id: '',
        products_left: '',
    });
    const [products, setProducts] = React.useState([])
    const [invoices, setInvoices] = React.useState([])
    const [newInvoice, setNewInvoice] = React.useState({
        name: '', agreement_id: ''
    })
    const sendPurchaseInvoiceProduct = async () => {
        await axios.post(
            `${HOST}/purchase-invoice-product/`,
            invoiceProduct,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {

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
    const getInvoices = async () => {
        await axios.get(
            `${HOST}/purchase-invoice/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setInvoices(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    }
    React.useEffect(() => getProducts(), [])
    React.useEffect(() => getInvoices(), [newInvoice])
    function handleChange(event) {
        const {name, value} = event.target
        setInvoiceProduct(prev => ({...prev, [name]: value}))
    }
    function handleSubmit(event) {
        event.preventDefault()
        setInvoiceProduct(prev => ({
        ...prev, products_left: prev.quantity, price: prev.price * 100
        }))
        sendPurchaseInvoiceProduct()
        setInvoiceProduct({
            product_id: '',
            quantity: '',
            price: '',
            purchase_invoice_id: '',
            products_left: '',
        })
    };
    return (
        <form onSubmit={handleSubmit}>
            <select
                name="product_id"
                id="idProduct"
                onChange={handleChange}
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
            <input
                type="number"
                name="quantity"
                required
                id="idQuantity"
                placeholder="Quantity"
                onChange={handleChange}
                value={invoiceProduct.quantity}
            />
            <input
                type="number"
                name="price"
                required
                step="0.01"
                id="idPrice"
                placeholder="Price"
                onChange={handleChange}
                value={invoiceProduct.price}
            />
            <select
                name="purchase_invoice_id"
                id="idPurchaseInvoice"
                onChange={handleChange}
                value={invoiceProduct.purchase_invoice_id}
            >
                <option>Select purchase invoice</option>

            </select>
        </form>
    )
};

export default CreatePurchaseInvoiceProduct;