import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {handleSimpleChange} from './../common/Handlers';
import {getProducts} from './../common/DataGetters';

const CreateOrderProduct = (props) => {
    const [orderProduct, setOrderProduct] = React.useState({
        product_id: '',
        quantity: '',
        price: '',
        order_id: '',
    });
    const [products, setProducts] = React.useState([])
    const handleClose = () => props.setShow(false);
    const sendOrderProduct = async () => {
        await axios.post(
            `${HOST}/order-product/`,
            orderProduct,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setOrderProduct({
                product_id: '',
                quantity: '',
                price: '',
                order_id: '',
            })
            props.setProductNumber(prev => (prev + 1))
            props.setShow(false)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    function handleSubmit(event) {
        event.preventDefault();
        setOrderProduct(prev => ({
            ...prev,
            price: prev.price * 100,
            order_id: props.orderId
        }));
    };
    React.useEffect(() => {getProducts(setProducts)}, []);
    React.useEffect(() => {
        if (Boolean(orderProduct.order_id)) sendOrderProduct()
    }, [orderProduct.order_id]);
    return (
        <Modal show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Додати товар</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="CreateOrderProductModal"
                >
                    <label htmlFor="idProduct">Код та найменування товару</label>
                    <select
                        name="product_id"
                        id="idProduct"
                        onChange={(event) => handleSimpleChange(event, setOrderProduct)}
                        value={orderProduct.product_id}
                    >
                        <option>Вибрати продукт</option>
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
                    <label htmlFor="idQuantity">Кількість</label>
                    <input
                        type="number"
                        name="quantity"
                        required
                        min="0"
                        id="idQuantity"
                        placeholder="Кількість"
                        onChange={(event) => handleSimpleChange(event, setOrderProduct)}
                        value={orderProduct.quantity}
                    />
                    <label htmlFor="idPrice">Ціна</label>
                    <input
                        type="number"
                        name="price"
                        required
                        step="0.01"
                        min="0"
                        id="idPrice"
                        placeholder="Ціна"
                        onChange={(event) => handleSimpleChange(event, setOrderProduct)}
                        value={orderProduct.price}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="CreateOrderProductModal">
                    Зберегти зміни
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default CreateOrderProduct;
