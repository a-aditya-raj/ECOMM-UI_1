const params = new URLSearchParams(window.location.search);
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

  }
  else {
    const item = $('#product');
    item.removeClass('d-none');
    item.find('#pImage').attr('src', prod.imageUrl);
    item.find('#pBrand').text(prod.brand);
    item.find('#pName').text(prod.name);
    item.find('#pPrice').text("Rs " + prod.mrp);
    item.find('#pDescr').text(prod.description);
    $('.info').append(item);
  }
}