var id = window.localStorage.getItem(getUserKey());
window.onload = islog;
function islog() {
  console.log(id);
  setTimeout(function(){if(id!=undefined){alert("Already logged in");window.location.href = "../index.html";}}, 1000);
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
        setUser(user[i]);
        window.location.href = "../index.html";
        break;
      }
      i = i + 1;
    }
    if (!loggedin) {
      $("#errormessage").removeClass("d-none");
    }
  }
  
});

function setUser(user) {
  localStorage.setItem(getUserKey(), JSON.stringify(user));
}

function isUserLoggedIn() {
  const user = localStorage.getItem(getUserKey());
  return !!user;
}

function redirectToHome() {
  window.location.href = '/';
}

function getUserKey() {
  return 'user';
}