// Qurilma turini aniqlash
function detectDeviceType() {
    const deviceText = document.getElementById('deviceText');
    const deviceIcon = document.querySelector('.device-icon');
    
    if (!deviceText || !deviceIcon) return;
    
    const userAgent = navigator.userAgent;
    let deviceType = '';
    let icon = '📱';
    
    // Qurilma turini aniqlash
    if (/Android/i.test(userAgent)) {
        deviceType = 'Android';
        icon = '🤖';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        deviceType = /iPad/i.test(userAgent) ? 'iPad' : 'iPhone';
        icon = '📱';
    } else if (/Windows/i.test(userAgent)) {
        deviceType = /Windows Phone/i.test(userAgent) ? 'WinPhone' : 'Windows';
        icon = '💻';
    } else if (/Macintosh/i.test(userAgent)) {
        deviceType = 'Mac';
        icon = '💻';
    } else if (/Linux/i.test(userAgent)) {
        deviceType = 'Linux';
        icon = '💻';
    } else {
        deviceType = 'Desktop';
        icon = '💻';
    }
    
    // Web yoki Mobile ekanligini aniqlash
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    
    if (isMobile) {
        if (!deviceType.includes('Phone') && !deviceType.includes('Android') && !deviceType.includes('iPhone')) {
            deviceType += ' Mobile';
        }
    }
    
    // Ekran o'lchamiga qarab qo'shimcha ma'lumot
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
        if (!isMobile) {
            deviceType += ' Tablet';
        }
    }
    
    deviceText.textContent = deviceType;
    deviceIcon.textContent = icon;
    
    // Qurilma turiga qarab body class qo'shish
    if (isMobile) {
        document.body.classList.add('mobile-device');
        if (isIOS) {
            document.body.classList.add('ios-device');
        } else {
            document.body.classList.add('android-device');
        }
    } else {
        document.body.classList.add('desktop-device');
    }
    
    // Safe area uchun padding o'rnatish
    setupSafeArea();
}

// Safe area uchun sozlash
function setupSafeArea() {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isIOS) {
        // iOS uchun safe area
        const header = document.querySelector('.glass-header');
        const footer = document.querySelector('.glass-footer');
        
        if (header) {
            header.style.paddingTop = 'calc(16px + env(safe-area-inset-top))';
        }
        
        if (footer) {
            footer.style.paddingBottom = 'env(safe-area-inset-bottom)';
        }
    }
}

// Scrollni bloklash va frame'ni sozlash
function setupFrameScrolling() {
    // Asosiy body scrollini to'xtatish
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Mobile frame ichidagi scrollni yoqish
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.overflowY = 'auto';
        mainContent.style.webkitOverflowScrolling = 'touch';
    }
    
    // Touch eventlarini boshqarish
    let startY = 0;
    let isScrolling = false;
    
    document.addEventListener('touchstart', function(e) {
        const mainContent = document.querySelector('.main-content');
        const touchInContent = mainContent && mainContent.contains(e.target);
        
        if (!touchInContent) {
            // Frame tashqarisida touch bosilsa, scrollni bloklash
            e.preventDefault();
        }
        
        startY = e.touches[0].clientY;
        isScrolling = false;
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        const mainContent = document.querySelector('.main-content');
        const touchInContent = mainContent && mainContent.contains(e.target);
        
        if (!touchInContent) {
            // Frame tashqarisida harakatlansa, scrollni to'xtatish
            e.preventDefault();
            return;
        }
        
        // Frame ichida scroll qilish
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        // Agar scroll pastga borayotgan bo'lsa va content yuqorida bo'lsa
        const isAtTop = mainContent.scrollTop === 0;
        const isAtBottom = mainContent.scrollHeight - mainContent.scrollTop === mainContent.clientHeight;
        
        if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
            // Chegaralarda scrollni bloklash
            e.preventDefault();
        }
        
        isScrolling = true;
    }, { passive: false });
    
    document.addEventListener('touchend', function(e) {
        isScrolling = false;
    });
    
    // Double tap to zoom ni oldini olish
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('gesturechange', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('gestureend', function(e) {
        e.preventDefault();
    });
}

// Telegram WebApp ni ishga tushirish
function initTelegramWebApp() {
    try {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            
            // To'liq ekranga chiqarish
            tg.expand();
            
            // Mavzu ranglarini o'rnatish
            tg.setHeaderColor('#000000');
            tg.setBackgroundColor('#111111');
            
            // Foydalanuvchi ma'lumotlarini olish
            const user = tg.initDataUnsafe?.user;
            
            if (user) {
                updateUserName(user);
            } else {
                // Standart foydalanuvchi ma'lumotlari
                updateUserName({
                    first_name: 'Telegram',
                    last_name: 'Foydalanuvchi'
                });
            }
            
            // WebApp tayyor ekanligini bildirish
            tg.ready();
            
            // Telegram WebApp bo'lsa, frame'ni to'liq ekran qilish
            document.body.style.background = '#111111';
            document.querySelector('.mobile-frame').style.borderRadius = '0';
            document.querySelector('.mobile-frame').style.maxWidth = '100%';
            document.querySelector('.mobile-frame').style.maxHeight = '100%';
            
        } else {
            console.log('Telegram WebApp API topilmadi');
            updateUserName({
                first_name: 'Veb',
                last_name: 'Foydalanuvchi'
            });
        }
    } catch (error) {
        console.error('Telegram WebApp ishga tushirishda xato:', error);
        updateUserName({
            first_name: 'Foydalanuvchi',
            last_name: ''
        });
    }
}

// Foydalanuvchi ismini yangilash
function updateUserName(user) {
    const userNameElement = document.getElementById('telegramUserName');
    
    if (userNameElement) {
        const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
        userNameElement.textContent = fullName || 'Foydalanuvchi';
    }
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('InfoBox Demo Initialized');
    
    // Qurilma turini aniqlash
    detectDeviceType();
    
    // Frame scroll sozlamalari
    setupFrameScrolling();
    
    // Initialize the app
    initApp();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize animations
    initAnimations();
    
    // Setup stats
    setupStats();
});

// Initialize App
function initApp() {
    // Create assets directory if needed
    console.log('Creating assets directory structure...');
    
    // Add some initial particles for visual effect
    setTimeout(() => {
        createWelcomeParticles();
    }, 1000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Airdrop button
    const airdropButton = document.getElementById('airdropButton');
    let clickCount = 0;
    let animationCount = 0;
    let particleCount = 0;
    
    airdropButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Increment counters
        clickCount++;
        document.getElementById('clickCount').textContent = clickCount;
        
        // Add click animation
        this.classList.add('airdrop-click');
        
        // Show notification
        showNotification('USER AIRDROP - 235 tokens available!');
        
        // Create particle animation
        const particles = createParticleAnimation(this);
        particleCount += particles;
        document.getElementById('particleCount').textContent = particleCount;
        
        // Animate stars
        animateStars();
        animationCount += 3;
        document.getElementById('animationCount').textContent = animationCount;
        
        // Toggle active state
        const isActive = this.classList.contains('active');
        this.classList.toggle('active', !isActive);
        
        // Show detailed alert
        setTimeout(() => {
            if (confirm('USER AIRDROP\n\nВаш баланс: 235 токенов\n\nУчаствуйте в играх и зарабатывайте токены!\n\nТокены можно обменять на награды.\n\nПодробнее?')) {
                window.open('https://example.com/airdrop', '_blank');
            }
        }, 500);
        
        // Remove click animation after completion
        setTimeout(() => {
            this.classList.remove('airdrop-click');
        }, 300);
    });
    
    // Hover effects
    airdropButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
        const glow = this.querySelector('.airdrop-glow');
        if (glow) glow.style.opacity = '0.8';
    });
    
    airdropButton.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active')) {
            this.style.transform = '';
            const glow = this.querySelector('.airdrop-glow');
            if (glow) glow.style.opacity = '0';
        }
    });
    
    // Menu button
    const menuButton = document.getElementById('menuButton');
    menuButton.addEventListener('click', function() {
        showNotification('Menu opened - More options coming soon!');
        this.classList.add('airdrop-click');
        setTimeout(() => {
            this.classList.remove('airdrop-click');
        }, 300);
    });
    
    // Navigation items - faqat bosiladigan itemlar
    const navItems = document.querySelectorAll('.nav-item:not(.device-info)');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show notification
            const label = this.querySelector('.nav-label').textContent;
            showNotification(`Navigating to ${label}`);
            
            // Update page content based on navigation
            updateContent(label);
        });
    });
    
    // Device info elementiga click event qo'shmaslik
    const deviceInfo = document.querySelector('.device-info');
    if (deviceInfo) {
        deviceInfo.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Hech narsa qilmaymiz, chunki bu element bosilmaydi
        });
    }
    
    // Add touch events for mobile
    airdropButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(0.95)';
    }, { passive: false });
    
    airdropButton.addEventListener('touchend', function() {
        this.style.transform = '';
    });
    
    // Resize event
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
}

// Handle resize and orientation change
function handleResize() {
    // Qurilma turini yangilash
    detectDeviceType();
    
    // Frame o'lchamini yangilash
    const mobileFrame = document.querySelector('.mobile-frame');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Mobile qurilmalarda
        mobileFrame.style.width = '100%';
        mobileFrame.style.height = '100%';
        mobileFrame.style.borderRadius = '0';
        mobileFrame.style.maxWidth = '100%';
        mobileFrame.style.maxHeight = '100%';
    } else {
        // Desktop qurilmalarda
        mobileFrame.style.width = '100%';
        mobileFrame.style.maxWidth = '430px';
        mobileFrame.style.height = '90vh';
        mobileFrame.style.maxHeight = '932px';
        mobileFrame.style.borderRadius = '30px';
        mobileFrame.style.margin = 'auto';
    }
    
    console.log('Window resized:', window.innerWidth, 'x', window.innerHeight, 'orientation:', window.orientation);
}

// Initialize Animations
function initAnimations() {
    console.log('Initializing animations...');
    
    // Randomize star animation delays
    const stars = document.querySelectorAll('.star-icon');
    stars.forEach((star, index) => {
        const randomDelay = Math.random() * 0.5;
        star.style.animationDelay = `${randomDelay}s`;
    });
    
    // Add floating animation to airdrop button
    const airdropButton = document.getElementById('airdropButton');
    let floatDirection = 1;
    
    setInterval(() => {
        if (!airdropButton.classList.contains('active') && 
            !airdropButton.classList.contains('airdrop-click')) {
            
            const currentTransform = airdropButton.style.transform || '';
            const currentY = currentTransform.includes('translateY') ? 
                parseFloat(currentTransform.match(/translateY\(([^)]+)\)/)?.[1] || 0) : 0;
            
            const newY = currentY + (0.2 * floatDirection);
            airdropButton.style.transform = `translateY(${newY}px)`;
            
            if (Math.abs(newY) >= 2) {
                floatDirection *= -1;
            }
        }
    }, 50);
    
    // Add subtle pulse to menu button
    const menuButton = document.getElementById('menuButton');
    setInterval(() => {
        if (!menuButton.classList.contains('airdrop-click')) {
            menuButton.style.boxShadow = '0 0 10px rgba(135, 116, 225, 0.3)';
            setTimeout(() => {
                menuButton.style.boxShadow = '';
            }, 1000);
        }
    }, 5000);
}

// Setup Stats
function setupStats() {
    // Initialize counters
    document.getElementById('clickCount').textContent = '0';
    document.getElementById('animationCount').textContent = '0';
    document.getElementById('particleCount').textContent = '0';
    
    // Add auto-increment for demo
    setInterval(() => {
        const animationCount = document.getElementById('animationCount');
        const current = parseInt(animationCount.textContent);
        if (current < 100) {
            animationCount.textContent = current + 1;
        }
    }, 10000);
}

// Animate Stars
function animateStars() {
    const stars = document.querySelectorAll('.star-icon');
    
    stars.forEach((star, index) => {
        setTimeout(() => {
            // Save original animation
            const originalAnimation = star.style.animation;
            
            // Boost animation
            star.style.animation = 'none';
            star.style.transform = 'scale(1.5)';
            star.style.filter = 'brightness(2) drop-shadow(0 0 10px #00EFFF)';
            
            // Return to original
            setTimeout(() => {
                star.style.animation = originalAnimation;
                star.style.transform = '';
                star.style.filter = '';
            }, 300);
        }, index * 100);
    });
}

// Create Particle Animation
function createParticleAnimation(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const particleCount = 8;
    const colors = ['#00EFFF', '#8774e1', '#0075FF', '#FFFFFF'];
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(centerX, centerY, colors[i % colors.length]);
    }
    
    return particleCount;
}

// Create Particle
function createParticle(x, y, color) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: fixed;
        top: ${y}px;
        left: ${x}px;
        width: 6px;
        height: 6px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        opacity: 0.8;
    `;
    
    document.body.appendChild(particle);
    
    // Random direction and speed
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    const distance = 30 + Math.random() * 50;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    // Random size
    const size = 3 + Math.random() * 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Animate particle
    let currentX = 0;
    let currentY = 0;
    let opacity = 0.8;
    
    function animate() {
        currentX += vx;
        currentY += vy;
        
        particle.style.top = `${y + currentY}px`;
        particle.style.left = `${x + currentX}px`;
        
        // Fade out
        const distanceTraveled = Math.sqrt(currentX * currentX + currentY * currentY);
        if (distanceTraveled > distance) {
            opacity -= 0.05;
            particle.style.opacity = opacity;
        }
        
        // Shrink
        const currentSize = parseFloat(particle.style.width);
        if (currentSize > 0.5) {
            particle.style.width = `${currentSize * 0.95}px`;
            particle.style.height = `${currentSize * 0.95}px`;
        }
        
        if (opacity > 0 && currentSize > 0.5) {
            requestAnimationFrame(animate);
        } else {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }
    }
    
    animate();
    return particle;
}

// Create Welcome Particles
function createWelcomeParticles() {
    const airdropButton = document.getElementById('airdropButton');
    const rect = airdropButton.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create welcome particles
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            createWelcomeParticle(centerX, centerY);
        }, i * 100);
    }
}

// Create Welcome Particle
function createWelcomeParticle(startX, startY) {
    const particle = document.createElement('div');
    particle.className = 'welcome-particle';
    particle.style.cssText = `
        position: fixed;
        top: ${startY}px;
        left: ${startX}px;
        width: 4px;
        height: 4px;
        background: #00EFFF;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        opacity: 0;
    `;
    
    document.body.appendChild(particle);
    
    // Animate in circle
    const radius = 40;
    const startAngle = Math.random() * Math.PI * 2;
    const duration = 2000 + Math.random() * 1000;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        if (progress < 1) {
            const angle = startAngle + progress * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            // Fade in then out
            let opacity;
            if (progress < 0.5) {
                opacity = progress * 2;
            } else {
                opacity = (1 - progress) * 2;
            }
            
            particle.style.opacity = opacity;
            particle.style.top = `${startY + y}px`;
            particle.style.left = `${startX + x}px`;
            
            requestAnimationFrame(animate);
        } else {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }
    }
    
    animate();
}

// Show Notification
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification container if it doesn't exist
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        document.body.appendChild(container);
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Update Content based on Navigation
function updateContent(section) {
    const contentWrapper = document.querySelector('.content-wrapper');
    
    // Simple content update based on section
    switch(section.toLowerCase()) {
        case 'games':
            contentWrapper.innerHTML = `
                <h1 class="page-title">Games</h1>
                <p class="page-description">
                    Game section coming soon. The InfoBox will show game-specific stats.
                </p>
                <div class="demo-section">
                    <h2><i class="fas fa-gamepad"></i> Games Section</h2>
                    <p>Games content will appear here.</p>
                </div>
            `;
            break;
            
        case 'settings':
            contentWrapper.innerHTML = `
                <h1 class="page-title">Settings</h1>
                <p class="page-description">
                    Settings section. Configure your InfoBox preferences here.
                </p>
                <div class="demo-section">
                    <h2><i class="fas fa-cog"></i> Settings Section</h2>
                    <p>Settings content will appear here.</p>
                </div>
            `;
            break;
            
        default:
            // Default holatda hozirgi kontentni saqlab qolamiz
            break;
    }
    
    // Reinitialize event listeners for new content
    setTimeout(() => {
        setupEventListeners();
    }, 100);
}

// Add CSS for particles
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    .particle {
        transition: transform 0.1s linear;
    }
    
    .welcome-particle {
        transition: all 0.5s ease;
    }
    
    @keyframes particleFloat {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx, 20px), var(--ty, -20px)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);
