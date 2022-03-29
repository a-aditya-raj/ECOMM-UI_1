$(document).ready(() => {
    const cartItems = getCartItems();

    if (!cartItems?.length) {
        $('.container').removeClass('d-none');
        removePaymentSection();
        return;
    }

    // Initializing the payment info
    const paymentInfo = {
        total: 0,
        gst: 0,
        subtotal: 0,
    };

    // Getting all the products
    $.getJSON('../assets/available-inventory.json', (products) => {
        const productList = $('#product-list');
        const entry = $('.product').first();

        // Traversing through all the values of the cart
        $.each(cartItems, (i, cartItem) => {
            // Checking if the product id is still present in our inventory
            const product = products.find(value => value.id === cartItem.id);

            // Doing all the operations only if the product is present and the quantity is greater than 0
            if (product && cartItem?.quantity > 0) {
                const clone = entry.clone();
                clone.removeClass('d-none');

                // Setting a custom id to be used to find the product
                clone.attr('id', product.id);

                // Attaching id and event handlers to delete the product
                clone.find('.fa-trash-alt').attr('id', 'delete-' + product.id, 'data-product-id', product.id).on({
                    'click': () => deleteProduct(products, product.id)
                });

                // Adding the attributes and values of the product in the cloned element
                clone.find('img').attr('src', product?.imageUrl || '');
                clone.find('.product-brand').text(product?.brand || '');
                clone.find('.product-name').text(product?.name || '');
                clone.find('.product-size').text(product?.size || '');
                clone.find('.product-mrp').text(product?.mrp || 0);
                clone.find('#product-quantity').attr('value', cartItem.quantity);
                clone.find('#product-quantity').attr('id', 'product-quantity' + product.id);
                clone.find('#update').attr('id', 'update' + product.id);

                // Appnding the cloned element in the list
                productList.append(clone);

                // Calculating subtotal
                paymentInfo.subtotal += ((product?.mrp || 0) * Number(cartItem?.quantity || 0));

                $('#update' + product.id).click(() => {
                    const quantity = Number($('#product-quantity' + product.id).val());
                    addToCart(product.id, quantity);
                    $('#total-items').text(totalQuantity || 0);
                })
            }
        });

        // Removing the dummy element from the list
        entry.remove();

        // Setting the total item value
        $('#total-items').text(totalQuantity || 0);

        // Payment Calculation
        paymentInfo.gst = +(0.14 * paymentInfo.subtotal).toFixed(2);
        paymentInfo.total = +(paymentInfo.subtotal + paymentInfo.gst).toFixed(2);

        // Adding the payment values in the view
        $('#subtotal').text(paymentInfo.subtotal);
        $('#gst').text(paymentInfo.gst);
        $('#total').text(paymentInfo.total);

        $('#place-order').click(() => {
            if (!checkSession()) return;
            downloadOrder(products);
        });
        // Showing the page when the page is completly loaded and filled with data.
        $('.container').removeClass('d-none');
    });

});

function deleteProduct(products, productId) {
    if (!checkSession()) return;

    // Updating the local storage after removing the product.
    let cartItems = getCartItems();

    cartItems = cartItems.filter(item => item.id !== productId);
    setCartItems(cartItems);

    // Removing the deleted product from the view
    $('#product-list').find('#' + productId).first().remove();

    // Setting the total item value
    $('#total-items').text(cartItems?.length || 0);

    // Updating the payment info to consolidate the removed product.
    updatePayment(products, cartItems);

    // Removing payment section from view if the cart is empty
    if (!cartItems.length) removePaymentSection();

    // Showing success message
    showSuccess('Product deleted successfully');
}

function removePaymentSection() {
    $('#payment-section').addClass('d-none');
    $('#no-product').removeClass('d-none');
}

function updatePayment(products, cartItems) {
    const paymentInfo = {
        total: 0,
        gst: 0,
        subtotal: 0,
    };

    cartItems.map(item => {
        const product = products.find(prod => prod.id === item.id);

        // Calculating subtotal
        paymentInfo.subtotal += ((product?.mrp || 0) * Number(item?.quantity || 0));
    });

    paymentInfo.gst = +(0.14 * paymentInfo.subtotal).toFixed(2);
    paymentInfo.total = +(paymentInfo.subtotal + paymentInfo.gst).toFixed(2);

    // Adding the payment values in the view
    $('#subtotal').text(paymentInfo.subtotal);
    $('#gst').text(paymentInfo.gst);
    $('#total').text(paymentInfo.total);
}

function downloadOrder(productsList) {
    const cartItems = getCartItems();

    if (!cartItems.length) {
        showError('No products added. Please add more products to place an order');
        return;
    }
    const fields = ["brand", "name", "clientSkuId", "size", "mrp"];

    // creating an array of products based on the fields.
    const products = cartItems.map(item => {
        const temp = {};
        const product = productsList.find(product => product.id === item.id);

        for (field of fields) temp[field] = product[field];

        temp.quantity = item.quantity;
        temp.subtotal = product.mrp * item.quantity;
        temp.gst = +(temp.subtotal * 0.14).toFixed(2);
        temp.total = +(temp.subtotal + temp.gst).toFixed(2);

        return temp;
    });

    // Sorting in ascending order
    products.sort((a, b) => a.id - b.id);

    // unparsing into csv
    const csv = Papa.unparse(products);

    // converting to a blob file
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let csvURL = null;
    if (navigator.msSaveBlob) {
        csvURL = navigator.msSaveBlob(csvData, 'order.csv');
    } else {
        csvURL = window.URL.createObjectURL(csvData);
    }

    // creating a temporary element to mock a click and download the file.
    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'order.csv');
    tempLink.click();
    // deleteAll();
    showSuccess('Order placed successfully');

}
function deleteAll() {
    const list = getCartItems();

}