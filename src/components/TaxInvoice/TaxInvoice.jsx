import React from 'react';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import HOST from './../../Constants.js';
import {getInvoiceSum, getArrayAttributeSum} from './../common/Func';
import {getCounterparties, getAgreements} from './../common/DataGetters';
import CreateTaxInvoice from './CreateTaxInvoice';
import UpdateTaxInvoice from './UpdateTaxInvoice';


const TaxInvoice = () => {
    const [invoice, setInvoice] = React.useState({
        name: '',
        created_at: '',
        sale_invoice_id: '',
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
        product_id: '',
        quantity: '',
        tax_invoice_id: '',
        sale_invoice_products_id: '',
        purchase_invoice_product_id: '',
        name: '',
        code: '',
        currency: '',
        units: '',
        purchase_price: '',
        sale_price: '',
    });
    const [deleteProductId, setDeleteProductId] = React.useState();
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
        tax_invoice_id: '',
        sale_invoice_products_id: '',
        purchase_invoice_product_id: '',
        name: '',
        code: '',
        currency: '',
        units: '',
        purchase_price: '',
        sale_price: '',
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
                        <th scope="col">Ціна продажу</th>
                        <th scope="col">Сума продажу</th>
                        <th scope="col">Ціна входу</th>
                        <th scope="col">Сума входу</th>
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
                                <th>{(product.sale_price / 100).toFixed(2)}</th>
                                <th>{(product.sale_price * product.quantity / 100).toFixed(2)}</th>
                                <th>{(product.purchase_price / 100).toFixed(2)}</th>
                                <th>{(product.purchase_price * product.quantity / 100).toFixed(2)}</th>
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
            <div>Загальна сумма продажу: {saleSum} грн</div>
            <div>Загальна сумма приходу: {purchaseSum} грн</div>
            {!invoice.name && <Button
                                        variant="primary"
                                        onClick={() => setCreateInvoiceShow(true)}
                                      >
                Створити податкову накладну
            </Button>}
            {Boolean(invoice.name) &&
                <Button
                    variant="primary"
                    onClick={() => setUpdateInvoiceShow(true)}
                >
                    Оновити податкову накладну
                </Button>
            }
            {Boolean(invoiceId) &&
                <Button
                    variant="primary"
                    onClick={() => setDeleteInvoiceShow(true)}
                >
                    Видалити податкову накладну
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
            {Boolean(createInvoiceShow) && <CreateTaxInvoice
                setInvoice={setInvoice}
                setInvoiceId={setInvoiceId}
                show={createInvoiceShow}
                setShow={setCreateInvoiceShow}
            />}
            {Boolean(updateInvoiceShow) && <UpdateTaxInvoice
                invoice={invoice}
                setInvoice={setInvoice}
                show={updateInvoiceShow}
                setShow={setUpdateInvoiceShow}
            />}
{/*             {Boolean(deleteInvoiceShow) && <DeleteInvoice */}
{/*                 invoiceId={invoiceId} */}
{/*                 show={deleteInvoiceShow} */}
{/*                 setShow={setDeleteInvoiceShow} */}
{/*                 setProductNumber={setProductNumber} */}
{/*             />} */}
{/*             {Boolean(createProductShow) && <CreateInvoiceProduct */}
{/*                 invoiceId={invoice.id} */}
{/*                 setProductNumber={setProductNumber} */}
{/*                 show={createProductShow} */}
{/*                 setShow={setCreateProductShow} */}
{/*             />} */}
{/*             {Boolean(updateProductShow) && <UpdateInvoiceProduct */}
{/*                 show={updateProductShow} */}
{/*                 setShow={setUpdateProductShow} */}
{/*                 product={updatedProduct} */}
{/*                 setProduct={setUpdatedProduct} */}
{/*                 setProductNumber={setProductNumber} */}
{/*             />} */}
{/*             {Boolean(deleteProductShow) && <DeleteInvoiceProduct */}
{/*                 show={deleteProductShow} */}
{/*                 setShow={setDeleteProductShow} */}
{/*                 productId={deleteProductId} */}
{/*                 setProductNumber={setProductNumber} */}
{/*             />} */}
        </>
    );
};

export default TaxInvoice;
