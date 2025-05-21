document.addEventListener('DOMContentLoaded', () => {
    const heroContent = document.querySelector('.hero-content');
    
    // Animação de entrada suave
    heroContent.style.opacity = 0;
    heroContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        heroContent.style.transition = 'all 1s ease';
        heroContent.style.opacity = 1;
        heroContent.style.transform = 'translateY(0)';
    }, 300);

    // Efeito de hover nos links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            e.target.style.color = '#ffd700';
        });
        link.addEventListener('mouseleave', (e) => {
            e.target.style.color = 'white';
        });
    });

    // Social Button Hover Effects
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            e.target.style.transform = 'scale(1.2) translateX(-15px)';
        });
        button.addEventListener('mouseleave', (e) => {
            e.target.style.transform = 'scale(1) translateX(0)';
        });
    });

    // Service Card Modal Logic
    const serviceCards = document.querySelectorAll('.service-card');
    const modals = document.querySelectorAll('.modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            modal.style.display = 'flex';
        });
    });

    closeModalButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    const videoThumbnails = document.querySelectorAll('.video-thumb');
    const mainVideoFrame = document.querySelector('.main-video iframe');

    videoThumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Remove active class from all thumbnails
            videoThumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            thumb.classList.add('active');
            
            // Get video ID and update iframe src
            const videoId = thumb.getAttribute('data-video-id');
            mainVideoFrame.src = `https://www.youtube.com/embed/${videoId}`;
        });
    });

    // Portfolio Modal Logic
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const modalId = item.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            modal.style.display = 'flex';
        });
    });

    // Web Preview Fullscreen Logic
    const previewItems = document.querySelectorAll('.preview-item');
    const fullscreenModal = document.getElementById('fullscreen-preview-modal');
    const fullscreenIframe = document.getElementById('fullscreen-iframe');
    const fullscreenCloseBtn = document.querySelector('.fullscreen-close');

    previewItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Check if the clicked element is not a direct link
            if (!e.target.closest('a')) {
                const fullscreenSrc = item.getAttribute('data-fullscreen-src');
                fullscreenIframe.src = fullscreenSrc;
                fullscreenModal.style.display = 'flex';
            }
        });
    });

    fullscreenCloseBtn.addEventListener('click', () => {
        fullscreenModal.style.display = 'none';
        fullscreenIframe.src = ''; // Clear the iframe src
    });

    // Close fullscreen modal when clicking outside
    fullscreenModal.addEventListener('click', (e) => {
        if (e.target === fullscreenModal) {
            fullscreenModal.style.display = 'none';
            fullscreenIframe.src = ''; // Clear the iframe src
        }
    });

    const commentNameInput = document.getElementById('comment-name');
    const commentMessageInput = document.getElementById('comment-message');
    const submitCommentBtn = document.getElementById('submit-comment');
    const commentsContainer = document.getElementById('comments-container');

    // Function to load comments and manage replies
    function loadComments() {
        const comments = JSON.parse(localStorage.getItem('websiteComments') || '[]');
        const commentsContainer = document.getElementById('comments-container');
        commentsContainer.innerHTML = ''; // Clear existing comments
        
        comments.forEach((comment, index) => {
            const commentElement = createCommentElement(comment, index);
            commentsContainer.prepend(commentElement);
        });
    }

    // Create comment element with reply management
    function createCommentElement(comment, index) {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        
        const timestamp = new Date(comment.timestamp).toLocaleString();
        
        commentDiv.innerHTML = `
            <div class="comment-header">
                <strong>${comment.name}</strong>
                <span class="comment-time">${timestamp}</span>
            </div>
            <div class="comment-body">${comment.message}</div>
            <div class="comment-actions">
                <button class="reply-btn" data-index="${index}">Responder</button>
            </div>
            <div class="replies-container" id="replies-${index}"></div>
        `;

        // Add reply functionality
        const replyBtn = commentDiv.querySelector('.reply-btn');
        const repliesContainer = commentDiv.querySelector('.replies-container');
        
        // Retrieve and add existing replies for this comment
        const comments = JSON.parse(localStorage.getItem('websiteComments') || '[]');
        const commentReplies = comments[index] && comments[index].replies ? comments[index].replies : [];
        
        commentReplies.forEach(reply => {
            const replyElement = document.createElement('div');
            replyElement.classList.add('reply');
            replyElement.innerHTML = `
                <div class="reply-header">
                    <strong>${reply.name}</strong>
                    <span class="reply-time">${new Date(reply.timestamp).toLocaleString()}</span>
                </div>
                <div class="reply-body">${reply.message}</div>
            `;
            repliesContainer.appendChild(replyElement);
        });
        
        replyBtn.addEventListener('click', () => {
            // Create reply input
            const replyInput = document.createElement('div');
            replyInput.classList.add('reply-input');
            replyInput.innerHTML = `
                <input type="text" placeholder="Seu nome" class="reply-name">
                <textarea placeholder="Sua resposta..." class="reply-message"></textarea>
                <button class="submit-reply">Enviar Resposta</button>
            `;

            repliesContainer.appendChild(replyInput);

            // Submit reply logic
            const submitReplyBtn = replyInput.querySelector('.submit-reply');
            submitReplyBtn.addEventListener('click', () => {
                const replyNameInput = replyInput.querySelector('.reply-name');
                const replyMessageInput = replyInput.querySelector('.reply-message');

                if (replyNameInput.value.trim() && replyMessageInput.value.trim()) {
                    const reply = {
                        name: replyNameInput.value.trim(),
                        message: replyMessageInput.value.trim(),
                        timestamp: new Date().toISOString()
                    };

                    // Retrieve current comments and add reply
                    const comments = JSON.parse(localStorage.getItem('websiteComments') || '[]');
                    
                    // Ensure the comment has a replies array
                    if (!comments[index].replies) {
                        comments[index].replies = [];
                    }
                    
                    comments[index].replies.push(reply);
                    localStorage.setItem('websiteComments', JSON.stringify(comments));

                    // Create reply element
                    const replyElement = document.createElement('div');
                    replyElement.classList.add('reply');
                    replyElement.innerHTML = `
                        <div class="reply-header">
                            <strong>${reply.name}</strong>
                            <span class="reply-time">${new Date(reply.timestamp).toLocaleString()}</span>
                        </div>
                        <div class="reply-body">${reply.message}</div>
                    `;

                    repliesContainer.appendChild(replyElement);

                    // Clear inputs
                    replyNameInput.value = '';
                    replyMessageInput.value = '';
                    replyInput.remove();
                }
            });
        });

        return commentDiv;
    }

    // Function to remove comments older than 3 days
    function cleanupOldComments() {
        const comments = JSON.parse(localStorage.getItem('websiteComments') || '[]');
        const currentTime = new Date().getTime();
        const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

        // Filter out comments and their replies older than 3 days
        const filteredComments = comments.filter(comment => {
            const commentTime = new Date(comment.timestamp).getTime();
            
            // If the comment is older than 3 days, remove it and its replies
            if ((currentTime - commentTime) > threeDaysInMilliseconds) {
                return false;
            }
            
            // If the comment has replies, filter out old replies
            if (comment.replies) {
                comment.replies = comment.replies.filter(reply => {
                    const replyTime = new Date(reply.timestamp).getTime();
                    return (currentTime - replyTime) <= threeDaysInMilliseconds;
                });
            }
            
            return true;
        });

        // Save filtered comments back to localStorage
        localStorage.setItem('websiteComments', JSON.stringify(filteredComments));

        // Reload comments
        loadComments();
    }

    // Cleanup old comments when page loads
    cleanupOldComments();

    // Submit comment
    submitCommentBtn.addEventListener('click', () => {
        const name = commentNameInput.value.trim();
        const message = commentMessageInput.value.trim();

        if (name && message) {
            const comment = {
                name: name,
                message: message,
                timestamp: new Date().toISOString()
            };

            // Get existing comments or create new array
            const comments = JSON.parse(localStorage.getItem('websiteComments') || '[]');
            
            // Add new comment
            comments.push(comment);

            // Save to localStorage
            localStorage.setItem('websiteComments', JSON.stringify(comments));

            // Cleanup old comments
            cleanupOldComments();
        }
    });

    // Language Selector Logic
    const langToggleBtn = document.getElementById('lang-toggle');
    const htmlElement = document.documentElement;

    // Default to Portuguese
    let currentLang = 'pt-BR';

    const translations = {
        'pt-BR': {
            // Hero Section
            heroTitle: 'Bem-vindo ao Meu Mundo Digital JokerSama',
            heroSubtitle: 'Transformamos servidores privados em experiências únicas com criatividade e técnica.',
            heroButton: 'Descubra Mais',

            // Navigation Links
            navLinks: ['Início', 'Sobre', 'Serviços', 'Contato'],

            // About Section
            aboutTitle: 'Sobre Nós',
            aboutSubtitle: 'Transformamos suas ideias em um servidor exclusivo!',
            aboutDescription: 'Somos um time que ama Ragnarök e criar coisas novas! Fazemos servidores personalizados para deixar seu jogo incrível. Juntamos criatividade e conhecimento técnico para transformar suas ideias em um mundo único - onde cada NPC, mapa e regra do jogo é feito com cuidado para você viver aventuras inesquecíveis!',
            
            aboutHighlights: [
                {
                    icon: 'fas fa-rocket',
                    title: 'Inovação',
                    description: 'Sempre buscando as melhores ideias para deixar seu servidor único e moderno!'
                },
                {
                    icon: 'fas fa-users',
                    title: 'Colaboração',
                    description: 'Trabalhamos em equipe com você para entender suas ideias e criar seu servidor!'
                },
                {
                    icon: 'fas fa-chart-line',
                    title: 'Resultados',
                    description: 'Focados em fazer um Ragnarök que realmente diverte e surpreende!'
                }
            ],

            // Services Section
            servicesTitle: 'Nossos Serviços',
            services: [
                {
                    icon: 'fas fa-paint-brush',
                    title: 'Design Criativo',
                    description: 'Criamos mapas, interfaces e NPCs visuais únicos para seu servidor.'
                },
                {
                    icon: 'fas fa-code',
                    title: 'Desenvolvimento de Sistemas',
                    description: 'Programamos sistemas exclusivos para seu RO.'
                },
                {
                    icon: 'fas fa-bullhorn',
                    title: 'Divulgação',
                    description: 'Ajudamos a promover seu servidor!'
                }
            ],

            // Portfolio Section
            portfolioTitle: 'Nosso Portfólio',
            portfolioItems: [
                {
                    title: 'Sistema Miner',
                    subtitle: 'Desenvolvimento de Sistemas'
                },
                {
                    title: 'Sistema Draco',
                    subtitle: 'Desenvolvimento de Sistemas'
                },
                {
                    title: 'Marketplace',
                    subtitle: 'Marketplace Web'
                },
                {
                    title: 'Sistema Pesca',
                    subtitle: 'Desenvolvimento de Sistemas'
                }
            ],

            // Web Previews Section
            webPreviewsTitle: 'Pré-Visualização de Projetos Web',
            webPreviews: [
                { title: 'Wiki - New4th', description: 'Projeto New4th! (WIKI)' },
                { title: 'Flappy Ring', description: 'Projeto Flappy Ring' },
                { title: 'WTTO', description: 'Projeto Game WTTO' },
                { title: 'New4th', description: 'Projeto New4th' }
            ],

            // YouTube Videos Section
            videosTitle: 'Vídeos Promocionais',

            // Contact Section
            contactTitle: 'Fale Conosco',
            commentPlaceholder: {
                name: 'Seu Nome',
                message: 'Deixe sua mensagem...',
                submit: 'Enviar Comentário'
            },

            // Footer
            footerCopyright: ' 2025 Meu Mundo. Todos os direitos reservados.'
        },
        'en-US': {
            // Hero Section
            heroTitle: 'Welcome to My Digital World JokerSama',
            heroSubtitle: 'We transform private servers into unique experiences with creativity and technique.',
            heroButton: 'Discover More',

            // Navigation Links
            navLinks: ['Home', 'About', 'Services', 'Contact'],

            // About Section
            aboutTitle: 'About Us',
            aboutSubtitle: 'We transform your ideas into an exclusive server!',
            aboutDescription: 'We are a team that loves Ragnarök and creating new things! We make personalized servers to make your game incredible. We combine creativity and technical knowledge to transform your ideas into a unique world - where each NPC, map, and game rule is carefully crafted for you to live unforgettable adventures!',
            
            aboutHighlights: [
                {
                    icon: 'fas fa-rocket',
                    title: 'Innovation',
                    description: 'Always seeking the best ideas to make your server unique and modern!'
                },
                {
                    icon: 'fas fa-users',
                    title: 'Collaboration',
                    description: 'We work as a team with you to understand your ideas and create your server!'
                },
                {
                    icon: 'fas fa-chart-line',
                    title: 'Results',
                    description: 'Focused on creating a Ragnarök that truly entertains and surprises!'
                }
            ],

            // Services Section
            servicesTitle: 'Our Services',
            services: [
                {
                    icon: 'fas fa-paint-brush',
                    title: 'Creative Design',
                    description: 'We create unique maps, interfaces, and visual NPCs for your server.'
                },
                {
                    icon: 'fas fa-code',
                    title: 'System Development',
                    description: 'We program exclusive systems for your RO.'
                },
                {
                    icon: 'fas fa-bullhorn',
                    title: 'Promotion',
                    description: 'We help promote your server!'
                }
            ],

            // Portfolio Section
            portfolioTitle: 'Our Portfolio',
            portfolioItems: [
                {
                    title: 'Miner System',
                    subtitle: 'Systems development'
                },
                {
                    title: 'Draco System',
                    subtitle: 'Systems development'
                },
                {
                    title: 'Marketplace',
                    subtitle: 'Marketplace Web'
                },
                {
                    title: 'Fishing System',
                    subtitle: 'Systems development'
                }
            ],

            // Web Previews Section
            webPreviewsTitle: 'Web Project Previews',
            webPreviews: [
                { title: 'Wiki - New4th', description: 'New4th Project! (WIKI)' },
                { title: 'Flappy Ring', description: 'Flappy Ring Project' },
                { title: 'WTTO', description: 'WTTO Game Project' },
                { title: 'New4th', description: 'New4th Project' }
            ],

            // YouTube Videos Section
            videosTitle: 'Promotional Videos',

            // Contact Section
            contactTitle: 'Contact Us',
            commentPlaceholder: {
                name: 'Your Name',
                message: 'Leave your message...',
                submit: 'Submit Question'
            },

            // Footer
            footerCopyright: ' 2025 My World. All rights reserved.'
        }
    };

    function updateLanguage(lang) {
        htmlElement.lang = lang;
        currentLang = lang;

        // Update hero section
        const heroTitle = document.querySelector('.hero-content h2');
        const heroSubtitle = document.querySelector('.hero-content p');
        const heroButton = document.querySelector('.hero-content .btn-primary');
        if (heroTitle) heroTitle.textContent = translations[lang].heroTitle;
        if (heroSubtitle) heroSubtitle.textContent = translations[lang].heroSubtitle;
        if (heroButton) heroButton.textContent = translations[lang].heroButton;

        // Update nav links
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach((link, index) => {
            link.textContent = translations[lang].navLinks[index];
        });

        // Update about section
        const aboutTitle = document.querySelector('#sobre h2');
        const aboutSubtitle = document.querySelector('.about-text h3');
        const aboutDescription = document.querySelector('.about-text p');
        if (aboutTitle) aboutTitle.textContent = translations[lang].aboutTitle;
        if (aboutSubtitle) aboutSubtitle.textContent = translations[lang].aboutSubtitle;
        if (aboutDescription) aboutDescription.textContent = translations[lang].aboutDescription;

        // Update about highlights
        const highlightItems = document.querySelectorAll('.highlight-item');
        highlightItems.forEach((item, index) => {
            const highlight = translations[lang].aboutHighlights[index];
            item.querySelector('h4').textContent = highlight.title;
            item.querySelector('p').textContent = highlight.description;
        });

        // Update services section
        const servicesTitle = document.querySelector('#servicos h2');
        const serviceCards = document.querySelectorAll('.service-card');
        if (servicesTitle) servicesTitle.textContent = translations[lang].servicesTitle;
        serviceCards.forEach((card, index) => {
            const service = translations[lang].services[index];
            card.querySelector('h3').textContent = service.title;
            card.querySelector('p').textContent = service.description;
        });

        // Update portfolio section
        const portfolioTitle = document.querySelector('.portfolio h2');
        const portfolioOverlays = document.querySelectorAll('.portfolio-overlay');
        if (portfolioTitle) portfolioTitle.textContent = translations[lang].portfolioTitle;
        portfolioOverlays.forEach((overlay, index) => {
            const item = translations[lang].portfolioItems[index];
            overlay.querySelector('h3').textContent = item.title;
            overlay.querySelector('p').textContent = item.subtitle;
        });

        // Update web previews section
        const webPreviewsTitle = document.querySelector('#web-previews h2');
        const webPreviewDetails = document.querySelectorAll('.preview-details p');
        if (webPreviewsTitle) webPreviewsTitle.textContent = translations[lang].webPreviewsTitle;
        webPreviewDetails.forEach((detail, index) => {
            detail.textContent = translations[lang].webPreviews[index].description;
        });

        // Update videos section
        const videosTitle = document.querySelector('#videos h2');
        if (videosTitle) videosTitle.textContent = translations[lang].videosTitle;

        // Update contact section
        const contactTitle = document.querySelector('#contato h2');
        const commentNameInput = document.getElementById('comment-name');
        const commentMessageInput = document.getElementById('comment-message');
        const submitCommentBtn = document.getElementById('submit-comment');
        if (contactTitle) contactTitle.textContent = translations[lang].contactTitle;
        if (commentNameInput) commentNameInput.placeholder = translations[lang].commentPlaceholder.name;
        if (commentMessageInput) commentMessageInput.placeholder = translations[lang].commentPlaceholder.message;
        if (submitCommentBtn) submitCommentBtn.textContent = translations[lang].commentPlaceholder.submit;

        // Update footer
        const footerCopyright = document.querySelector('footer p');
        if (footerCopyright) footerCopyright.textContent = translations[lang].footerCopyright;

        // Update language toggle button flag
        langToggleBtn.innerHTML = lang === 'pt-BR' 
            ? '<span class="fi fi-br"></span>' 
            : '<span class="fi fi-us"></span>';
    }

    langToggleBtn.addEventListener('click', () => {
        const newLang = currentLang === 'pt-BR' ? 'en-US' : 'pt-BR';
        updateLanguage(newLang);
    });

    // Initialize with Portuguese
    updateLanguage('pt-BR');
});