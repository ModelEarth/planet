(function () {
  const containerId = 'embedded-widget-container';

  // Create a container if it doesn't exist
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  // Load layout.html and inject it
  fetch('layout.html')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load layout.html');
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;

      // Re-execute all script tags in layout.html
      const scripts = container.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        if (oldScript.type) {
          newScript.type = oldScript.type;
        }
        oldScript.replaceWith(newScript);
      });

      // Now load layout.js after HTML is inserted
      const script = document.createElement('script');
      script.src = 'trade/assets/index.js';
      script.type = 'module'; // Use ES Modules syntax (like import.meta, import, or export)
      script.onload = () => {
        console.log('layout.js loaded and executed.');
      };
      script.onerror = () => {
        console.error('Failed to load layout.js');
      };
      document.body.appendChild(script);
    })
    .catch(error => {
      console.error('Widget initialization error:', error);
    });
})();
