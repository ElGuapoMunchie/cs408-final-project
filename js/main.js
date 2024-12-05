let lastCall = 0;

window.onload = loaded;

function loaded() {
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
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        func(...args);
      }
    };
  }
}

// Oh my god I hope this works

// Load the posts using GET
function loadData() {
    let commentsList = document.getElementById("comments-list");
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        commentsList.innerHTML = "";  // make sure there aren't any duplicates
        const posts = JSON.parse(xhr.response); // parse the posts

        posts.forEach(post => {
            let postDiv = document.createElement("div");
            postDiv.classList.add("post");

            let postText = document.createElement("p");
            postText.textContent = post.text;

            postDiv.appendChild(postText);
            commentsList.appendChild(postDiv);
        });
    });

    xhr.open("GET", "https://5zol9aa2td.execute-api.us-east-2.amazonaws.com/posts");
    xhr.send();
}

// Create a new post using PUT (or POST depending on your backend)
function createPost() {
    console.log("Clicked the button!");
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://5zol9aa2td.execute-api.us-east-2.amazonaws.com/posts");  // Assuming POST for creating a new post
    xhr.setRequestHeader("Content-Type", "application/json");

    let postText = document.getElementById("post-text").value;

    if (postText.trim() !== "") {
        xhr.send(JSON.stringify({
            "text": postText
        }));

        // Optionally, clear the textarea after posting
        document.getElementById("post-text").value = "";
        
        // Refresh the posts list after the new post is added
        loadData();
    } else {
        alert("Please enter some text for your post.");
    }
}
