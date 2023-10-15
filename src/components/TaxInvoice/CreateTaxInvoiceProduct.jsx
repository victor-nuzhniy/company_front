import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {handleSimpleChange} from './../common/Handlers';
import {getInstance} from './../common/DataGetters';
import {getElementById} from './../common/Func';

const CreateTaxInvoiceProduct = (props) => {
    const [invoiceProduct, setInvoiceProduct] = React.useState({
        quantity: '',
        tax_invoice_id: '',
        sale_invoice_product_id: '',
        purchase_invoice_product_id: '',
    });
    const [saleInvoiceProducts, setSaleInvoiceProducts] = React.useState([])
    const [productId, setProductId] = React.useState()
    const [purchaseInvoiceProducts, setPurchaseInvoiceProducts] = React.useState([])
    const handleClose = () => props.setShow(false);
    console.log(invoiceProduct, 11111111111111)
    const sendInvoiceProduct = async () => {
        await axios.post(
            `${HOST}/tax-invoice-product/`,
            invoiceProduct,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setInvoiceProduct({
                quantity: '',
                tax_invoice_id: '',
                sale_invoice_product_id: '',
                purchase_invoice_product_id: '',
            })
            props.setProductNumber(prev => (prev + 1))
            props.setShow(false)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    function handleSubmit(event) {
        event.preventDefault();
        sendInvoiceProduct()
    };
    function handleSaleInvoiceProductChange(event) {
        const {name, value} = event.target
        const product = getElementById(saleInvoiceProducts, parseInt(value))
        setInvoiceProduct(prev => ({...prev, [name]: value}));
        setProductId(product.product_id)
    }
    console.log(props.saleInvoiceId, props.invoiceId, 33333333333)
    React.useEffect(() => {
        getInstance(`sale-invoice-products/${props.saleInvoiceId}/${props.invoiceId}`, setSaleInvoiceProducts);
        setInvoiceProduct(prev => ({
            ...prev,
            tax_invoice_id: props.invoiceId
        }));
    }, []);
    React.useEffect(() => {
        if (Boolean(productId)) {
            getInstance(`purchase-invoice-products/product/${productId}`, setPurchaseInvoiceProducts)
        }
    }, [productId]);
    return (
        <Modal show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Додати товар</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="CreateTaxInvoiceProductModal"
                >
                    <label htmlFor="idCreateSaleProduct">Код та найменування товару</label>
                    <select
                        name="sale_invoice_product_id"
                        id="idCreateSaleProduct"
                        onChange={handleSaleInvoiceProductChange}
                        value={invoiceProduct.sale_invoice_product_id}
                    >
                        <option>Вибрати продукт видаткової накладної</option>
                        {saleInvoiceProducts.map((product, i) => {
                            return (
                                <option
                                    value={product.id}
                                    key={i}
                                >
                                    {`${product.code} ${product.name} ${product.quantity} ${product.sale_products_left}`}
                                </option>
                            )
                        })}
                    </select>
                    <label htmlFor="idCreatePurchaseProduct">Код та найменування товару</label>
                    <select
                        name="purchase_invoice_product_id"
                        id="idCreatePurchaseProduct"
                        onChange={(event) => handleSimpleChange(event, setInvoiceProduct)}
                        value={invoiceProduct.purchase_invoice_product_id}
                    >
                        <option>Вибрати продукт прибуткової накладної</option>
                        {purchaseInvoiceProducts.map((product, i) => {
                            return (
                                <option
                                    value={product.id}
                                    key={i}
                                >
                                    {`${product.code} ${product.name} ${product.products_left}`}
                                </option>
                            )
                        })}
                    </select>
                    <label htmlFor="idCreateQuantity">Кількість</label>
                    <input
                        type="number"
                        name="quantity"
                        required
                        min="0"
                        id="idCreateQuantity"
                        placeholder="Кількість"
                        onChange={(event) => handleSimpleChange(event, setInvoiceProduct)}
                        value={invoiceProduct.quantity}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="CreateTaxInvoiceProductModal">
                    Зберегти зміни
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default CreateTaxInvoiceProduct;
