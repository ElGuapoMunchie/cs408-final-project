// Code was taken from my lab11. 

window.onload = loadData;

// Load the data using GET
function loadData() {
    console.log("loaded data")
    let lambda = document.getElementById("itemsInTable");
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        lambda.innerHTML = ""   // make sure there aren't any duplicates
        const items = JSON.parse(xhr.response); // parse the item

        items.forEach(item => {
            var row = lambda.insertRow();
            var id = row.insertCell(0);
            var name = row.insertCell(1);
            var price = row.insertCell(2)
            var action = row.insertCell(3);

            id.innerText = item.id;
            name.innerText = item.name;
            price.innerText = item.price;

            // Create the DELETE button
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function () {
                deleteItem(item.id);    // Delete the specified item
            };
            action.appendChild(deleteButton);
        });
    });

    xhr.open("GET", "https://5zol9aa2td.execute-api.us-east-2.amazonaws.com/items");
    xhr.send();
}

// Delete the item using DELETE
function deleteItem(id) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "https://5zol9aa2td.execute-api.us-east-2.amazonaws.com/items/" + id);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

// Check if an input is a number
function isNumber(value) {
    // Convert the value to a number and check if it's valid
    return !isNaN(Number(value)) && value.trim() !== "";
}

// Add the item using PUT
function addItem() {
    // console.log("addItem called")

    // Local dateTimeFormatter - has block scope so should be ok
    const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://5zol9aa2td.execute-api.us-east-2.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");

    var username = document.getElementById("username");
    var post = document.getElementById("post-text");
    
    // Check that input fields are valid (i.e. not NULL or empty)
    if (username.value != "" && post.value != "" && !isNumber(username.value)) {
        
        // Get current date
        let now = new Date();
        let dt = dateTimeFormatter.format(now);

        // console.log(username.value, post.value, dt)
        
        xhr.send(JSON.stringify({
            "id": username.value,
            "price": dt,
            "name": post.value
        }));

        checkItemAdded.textContent = "Successfully Added Item"; // Tell user item was added

        // Refresh the table (because why hit load unless we have to)
        // loadData();

        // Reset the form to placeholder values
        document.getElementById("forum").reset();

    } else {
        // Provide error message corresponding to problem
        if (name === "") {
            checkItemAdded.textContent = "Error: Cannot have empty fields. Ensure all items have a name, price, and id.";
        } else if (!isNumber(price) || !isNumber(id)) {
            checkItemAdded.textContent = "Error: Price and ID fields must be a number (e.g. numeric digits [0-9, etc]).";
        }
    }
}