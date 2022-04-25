$(document).ready(function () {
    if (!isUserLoggedIn()) redirectToLogin();
    checkuser();
    updateCartQuantity();
    setDateTime();
    $('[data-tooltip="tooltip"]').tooltip();

    setLoggedInUser();

});
function logout() {
    window.localStorage.removeItem("user");
    window.location.href = "../html/login.html";
}
function getUserKey() {
    return 'user';
}

function getCartKey() {
    return 'cart_items';
}

function getUser() {
    try {
        const user = JSON.parse(localStorage.getItem(getUserKey()));
        return user;

    } catch (err) {
        logout();
    }
}

function setLoggedInUser() {
    const users = getUser();
    fetch("../assets/creds.json").then(response => {
        return response.json();
    }).then(data => {
        for (const key of data) {
            if (key.id == users) {
                $("#user-name").text("Hi, " + key.name);
                break;
            }
        }
    });
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
    window.location.href = './login.html';
}

function redirectToHome() {
    window.location.href = './product.html';
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
        }));
}

async function setCartItems(items) {
    await checkuser();
    if (!checkSession()) return;

    const cartMap = getCartMap();
    const user = getUser();

    cartMap[user] = items;
    localStorage.setItem(getCartKey(), JSON.stringify(cartMap));
    updateCartQuantity();
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
        return itemMap.hasOwnProperty(user) ? itemMap[user] : [];
    } catch (err) {
        return [];
    }
}
var totalQuantity = 0;
async function updateCartQuantity() {
    await checkuser();
    if (!checkSession()) return;

    const cartItems = getCartItems();
    totalQuantity = cartItems.reduce((accr, curr) => accr += curr.quantity, 0);

    $('.cart-quantity').text(totalQuantity);
    $('#total-items').text(totalQuantity);

}


async function addToCart(productId, quantity) {
    await checkuser();
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

    showSuccess("Product added successfully");
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

async function deletethis(products, productId) {
    await checkuser();
    if (!checkSession()) return;
    let cartItems = getCartItems();

    cartItems = cartItems.filter(item => item.id !== productId);
    setCartItems(cartItems);
    $('#product-list').find('#' + productId).first().remove();

    // Setting the total item value
    $('#total-items').text(totalQuantity || 0);
    // Updating the payment info to consolidate the removed product.
    updatePayment(products, cartItems);

    // Removing payment section from view if the cart is empty
    if (!cartItems.length) removePaymentSection();

    $('.cart-quantity').text(totalQuantity || 0);
    showSuccess("Product removed.");

}
async function checkuser() {
    const user = getUser();
    let response = await fetch("../assets/creds.json");
    let data = await response.json();
    let valid = true;
    for (const key of data) {
        if (key.id == user) {
            valid = false;
            break;
        }
    }
    if (valid) {
        logout();
    }
}
