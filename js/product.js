
fetch("../assets/available-inventory.json").then(response => {
  return response.json();
}).then(data => {
  creds = JSON.stringify(data);
  getlist(creds);
});
function getlist(creds) {
  var products = JSON.parse(creds);
  const dummy = $('#dummyProduct');
  var url = "./info.html?id="
  products.forEach(product => {
    const item = dummy.clone();
    item.removeClass('d-none');
    item.find('#getId').attr('href',url + product.id)
    item.find('img').attr('src', product.imageUrl);
    item.find('#product-brand').text(product.brand);
    item.find('#product-name').text(product.name);
    item.find('#product-price').text("Rs. " + product.mrp);
    $('.card-deck').append(item);
  });

}

