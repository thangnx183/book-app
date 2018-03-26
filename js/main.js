var bookContainer = document.getElementById('books-space');
var borrowedBook = document.getElementById('borrow-book');
var borrowed = [];
var data;
var request = new XMLHttpRequest();
// comment democontent
// new api


request.open("GET",'http://35.185.179.159:8080/api/books');
request.onload= function(){
    data = JSON.parse(request.responseText);
    console.log(data);
    for (var i = 0;i < data.length; i ++){
        data[i].canBeBorrowed = data[i].quantity - data[i].borrowedQuantity - 1;
    }

    renderHTML(data,bookContainer);
}
request.send();

function renderHTML(dat, position){
    var stringHTML = "";
    for(var i = 0; i < dat.length; i++){
        stringHTML += bookHTML(dat[i]);
    }
    position.insertAdjacentHTML("beforeend",stringHTML);
}

function bookHTML(bookData){
    insertHTML = "";
    insertHTML += "<div class = 'book-space'>";
    insertHTML += "<p> Title : " + bookData.title + "</p>";
    insertHTML += "<p> Author : " + bookData.author + "</p>";
    insertHTML += "<p>Quantity : " + bookData.canBeBorrowed + "</p>";
    insertHTML += "<input type='number' min=0 onfocus='myfocus()' required> </input>"
    insertHTML += "<button id = '"+ bookData.id +"' class = 'btn' onclick='clicked(this.id, getQuantity(this.id))'> Borrow </button>";
    insertHTML += "<a></a>";
    insertHTML += "</div>";
    return insertHTML;
}

function myfocus(){
    var aTag = document.getElementsByTagName("A");
    for (var i = 0; i < aTag.length; i ++){
        aTag[i].innerHTML = "";
    }
}

function getQuantity(id){
    return document.getElementById(id).previousElementSibling.value;
}

function clicked(id, quantity){
    //console.log(quantity);
    //console.log(id);
    //console.log("clicked");
    var al = document.getElementById(id).parentElement.lastElementChild;

    var borrowRequest = new XMLHttpRequest();
    borrowRequest.onreadystatechange = function(){
        if(this.status == 201 && this.readyState == 4){
            //alert("ok");
            al.innerHTML = "ok";
            //console.log("ajax-----");
            successed(id, quantity);
            return;
        }

        if(this.status == 400 && this.readyState == 4){
            //alert('Borrow quantity must be greater than 0');
            al.innerHTML = "Borrow quantity must be greater than 0";
        }

        if(this.status == 403 && this.readyState == 4){
            al.innerHTML = "Borrow quantity is greater than available book quantity, cannot borrow";
        }

        if(this.status == 404 && this.readyState == 4){
            al.innerHTML = "U need to fill the blank";
        }
    }

    var url = 'http://35.185.179.159:8080/api/borrower/books/';
    url += id + '/borrow/';
    url += quantity;

    borrowRequest.open("POST",url,true);
    borrowRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    borrowRequest.send();
}

function successed(id, quantity){
    //console.log("quantity: "+quantity);
    if(borrowed.find(book=>book.id === id) === undefined){
      //  console.log("ok");
        var x = JSON.parse(JSON.stringify(data.find(book=>book.id === id)));
        x.borrowedQuantity = parseInt(quantity);
        //console.log(x);
        borrowed.push(x);
    }else{
        //console.log("error")
        borrowed.find(book=>book.id === id).borrowedQuantity  += parseInt(quantity);
    }

    var canBeBorrowedHtml = document.getElementById(id).previousElementSibling.previousElementSibling;
//    console.log(canBeBorrowedHtml.innerHTML.slice(11,canBeBorrowedHtml.innerHTML.length));
    canBeBorrowedHtml.innerHTML = parseInt(canBeBorrowedHtml.innerHTML.slice(11,canBeBorrowedHtml.innerHTML.length)) - parseInt(quantity);
    canBeBorrowedHtml.innerHTML = "Quantity : " + canBeBorrowedHtml.innerHTML;


    borrowedBook.innerHTML = " ";
    var bookHtml = "" ;

    for (var i = 0; i < borrowed.length; i ++){
        bookHtml += "<p>"+borrowed[i].title+"</p>";
        bookHtml += "<p>"+borrowed[i].borrowedQuantity+"</p>";
    }

    borrowedBook.insertAdjacentHTML("beforeend",bookHtml);
}