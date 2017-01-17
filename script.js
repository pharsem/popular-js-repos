// Making sure the heading is still shown and not scrolled past when changing page
window.addEventListener("hashchange", function () {
    window.scrollTo(window.scrollX, window.scrollY - 200);
});

// AJAX request
var request = new XMLHttpRequest();
var url = "https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&per_page=100";

request.onreadystatechange = function () {
    // Retrieve result when the request is ready and the status is OK
    if (request.readyState === 4 && request.status === 200) {

        // Parse the result and pass the items-object to the createTable function
        var result = JSON.parse(request.responseText);
        createTable(result['items']);

    } else if (request.readyState === 4 && request.status != 200) { // Error handling if status isn't OK
        console.log('Error: ' + request.status);
    }
};

// Open/send request
request.open("GET", url, true);
request.send();

var currentPage = 1;

// Function to create the table
function createTable(object) {
    var output = '';
    var pages = 0;

    // Iterate through the result object, add each to the output variable
    for (var i = 0; i < object.length; i++) {

        // On every 20th iteration, but not the first one, input closing tag for table
        if (i && (i % 20 === 0)) {
            output += '</table>';
        }

        // On every 20th iteration, including the first one, start a new table
        if (i % 20 === 0) {
            output += '<table class="page hide" id="page' + (pages+1) + '">' +
                '<tr>' +
                '<th>#</th>' +
                '<th>Repository name</th>' +
                '<th>Owner</th>' +
                '<th>Description</th>' +
                '<th>Watchers</th>' +
                '<th>Forks</th>' +
                '</tr>';

            // Increase pages counter
            pages++;
        }

        // Add the information from the result to table rows
        output += '<tr>' +
            '<td>' + (i+1) + '</td>' +
            '<td><a href="' + object[i].html_url + '" target="_blank">' + object[i].name + '</a></td>' +
            '<td><a href="' + object[i].owner.html_url + '" target="_blank">' + object[i].owner.login + '</a></td>' +
            '<td>' + sanitise(object[i].description) + '</td>' +
            '<td>' + object[i].watchers + '</td>' +
            '<td>' + object[i].forks + '</td>' +
            '</tr>';
    }

    // Print the output variable
    document.getElementById("table").innerHTML = output;

    if (pages > 0) {
        createPagination(pages);
    };

    // When results are loaded, remove loader and display first page
    document.getElementById('loader').style.display = 'none';
    changePage(currentPage);

}
// Create pagination system with buttons for each page
function createPagination(pages) {

    var output = '';

    for (var i = 0; i < pages; i++) {
        var id = "page" + (i+1) + "btn";

        output += '<li id="' + id + '"><a onclick="changePage(' + (i+1) + ')">' + (i+1) + '</a></li>';
    }

    // Print the output variable
    document.getElementById("pagination").innerHTML = output;
}

// Toggle classes based on what page to show
function changePage(page) {
    currentPage = page;
    var id = "page" + currentPage + "";
    var btnId = id + "btn";

    // Hide all pages, then show the one that's selected
    var pages = document.getElementsByClassName("page");
    while(pages.length > 0) {
        pages[0].className = "hide";
    }

    document.getElementById(id).className = "page show";

    // Remove active class from all the pagination numbers, then add it to the one that's selected
    var numbers = document.getElementById("pagination").getElementsByTagName("li");
    for (var i = 0; i < numbers.length; ++i) {
        numbers[i].className = "";
    }

    document.getElementById(btnId).className = "active";
}

// Function to sanitise strings, needed because some of the repo descriptions might contain HTML
function sanitise(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

