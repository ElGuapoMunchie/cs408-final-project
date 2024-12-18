// window.onload = loadData;
let lastCall = 0;
window.onload = loaded;

function loaded() {
    // Load Posts from the database
    loadData();

    const button = document.querySelector('.money-button');

    button.addEventListener('mouseover', () => {
        // On mouseover, allow for fluttering dollar bills to be created
        button.addEventListener('mousemove', throttle(createDollar, 75)); // Call function at most once every 500ms
    });

    button.addEventListener('mouseleave', () => {
        // Remove event listener when the mouse leaves the button
        button.removeEventListener('mousemove', createDollar);
    });

    function createDollar(event) {
        for (let i = 0; i < 5; i++) { // Now creates only 5 dollar signs per mouse move
            const dollar = document.createElement('span');
            dollar.classList.add('dollar');
            dollar.innerText = '$';

            // Position the dollar sign at the mouse cursor location relative to the entire page
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const offsetX = (Math.random() * 60) - 30;
            const offsetY = (Math.random() * 60) - 30;

            dollar.style.left = `${mouseX + offsetX}px`;
            dollar.style.top = `${mouseY + offsetY}px`;

            // Add dollar to the body or document so it can flow over the page
            document.body.appendChild(dollar);

            // Remove the dollar after animation ends
            dollar.addEventListener('animationend', () => {
                dollar.remove();
            });
        }
    }

    // Throttle function - limits how often the provided function can be called
    function throttle(func, limit) {
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= limit) {
                lastCall = now;
                func(...args);
            }
        };
    }
}


// Forum Specific Code (below) was modified from my lab11. 
// Load the data using GET
function loadData() {
    // console.log("loaded data")
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

    // Print statements for debugging/testing
    // console.log(xhr.open("GET", "https://5zol9aa2td.execute-api.us-east-2.amazonaws.com/items"));
    // console.log(xhr.send());

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

        // SANITIZE THE INPUTS
        username = sanitizeInput(username.value);
        post = sanitizeInput(post.value);

        // Get current date
        let now = new Date();
        let dt = dateTimeFormatter.format(now);

        // Print output for debugging/testing
        // console.log(username.value, post.value, dt)

        xhr.send(JSON.stringify({
            "id": username,
            "price": dt,
            "name": post
        }));

        checkItemAdded.textContent = "Added your post! Click Refresh to view."; // Tell user item was added

        // Refresh the table (because why hit load unless we have to)
        // loadData();

        // Reset the form to placeholder values
        document.getElementById("forum").reset();

    } else {
        // Provide error message corresponding to problem
        if (username === "") {
            checkItemAdded.textContent = "Error: Username cannot be empty.";
        } else if (isNumber(username)) {
            checkItemAdded.textContent = "Error: Username cannot be a number.";
        } else if (post === "") {
            checkItemAdded.textContent = "Error: Post cannot be empty.";
        }
    }
}

// Search through the database to display specific posts matching query
function searchData() {
    // console.log("Search Queried")
    let lambda = document.getElementById("itemsInTable");
    let searchQuery = document.getElementById("searchtext").value; // Get the search query from the input field
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", function () {
        lambda.innerHTML = ""; // Clear the table to avoid duplicates
        const items = JSON.parse(xhr.response); // Parse the response

        items.forEach(item => {
            var row = lambda.insertRow();
            var id = row.insertCell(0);
            var name = row.insertCell(1);
            var price = row.insertCell(2);
            var action = row.insertCell(3);

            id.innerText = item.id;
            name.innerText = item.name;
            price.innerText = item.price;

            // Create the DELETE button
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function () {
                deleteItem(item.id); // Delete the specified item
            };
            action.appendChild(deleteButton);
        });
    });

    // Include the search query in the API request as a query parameter

    // Print statements for debugging/testing
    // console.log(xhr.open("GET", `https://5zol9aa2td.execute-api.us-east-2.amazonaws.com/items?search=${encodeURIComponent(searchQuery)}`));
    // console.log(xhr.send());

    xhr.open("GET", `https://5zol9aa2td.execute-api.us-east-2.amazonaws.com/items?search=${encodeURIComponent(searchQuery)}`);
    xhr.send();
}

// INPUT VALIDATION AND SANITIZATION (the good stuff)

/**
 * Sanitizes user input fields (username and form submission for posts)
 * by removing HTML tags and JS script tags from the input. 
 * @param {*} input 
 * @returns sanitized user input
 */
function sanitizeInput(input) {
    // Convert to string if not string already
    if (typeof input !== 'string') {
        input = String(input); // Convert to string if not already
    }
    input = input.replace(/<\/?[^>]+(>|$)/g, ""); // Removes HTML tags
    return input.replace(/<script.*?>.*?<\/script>/gi, ""); // Remove script tags
}