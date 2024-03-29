function adjustHamburgerDisplay() {
  if (('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768) {
    document.getElementById('hamburger').style.display = 'block';
  } else {
    document.getElementById('hamburger').style.display = 'none';
  }
}

// Call on initial load
adjustHamburgerDisplay();

// This function handles both initial load and hash changes.
function handleNavigation() {
  const fullHash = window.location.hash.substring(1);
  if (fullHash) {
    const [contentId, subContentId] = fullHash.includes('#') ? fullHash.split('#') : [fullHash, null];
    changeContent(contentId, subContentId);
  } else {
    changeContent('biden'); // Load the default content if no specific hash is found
  }
}

// Handle page load and navigate to the appropriate content or subsection.
document.addEventListener('DOMContentLoaded', function() {
  handleNavigation();
});

// Toggle the left sidebar's visibility and adjust the main content area.
document.getElementById('toggle').addEventListener('click', function() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('toggle');

  sidebar.classList.toggle('collapsed');
  
  // Toggle the text inside chevron based on the sidebar state
  toggle.textContent = sidebar.classList.contains('collapsed') ? 'chevron_right' : 'chevron_left';

  // Update the position of the toggle button to follow the sidebar's current state
  toggle.style.left = sidebar.classList.contains('collapsed') ? '0px' : '165px';  // Adjust '165px' as necessary to match your sidebar's width
});

async function changeContent(contentId, subContentId = null) {
  window.scrollTo(0, 0);
  const response = await fetch(`${contentId}.html`);
  const htmlContent = await response.text();

  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = htmlContent || '<p>Content not found.</p>';

  // Clear existing active state, submenus, and expanded lists.
  document.querySelectorAll('#sidebar ul li').forEach(item => {
    item.classList.remove('active'); // Remove active state for submenu display.
    item.querySelector('a')?.classList.remove('active'); // Remove active state for highlighting.

    // Check for an existing submenu and remove it if found.
    const existingSubmenu = item.querySelector('.submenu');
    if (existingSubmenu) {
      item.removeChild(existingSubmenu);
    }
  });

  // Highlight the active menu item and manage the submenu.
  const activeLink = document.querySelector(`#sidebar ul li a[href="#${contentId}"]`);
  if (activeLink) {
    activeLink.classList.add('active'); // Apply highlighting.

    const listItem = activeLink.closest('li');
    listItem.classList.add('active'); // Manage submenu display.

    // Generate submenu based on h2 elements in the fetched content.
    const headers = mainContent.querySelectorAll('h2');
    if (headers.length > 0) {
      const submenu = document.createElement('ul');
      submenu.classList.add('submenu');
      headers.forEach(header => {
        const subItem = document.createElement('li');
        const subLink = document.createElement('a');
        subLink.textContent = header.textContent.toLowerCase();
        subLink.href = `#${contentId}#${header.id}`;
        subLink.addEventListener('click', (e) => {
          e.preventDefault();
          document.getElementById(header.id)?.scrollIntoView();
        });
        subItem.appendChild(subLink);
        submenu.appendChild(subItem);
      });
      listItem.appendChild(submenu);
    }
  }

  // If a subsection is specified, scroll to it.
  if (subContentId) {
    document.getElementById(subContentId)?.scrollIntoView();
  }
}

// Toggle the sidebar in mobile view.
function toggleMobileSidebar() {
  var sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible");

  if (sidebar.classList.contains("visible")) {
    sidebar.style.width = "165px";  // Or whatever your sidebar width should be
    sidebar.style.visibility = "visible";
  } else {
    sidebar.style.width = "0";
    sidebar.style.visibility = "hidden";
  }
}

function sendEmail() {
  var urlParts = window.location.href.split('#');
  var subjectBase = "info dump";
  var subject = "";

  if (urlParts.length > 1) {
      var topics = urlParts.slice(1).join(' and ');
      var formattedTopics = topics.replace(/_/g, ' ').toLowerCase().split(' ');
      for (var i = 0; i < formattedTopics.length; i++) {
          if (i === 0) {
              formattedTopics[i] = formattedTopics[i].charAt(0).toUpperCase() + formattedTopics[i].slice(1);
          }
      }
      subject = formattedTopics.join(' ') + " " + subjectBase;
  } else {
      subject = "Page " + subjectBase;
  }

  var body = "I thought you might find this page interesting: " + window.location.href;
  window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

document.getElementById('main-content').addEventListener('click', function() {
  // Check if the screen width is 768px or less - typical for mobile devices
  if (window.innerWidth <= 768) {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("visible")) {
      sidebar.classList.remove("visible");
      sidebar.style.width = "0";
      sidebar.style.visibility = "hidden";
    }
  }
});
