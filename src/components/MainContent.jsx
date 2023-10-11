import React from 'react';
import { Link, Outlet } from "react-router-dom";


const MainContent = (props) => {

    return(
        <>
            <Link to="purchase-invoice-registry">Реєстр прибуткових накладних</Link>
            <Link to="order-registry">Реєстр замовлень</Link>
            <Link to="invoice-registry">Реєстр рахунків</Link>
            <Link to="sale-invoice-registry">Реєстр видаткових накладних</Link>
            <Outlet />
        </>
    )
}

export default MainContent;
