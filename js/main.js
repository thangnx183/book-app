var bookContainer = document.getElementById('books-space');
var data;
var request = new XMLHttpRequest();
// comment democontent
// new api


request.open("GET",'http://35.185.179.159:8080/api/borrower/borrowedBooks');
request.onload= function(){
    data = JSON.parse(request.responseText);
    console.log(data);

    for(i = 0; i < data.length - 1; i ++){
        for(j = i + 1; j < data.length;){

            if(data[i]['bookID'] == data[j]['bookID']){   
                data[i].quantity += data[j].quantity;
                data.splice(j,1);
            }else{
                j ++;
            }
        }
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
    insertHTML += "<p> Quantity : " + bookData.quantity + "</p>";
    insertHTML += "<input type='number' min=0> </input>"
    insertHTML += "<button id = '"+ bookData.bookID +"' class = 'btn' onclick='clicked(this.id)'> Borrow </button>";
    insertHTML += "</div>";
    return insertHTML;
}

function clicked(e){
    var btn = document.getElementById(e);
    var quantity = btn.previousElementSibling.value;
    console.log(quantity);

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
    url += e + '/borrow/';
    url += quantity;

    borrowRequest.open("POST",url,true);
    borrowRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    borrowRequest.send();

}