// Smooth Scroll mit einstellbarer Geschwindigkeit
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1800; // Dauer in Millisekunden (1800ms = 1.8 Sekunden - langsam & smooth)
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }
            
            // Easing-Funktion für smoothes Scrollen
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
            
            requestAnimationFrame(animation);
        }
    });
});

// Wartelisten-Formular mit verbesserter Validierung
document.getElementById('waitlist-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    
    // Email Validierung
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('⚠️ Bitte gib eine gültige E-Mail-Adresse ein!');
        emailInput.focus();
        return;
    }
    
    try {
        // Import utilities for security
        const { sanitizeInput, isValidEmail } = await import('./utils.js');
        
        // Sanitize and validate email
        const sanitizedEmail = sanitizeInput(email, 100);
        if (!isValidEmail(sanitizedEmail)) {
            alert('⚠️ Bitte gib eine gültige E-Mail-Adresse ein!');
            emailInput.focus();
            return;
        }
        
        // Importiere Firestore
        const { getFirestore, collection, addDoc, query, where, getDocs } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        const db = getFirestore(window.firebaseApp);
        
        // Prüfe ob E-Mail bereits existiert
        const q = query(collection(db, "betaEmails"), where("email", "==", sanitizedEmail));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
            alert('📧 Diese E-Mail ist bereits auf der Warteliste!');
            return;
        }
        
        // Speichere in Firestore (Firestore Rules validate the data)
        await addDoc(collection(db, "betaEmails"), {
            email: sanitizedEmail,
            timestamp: new Date().toISOString(),
            source: 'landing-page',
            createdAt: new Date()
        });
        
        // Zeige Erfolgs-Nachricht
        document.getElementById('success-message').classList.remove('hidden');
        document.getElementById('waitlist-form').reset();
        
        // Verstecke Erfolgs-Nachricht nach 5 Sekunden
        setTimeout(() => {
            document.getElementById('success-message').classList.add('hidden');
        }, 5000);
        
        console.log('✅ Neue Anmeldung gespeichert:', email);
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        alert('⚠️ Fehler beim Speichern. Bitte versuche es später erneut.');
    }
});

// Navigation Highlight beim Scrollen
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Rick Animation beim Laden
window.addEventListener('load', () => {
    console.log('🎉 Road2Skill geladen! Rick ist bereit!');
    console.log('🧙‍♂️ Aktuelle Warteliste:', JSON.parse(localStorage.getItem('waitlist'))?.length || 0, 'Personen');
});

// Debug-Funktion: Zeige alle Wartelisten-Einträge (nur für Entwicklung)
function showWaitlist() {
    const waitlist = JSON.parse(localStorage.getItem('waitlist')) || [];
    console.table(waitlist);
    return waitlist;
}

// Debug-Funktion: Lösche Warteliste (nur für Tests)
function clearWaitlist() {
    localStorage.removeItem('waitlist');
    console.log('🗑️ Warteliste gelöscht!');
}
// Rick Confetti Easter Egg 🎉
const rickImage = document.getElementById('rick-confetti');

if (rickImage) {
    rickImage.addEventListener('click', function(event) {
        // Position des Klicks
        const rect = rickImage.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        
        // Konfetti-Explosion!
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: x, y: y },
            colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
            ticks: 200
        });
        
        // Extra Konfetti für mehr Effekt
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: x, y: y },
                colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
            });
        }, 100);
        
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: x, y: y },
                colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
            });
        }, 100);
        
        console.log('🎉 Rick macht Party!');
    });
}
// Intelligenter Loading Screen - Nur bei langsamer Ladung
let loadingTimeout;
let isPageLoaded = false;

// Zeige Loading Screen nur, wenn Seite länger als 300ms lädt
loadingTimeout = setTimeout(() => {
    if (!isPageLoaded) {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex'; // Zeige nur wenn wirklich nötig
        }
    }
}, 300); // 300ms Schwellenwert - zeige nur bei langsamer Ladung

// Wenn Seite fertig geladen ist
window.addEventListener('load', function() {
    isPageLoaded = true;
    clearTimeout(loadingTimeout); // Verhindere Anzeige, wenn schnell geladen
    
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
});
