window.addEventListener('resize', function() {
    const header = document.querySelector('.nav-logo-title-container');
    const windowWidth = window.innerWidth;
  
    if (windowWidth < 1024 && header.offsetWidth > windowWidth) {
      // Trigger dropdown behavior
      document.querySelector('.nav-trigger').checked = true;
    }
  });
  