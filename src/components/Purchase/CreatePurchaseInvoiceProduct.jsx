import React from 'react';
import axios from 'axios';
import HOST from './../../Constants.js';
import {pad} from './../common/Func';

const CreatePurchaseInvoiceProduct = (props) => {
    const [invoiceProduct, setInvoiceProduct] = React.useState({
        product_id: '',
        quantity: '',
        price: '',
        purchase_invoice_id: '',
        products_left: '',
    });
    const [products, setProducts] = React.useState([])
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

    React.useEffect(() => {getProducts()}, [])
    function handleChange(event) {
        const {name, value} = event.target
        setInvoiceProduct(prev => ({...prev, [name]: value}))
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
    React.useEffect(() => {
        if (Boolean(invoiceProduct.purchase_invoice_id)) sendPurchaseInvoiceProduct()
    }, [invoiceProduct.purchase_invoice_id])
    return (
        <form
            onSubmit={handleSubmit}
            className="modal fade"
            id="CreatePurchaseInvoiceProductModal"
            tabIndex="-1"
            aria-labelledby="CreatePurchaseInvoiceProductModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1
                            className="modal-title fs-5"
                            id="CreatePurchaseInvoiceProductModalLabel"
                        >Додати товар</h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dissmiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
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
                            min="0"
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
                            min="0"
                            id="idPrice"
                            placeholder="Price"
                            onChange={handleChange}
                            value={invoiceProduct.price}
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >Закрити</button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >Зберегти</button>
                    </div>
                </div>
            </div>
        </form>
    )
};

export default CreatePurchaseInvoiceProduct;