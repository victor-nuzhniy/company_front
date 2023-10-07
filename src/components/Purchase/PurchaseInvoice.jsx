import React from 'react';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import * as bootstrap from 'bootstrap';
import HOST from './../../Constants.js';
import CreatePurchaseInvoice from './CreatePurchaseInvoice';
import UpdatePurchaseInvoice from './UpdatePurchaseInvoice';
import CreatePurchaseInvoiceProduct from './CreatePurchaseInvoiceProduct';
import UpdatePurchaseInvoiceProduct from './UpdatePurchaseInvoiceProduct';

const PurchaseInvoice = () => {
    const [purchaseInvoice, setPurchaseInvoice] = React.useState({
        name: '', agreement_id: '', created_at: ''
    })
    const [purchaseInvoiceId, setPurchaseInvoiceId] = React.useState()
    const [products, setProducts] = React.useState([])
    const [productNumber, setProductNumber] = React.useState(0)
    const location = useLocation()
    const outerPurchaseInvoiceId = location.state.purchaseInvoiceId
    if (!purchaseInvoiceId && Boolean(outerPurchaseInvoiceId)) {
        setPurchaseInvoiceId(outerPurchaseInvoiceId)
    }
    const getPurchaseInvoice = async () => {
        await axios.get(
            `${HOST}/purchase-invoice/${purchaseInvoiceId}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setPurchaseInvoice(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    };
    const getPurchaseInvoiceProducts = async () => {
        await axios.get(
            `${HOST}/purchase-invoice-products/${purchaseInvoiceId}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setProducts(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    };
    React.useEffect(() => {
        if (Boolean(purchaseInvoiceId)) getPurchaseInvoice()
    }, [purchaseInvoiceId])
    React.useEffect(() => {
    if (Boolean(purchaseInvoiceId)) getPurchaseInvoiceProducts()
    }, [purchaseInvoiceId, productNumber])
    let invoiceSum = 0
    products.map((product) => invoiceSum += product.price * product.quantity)
    invoiceSum = (invoiceSum / 100).toFixed(2)
    let updatedProduct = {
        id: '',
        quantity: 0,
        price: 0,
        products_left: 0,
        purchase_invoice_id: 1,
        name: '',
        code: '',
        currency: '',
        units: '',
    }
    function handleClick(event) {
        const {product} = event.target
        updatedProduct = product
        let modal = new bootstrap.Modal(document.getElementById("UpdatePurchaseInvoiceProductModal"), {});

        document.onreadystatechange = function () {
          modal.show();
        };
//         $('#UpdatePurchaseInvoiceProductModal').modal("show")
    };
    return (
        <>
            <div className="w-100 text-center">
                <div>
                Прибуткова накладна №{purchaseInvoice.name} від {purchaseInvoice.created_at.slice(0, 10)}
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Номер</th>
                        <th scope="col">Назва</th>
                        <th scope="col">Код</th>
                        <th scope="col">Валюта</th>
                        <th scope="col">Одиниці</th>
                        <th scope="col">Кількість</th>
                        <th scope="col">На складі</th>
                        <th scope="col">Ціна</th>
                        <th scope="col">Сума</th>
                        <th scope="col">Змінити</th>
                    </tr>
                </thead>
                {products.map((product, i) => {
                    return (
                        <tbody key={i}>
                            <tr>
                                <th scope="row">{i}</th>
                                <th>{product.name}</th>
                                <th>{product.code}</th>
                                <th>{product.currency}</th>
                                <th>{product.units}</th>
                                <th>{product.quantity}</th>
                                <th>{product.products_left}</th>
                                <th>{(product.price / 100).toFixed(2)}</th>
                                <th>{(product.price * product.quantity / 100).toFixed(2)}</th>
                                <th>
                                    <div
                                        product={product}
                                        onClick={handleClick}
                                    >++</div>
                                </th>
                            </tr>
                        </tbody>
                    )
                })}
            </table>
            <div>Загальна сумма: {invoiceSum} грн</div>
            {!purchaseInvoice.name && <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#CreatePurchaseInvoiceModal"
                                      >
                Створити прибуткову накладну
            </button>}
            {Boolean(purchaseInvoice.name) && <button
                                                type="button"
                                                className="btn btn-primary"
                                                data-bs-toggle="modal"
                                                data-bs-target="#UpdatePurchaseInvoiceModal"
                                              >
                Оновити прибуткову накладну
            </button>}
            {Boolean(purchaseInvoice.id) &&<button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#CreatePurchaseInvoiceProductModal"
            >Додати товар</button>}
            <CreatePurchaseInvoice setPurchaseInvoice={setPurchaseInvoice}/>
            <UpdatePurchaseInvoice invoice={purchaseInvoice} setPurchaseInvoice={setPurchaseInvoice} />
            <CreatePurchaseInvoiceProduct
                invoiceId={purchaseInvoice.id}
                setProductNumber={setProductNumber}
            />
            {products && <UpdatePurchaseInvoiceProduct
                product={updatedProduct}
            />}
        </>
    )
};

export default PurchaseInvoice;
