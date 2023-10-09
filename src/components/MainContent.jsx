import React from 'react';
import { Link, Outlet } from "react-router-dom";


const MainContent = (props) => {

    return(
        <>
            <Link to="purchase-invoice-registry">Реєстр прибуткових накладних</Link>
            <Link to="order-registry">Реєстр замовлень</Link>
            <Outlet />
        </>
    )
}

export default MainContent;
