
function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function getElementById(elements, elementId){
    for(let i=0; i<elements.length; i++){
        if (elements[i].id === elementId){
            return elements[i]
        }
    }
}

export {pad, getElementById};
