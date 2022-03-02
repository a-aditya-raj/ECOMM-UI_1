$("form").on("submit", function (event) {
  event.preventDefault();
  const email = $("input[id=email]").val();
  const password = $("input[id=password]").val();
  console.log(email);
  console.log(password);
  var mycreds = [{
    "id": "4",
    "name": "Aaditya Raj",
    "email": "aaditya.raj@increff.com",
    "password": "password1234"
  }];
  $.getJSON(mycreds, function (mycreds) {
    const user = users.filter(users => email === users.email && password === users.password);
    console.log(user);
    if (user.length) {
      $("#errormessage").addClass("d-none");
      console.log("Logged in successfully");
      window.location.href = "/html/product.html";
    }
    else {
      $("#errormessage").removeClass("d-none");
      console.log("error in username or password");
    }
  });
});