import React from 'react';
import { Link, Outlet } from "react-router-dom";


const MainContent = (props) => {

    return(
        <>
            <Link to="purchase-invoice-registry">Purchase invoice registry</Link>
            <Link to="purchase-invoice" state={{ purchaseInvoiceId: ''}}>Purchase invoice</Link>
            <Outlet />
        </>
    )
}

export default MainContent;
