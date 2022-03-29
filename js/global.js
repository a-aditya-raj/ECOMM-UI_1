$(document).ready(function () {
    if (!isUserLoggedIn()) redirectToLogin();
    updateCartQuantity();
    setInterval(setDateTime, 1000);
    $('[data-tooltip="tooltip"]').tooltip();
    setLoggedInUser();
});
function logout() {
    window.localStorage.removeItem("user");
    window.location.href = "../html/login.html";
}
function logout1() {
    window.localStorage.removeItem("user");
    window.location.href = "./html/login.html";
}
function getUserKey() {
    return 'user';
}

function getCartKey() {
    return 'cart_items';
}

function getUser() {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user;
    } catch (err) {
        return void 0;
    }
}

function setLoggedInUser() {
    const user = getUser();
    $('#user-name').text(user.name).removeClass('d-none');
}

function isUserLoggedIn() {
    const user = getUser();
    return !!user;
}

function checkSession() {
    if (!isUserLoggedIn()) {
        showError('User not logged in');
        setTimeout(redirectToLogin, 1500);
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem(getUserKey());
    redirectToLogin();
}


function redirectToLogin() {
    window.location.href = '../html/login.html';
}

function redirectToHome() {
    window.location.href = '/';
}

// To set the current date-time
function setDateTime() {
    $('#date-time')
        .text(new Date().toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            year: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }));
}

function setCartItems(items) {
    const cartMap = getCartMap();
    const user = getUser();

    cartMap[user.id] = items;
    localStorage.setItem(getCartKey(), JSON.stringify(cartMap));
}

// returning the cart map or an empty map if lcoalstorage is empty
function getCartMap() {
    try {
        return JSON.parse(localStorage.getItem(getCartKey())) || {};
    } catch (err) { return {}; }
}

function getCartItems() {
    try {
        const itemMap = getCartMap();
        const user = getUser();
        return itemMap.hasOwnProperty(user.id) ? itemMap[user.id] : [];
    } catch (err) {
        return [];
    }
}
var totalQuantity = 0;
function updateCartQuantity() {
    const cartItems = getCartItems();
    totalQuantity = cartItems.reduce((accr, curr) => accr += curr.quantity, 0);

    $('.cart-quantity').text(totalQuantity);

}


function addToCart(productId, quantity) {
    if (!checkSession()) return;

    if (quantity < 1) {
        showError('Quantity should be atleast 1');
        return;
    }

    const cartItems = getCartItems();

    if (cartItems.length) {
        const index = cartItems.findIndex(item => item.id === productId);
        if (index >= 0) {
            if (cartItems[index].quantity == undefined) {
                cartItems[index].quantity = quantity;
                setCartItems(cartItems);
    
                updateCartQuantity();
                showSuccess('Product added successfully');
                return;
            }
            else {
                cartItems[index].quantity = quantity;
                setCartItems(cartItems);
    
                updateCartQuantity();
                showSuccess('Product updated successfully');
                return;
            }
        }
    }
    cartItems.push({
        id: productId,
        quantity
    });
    setCartItems(cartItems);

    updateCartQuantity();
    showSuccess('Product added successfully');
}

function getQuant(id) {
    let quant = 0;
    const cartItems = getCartItems();

    if (cartItems.length) {
        const index = cartItems.findIndex(item => item.id === id);
        if (index >= 0) {
            quant = cartItems[index].quantity;
        }
    }
    return quant;
}
