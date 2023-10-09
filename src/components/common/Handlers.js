function handleLeftClick(pagination, setPagination) {
    if (pagination.offset > 0) {
        setPagination(prevPagin => ({
            ...prevPagin,
            offset: prevPagin.offset - prevPagin.limit > 0 ? prevPagin.offset - prevPagin.limit : 0,
        }));
    };
};

function handleRightClick(pagination, setPagination, array){
    if (array.length % pagination.limit === 0) {
        setPagination(prevPagin => ({
            ...prevPagin,
            offset: prevPagin.offset + prevPagin.limit
        }));
    };
};

function handleSimpleChange(event, setValue){
    const {name, value} = event.target;
    setValue(prev => ({...prev, [name]: value}));
};

function handleProductChange(event, setValue) {
    const {name, value} = event.target
    setValue(prev => ({...prev, [name]: name === "price" ? value * 100 : value}))
};

export {handleLeftClick, handleRightClick, handleSimpleChange, handleProductChange};
