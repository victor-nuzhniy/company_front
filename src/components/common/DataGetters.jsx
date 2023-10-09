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

export {getName, getCounterparties};