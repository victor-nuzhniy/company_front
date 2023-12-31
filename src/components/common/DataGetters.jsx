import axios from 'axios';
import HOST from './../../Constants.js';
import {pad} from './../common/Func';


async function getName(moduleName, setData, letter) {
    await axios.get(
        `${HOST}/account/${moduleName}/`,
        {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
        ).then((response) => {
            setData(prev => ({
                ...prev, name: `${letter}-${pad(response.data.number, 10)}`
            }))
        }).catch((error) => {
            console.log("Something went wrong. May be auth token is invalid.")
        });
};

async function getCounterparties(setData) {
    await axios.get(
        `${HOST}/counterparty/`,
        {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
    ).then((response) => {
        setData(response.data)
    }).catch((error) => {
        console.log("Something went wrong. May be auth token is invalid.")
    });
};

async function getProducts(setData) {
    await axios.get(
        `${HOST}/product/`,
        {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
    ).then((response) => {
        setData(response.data)
    }).catch((error) => {
        console.log("Something went wrong. May be auth token is invalid.")
    });
}

async function getAgreements(elemId, setValue) {
    let url = Boolean(elemId) ? `agreements/${elemId}` : 'agreement'
    await axios.get(
        `${HOST}/${url}/`,
        {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
    ).then((response) => {
        setValue(response.data)
    }).catch((error) => {
        console.log("Something went wrong. May be auth token is invalid.")
    })
};

async function getOrders(elemId, setValue) {
    let url = Boolean(elemId) ? `orders/${elemId}` : 'order'
    await axios.get(
        `${HOST}/${url}/`,
        {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
    ).then((response) => {
        setValue(response.data)
    }).catch((error) => {
        console.log("Something went wrong. May be auth token is invalid.")
    })
}

async function getInvoices(elemId, setValue) {
    let url = Boolean(elemId) ? `invoices/${elemId}` : 'invoice'
    await axios.get(
        `${HOST}/${url}/`,
        {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
    ).then((response) => {
        setValue(response.data)
    }).catch((error) => {
        console.log("Something went wrong. May be auth token is invalid.")
    })
}

async function getInstance(url, setValue) {
    await axios.get(
        `${HOST}/${url}/`,
        {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},
    ).then((response) => {
        setValue(response.data)
    }).catch((error) => {
        console.log("Something went wrong. May be auth token is invalid.")
    })
};

export {
    getName, getCounterparties, getProducts, getAgreements, getOrders, getInstance, getInvoices
    };