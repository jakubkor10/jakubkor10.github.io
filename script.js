// Change navbar background on scroll
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

// Typing animation for hero title
const heroTitle = document.querySelector('#hero h1 .highlight');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    // Start typing animation after a short delay
    setTimeout(typeWriter, 500);
}

// Fetch GitHub projects and display them (with improved error handling for GitHub Pages)
async function fetchProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    // Show loading state
    projectsGrid.innerHTML = '<p style="color: var(--secondary);">Loading projects...</p>';

    try {
        // Fetch repositories from GitHub API (public repos only)
        // per_page=5 to ensure we get at least 2 repos even if some are filtered
        // Add User-Agent header as GitHub API requires it
        const response = await fetch('https://api.github.com/users/jakubkor10/repos?per_page=5&sort=updated', {
            headers: {
                'User-Agent': 'portfolio-website'
            }
        });

        if (!response.ok) {
            throw new Error('API responded with status: ' + response.status);
        }

        const repos = await response.json();

        // Display first 2 projects (that have names)
        const toDisplay = repos.filter(repo => repo.name).slice(0, 2);

        if (toDisplay.length === 0) {
            throw new Error('No repos found with names');
        }

        toDisplay.forEach(repo => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';

            // Get the repo description, handle null case
            const description = repo.description || 'No description available.';

            projectCard.innerHTML = `
                <div class="project-img" style="background: var(--card-bg); border-radius: 8px; padding: 20px; text-align: center; color: var(--secondary);"></div>
                <h3 style="margin: 10px 0 0 0;">${repo.name}</h3>
                <p style="margin: 10px 0 0 0;">${description}</p>
                <a href="${repo.html_url}" target='_blank' class='btn' style='margin-top: 10px; padding: 8px 16px; border-color: var(--accent); color: var(--accent);'>View on GitHub</a>
            `;
            projectsGrid.appendChild(projectCard);
        });
    } catch (error) {
        // Fallback if API fails
        console.error('Error fetching GitHub projects:', error);
        projectsGrid.innerHTML = '<p style="color: var(--secondary);">Unable to load projects. ' +
            'This is a known limitation of GitHub Pages. ' +
            'Check your internet connection or try again later.</p>';
    }
}

// Simple reveal animation for project cards
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = '0.6s ease-out';
    observer.observe(card);
});

// Load projects on page load
document.addEventListener('DOMContentLoaded', fetchProjects);