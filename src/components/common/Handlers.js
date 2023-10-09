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

export {handleLeftClick, handleRightClick};
