// This function handles both initial load and hash changes.
function handleNavigation() {
  const fullHash = window.location.hash.substring(1); // Get the URL fragment without the '#'
  if (fullHash) {
    const [contentId, subContentId] = fullHash.includes('#') ? fullHash.split('#') : [fullHash, null];
    changeContent(contentId, subContentId);
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
  const mainContent = document.getElementById('main-content');

  sidebar.classList.toggle('collapsed');
  mainContent.classList.toggle('expanded'); // Adjust based on your layout needs

  toggle.textContent = sidebar.classList.contains('collapsed') ? 'chevron_right' : 'chevron_left';
});

// Dynamically change the content based on the selected menu item and potentially a subsection.
async function changeContent(contentId, subContentId = null) {
  const response = await fetch(`${contentId}.html`);
  const htmlContent = await response.text();

  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = htmlContent || '<p>Content not found.</p>';

  // Highlight the active menu item.
  document.querySelectorAll('#sidebar ul li a').forEach(item => {
    item.classList.remove('active');
  });
  const activeLink = document.querySelector(`#sidebar ul li a[href="#${contentId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }

  // If a subsection is specified, scroll to it.
  if (subContentId) {
    document.getElementById(subContentId)?.scrollIntoView();
  }
}

// Toggle the sidebar in mobile view.
function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');

  sidebar.classList.toggle('mobile-visible');
  mainContent.classList.toggle('mobile-collapsed'); // Adjust based on your layout needs
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


