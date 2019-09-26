var status

window.onload = function() {
    status = getParam();
    if(status == 1){
        document.title = "Confimation"
        document.getElementById("header").innerHTML = "Confirmation"
        document.getElementById("pMessage").innerHTML = "Order confirmed. Confirmation code: 1escjsd!"
    }else if(status==0) {
        document.title = "Out Of Stock"
        document.getElementById("header").innerHTML = "Apologies"
        document.getElementById("pMessage").innerHTML = "That item/size is now out of stock."
    }
}

function getParam() {
    var queryString = decodeURIComponent(window.location.search);
    console.log(queryString);
    var res = queryString.split("=");
    status = res[1];
    console.log(status);
    return status;
}