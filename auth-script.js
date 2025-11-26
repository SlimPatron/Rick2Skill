// Intelligenter Loading Screen
let loadingTimeout;
let isPageLoaded = false;

loadingTimeout = setTimeout(() => {
    if (!isPageLoaded) {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }
}, 300);

window.addEventListener('load', function() {
    isPageLoaded = true;
    clearTimeout(loadingTimeout);
    
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
});

console.log('✅ Auth page loaded!');
