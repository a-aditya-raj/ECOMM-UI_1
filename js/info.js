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
function getProduct(data) {
  var product = JSON.parse(data);
  for (let p of product) {
    if (p.id === id) {
      prod = p;
      break;
    }
  }
  if (prod == undefined) {
    $('#noprod').removeClass('d-none');
    setTimeout(redirectToHome, 5000);
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
    'click': () => {
      const quantity = Number($('#quant').val());
      console.log(quantity);
      addToCart(id, quantity);
    }
  });
}

function redirectToHome() {
  window.location.href = "../index.html";
}