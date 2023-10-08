
function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
};

function getElementById(elements, elementId){
    for(let i=0; i<elements.length; i++){
        if (elements[i].id === elementId){
            return elements[i]
        };
    };
};

function getInvoiceSum(products){
    let invoiceSum = 0
    products.map((product) => invoiceSum += product.price * product.quantity)
    return (invoiceSum / 100).toFixed(2)
};

export {pad, getElementById, getInvoiceSum};
