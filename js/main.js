var bookContainer = document.getElementById('books-space');
var borrowedBook = document.getElementById('borrow-book')
var data;
var request = new XMLHttpRequest();
// comment democontent
// new api


request.open("GET",'http://35.185.179.159:8080/api/books');
request.onload= function(){
    data = JSON.parse(request.responseText);
    console.log(data);
    for (var i = 0;i < data.length; i ++){
        data[i].canBeBorrowed = data[i].quantity - data[i].borrowedQuantity;
    }

    renderHTML(data);
}
request.send();

function renderHTML(dat){
    var stringHTML = "";
    for(var i = 0; i < dat.length; i++){
        stringHTML += bookHTML(dat[i]);
    }
    bookContainer.insertAdjacentHTML("beforeend",stringHTML);
}

function bookHTML(bookData){
    insertHTML = "";
    insertHTML += "<div class = 'book-space'>";
    insertHTML += "<p> Title : " + bookData.title + "</p>";
    insertHTML += "<p> Author : " + bookData.author + "</p>";
    insertHTML += "<p> Quantity : " + bookData.canBeBorrowed + "</p>";
    insertHTML += "<input type='number' min=0> </input>"
    insertHTML += "<button id = '"+ bookData.id +"' class = 'btn' onclick='clicked(this.id, getQuantity(this.id))'> Borrow </button>";
    insertHTML += "</div>";
    return insertHTML;
}

function getQuantity(id){
    return document.getElementById(id).previousElementSibling.value;
}

function clicked(id, quantity){
    console.log(quantity);
    console.log(id);

    var borrowRequest = new XMLHttpRequest();
    borrowRequest.onreadystatechange = function(){
        if(this.status == 201){
            alert("ok");
            console.log("ok");
        }

        if(this.status == 403){
            alert("Borrow quantity is greater than available book quantity, cannot borrow");
        }

        if(this.status == 404){
            alert("Book with given id not found")
        }
    }

    var url = 'http://35.185.179.159:8080/api/borrower/books/';
    url += id + '/borrow/';
    url += quantity;

    borrowRequest.open("POST",url,true);
    borrowRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    borrowRequest.send();

}