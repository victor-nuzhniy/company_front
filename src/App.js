import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {Route, Routes} from 'react-router-dom';
import React from 'react';
import MainContent from './components/MainContent';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import PrivateRoute from './components/auth/PrivateRoute';
import PurchaseInvoice from './components/Purchase/PurchaseInvoice';
import PurchaseInvoiceRegistry from './components/Purchase/PurchaseInvoiceRegistry';
import OrderRegistry from './components/Order/OrderRegistry';
import Order from './components/Order/Order';
import InvoiceRegistry from './components/Invoice/InvoiceRegistry';
import Invoice from './components/Invoice/Invoice';


function App() {

  return (
  <>
    <Routes>
        <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<MainContent />}>
                <Route index element={<PurchaseInvoiceRegistry />} />
                <Route path="purchase-invoice-registry" element={<PurchaseInvoiceRegistry />} />
                <Route path="order-registry" element={<OrderRegistry />} />
                <Route path="invoice-registry" element={<InvoiceRegistry />} />
                <Route path="purchase-invoice" element={<PurchaseInvoice state={{ purchaseInvoiceId: null}} />} />
                <Route path="order" element={<Order state={{ orderId: null }} />} />
                <Route path="invoice" element={<Invoice state={{ invoiceId: null}} />} />
            </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
    </Routes>
    </>
  );
}

export default App;
