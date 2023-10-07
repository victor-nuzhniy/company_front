import React from 'react';
import axios from 'axios';
import HOST from './../../Constants.js';
import {getElementById} from './../common/Func';

const UpdatePurchaseInvoiceProduct = (props) => {
    const [invoiceProduct, setInvoiceProduct] = React.useState({
        product_id: '',
        quantity: '',
        price: '',
        purchase_invoice_id: '',
        products_left: '',
    });
    const [products, setProducts] = React.useState([])
    const sendPurchaseInvoiceProduct = async () => {
        await axios.put(
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
                changeFlag: 0,
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
    }, []);
    let currentProduct = getElementById(products, props.product.product_id)
    function handleChange(event) {
        const {name, value} = event.target
        setInvoiceProduct(prev => ({...prev, [name]: value}))
    }
    function handleSubmit(event) {
        event.preventDefault();
        setInvoiceProduct(prev => ({
            ...prev,
            price: prev.price * 100,
            changeFlag: prev + 1,
        }))
    };
    React.useEffect(() => {
        if (Boolean(invoiceProduct.changeFlag)) sendPurchaseInvoiceProduct()
    }, [invoiceProduct.changeFlag]);
    return (
        <>
        {currentProduct && <form
            onSubmit={handleSubmit}
            className="modal fade"
            id="UpdatePurchaseInvoiceProductModal"
            tabIndex="-1"
            aria-labelledby="UpdatePurchaseInvoiceProductModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1
                            className="modal-title fs-5"
                            id="UpdatePurchaseInvoiceProductModalLabel"
                        >Змінити товар</h1>
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
                            id="idProductUpdate"
                            onChange={handleChange}
                            value={invoiceProduct.product_id}
                        >
                            <option>{`${currentProduct.code} ${currentProduct.name}`}</option>
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
                            id="idQuantityUpdate"
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
                            id="idPriceUpdate"
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
        </form>}
        </>
    );
};

export default UpdatePurchaseInvoiceProduct;
