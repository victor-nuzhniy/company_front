import React from 'react';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import HOST from './../../Constants.js';
import CreatePurchaseInvoice from './CreatePurchaseInvoice';
import UpdatePurchaseInvoice from './UpdatePurchaseInvoice';
import CreatePurchaseInvoiceProduct from './CreatePurchaseInvoiceProduct';
import UpdatePurchaseInvoiceProduct from './UpdatePurchaseInvoiceProduct';
import DeletePurchaseInvoice from './DeletePurchaseInvoice';
import DeletePurchaseInvoiceProduct from './DeletePurchaseInvoiceProduct';
import {getInvoiceSum} from './../common/Func';

const PurchaseInvoice = () => {
    const [purchaseInvoice, setPurchaseInvoice] = React.useState({
        name: '', agreement_id: '', created_at: ''
    });
    const [purchaseInvoiceId, setPurchaseInvoiceId] = React.useState();
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
        quantity: 0,
        price: 0,
        products_left: 0,
        purchase_invoice_id: 1,
        name: '',
        code: '',
        currency: '',
        units: '',
    });
    const [deleteProductId, setDeleteProductId] = React.useState();
    const location = useLocation();
    const outerPurchaseInvoiceId = location.state.purchaseInvoiceId;
    if (!purchaseInvoiceId && Boolean(outerPurchaseInvoiceId)) {
        setPurchaseInvoiceId(outerPurchaseInvoiceId);
    };
    const getPurchaseInvoice = async () => {
        await axios.get(
            `${HOST}/purchase-invoice/${purchaseInvoiceId}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setPurchaseInvoice(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    const getPurchaseInvoiceProducts = async () => {
        await axios.get(
            `${HOST}/purchase-invoice-products/${purchaseInvoiceId}/`,
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
        if (Boolean(purchaseInvoiceId)) getPurchaseInvoice();
    }, [purchaseInvoiceId]);
    React.useEffect(() => {
        if (Boolean(purchaseInvoiceId)) getPurchaseInvoiceProducts()
    }, [purchaseInvoiceId, productNumber]);
    React.useEffect(() => {
        if (!updateProductShow) setUpdatedProduct({
        id: '',
        quantity: 0,
        price: 0,
        products_left: 0,
        purchase_invoice_id: 1,
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
                                <th>{product.products_left}</th>
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
            {!purchaseInvoice.name && <Button
                                        variant="primary"
                                        onClick={() => setCreateInvoiceShow(true)}
                                      >
                Створити прибуткову накладну
            </Button>}
            {Boolean(purchaseInvoice.name) &&
                <Button
                    variant="primary"
                    onClick={() => setUpdateInvoiceShow(true)}
                >
                    Оновити прибуткову накладну
                </Button>
            }
            {Boolean(purchaseInvoiceId) &&
                <Button
                    variant="primary"
                    onClick={() => setDeleteInvoiceShow(true)}
                >
                    Видалити накладну
                </Button>
            }
            {Boolean(purchaseInvoice.id) &&
                <Button
                    variant="primary"
                    onClick={() => setCreateProductShow(true)}
                >
                    Додати товар
                </Button>
            }
            {createInvoiceShow && <CreatePurchaseInvoice
                setPurchaseInvoice={setPurchaseInvoice}
                setPurchaseInvoiceId={setPurchaseInvoiceId}
                show={createInvoiceShow}
                setShow={setCreateInvoiceShow}
            />}
            {updateInvoiceShow && <UpdatePurchaseInvoice
                invoice={purchaseInvoice}
                setPurchaseInvoice={setPurchaseInvoice}
                show={updateInvoiceShow}
                setShow={setUpdateInvoiceShow}
            />}
            {deleteInvoiceShow && <DeletePurchaseInvoice
                invoiceId={purchaseInvoiceId}
                show={deleteInvoiceShow}
                setShow={setDeleteInvoiceShow}
                setProductNumber={setProductNumber}
            />}
            {createProductShow && <CreatePurchaseInvoiceProduct
                invoiceId={purchaseInvoice.id}
                setProductNumber={setProductNumber}
                show={createProductShow}
                setShow={setCreateProductShow}
            />}
            {updateProductShow && <UpdatePurchaseInvoiceProduct
                show={updateProductShow}
                setShow={setUpdateProductShow}
                product={updatedProduct}
                setProduct={setUpdatedProduct}
                setProductNumber={setProductNumber}
            />}
            {deleteProductShow && <DeletePurchaseInvoiceProduct
                show={deleteProductShow}
                setShow={setDeleteProductShow}
                productId={deleteProductId}
                setProductNumber={setProductNumber}
            />}
        </>
    );
};

export default PurchaseInvoice;
