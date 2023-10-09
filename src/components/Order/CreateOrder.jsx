import React from 'react';
import axios from 'axios';
import { Button, Form, Modal } from "react-bootstrap";
import HOST from './../../Constants.js';
import {pad} from './../common/Func';
import {handleSimpleChange} from './../common/Handlers';
import {getName, getCounterparties} from './../common/DataGetters';


const CreateOrder = (props) => {
    const [order, setOrder] = React.useState({
        name: '', customer_id: '', user_id: '', created_at: ''
    });
    const [customers, setCustomers] = React.useState([]);
    const handleClose = () => props.setShow(false);
    const sendOrder = async () => {
        await axios.post(
            `${HOST}/user-order/`,
            order,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            props.setOrder(response.data)
            props.setOrderId(response.data.id)
            props.setShow(false)
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
    };
    function handleSubmit(event) {
        event.preventDefault();
        sendOrder();
    };
    React.useEffect(() => {getName('Order', setOrder, 'O')}, []);
    React.useEffect(() => {getCounterparties(setCustomers)}, []);
    return (
        <Modal show={props.show} onHide={handleClose}>
             <Modal.Header closeButton>
                <Modal.Title>Створити замовлення</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column"
                    id="CreateOrderModal"

                >
                    <label htmlFor="idOrderName">Назва накладної</label>
                    <input
                        type="text"
                        name="name"
                        maxLength="100"
                        required
                        id="idPurchaseInvoiceName"
                        placeholder="Назва замовлення"
                        onChange={(event) => handleSimpleChange(event, setOrder)}
                        value={order.name}
                    />
                    <label htmlFor="idCustomerId">Замовник</label>
                    <select
                        name="customer_id"
                        id="idCustomerId"
                        onChange={(event) => handleSimpleChange(event, setOrder)}
                        value={order.customer_id}
                    >
                        <option>Вибрати замовника</option>
                        {customers.map((customer, i) => {
                            return(
                                <option
                                    value={customer.id}
                                    key={i}
                                >{customer.name}</option>
                            )
                        })}
                    </select>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="primary" type="submit" form="CreateOrderModal">
                    Зберегти
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateOrder;
