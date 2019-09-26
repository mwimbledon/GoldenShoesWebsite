var db
var shoe

window.onload = function() {
    db = firebase.firestore();
    shoe = getParam();
    getData();
    setElements();
}

function getParam() {
    var queryString = decodeURIComponent(window.location.search);
    console.log(queryString);
    var res = queryString.split("=");
    shoe = res[1];
    console.log(shoe);
    return shoe;
}

function getData() {
    var colRef = db.collection("products").doc(shoe);
    colRef.get().then(function(doc) {
        if (doc.exists) {
            console.log(doc.data().desc);
            document.getElementById("desc").innerHTML = doc.data().desc
            if(doc.data().stock) {
                var sizeList = document.createElement("select")
                sizeList.id = "sizeList";
                colRef.collection("size")/*.where("qty", "==", 1)*/
                .get()
                .then(function(snapshot) {
                    snapshot.forEach(function(doc2) {
                        if(doc2.data().qty >= 1) {
                            console.log("size: " + doc2.data().size)
                            var opt = document.createElement("option");
                            opt.value= doc2.data().size;
                            opt.innerHTML = doc2.data().size;
                            sizeList.appendChild(opt);
                        }
                    });
                })
                document.getElementById("shoeInfo").appendChild(sizeList);
                var span = document.createElement('span');
                span.innerHTML = '<button id="btnOrder" onclick="order()">Order</button>';
                document.getElementById("shoeInfo").appendChild(span);
            } else {
                var outOfStock = document.createElement("p")
                outOfStock.innerHTML = "Apologies, these are all out of stock."
                document.getElementById("shoeInfo").appendChild(outOfStock);
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function setElements() {
    document.title = shoe;
    document.getElementById("h2").innerHTML = shoe;
}

function order() {
    var size = document.getElementById("sizeList").value;
    var docRef = db.collection("products").doc(shoe)
                    .collection("size").doc(size);
    var qty
    docRef.get().then(function(doc) {
        qty = doc.data().qty - 1;
        if(qty > 0) {
            var setWithMerge = docRef.set({
                qty: qty
            }, { merge: true }).then(function() {
            location.replace("../Purchased/Purchased Page.html?status=1")});
        }
        else if(qty == 0) {
            var setWithMerge = docRef.set({
                qty: qty
            }, { merge: true });
            var stock = false;
            var sizeRef = db.collection("products").doc(shoe)
                            .collection("size");
            sizeRef.get()
            .then(function(snapshot) {
                console.log(snapshot);
                snapshot.forEach(function(doc2) {
                    if(doc2.data().qty > 0) {
                        stock = true;
                        return;
                    }
                })
                if(!stock) {
                    var shoeRef = db.collection('products').doc(shoe);
                    var setWithMerge = shoeRef.set({
                        stock: false
                    }, { merge: true }).then(function() {
                        location.replace("../Purchased/Purchased Page.html?status=1")});
                }
                location.replace("../Purchased/Purchased Page.html?status=1");
            })
        }
        else if(qty < 0) {
            document.getElementById("lblSize").innerHTML = "Apologies, this size/item is now sold out";
            document.getElementById("btnOrder").disabled = true
            location.replace("../Purchased/Purchased Page.html?status=0")
        }
    })
    
}