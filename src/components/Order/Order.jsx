import React from 'react';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import HOST from './../../Constants.js';
import CreateOrder from './CreateOrder';
import UpdateOrder from './UpdateOrder';
import CreateOrderProduct from './CreateOrderProduct';
import UpdateOrderProduct from './UpdateOrderProduct';
import DeleteOrder from './DeleteOrder';
import DeleteOrderProduct from './DeleteOrderProduct';

import {getInvoiceSum} from './../common/Func';

const Order = () => {
    const [order, setOrder] = React.useState({
        name: '', customer_id: '', created_at: ''
    });
    const [orderId, setOrderId] = React.useState();
    const [products, setProducts] = React.useState([]);
    const [productNumber, setProductNumber] = React.useState(0);
    const [updateProductShow, setUpdateProductShow] = React.useState(false);
    const [createProductShow, setCreateProductShow] = React.useState(false);
    const [createOrderShow, setCreateOrderShow] = React.useState(false);
    const [updateOrderShow, setUpdateOrderShow] = React.useState(false);
    const [deleteOrderShow, setDeleteOrderShow] = React.useState(false);
    const [deleteProductShow, setDeleteProductShow] = React.useState(false);
    const [updatedProduct, setUpdatedProduct] = React.useState({
        id: '',
        quantity: 0,
        price: 0,
        order_id: 1,
        name: '',
        code: '',
        currency: '',
        units: '',
    });
    const [deleteProductId, setDeleteProductId] = React.useState();
    const location = useLocation();
    const outerOrderId = location.state.orderId;
    if (!orderId && Boolean(outerOrderId)){
        setOrderId(outerOrderId)
    };
    const getOrder = async () => {
        await axios.get(
            `${HOST}/order/${orderId}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setOrder(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    const getOrderProducts = async () => {
        await axios.get(
            `${HOST}/orders-products/${orderId}/`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setProducts(response.data)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    const orderSum = getInvoiceSum(products);
    function handleUpdateClick(product) {
        setUpdatedProduct(product);
        setUpdateProductShow(true);
    };
    function handleDeleteClick(productId) {
        setDeleteProductId(productId);
        setDeleteProductShow(true);
    };
    React.useEffect(() => {
        if (Boolean(orderId)) getOrder()
    }, [orderId]);
    React.useEffect(() => {
        if (Boolean(orderId)) getOrderProducts()
    }, [orderId, productNumber]);
    React.useEffect(() => {
        if (!updateProductShow) setUpdatedProduct({
            id: '',
            quantity: 0,
            price: 0,
            order_id: 1,
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
                Замовлення №{order.name} від {order.created_at.slice(0, 10)}
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
            <div>Загальна сумма: {orderSum} грн</div>
            {!order.name && <Button
                                variant="primary"
                                onClick={() => setCreateOrderShow(true)}
                              >
                Створити замовлення
            </Button>}
            {Boolean(order.name) &&
                <Button
                    variant="primary"
                    onClick={() => setUpdateOrderShow(true)}
                >
                    Оновити замовлення
                </Button>
            }
            {Boolean(orderId) &&
                <Button
                    variant="primary"
                    onClick={() => setDeleteOrderShow(true)}
                >
                    Видалити замовлення
                </Button>
            }
            {Boolean(order.id) &&
                <Button
                    variant="primary"
                    onClick={() => setCreateProductShow(true)}
                >
                    Додати товар
                </Button>
            }
            {createOrderShow && <CreateOrder
                setOrder={setOrder}
                setOrderId={setOrderId}
                show={createOrderShow}
                setShow={setCreateOrderShow}
            />}
            {updateOrderShow && <UpdateOrder
                order={order}
                setOrder={setOrder}
                show={updateOrderShow}
                setShow={setUpdateOrderShow}
            />}
            {deleteOrderShow && <DeleteOrder
                orderId={orderId}
                show={deleteOrderShow}
                setShow={setDeleteOrderShow}
                setProductNumber={setProductNumber}
            />}
            {createProductShow && <CreateOrderProduct
                orderId={order.id}
                setProductNumber={setProductNumber}
                show={createProductShow}
                setShow={setCreateProductShow}
            />}
            {updateProductShow && <UpdateOrderProduct
                show={updateProductShow}
                setShow={setUpdateProductShow}
                product={updatedProduct}
                setProduct={setUpdatedProduct}
                setProductNumber={setProductNumber}
            />}
            {deleteProductShow && <DeleteOrderProduct
                show={deleteProductShow}
                setShow={setDeleteProductShow}
                productId={deleteProductId}
                setProductNumber={setProductNumber}
            />}
        </>
    );
};

export default Order;
