var db

window.onload = function() {
    db = firebase.firestore();
    getData()
}

function getData() {
    var colRef = db.collection("products");
    colRef.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            buildElements(doc);
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function buildElements(doc) {
    if(doc.data().name, doc.data().price) {
        var div = document.createElement("div");
        div.classList.add("box");
        var h3 = document.createElement("h3");
        var h3Node = document.createTextNode(doc.data().name);
        h3.appendChild(h3Node);
        div.appendChild(h3);
        var pPrice = document.createElement("p");
        pPrice.classList.add("price");
        var pPriceNode
        var aNode
        if(doc.data().stock == true) {
            pPriceNode = document.createTextNode(doc.data().price);
            aNode = document.createTextNode("Buy Now!");
        }
        else {
            pPriceNode = document.createTextNode("Sold Out!");
            aNode = document.createTextNode("Details!");
        }
        pPrice.appendChild(pPriceNode);
        div.appendChild(pPrice);
        if(doc.data().desc) {
            var pDesc = document.createElement("p");
            var pDescNode = document.createTextNode(doc.data().desc);
            pDesc.appendChild(pDescNode);
            div.appendChild(pDesc);
        }
        var a = document.createElement("a");
        a.classList.add("btn");
        a.appendChild(aNode);
        a.href="../Details/Details Page.html?product=" + doc.data().name;
        div.appendChild(a);
        var element = document.getElementById("boxSection");
        element.appendChild(div);
    }
    else {
        console.log("Error: Invalid documents in Products collection!")
    }
}