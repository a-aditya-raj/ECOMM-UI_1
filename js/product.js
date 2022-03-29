let results = 0;
let filterList = [];
let sort = 0;


$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();

  $.getJSON("assets/available-inventory.json", function (products) {
    let filterProducts = [...products];
    results = 0;
    getlist(products);

    fillfilters(products);

    $('#filters input[type="checkbox"]').change(function () {
      if (this.checked) {
        filterList.push($(this).attr("id"));
      }
      else if (!this.checked) {
        var i = filterList.indexOf($(this).attr("id"));
        if (i !== -1) {
          filterList.splice(i, 1);
        }
      }

      if (filterList.length) {
        filterProducts = products.filter((product) => filterList.includes(product.brand));
      }
      else {
        filterProducts = products;
      }
      results = 0;
      $('#list-container').children("*").not("#demo").remove();
      if (sort === 1) {
        let sortProducts = [...filterProducts];
        sortProducts.sort(function (a, b) {
          return a.mrp - b.mrp;
        });
        getlist(sortProducts);
      }
      else {
        getlist(filterProducts);
      }
    });
    if (sort === 1) {
      $('#list-container').children("*").not("#demo").remove();
      results = 0;
      getlist(sortProducts);
    }
    $('#sort').on({
      'click': () => {
        let sortProducts = [...filterProducts];
        sortProducts.sort(function (a, b) {
          return a.mrp - b.mrp;
        });
        if (sort === 0) {
          sort += 1;
          $('#sort').find('h6').addClass('bg-primary');
          $('#sort').find('h6').addClass('text-white');
          $('#list-container').children("*").not("#demo").remove();
          results = 0;
          getlist(sortProducts);
        }
        else if (sort === 1) {
          sort = 0;
          $('#sort').find('h6').removeClass('bg-primary');
          $('#sort').find('h6').removeClass('text-white');
          $('#list-container').children("*").not("#demo").remove();
          results = 0;
          getlist(filterProducts);
        }
      }
    });
  });
});

function fillfilters(product) {
  const brands = [...new Set(product.map((item) => item.brand))];
  const dummy = $('#filter-list');
  brands.forEach(brand => {
    const list = dummy.clone();
    list.removeClass('d-none');
    list.find('input').attr('id', brand);
    list.find('label').attr('for', brand).text(brand);
    $('#brands').append(list);
  })
}

function getlist(creds) {
  // var prod = filterList(creds);
  var products = creds;
  const dummy = $('#product-list');
  products.forEach(product => {
    results++;
    const item = dummy.clone();

    item.attr('id', "item" + product.id);
    item.find('#link1').attr('id', product.id);
    item.find('#link2').attr('id', product.id);
    item.find('.cart-section').attr('id', 'cart-section-' + product.id);
    item.find('input').attr('id', 'input' + product.id);

    const n = getQuant(product.id);

    item.find('input').attr('value', n);
    item.find('#addbtn').attr('id', 'addbtn' + product.id);
    item.find('img').attr('src', product.imageUrl);
    item.find('.product-brand').text(product.brand);
    item.find('.product-name').text(product.name);
    item.find('.product-size').text(product.size);
    item.find('.product-mrp').text(product.mrp);
    $('#list-container').append(item);

    $('#' + product.id).on({
      'click': () => window.location.href = "./html/info.html?id=" + (product.id)
    });

    $('#addbtn' + product.id).on({
      'click': () => {
        const quantity = Number($('#input' + product.id).val());
        addToCart(product.id, quantity);

      }
    });
  });

  $(".result").text(results);
}
let show = 0;
let showFilter = 0;

if ($(window).width() < 768){
  showFilter=1;
  show=1;
}
else{
  showFilter=0;
  show=0;
}
if(show===0){
  $('#icon2').text("-");
  $('ul').removeClass('d-none');
}
if(showFilter===0){
  $('#icon1').text("-");
  $('#Filter').removeClass('d-none');
}

if(show===1){
  $('#icon2').text("+");
  $('ul').addClass('d-none');
}
if(showFilter===1){
  $('#icon1').text("+");
  $('#Filter').addClass('d-none');
}
$('#showFilters').on({
  'click': () => {
    if(showFilter===0){
      showFilter++;
      $('#icon1').text("+");
      $('#Filter').addClass('d-none');
    }
    else{
      showFilter--;
      $('#icon1').text("-");
      $('#Filter').removeClass('d-none');
    }
  }
})

$('#showBrand').on({
  'click': () => {
    if(show===0){
      show++;
      $('#icon2').text("+");
      $('ul').addClass('d-none');
    }
    else{
      show--;
      $('#icon2').text("-");
      $('ul').removeClass('d-none');
    }
  }
});