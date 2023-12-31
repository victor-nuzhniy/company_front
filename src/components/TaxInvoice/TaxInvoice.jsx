import React from 'react';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import HOST from './../../Constants.js';
import {getInvoiceSum, getArrayAttributeSum} from './../common/Func';
import {getCounterparties, getAgreements} from './../common/DataGetters';

const TaxInvoice = () => {
    const [invoice, setInvoice] = React.useState({
        name: '',
        created_at: '',
        sale_invoice_id: '',
    });
    const [invoiceId, setInvoiceId] = React.useState();
    const [products, setProducts] = React.useState([]);
    const location = useLocation();
    const outerInvoiceId = location.state.invoiceId;
    if (!invoiceId && Boolean(outerInvoiceId)) {
        setInvoiceId(outerInvoiceId);
    };
    const getInvoice = async () => {
        await axios.get(
            `${HOST}/tax-invoice/${invoiceId}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setInvoice(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    const getInvoiceProducts = async () => {
        await axios.get(
            `${HOST}/tax-invoice-products/${invoiceId}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setProducts(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    const saleSum = getArrayAttributeSum(products, 'quantity', 'sale_price');
    const purchaseSum = getArrayAttributeSum(products, 'quantity', 'purchase_price');
    React.useEffect(() => {
        if (Boolean(invoiceId)) getInvoice();
    }, [invoiceId]);
    React.useEffect(() => {
        if (Boolean(invoiceId)) getInvoiceProducts()
    }, [invoiceId]);
    return (
        <>
            <div className="w-100 text-center">
                <div>
                Накладна №{invoice.name} від {invoice.created_at.slice(0, 10)}
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
                        <th scope="col">Ціна продажу</th>
                        <th scope="col">Сума продажу</th>
                        <th scope="col">Ціна входу</th>
                        <th scope="col">Сума входу</th>
                    </tr>
                </thead>
                {products.map((product, i) => {
                    return (
                        <tbody key={i}>
                            <tr>
                                <th scope="row">{i + 1}</th>
                                <th>{product.name}</th>
                                <th>{product.code}</th>
                                <th>{product.currency}</th>
                                <th>{product.units}</th>
                                <th>{product.quantity}</th>
                                <th>{(product.sale_price / 100).toFixed(2)}</th>
                                <th>{(product.sale_price * product.quantity / 100).toFixed(2)}</th>
                                <th>{(product.purchase_price / 100).toFixed(2)}</th>
                                <th>{(product.purchase_price * product.quantity / 100).toFixed(2)}</th>
                            </tr>
                        </tbody>
                    )
                })}
            </table>
            <div>Загальна сумма продажу: {saleSum} грн</div>
            <div>Загальна сумма приходу: {purchaseSum} грн</div>
            }
        </>
    );
};

export default TaxInvoice;
