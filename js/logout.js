function logout(){
  window.localStorage.removeItem("email");
  window.location.href = "../html/login.html";
}
var id = window.localStorage.getItem("email");
if(id==undefined){
  window.location.href = "../html/login.html";
}