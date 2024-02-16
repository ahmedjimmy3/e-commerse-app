export  function calcSubTotal(userCart){
    let newSubTotal = 0
    for (const pro of userCart.products) {
        newSubTotal += pro.finalPrice
    }
    return newSubTotal
}