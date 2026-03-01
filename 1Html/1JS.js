// Актив стр

const nav = document.querySelector(".main-nav");

nav.addEventListener('click', function(event){
    if (event.target.tagName === 'A') {
        event.preventDefault();

        document.querySelectorAll('.nav-link').forEach(link=> {
            link.classList.remove('active');
        });

        event.target.classList.add('active');
    }
});

// Поиск

const searchInput = document.querySelector('#search-input');

const posts = document.querySelectorAll('.post');

searchInput.addEventListener('input', function(event) {
    const query = event.target.value.toLowerCase().trim();

    posts.forEach(post => {
        const text = post.textContent.toLowerCase();

        if (text.includes(query)) {
            post.style.display = 'block';
        }
        else {
            post.style.display = 'none';
        }
    });
});

// lazy loading
const lazyImages = document.querySelectorAll('img.lazy');

const observer = new IntersectionObserver((entries, observer) => {
    
    entries.forEach(entry => {
        
        if(entry.isIntersecting) {
            
            const img = entry.target;
            img.src = img.dataset.src;

            observer.unobserve(img);
        } 
    });
}, {
    rootMargin: '200px 0px',
    threshold: 0.1
});

lazyImages.forEach(img => observer.observe(img));

// localstorage

const toggleBtn = document.querySelector('#theme-toggle');

const savedTheme = localStorage.getItem('theme') || 'ligth';

document.body.classList.add(savedTheme);

if (savedTheme === 'dark-theme') {
    toggleBtn.textContent = '☀️';
}
else {
    toggleBtn.textContent = '🌙';
}

toggleBtn.addEventListener('click', function() {
    
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light-theme');
        toggleBtn.textContent = '🌙';
    }
    else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
        toggleBtn.textContent = '☀️';
    }
});