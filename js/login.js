var id = window.localStorage.getItem("email");
window.onload = islog;
function islog() {
  setTimeout(function(){if(id!=undefined){alert("Already logged in");window.location.href = "../html/product.html";}}, 1000);
}


$("form").on("submit", function (event) {
  event.preventDefault();
  const email = $("input[id=email]").val();
  const password = $("input[id=password]").val();
  fetch("../assets/creds.json").then(response => {
    return response.json();
  }).then(data => {
    creds = JSON.stringify(data);
    validate(creds);
  });
  function validate(data) {
    var user = JSON.parse(data);
    var i = 0;
    var loggedin = false;
    while (user[i]) {
      if (user[i].email === email && user[i].password === password) {
        $("#errormessage").addClass("d-none");
        window.location.href = "../html/product.html";
        window.localStorage.setItem("email", user[i].id);
        loggedin = true;
        break;
      }
      i = i + 1;
    }
    if (!loggedin) {
      $("#errormessage").removeClass("d-none");
    }
  }
});