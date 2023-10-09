import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {getCounterparties} from './../common/DataGetters';
import {handleSimpleChange} from './../common/Handlers';

const UpdateOrder = (props) => {
    const [order, setOrder] = React.useState({
        name: '', customer_id: '', user_id: '', created_at: ''
    });
    const [customers, setCustomers] = React.useState([]);
    const [orderId, setOrderId] = React.useState()
    const handleClose = () => props.setShow(false);
    const sendOrder = async () => {
        await axios.put(
            `${HOST}/order/${props.order.id}/`,
            order,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            props.setOrder(response.data)
            props.setShow(false)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        })
    };
    function handleSubmit(event) {
        event.preventDefault()
        sendOrder()
    };
    React.useEffect(() => {getCounterparties(setCustomers)}, [])
    React.useEffect(() => {setOrder({
        name: props.order.name,
        customer_id: props.order.customer_id,
        user_id: props.order.user_id,
        created_at: props.order.created_at,
    })}, [props.order.name]);
    return(
        <Modal show={props.show} onHide={handleClose}>
             <Modal.Header closeButton>
              <Modal.Title>Оновити замовлення</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="UpdateOrderModal"
                >
                    <label htmlFor="idUpdateOrderName">Назва накладної</label>
                    <input
                        type="text"
                        name="name"
                        maxLength="100"
                        required
                        id="idUpdateOrderName"
                        onChange={(event) => handleSimpleChange(event, setOrder)}
                        value={order.name}
                    />
                    <label htmlFor="idUpdateCounterparty">Контрагент</label>
                    <select
                        name="customer_id"
                        value={order.customer_id}
                        id="idUpdateCounterparty"
                        onChange={(event) => handleSimpleChange(event, setOrder)}
                    >
                        {customers.map((customer, j) => {
                            return(
                                <option
                                    value={customer.id}
                                    key={j}
                                >
                                    {`${customer.name} ${customer.city} ${customer.country}`}
                                </option>
                            )
                        })}
                    </select>
                    <label htmlFor="idOrderCreatedAt">Створено</label>
                    <input
                        type="text"
                        name="created_at"
                        maxLength="30"
                        required
                        id="idOrderCreatedAt"
                        onChange={(event) => handleSimpleChange(event, setOrder)}
                        value={order.created_at}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="UpdateOrderModal">
                    Зберегти зміни
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateOrder;
