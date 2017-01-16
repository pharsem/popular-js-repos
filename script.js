
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

// Function to create the table
function createTable(object) {
    var out = "";

    // Iterate through the result object, add each to the out variable
    for(var i = 0; i < object.length; i++) {
        out += '<p>' + (i+1) + ': ' + object[i].name + '</p>';
    }

    // Print the out variable
    document.getElementById("table").innerHTML = out;
}