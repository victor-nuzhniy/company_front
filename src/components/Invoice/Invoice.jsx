import React from 'react';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import HOST from './../../Constants.js';
import {getInvoiceSum} from './../common/Func';
import CreateInvoice from './CreateInvoice';
import UpdateInvoice from './UpdateInvoice';
import {getCounterparties, getAgreements} from './../common/DataGetters';
import CreateInvoiceProduct from './CreateInvoiceProduct';
import UpdateInvoiceProduct from './UpdateInvoiceProduct';
import DeleteInvoice from './DeleteInvoice';
import DeleteInvoiceProduct from './DeleteInvoiceProduct';

const Invoice = () => {
    const [invoice, setInvoice] = React.useState({
        name: '',
        agreement_id: '',
        created_at: '',
        order_id: '',
        paid: ''
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
        invoice_id: '',
        name: '',
        code: '',
        currency: '',
        units: '',
    });
    const [deleteProductId, setDeleteProductId] = React.useState();
    const location = useLocation();
    const outerInvoiceId = location.state.invoiceId;
    if (!invoiceId && Boolean(outerInvoiceId)) {
        setInvoiceId(outerInvoiceId);
    };
    const getInvoice = async () => {
        await axios.get(
            `${HOST}/invoice/${invoiceId}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setInvoice(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    const getInvoiceProducts = async () => {
        await axios.get(
            `${HOST}/invoice-products/${invoiceId}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setProducts(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
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
        invoice_id: '',
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
                Рахунок №{invoice.name} від {invoice.created_at.slice(0, 10)}
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
                Створити рахунок
            </Button>}
            {Boolean(invoice.name) &&
                <Button
                    variant="primary"
                    onClick={() => setUpdateInvoiceShow(true)}
                >
                    Оновити рахунок
                </Button>
            }
            {Boolean(invoiceId) &&
                <Button
                    variant="primary"
                    onClick={() => setDeleteInvoiceShow(true)}
                >
                    Видалити рахунок
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
            {Boolean(createInvoiceShow) && <CreateInvoice
                setInvoice={setInvoice}
                setInvoiceId={setInvoiceId}
                show={createInvoiceShow}
                setShow={setCreateInvoiceShow}
            />}
            {Boolean(updateInvoiceShow) && <UpdateInvoice
                invoice={invoice}
                setInvoice={setInvoice}
                show={updateInvoiceShow}
                setShow={setUpdateInvoiceShow}
            />}
            <DeleteInvoice
                invoiceId={invoiceId}
                show={deleteInvoiceShow}
                setShow={setDeleteInvoiceShow}
                setProductNumber={setProductNumber}
            />
            <CreateInvoiceProduct
                invoiceId={invoice.id}
                setProductNumber={setProductNumber}
                show={createProductShow}
                setShow={setCreateProductShow}
            />
            <UpdateInvoiceProduct
                show={updateProductShow}
                setShow={setUpdateProductShow}
                product={updatedProduct}
                setProduct={setUpdatedProduct}
                setProductNumber={setProductNumber}
            />
            <DeleteInvoiceProduct
                show={deleteProductShow}
                setShow={setDeleteProductShow}
                productId={deleteProductId}
                setProductNumber={setProductNumber}
            />
        </>
    );
};

export default Invoice;
