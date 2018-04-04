var bookContainer = document.getElementById('books-space');
var borrowedBook = document.getElementById('borrow-book');
var borrowed = [];
var data;      // data of book in library
var data2;     // data of borrowed book


/*
    initalize ajax request to get data of library from server 
*/
var request = new XMLHttpRequest();
request.open("GET",'http://35.185.179.159:8080/api/books');
request.onload= function(){
    data = JSON.parse(request.responseText);
    //console.log(data);
    for (var i = 0;i < data.length; i ++){
        data[i].canBeBorrowed = data[i].quantity - data[i].borrowedQuantity - 1;
    }

    renderHTML(data,bookContainer);
}
request.send();

// render borrowed books from server
makeList();

function renderHTML(dat, position){
    var stringHTML = "";
    for(var i = 0; i < dat.length; i++){
        stringHTML += bookHTML(dat[i]);
    }
    position.insertAdjacentHTML("beforeend",stringHTML);
}

function bookHTML(bookData){
    insertHTML =  "<div style='margin-bottom:20px; background-color:#fff' class='form-group' >";
    insertHTML +=       "<div> <label> Title:  </label>" + bookData.title + "</div>";
    insertHTML +=       "<div> <label> Author: </label>" + bookData.author + "</div>";
    insertHTML +=       "<div>Quantity : " + bookData.canBeBorrowed + "</div>";
    insertHTML +=       "<div class='row'> <div  class='col-xs-10'> <input  class='form-control' type='number' min=0 onfocus='myfocus()' required> </input>  </div>";
    insertHTML +=                          "<div class='col-xs-2'> <button id = '"+ bookData.id +"' class = 'btn btn-info form-control input-sm ' onclick='clicked(this.id, getQuantity(this.id))'> Borrow </button> </div>"; 
    insertHTML +=       "</div>";
    insertHTML +=       "<a style='color:red'></a>";
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
    return document.getElementById(id).parentElement.previousElementSibling.firstElementChild.value;
}

/*
    call back function of "Borrow" button
*/ 

function clicked(id, quantity){

    var al = document.getElementById(id).parentElement.parentElement.nextElementSibling;

    var borrowRequest = new XMLHttpRequest();

    borrowRequest.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4){
            al.innerHTML = "ok";
            successed(id, quantity);
            return;
        }

        if(this.status == 400 && this.readyState == 4){
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

    console.log("success");

    var canBeBorrowedHtml = document.getElementById(id).parentElement.parentElement.previousElementSibling;
    canBeBorrowedHtml.innerHTML = parseInt(canBeBorrowedHtml.innerHTML.slice(11,canBeBorrowedHtml.innerHTML.length)) - parseInt(quantity);
    canBeBorrowedHtml.innerHTML = "Quantity : " + canBeBorrowedHtml.innerHTML;

    makeList();
}

/*
    get data of borrowed books from server
*/
function makeList(){
    var request2 = new XMLHttpRequest();
    request2.open("GET","http://35.185.179.159:8080/api/borrower/borrowedBooks");
    request2.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4){
            data2 = JSON.parse(request2.responseText);
            console.log(data2);

            borrowedBook.innerHTML = " ";
            var bookHtml =  "<div style='margin-bottom:20px;top: 58px; background-color:#fff' class='form-group' >" ;
        
            for (var i = 0; i < data2.length; i ++){
                if (data2[i].returnedDate == -1){
                    bookHtml += "<div style='margin-bottom:20px' class='form-group'>"
                    bookHtml += "<p>"+data2[i].title+"</p>";
                   // bookHtml += "<p> id : "+data2[i].id+"</p>";
                    bookHtml += "<p>Quantity : "+data2[i].quantity+"</p>";
                    bookHtml += "<p>Date : "+ Date(data2[i].createdDate).toString().slice(4,15) +"</p>"
                    bookHtml += "</div>"
                }
            }
            bookHtml += "</div>";
        
            borrowedBook.insertAdjacentHTML("beforeend",bookHtml);
        
        }
    }

    request2.send();
}






