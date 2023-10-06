import React from 'react';
import axios from 'axios';
import Login from './auth/Login';
import { Link, Outlet } from "react-router-dom";
import PurchaseInvoiceRegistry from './Purchase/PurchaseInvoiceRegistry';
import CreatePurchaseInvoice from './Purchase/CreatePurchaseInvoice';


const MainContent = (props) => {

    const token = localStorage.getItem('token')
    return(
        <>
            <Link to="purchase-invoice-registry">Purchase invoice registry</Link>
            <Link to="purchase-invoice" state={{ purchaseInvoiceId: ''}}>Purchase invoice</Link>
            <Outlet />
        </>
    )
}

export default MainContent;
