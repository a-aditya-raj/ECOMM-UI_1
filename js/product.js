let results = 0;
let filterList = [];
let sort = 0;
let filterProducts = [];
let sortProducts = [];
let productList = [];

$(document).ready(function () {
  if (!checkSession()) return;
  $('[data-toggle="tooltip"]').tooltip();

  $.getJSON("../assets/available-inventory.json", function (products) {
    productList = products;
    filterProducts = [...products];
    sortProducts = [...filterProducts];
    getlist(products);

    fillfilters(products);
    
  });
  $('#filters input[type="checkbox"]').change(function () {
    if (!checkSession()) return;

    if (this.checked) {
      filterList.push($(this).attr("id"));
    }
    else if (!this.checked) {
      let i = filterList.indexOf($(this).attr("id"));
      if (i !== -1) {
        filterList.splice(i, 1);
      }
    }
    if (filterList.length) {
      filterProducts = prod.filter((product) => filterList.includes(product.brand));
    }
    else {
      filterProducts = [...productList];
    }
    sortProducts = [...filterProducts];

    if (sort == 1) {
      sortProducts.sort((a, b) => (a.mrp > b.mrp ? 1 : -1));
      getlist(sortProducts);
    } else if (sort == 2) {
      sortProducts.sort((a, b) => (a.mrp < b.mrp ? 1 : -1));
      getlist(sortProducts);
    }
    else if (sort == 0) {
      sortProducts = [...filterProducts];
      getlist(sortProducts);
    }

    $("select").on("change", function (e) {
      if (!checkSession()) return;
      let optionSelected = $("option:selected", this);
      let valueSelected = this.value;
      sort = valueSelected;
      if (valueSelected == 1) {
        sortProducts.sort((a, b) => (a.mrp > b.mrp ? 1 : -1));
      } else if (valueSelected == 2) {
        sortProducts.sort((a, b) => (a.mrp < b.mrp ? 1 : -1));
      }
      else if (valueSelected == 0) {
        sortProducts = [...filterProducts];
      }
      getlist(sortProducts);
    });
  });

  $('#clear-filters').click(() => {
    if (!checkSession()) return;
    filterList = [];
    fillfilters(productList);
    filterProducts = [...productList];
    sortProducts = [...productList];
    getlist(filterProducts);
  });
  if (sort == 1) {
    sortProducts.sort((a, b) => (a.mrp > b.mrp ? 1 : -1));
    getlist(sortProducts);
  } else if (sort == 2) {
    sortProducts.sort((a, b) => (a.mrp < b.mrp ? 1 : -1));
    getlist(sortProducts);
  }
  else if (sort == 0) {
    sortProducts = [...filterProducts];
    getlist(sortProducts);
  }
  $("select").on("change", function (e) {
    if (!checkSession()) return;
    let optionSelected = $("option:selected", this);
    let valueSelected = this.value;
    sort = valueSelected;
    if (valueSelected == 1) {
      sortProducts.sort((a, b) => (a.mrp > b.mrp ? 1 : -1));
    } else if (valueSelected == 2) {
      sortProducts.sort((a, b) => (a.mrp < b.mrp ? 1 : -1));
    }
    else if (valueSelected == 0) {
      sortProducts = [...filterProducts];
    }
    getlist(sortProducts);
  });

});

function fillfilters(products) {
  $('#brands').children("*").not("#filter-list").remove();
  const brands = [...new Set(products.map((item) => item.brand))];
  const dummy = $('#filter-list');
  brands.forEach(brand => {
    const list = dummy.clone();
    list.attr('id', 'filter' + brand);
    list.removeClass('d-none');
    list.find('input').attr('id', brand);
    list.find('label').attr('for', brand).text(brand);
    $('#brands').append(list);
  });
  $('#filters input[type="checkbox"]').change(function () {
    if (!checkSession()) return;

    if (this.checked) {
      filterList.push($(this).attr("id"));
    }
    else if (!this.checked) {
      let i = filterList.indexOf($(this).attr("id"));
      if (i !== -1) {
        filterList.splice(i, 1);
      }
    }
    if (filterList.length) {
      filterProducts = products.filter((product) => filterList.includes(product.brand));
    }
    else {
      filterProducts = [...products];
    }
    sortProducts = [...filterProducts];

    if (sort == 1) {
      sortProducts.sort((a, b) => (a.mrp > b.mrp ? 1 : -1));
      getlist(sortProducts);
    } else if (sort == 2) {
      sortProducts.sort((a, b) => (a.mrp < b.mrp ? 1 : -1));
      getlist(sortProducts);
    }
    else if (sort == 0) {
      sortProducts = [...filterProducts];
      getlist(sortProducts);
    }
    $("select").on("change", function (e) {
      if (!checkSession()) return;
      let optionSelected = $("option:selected", this);
      let valueSelected = this.value;
      sort = valueSelected;
      if (valueSelected == 1) {
        sortProducts.sort((a, b) => (a.mrp > b.mrp ? 1 : -1));
      } else if (valueSelected == 2) {
        sortProducts.sort((a, b) => (a.mrp < b.mrp ? 1 : -1));
      }
      else if (valueSelected == 0) {
        sortProducts = [...filterProducts];
      }
      getlist(sortProducts);
    });
  });
}

async function getlist(creds) {
  await checkuser();
  $('#list-container').children("*").not("#demo").remove();
  $('#filtername').children("*").not("#filterx").remove();
  const filterdummy = $('#filterx');
  if (filterList.length) {
    $('#appfilt').removeClass('d-none');
  }
  else {
    $('#appfilt').addClass('d-none');
  }
  filterList.forEach(filter => {
    const clone = filterdummy.clone();
    clone.removeClass('d-none');
    clone.attr('id', filter);
    clone.find('span').text(filter);
    $('#filtername').append(clone);
  });
  let products = creds;

  if (sort == 1) {
    products.sort((a, b) => (a.mrp > b.mrp ? 1 : -1));
  }
  else if (sort == 2) {
    products.sort((a, b) => (a.mrp < b.mrp ? 1 : -1));
  }

  results = 0;
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
    item.find('#inputquantity').text(n);
    item.find('#inputquantity').attr('id', 'inputquantity' + product.id);
    item.find('#increasebtn').attr('id', 'increasebtn' + product.id);
    item.find('#decreasebtn').attr('id', 'decreasebtn' + product.id);
    item.find('#addbtn').attr('id', 'addbtn' + product.id);
    if (n < 1) {
      item.find('#decreasebtn' + product.id).prop('disabled', true);
      item.find('#cart-section-' + product.id).removeClass('d-flex').addClass('d-none');
      item.find('#addbtn' + product.id).removeClass('d-none');
    }
    item.find('img').attr('src', product.imageUrl);
    item.find('.product-brand').text(product.brand);
    item.find('.product-name').text(product.name);
    item.find('.product-size').text(product.size);
    item.find('.product-mrp').text(product.mrp);
    $('#list-container').append(item);

    $('#' + product.id).on({
      'click': () => window.location.href = "./detail.html?id=" + (product.id)
    });
    $('#addbtn' + product.id).click(() => {
      $('#addbtn' + product.id).addClass('d-none');
      $('#cart-section-' + product.id).removeClass('d-none').addClass('d-flex');
    });
    $("#increasebtn" + product.id).unbind('click');
    $('#increasebtn' + product.id).on({
      'click': async function () {
        await checkuser();
        if (!checkSession()) return;
        const quantity = Number($('#input' + product.id).val());
        addToCart(product.id, quantity);
        $('#inputquantity' + product.id).text(quantity);
        $('#decreasebtn' + product.id).prop('disabled', false);
      }
    });
    $("#decreasebtn" + product.id).unbind('click');
    $('#decreasebtn' + product.id).on({
      'click': async function () {
        await checkuser();
        if (!checkSession()) return;
        const quantity = Number($('#input' + product.id).val());
        if (quantity == 0) {
          deleteme(product.id);
          $('#decreasebtn' + product.id).prop('disabled', true);
          $('#addbtn' + product.id).removeClass('d-none');
          $('#cart-section-' + product.id).addClass('d-none').removeClass('d-flex');
        }
        else {
          addToCart(product.id, quantity);
        }
        $('#inputquantity' + product.id).text(quantity);
      }
    });
  });

  $(".result").text(results);
}
let show = 0;
if (show === 0) {
  $('ul').removeClass('d-none');
}
if (show === 1) {
  $('ul').addClass('d-none');
}
$('#showBrand').on({
  'click': () => {
    if (show === 0) {
      show++;
      $('ul').addClass('d-none');
    }
    else {
      show--;
      $('ul').removeClass('d-none');
    }
  }
});
async function deleteme(productId) {
  await checkuser();
  if (!checkSession()) return;
  let cartItems = getCartItems();

  cartItems = cartItems.filter(item => item.id !== productId);
  setCartItems(cartItems);
  $('.cart-quantity').text(totalQuantity || 0);
  showSuccess("Product removed.");

}
let showfilter = 1;
$('#filter-section').click(() => {
  if (showfilter == 1) {
    showfilter--;
    $('#filters').removeClass('fadeshow');
  }
  else {
    showfilter++;
    $('#filters').addClass('fadeshow');
  }
})