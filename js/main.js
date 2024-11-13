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
