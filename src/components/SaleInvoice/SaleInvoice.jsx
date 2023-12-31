import React from 'react';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import HOST from './../../Constants.js';
import {getInvoiceSum} from './../common/Func';
import {getCounterparties, getAgreements} from './../common/DataGetters';
import CreateSaleInvoice from './CreateSaleInvoice';
import UpdateSaleInvoice from './UpdateSaleInvoice';
import CreateSaleInvoiceProduct from './CreateSaleInvoiceProduct';
import UpdateSaleInvoiceProduct from './UpdateSaleInvoiceProduct';
import DeleteSaleInvoice from './DeleteSaleInvoice';
import DeleteSaleInvoiceProduct from './DeleteSaleInvoiceProduct';

const SaleInvoice = () => {
    const [invoice, setInvoice] = React.useState({
        name: '',
        sale_invoice_id: '',
        created_at: '',
        done: ''
    });
    const [invoiceId, setInvoiceId] = React.useState();
    const [products, setProducts] = React.useState([]);
    const [productNumber, setProductNumber] = React.useState(0);
    const [updateProductShow, setUpdateProductShow] = React.useState(false);
    const [createProductShow, setCreateProductShow] = React.useState(false);
    const [createInvoiceShow, setCreateInvoiceShow] = React.useState(false);
    const [updateInvoiceShow, setUpdateInvoiceShow] = React.useState(false);
    const [deleteInvoiceShow, setDeleteInvoiceShow] = React.useState(false);
    const [deleteProductShow, setDeleteProductShow] = React.useState(false);
    const [updatedProduct, setUpdatedProduct] = React.useState({
        id: '',
        quantity: '',
        price: '',
        sale_invoice_id: '',
        name: '',
        code: '',
        currency: '',
        units: '',
    });
    const [deleteProductId, setDeleteProductId] = React.useState();
    const [message, setMessage] = React.useState()
    const location = useLocation();
    const outerInvoiceId = location.state.invoiceId;
    if (!invoiceId && Boolean(outerInvoiceId)) {
        setInvoiceId(outerInvoiceId);
    };
    const getInvoice = async () => {
        await axios.get(
            `${HOST}/sale-invoice/${invoiceId}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setInvoice(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    const getInvoiceProducts = async () => {
        await axios.get(
            `${HOST}/sale-invoice-products/${invoiceId}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setProducts(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    const makeAccountEntry = async () => {
        await axios.post(
            `${HOST}/account/process-sale-invoice/`,
            {sale_invoice_id: invoiceId},
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setMessage(response.data.message)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
            setMessage(error.message)
        });
    };
    const invoiceSum = getInvoiceSum(products);
    function handleUpdateClick(product) {
        setUpdatedProduct(product);
        setUpdateProductShow(true);
    };
    function handleDeleteClick(productId) {
        setDeleteProductId(productId);
        setDeleteProductShow(true);
    };
    function handleMakeAccountClick() {
        makeAccountEntry()
    };
    React.useEffect(() => {
        if (Boolean(invoiceId)) getInvoice();
    }, [invoiceId]);
    React.useEffect(() => {
        if (Boolean(invoiceId)) getInvoiceProducts()
    }, [invoiceId, productNumber]);
    React.useEffect(() => {
        if (!updateProductShow) setUpdatedProduct({
        id: '',
        quantity: '',
        price: '',
        sale_invoice_id: '',
        name: '',
        code: '',
        currency: '',
        units: '',
    });
    }, [updateProductShow]);
    React.useEffect(() => {if (!deleteProductShow) setDeleteProductId()}, [deleteProductId]);
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
                        <th scope="col">Ціна</th>
                        <th scope="col">Сума</th>
                        <th scope="col">Змінити</th>
                        <th>Видалити</th>
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
                                <th>{(product.price / 100).toFixed(2)}</th>
                                <th>{(product.price * product.quantity / 100).toFixed(2)}</th>
                                <th>
                                    <div
                                        onClick={() => handleUpdateClick(product)}
                                        style={{color: "blue", textDecoration: "underline", cursor: "pointer"}}
                                    >+</div>
                                </th>
                                <th>
                                    <div
                                        onClick={() => handleDeleteClick(product.id)}
                                        style={{color: "blue", textDecoration: "underline", cursor: "pointer"}}

                                    >-</div>
                                </th>
                            </tr>
                        </tbody>
                    )
                })}
            </table>
            <div>Загальна сумма: {invoiceSum} грн</div>
            {!invoice.name && <Button
                                        variant="primary"
                                        onClick={() => setCreateInvoiceShow(true)}
                                      >
                Створити видаткову накладну
            </Button>}
            {Boolean(invoice.name) &&
                <Button
                    variant="primary"
                    onClick={() => setUpdateInvoiceShow(true)}
                >
                    Оновити видаткову накладну
                </Button>
            }
            {Boolean(invoiceId) &&
                <Button
                    variant="primary"
                    onClick={() => setDeleteInvoiceShow(true)}
                >
                    Видалити накладну
                </Button>
            }
            {Boolean(invoice.id) &&
                <Button
                    variant="primary"
                    onClick={() => setCreateProductShow(true)}
                >
                    Додати товар
                </Button>
            }
            {Boolean(invoiceId) &&
                <Button
                    variant="primary"
                    onClick={handleMakeAccountClick}
                >
                    Провести накладну
                </Button>
            }
            {Boolean(message) && <div>message</div>}
            {Boolean(createInvoiceShow) && <CreateSaleInvoice
                setInvoice={setInvoice}
                setInvoiceId={setInvoiceId}
                show={createInvoiceShow}
                setShow={setCreateInvoiceShow}
            />}
            {Boolean(updateInvoiceShow) && <UpdateSaleInvoice
                saleInvoice={invoice}
                setSaleInvoice={setInvoice}
                show={updateInvoiceShow}
                setShow={setUpdateInvoiceShow}
            />}
            {Boolean(deleteInvoiceShow) && <DeleteSaleInvoice
                invoiceId={invoiceId}
                show={deleteInvoiceShow}
                setShow={setDeleteInvoiceShow}
                setProductNumber={setProductNumber}
            />}
            {Boolean(createProductShow) && <CreateSaleInvoiceProduct
                invoiceId={invoice.id}
                setProductNumber={setProductNumber}
                show={createProductShow}
                setShow={setCreateProductShow}
            />}
            {Boolean(updateProductShow) && <UpdateSaleInvoiceProduct
                show={updateProductShow}
                setShow={setUpdateProductShow}
                product={updatedProduct}
                setProduct={setUpdatedProduct}
                setProductNumber={setProductNumber}
            />}
            {Boolean(deleteProductShow) && <DeleteSaleInvoiceProduct
                show={deleteProductShow}
                setShow={setDeleteProductShow}
                productId={deleteProductId}
                setProductNumber={setProductNumber}
            />}
        </>
    );
};

export default SaleInvoice;
