let id = window.localStorage.getItem("user");
window.onload = islog;
function islog(){
  if(id!=undefined){
    window.location.href = "./product.html";
  }
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
    let user = JSON.parse(data);
    let i = 0;
    let p = true;
    
    while (user[i]) {
      if (user[i].email === email && user[i].password === password) {
        setUser(user[i]);
        window.location.href = "../html/product.html";
        p= false;
        break;
      }
      i++;
    }
    if (p) {
      $("#errormessage").removeClass("d-none");
    }
  }
  
});

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user.id));
}
