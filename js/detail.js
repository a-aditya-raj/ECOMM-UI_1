const params = new URLSearchParams(window.location.search);
var url = window.location.href;
var id = params.get("id");
var prod;
fetch("../assets/available-inventory.json").then(response => {
  return response.json();
}).then(data => {
  creds = JSON.stringify(data);
  getProduct(creds);
});
async function getProduct(data) {
  await checkuser();
  if (!checkSession()) return;
  var product = JSON.parse(data);
  for (let p of product) {
    if (p.id == id) {
      prod = p;
      break;
    }
  }
  if (prod == undefined) {
    $('#noprod').removeClass('d-none');
  }
  else {
    $('#noprod').addClass('d-none');
    const item = $('.container');
    item.removeClass('d-none');
    const carousel = $('.carousel-inner');
    const carouselItem = $('.carousel-inner').find('.carousel-item').first();

    $.each(prod.images, (i, image) => {
      const clone = carouselItem.clone().removeClass('d-none');
      clone.find('img').attr('src', image);
      if (i === 0) clone.addClass('active');
      carousel.append(clone);
    });

    carouselItem.remove();
    item.find('input').attr('value', getQuant(prod.id));
    if (getQuant(prod.id) < 1) {
      item.find('#decreasebtn').prop('disabled', true);
    }
    item.find('#inputquantity').text(getQuant(prod.id));
    item.find('#product-image').attr('src', prod.imageUrl);
    item.find('#product-brand').text(prod.brand);
    item.find('#product-name').text(prod.name);
    item.find('.size').text(prod.size);
    item.find('#mrp').text(prod.mrp);
    item.find('#description').text(prod.description);
    item.find('#material').text(prod.material);
    item.find('#care').text(prod.care);
    $('.info').append(item);
  }
  // $('form').on('submit', (event) => {
  //   const quantity = Number($('#quantity').val());
  //   addToCart(id, quantity);
  // });
  $('#add-to-cart-btn').on({
    'click': async function () {
      await checkuser();
      if (!checkSession()) return;
      const quantity = Number($('#quant').val());
      addToCart(prod.id, quantity);
    }
  });

  $('#increasebtn').on({
    'click': async function () {
      await checkuser();
      if (!checkSession()) return;
      const quantity = Number($('#quant').val());
      addToCart(prod.id, quantity);
      $('#inputquantity').text(quantity);
      $('#decreasebtn').prop('disabled', false);
    }
  });
  $('#decreasebtn').on({
    'click': async function () {
      await checkuser();
      if (!checkSession()) return;
      const quantity = Number($('#quant').val());
      if (quantity == 0) {
        removethis(prod.id);
        $('#decreasebtn').prop('disabled', true);
      }
      else {
        addToCart(prod.id, quantity);
      }
      $('#inputquantity').text(quantity);
    }
  });
}

function redirectToHome() {
  window.location.href = "./product.html";
}

async function removethis(id) {
  await checkuser();
  if (!checkSession()) return;
  let cartItems = getCartItems();

  cartItems = cartItems.filter(item => item.id !== id);
  setCartItems(cartItems);
  $('.cart-quantity').text(totalQuantity || 0);
  showSuccess("Product removed.");
}