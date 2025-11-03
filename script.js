// script.js с jQuery
function initPopup() {
    const $openPopupBtn = $('#openPopupBtn');
    const $popupForm = $('#popupForm');
    const $closeBtn = $('.close-btn');

    if ($openPopupBtn.length && $popupForm.length) {
        $openPopupBtn.on('click', function() {
            $popupForm.css('display', 'flex');
        });

        $closeBtn.on('click', function() {
            $popupForm.hide();
        });

        $(window).on('click', function(e) {
            if (e.target === $popupForm[0]) {
                $popupForm.hide();
            }
        });

        $('#popupSubscribeForm').on('submit', function(e) {
            e.preventDefault();
            const $submitBtn = $(this).find('button[type="submit"]');
            const originalText = $submitBtn.html();
            
            $submitBtn.prop('disabled', true)
                .html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Please wait...');
            
            setTimeout(() => {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                $submitBtn.prop('disabled', false).html(originalText);
                $popupForm.hide();
                $(this).trigger('reset');
            }, 2000);
        });
    }
}

function initThemeToggle() {
    const $themeToggleBtn = $('#themeToggleBtn');
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        $('body').addClass('dark-theme');
        updateThemeButton(true);
    }

    if ($themeToggleBtn.length) {
        $themeToggleBtn.on('click', function() {
            isDarkMode = !isDarkMode;
            
            if (isDarkMode) {
                $('body').addClass('dark-theme');
                updateThemeButton(true);
                showNotification('Dark mode activated', 'info');
            } else {
                $('body').removeClass('dark-theme');
                updateThemeButton(false);
                showNotification('Light mode activated', 'info');
            }
            
            localStorage.setItem('darkMode', isDarkMode);
            playClickSound();
        });
    }
}

function updateThemeButton(isDark) {
    const $themeToggleBtn = $('#themeToggleBtn');
    if (!$themeToggleBtn.length) return;

    if (isDark) {
        $themeToggleBtn.html('<i class="fas fa-sun me-2"></i>Light Mode')
            .css({
                'background': 'linear-gradient(135deg, #eeff00ff 0%, #ffe600ff 100%)',
                'color': '#333'
            });
    } else {
        $themeToggleBtn.html('<i class="fas fa-moon me-2"></i>Dark Mode')
            .css({
                'background': 'linear-gradient(135deg, var(--primary-red) 0%, var(--dark-red) 100%)',
                'color': 'white'
            });
    }
}

function initScrollAnimations() {
    const $fadeElements = $('.fade-in');
    
    const fadeInOnScroll = function() {
        $fadeElements.each(function() {
            const $element = $(this);
            const elementTop = $element[0].getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                $element.css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }
        });
    };
    
    $fadeElements.css({
        'opacity': '0',
        'transform': 'translateY(30px)',
        'transition': 'opacity 0.8s ease, transform 0.8s ease'
    });
    
    fadeInOnScroll();
    $(window).on('scroll', fadeInOnScroll);
}

function initSoundEffects() {
    $('.btn-custom, .floating-btn, .aca-team-card, .notification-bell-btn').on('click', function() {
        playClickSound();
    });
    
    $('#themeToggleBtn').on('click', function() {
        playClickSound();
    });
}

function initInteractiveFAQ() {
    const $faqSection = $('.aca-faq-section');
    if (!$faqSection.length) return;

    const quizHTML = `
        <div class="quiz-container mt-5">
            <div class="card card-custom">
                <div class="card-body card-body-custom">
                    <h4 class="card-title-custom">American Culture Quiz</h4>
                    <p class="card-text-custom">Test your knowledge about American culture with this interactive quiz!</p>
                    <div id="quizQuestions"></div>
                    <button id="startQuiz" class="btn btn-custom mt-3">
                        <i class="fas fa-play me-2"></i>Start Quiz
                    </button>
                    <div id="quizResult" class="mt-3"></div>
                </div>
            </div>
        </div>
    `;

    const $faqAccordion = $('#faqAccordion');
    if ($faqAccordion.length) {
        $faqAccordion.after(quizHTML);
    }

    const quizData = [
        {
            question: "Which music genre originated in the United States?",
            options: ["Jazz", "Flamenco", "Reggae", "K-Pop"],
            correct: 0,
            fact: "Jazz originated in New Orleans in the late 19th century and is considered America's classical music."
        },
        {
            question: "What is the traditional American Thanksgiving dish?",
            options: ["Pizza", "Sushi", "Turkey", "Tacos"],
            correct: 2,
            fact: "Turkey has been the centerpiece of Thanksgiving meals since the 19th century, with over 46 million turkeys consumed each Thanksgiving."
        },
        {
            question: "Which sport is known as 'America's Pastime'?",
            options: ["Basketball", "Baseball", "Soccer", "Hockey"],
            correct: 1,
            fact: "Baseball earned the nickname 'America's Pastime' in the 1850s and was the first professional team sport in the US."
        },
        {
            question: "Which landmark is a symbol of American freedom?",
            options: ["Golden Gate Bridge", "Statue of Liberty", "Mount Rushmore", "Grand Canyon"],
            correct: 1,
            fact: "The Statue of Liberty was a gift from France in 1886 and has welcomed millions of immigrants to America."
        },
        {
            question: "What American holiday features fireworks displays?",
            options: ["Thanksgiving", "Independence Day", "Labor Day", "Memorial Day"],
            correct: 1,
            fact: "Independence Day (July 4th) celebrates the adoption of the Declaration of Independence in 1776 with fireworks across the nation."
        }
    ];

    $('#startQuiz').on('click', startQuiz);

    function startQuiz() {
        const $quizQuestions = $('#quizQuestions');
        const $startBtn = $('#startQuiz');
        const $quizResult = $('#quizResult');
        
        $startBtn.hide();
        $quizResult.empty();
        
        let score = 0;
        let currentQuestion = 0;
        let userAnswers = [];
        
        function showQuestion() {
            if (currentQuestion >= quizData.length) {
                showResults();
                return;
            }
            
            const q = quizData[currentQuestion];
            $quizQuestions.html(`
                <div class="question-container">
                    <h5>Question ${currentQuestion + 1}/${quizData.length}</h5>
                    <p class="fw-semibold">${q.question}</p>
                    <div class="options-container">
                        ${q.options.map((option, index) => `
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="radio" name="quizAnswer" id="option${currentQuestion}_${index}" value="${index}">
                                <label class="form-check-label" for="option${currentQuestion}_${index}">
                                    ${option}
                                </label>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-custom mt-3" id="quizNextBtn">
                        ${currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                </div>
            `);

            $('#quizNextBtn').on('click', checkAnswer);
        }
        
        function checkAnswer() {
            const $selected = $('input[name="quizAnswer"]:checked');
            if (!$selected.length) {
                showNotification('Please select an answer!', 'warning');
                return;
            }
            
            const selectedAnswer = parseInt($selected.val());
            const isCorrect = selectedAnswer === quizData[currentQuestion].correct;
            
            userAnswers.push({
                question: quizData[currentQuestion].question,
                userAnswer: quizData[currentQuestion].options[selectedAnswer],
                correctAnswer: quizData[currentQuestion].options[quizData[currentQuestion].correct],
                isCorrect: isCorrect,
                fact: quizData[currentQuestion].fact
            });
            
            if (isCorrect) {
                score++;
                playSuccessSound();
                showNotification('Correct answer! 🎉', 'success', 2000);
            } else {
                playErrorSound();
                showNotification('Wrong answer, try again! 💡', 'error', 2000);
            }
            
            currentQuestion++;
            showQuestion();
        }
        
        function showResults() {
            const percentage = Math.round((score / quizData.length) * 100);
            let message, alertClass;
            
            switch(true) {
                case percentage >= 80:
                    message = "🎉 Excellent! You're an American culture expert!";
                    alertClass = "alert-success";
                    break;
                case percentage >= 60:
                    message = "👍 Great job! You know American culture well!";
                    alertClass = "alert-info";
                    break;
                case percentage >= 40:
                    message = "💡 Good effort! Keep learning about American culture!";
                    alertClass = "alert-warning";
                    break;
                default:
                    message = "📚 Keep exploring! American culture has so much to discover!";
                    alertClass = "alert-danger";
            }
            
            $quizQuestions.empty();
            $quizResult.html(`
                <div class="alert ${alertClass}">
                    <h5>Quiz Complete!</h5>
                    <p>You scored <strong>${score} out of ${quizData.length}</strong> (${percentage}%)</p>
                    <p class="mb-0">${message}</p>
                </div>
                
                <div class="detailed-results mt-4">
                    <h6>Detailed Results:</h6>
                    ${userAnswers.map((answer, index) => `
                        <div class="card mb-2 ${answer.isCorrect ? 'border-success' : 'border-danger'}">
                            <div class="card-body py-2">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-semibold">Q${index + 1}: ${answer.question}</span>
                                    <span class="badge ${answer.isCorrect ? 'bg-success' : 'bg-danger'}">
                                        ${answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                    </span>
                                </div>
                                ${!answer.isCorrect ? `
                                    <div class="mt-1">
                                        <small class="text-muted">Your answer: ${answer.userAnswer}</small><br>
                                        <small class="text-success">Correct answer: ${answer.correctAnswer}</small>
                                    </div>
                                ` : ''}
                                <div class="mt-1">
                                    <small class="text-info"><i>💡 ${answer.fact}</i></small>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-4">
                    <button class="btn btn-custom me-2" id="tryAgainBtn">
                        <i class="fas fa-redo me-2"></i>Try Again
                    </button>
                    <button class="btn btn-outline-custom" id="shareResultsBtn">
                        <i class="fas fa-share me-2"></i>Share Results
                    </button>
                </div>
            `);
            
            $('#tryAgainBtn').on('click', function() {
                $startBtn.show();
                $quizResult.empty();
                score = 0;
                currentQuestion = 0;
                userAnswers = [];
            });
            
            $('#shareResultsBtn').on('click', function() {
                const shareText = `I scored ${score}/${quizData.length} on the American Culture Quiz! How well do you know American culture?`;
                if (navigator.share) {
                    navigator.share({
                        title: 'American Culture Quiz Results',
                        text: shareText,
                        url: window.location.href
                    });
                } else {
                    showNotification(shareText + '\n\nShare this with your friends!', 'info', 5000);
                }
            });

            addNotification('Quiz Completed! 🎯', 'success', `You scored ${score}/${quizData.length} on the American Culture Quiz!`);
        }
        
        showQuestion();
    }
}

function playSuccessSound() {
    playTone(523.25, 0.2, 'sine');
}

function playErrorSound() {
    playTone(392.00, 0.3, 'square');
}

function playRatingSound() {
    playTone(800, 0.3, 'sine');
}

function playClickSound() {
    playTone(523.25, 0.1, 'sine');
}

function playTone(frequency, duration, type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function initRatingStars() {
    const $stars = $('.star');
    const $ratingText = $('#rating-text');
    
    if (!$stars.length || !$ratingText.length) return;
    
    $stars.on('click', function() {
        const rating = parseInt($(this).data('rating'));
        
        $stars.each(function() {
            const $star = $(this);
            const starRating = parseInt($star.data('rating'));
            if (starRating <= rating) {
                $star.addClass('active');
            } else {
                $star.removeClass('active');
            }
        });
        
        const messages = {
            1: "Thanks for 1 star! We'll work harder to improve! 🌟",
            2: "Thanks for 2 stars! We appreciate your feedback! ⭐⭐", 
            3: "Thanks for 3 stars! We're glad you like it! ⭐⭐⭐",
            4: "Thanks for 4 stars! Great rating! ⭐⭐⭐⭐",
            5: "Thanks for 5 stars! You're amazing! ⭐⭐⭐⭐⭐"
        };
        
        $ratingText.text(messages[rating] || "Thank you for rating!")
            .css('font-weight', 'bold');
        
        playRatingSound();
        showNotification(`Thank you for ${rating} star${rating > 1 ? 's' : ''}!`, 'success');
    });
    
    $stars.on('mouseover', function() {
        const rating = parseInt($(this).data('rating'));
        $stars.each(function() {
            const $star = $(this);
            const starRating = parseInt($star.data('rating'));
            if (starRating <= rating) {
                $star.css('color', '#078fffff');
            }
        });
    });
    
    $stars.on('mouseout', function() {
        $stars.each(function() {
            const $star = $(this);
            if (!$star.hasClass('active')) {
                $star.css('color', '');
            }
        });
    });
}

function initFAQAccordion() {
    const $accordionHeaders = $('.aca-accordion-header');
    
    $accordionHeaders.on('click', function() {
        const $this = $(this);
        
        $accordionHeaders.not($this).each(function() {
            const $otherHeader = $(this);
            $otherHeader.removeClass('active');
            const otherContentId = $otherHeader.attr('id').replace('Heading', 'Content');
            const $otherContent = $('#' + otherContentId);
            $otherContent.removeClass('active')
                .css('max-height', '0');
        });
        
        $this.toggleClass('active');
        const contentId = $this.attr('id').replace('Heading', 'Content');
        const $content = $('#' + contentId);
        $content.toggleClass('active');
        
        if ($content.hasClass('active')) {
            $content.css('max-height', $content[0].scrollHeight + "px");
        } else {
            $content.css('max-height', '0');
        }
        
        playClickSound();
    });
    
    if ($accordionHeaders.length > 0) {
        $accordionHeaders.first().trigger('click');
    }
}

function initReadMore() {
    const $readMoreButtons = $('.read-more-btn');
    
    $readMoreButtons.on('click', function() {
        const $button = $(this);
        const targetId = $button.data('target');
        const $content = $('#' + targetId);
        const moreText = $button.data('more');
        const lessText = $button.data('less');
        
        if ($content.length && moreText && lessText) {
            if ($content.hasClass('expanded')) {
                $content.removeClass('expanded')
                    .css('max-height', '60px');
                $button.text(moreText);
            } else {
                $content.addClass('expanded')
                    .css('max-height', $content[0].scrollHeight + 'px');
                $button.text(lessText);
            }
            
            playClickSound();
        }
    });
}

const galleryItems = [
    {
        id: 1,
        title: "Statue of Liberty",
        image: "images/statue-liberty.jpg",
        description: "Iconic symbol of freedom in New York Harbor",
        category: "landmark",
        year: 1886
    },
    {
        id: 2,
        title: "Grand Canyon",
        image: "images/grand-canyon.jpg", 
        description: "Natural wonder in Arizona, carved by Colorado River",
        category: "nature",
        year: 0
    },
    {
        id: 3,
        title: "White House",
        image: "images/white-house.jpg",
        description: "Official residence of the US President in Washington D.C.",
        category: "government",
        year: 1800
    },
    {
        id: 4,
        title: "Hollywood Sign",
        image: "images/Hollywood-sign.jpg",
        description: "Famous landmark in Los Angeles, California",
        category: "entertainment",
        year: 1923
    },
    {
        id: 5,
        title: "Golden Gate Bridge",
        image: "images/new-york.jpg", 
        description: "Suspension bridge connecting San Francisco to Marin County",
        category: "landmark", 
        year: 1937
    },
    {
        id: 6,
        title: "Mount Rushmore",
        image: "images/Cuisine Image.webp", 
        description: "National memorial with presidential sculptures in South Dakota",
        category: "landmark",
        year: 1941
    }
];

function initInteractiveGallery() {
    const galleryHTML = `
        <section class="py-5">
            <div class="container">
                <h3 class="aca-section-title fade-in">Interactive American Gallery</h3>
                <div class="text-center mb-4">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-custom active" data-filter="all">All</button>
                        <button type="button" class="btn btn-outline-custom" data-filter="landmark">Landmarks</button>
                        <button type="button" class="btn btn-outline-custom" data-filter="nature">Nature</button>
                        <button type="button" class="btn btn-outline-custom" data-filter="entertainment">Entertainment</button>
                    </div>
                </div>
                <div class="row g-3" id="interactiveGallery"></div>
                <div class="text-center mt-4">
                    <button id="shuffleGallery" class="btn btn-custom">
                        <i class="fas fa-random me-2"></i>Shuffle Gallery
                    </button>
                </div>
            </div>
        </section>
    `;
    
    const $carouselSection = $('.bg-light');
    if ($carouselSection.length) {
        $carouselSection.after(galleryHTML);
        renderGallery();
        
        $('#shuffleGallery').on('click', function() {
            const shuffled = [...galleryItems].sort(() => Math.random() - 0.5);
            renderGallery(shuffled);
            playClickSound();
            showNotification('Gallery shuffled! 🔀', 'info');
        });
        
        $('[data-filter]').on('click', function() {
            const $button = $(this);
            const filter = $button.data('filter');
            
            $('[data-filter]').removeClass('active');
            $button.addClass('active');
            
            if (filter === 'all') {
                renderGallery();
            } else {
                const filtered = galleryItems.filter(item => item.category === filter);
                renderGallery(filtered);
            }
            
            playClickSound();
            showNotification(`Showing ${filter} items`, 'info');
        });
    }
}

function renderGallery(items = galleryItems) {
    const $galleryContainer = $('#interactiveGallery');
    if (!$galleryContainer.length) return;
    
    $galleryContainer.empty();
    
    items.forEach(item => {
        const galleryItem = `
            <div class="col-lg-4 col-md-6">
                <div class="gallery-item card card-custom fade-in" data-category="${item.category}">
                    <img src="${item.image}" class="card-img-top card-img-custom" alt="${item.title}" 
                         onclick="openGalleryModal(${item.id})">
                    <div class="card-body card-body-custom">
                        <h5 class="card-title-custom">${item.title}</h5>
                        <p class="card-text-custom">${item.description}</p>
                        <div class="gallery-meta">
                            ${item.year ? `<small class="text-muted"><i class="fas fa-calendar me-1"></i>${item.year}</small>` : ''}
                            <span class="badge bg-primary ms-2">${item.category}</span>
                        </div>
                        <button class="btn btn-outline-custom btn-sm mt-2" onclick="showItemDetails(${item.id})">
                            <i class="fas fa-info-circle me-1"></i>Details
                        </button>
                    </div>
                </div>
            </div>
        `;
        $galleryContainer.append(galleryItem);
    });
}

window.openGalleryModal = function(itemId) {
    const item = galleryItems.find(i => i.id === itemId);
    if (!item) return;
    
    const modalHTML = `
        <div class="modal fade" id="galleryModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${item.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${item.image}" class="img-fluid mb-3" alt="${item.title}">
                        <p>${item.description}</p>
                        ${item.year ? `<p><strong>Year:</strong> ${item.year}</p>` : ''}
                        <p><strong>Category:</strong> ${item.category}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#galleryModal').remove();
    $('body').append(modalHTML);
    
    const modal = new bootstrap.Modal($('#galleryModal')[0]);
    modal.show();
};

window.showItemDetails = function(itemId) {
    const item = galleryItems.find(i => i.id === itemId);
    if (!item) return;
    
    showNotification(`📋 ${item.title}\n\n📝 ${item.description}\n\n🏷️ Category: ${item.category}${item.year ? `\n📅 Year: ${item.year}` : ''}`, 'info', 5000);
};

const culturalFacts = [
    {
        id: 1,
        title: "Thanksgiving Tradition",
        fact: "The first Thanksgiving was celebrated in 1621 by Pilgrims and Native Americans and lasted three days.",
        category: "holidays",
        source: "Historical Records",
        interesting: true
    },
    {
        id: 2, 
        title: "Jazz Origins",
        fact: "Jazz originated in New Orleans in the late 19th century, blending African and European musical traditions.",
        category: "music",
        source: "Music History",
        interesting: true
    },
    {
        id: 3,
        title: "Baseball History",
        fact: "The first official baseball game was played in 1846 in Hoboken, New Jersey.",
        category: "sports", 
        source: "Sports Archives",
        interesting: true
    },
    {
        id: 4,
        title: "Hollywood Golden Age",
        fact: "The Golden Age of Hollywood lasted from the late 1920s to the early 1960s, producing classic films.",
        category: "movies",
        source: "Film History",
        interesting: false
    },
    {
        id: 5,
        title: "Hamburger Popularity",
        fact: "Americans consume approximately 50 billion burgers each year.",
        category: "cuisine",
        source: "Food Statistics",
        interesting: true
    },
    {
        id: 6,
        title: "Fourth of July",
        fact: "The Declaration of Independence was actually signed on July 2, 1776, but adopted on July 4th.",
        category: "holidays",
        source: "Historical Documents", 
        interesting: false
    }
];

function initCulturalFacts() {
    const factsHTML = `
        <section class="py-5 bg-light">
            <div class="container">
                <h3 class="aca-section-title fade-in">American Cultural Facts</h3>
                <div class="row g-4" id="culturalFactsContainer"></div>
                <div class="text-center mt-4">
                    <button id="refreshFacts" class="btn btn-custom">
                        <i class="fas fa-sync-alt me-2"></i>Show New Facts
                    </button>
                </div>
            </div>
        </section>
    `;
    
    const $categoriesSection = $('.aca-categories');
    if ($categoriesSection.length) {
        $categoriesSection.after(factsHTML);
        renderFacts();
        
        $('#refreshFacts').on('click', function() {
            renderFacts();
            playClickSound();
            showNotification('New facts loaded! 📚', 'success');
        });
    }
}

let displayedFacts = [];

function getRandomFacts(count = 3) {
    const availableFacts = culturalFacts.filter(fact => !displayedFacts.includes(fact.id));
    
    if (availableFacts.length < count) {
        displayedFacts = [];
        return culturalFacts.slice(0, count);
    }
    
    const shuffled = [...availableFacts].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    
    selected.forEach(fact => displayedFacts.push(fact.id));
    
    return selected;
}

function renderFacts() {
    const $container = $('#culturalFactsContainer');
    if (!$container.length) return;
    
    const facts = getRandomFacts(3);
    $container.empty();
    
    facts.forEach(fact => {
        const factHTML = `
            <div class="col-md-4">
                <div class="card card-custom h-100 fade-in">
                    <div class="card-body card-body-custom">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-primary">${fact.category}</span>
                            ${fact.interesting ? '<span class="badge bg-warning">⭐ Interesting</span>' : ''}
                        </div>
                        <h5 class="card-title-custom">${fact.title}</h5>
                        <p class="card-text-custom">${fact.fact}</p>
                        <small class="text-muted">Source: ${fact.source}</small>
                    </div>
                </div>
            </div>
        `;
        $container.append(factHTML);
    });
}

let notifications = JSON.parse(localStorage.getItem('acaNotifications')) || [];

function initNotificationSystem() {
    const $notificationBell = $('#notificationBell');
    const $notificationPanel = $('#notificationPanel');
    const $closeNotifications = $('#closeNotifications');
    const $markAllRead = $('#markAllRead');

    if (notifications.length === 0) {
        createWelcomeNotifications();
    }

    updateNotificationCount();

    $notificationBell.on('click', function(e) {
        e.stopPropagation();
        $notificationPanel.toggleClass('show');
        if ($notificationPanel.hasClass('show')) {
            markAllNotificationsAsRead();
        }
        playClickSound();
    });

    $closeNotifications.on('click', function() {
        $notificationPanel.removeClass('show');
        playClickSound();
    });

    $markAllRead.on('click', function() {
        markAllNotificationsAsRead();
        playClickSound();
    });

    $(document).on('click', function(e) {
        if (!$notificationPanel.is(e.target) && $notificationPanel.has(e.target).length === 0 && 
            !$notificationBell.is(e.target) && $notificationBell.has(e.target).length === 0) {
            $notificationPanel.removeClass('show');
        }
    });

    renderNotifications();

    setInterval(generateRandomNotification, 120000);
}

function createWelcomeNotifications() {
    const welcomeNotifications = [
        {
            id: Date.now(),
            type: 'info',
            title: 'Welcome to ACA! 🎉',
            message: 'Thank you for joining American Cultural Association. Explore American culture with us!',
            time: new Date().toISOString(),
            read: false
        },
        {
            id: Date.now() + 1,
            type: 'success',
            title: 'System Ready ✅',
            message: 'All features are now active. Enjoy your cultural journey!',
            time: new Date().toISOString(),
            read: false
        },
        {
            id: Date.now() + 2,
            type: 'warning',
            title: 'New Quiz Available! 🎯',
            message: 'Test your knowledge with our American Culture Quiz in the FAQ section.',
            time: new Date().toISOString(),
            read: false
        }
    ];

    notifications = welcomeNotifications;
    saveNotifications();
}

function generateRandomNotification() {
    const notificationTypes = [
        {
            type: 'info',
            title: 'Cultural Tip of the Day 🌟',
            message: 'Did you know? Jazz music originated in New Orleans in the late 19th century.'
        },
        {
            type: 'success',
            title: 'New Content Added! 📚',
            message: 'Check out our updated gallery with famous American landmarks and cultural sites.'
        },
        {
            type: 'warning',
            title: 'Quiz Reminder 🎯',
            message: 'Haven\'t tried our American Culture Quiz yet? Test your knowledge now!'
        },
        {
            type: 'error',
            title: 'Maintenance Alert ⚠️',
            message: 'Scheduled maintenance this weekend. Some features may be temporarily unavailable.'
        },
        {
            type: 'info',
            title: 'Holiday Celebration 🎄',
            message: 'Learn about American Thanksgiving traditions in our cultural facts section.'
        }
    ];

    const randomNotif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    addNotification(
        randomNotif.type,
        randomNotif.title,
        randomNotif.message
    );
}

function addNotification(type, title, message) {
    const newNotification = {
        id: Date.now(),
        type: type,
        title: title,
        message: message,
        time: new Date().toISOString(),
        read: false
    };

    notifications.unshift(newNotification);
    if (notifications.length > 50) {
        notifications = notifications.slice(0, 50);
    }
    
    saveNotifications();
    updateNotificationCount();
    renderNotifications();
    
    const $notificationPanel = $('#notificationPanel');
    if (!$notificationPanel.hasClass('show')) {
        showNotification(`${title}: ${message}`, type, 4000);
    }
}

function renderNotifications() {
    const $notificationList = $('#notificationList');
    
    if (notifications.length === 0) {
        $notificationList.html(`
            <div class="text-center py-5">
                <i class="fas fa-bell-slash fa-3x text-muted mb-3"></i>
                <p class="text-muted">No notifications yet</p>
            </div>
        `);
        return;
    }

    $notificationList.empty();
    notifications.forEach(notif => {
        const notificationHTML = `
            <div class="notification-item ${notif.type} ${notif.read ? 'read' : 'unread'}" 
                 onclick="markNotificationAsRead(${notif.id})">
                <div class="notification-content">
                    <h6>${notif.title}</h6>
                    <p>${notif.message}</p>
                    <div class="notification-meta">
                        <span class="notification-time">${formatTime(notif.time)}</span>
                        ${!notif.read ? '<span class="badge bg-primary">New</span>' : ''}
                    </div>
                </div>
            </div>
        `;
        $notificationList.append(notificationHTML);
    });
}

function markNotificationAsRead(id) {
    notifications = notifications.map(notif => 
        notif.id === id ? {...notif, read: true} : notif
    );
    saveNotifications();
    updateNotificationCount();
    renderNotifications();
}

function markAllNotificationsAsRead() {
    notifications = notifications.map(notif => ({...notif, read: true}));
    saveNotifications();
    updateNotificationCount();
    renderNotifications();
    showNotification('All notifications marked as read', 'success');
}

function updateNotificationCount() {
    const unreadCount = notifications.filter(notif => !notif.read).length;
    const $notificationCountBadge = $('#notificationCount');
    
    if ($notificationCountBadge.length) {
        $notificationCountBadge.text(unreadCount);
        $notificationCountBadge.toggle(unreadCount > 0);
    }
    
    document.title = unreadCount > 0 ? 
        `(${unreadCount}) American Cultural Association` : 
        'American Cultural Association';
}

function formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}

function saveNotifications() {
    localStorage.setItem('acaNotifications', JSON.stringify(notifications));
}

function showNotification(message, type = 'info', duration = 3000) {
    const $notification = $('<div>').css({
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: '15px 25px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        zIndex: '9999',
        maxWidth: '300px',
        opacity: '0',
        transform: 'translateX(100px)',
        transition: 'all 0.3s ease',
        fontFamily: "'Roboto', sans-serif",
        fontWeight: '500'
    }).html(`<i class="fas ${getNotificationIcon(type)}"></i> ${message}`);
    
    $('body').append($notification);
    
    setTimeout(() => {
        $notification.css({
            opacity: '1',
            transform: 'translateX(0)'
        });
    }, 100);
    
    setTimeout(() => {
        $notification.css({
            opacity: '0',
            transform: 'translateX(100px)'
        });
        setTimeout(() => {
            $notification.remove();
        }, 300);
    }, duration);
    
    $notification.on('click', function() {
        $notification.css({
            opacity: '0',
            transform: 'translateX(100px)'
        });
        setTimeout(() => {
            $notification.remove();
        }, 300);
    });
}

function getNotificationColor(type) {
    const colors = {
        'success': 'linear-gradient(135deg, #28a745, #20c997)',
        'error': 'linear-gradient(135deg, #dc3545, #c82333)',
        'warning': 'linear-gradient(135deg, #ffc107, #fd7e14)',
        'info': 'linear-gradient(135deg, #3C3B6E, #2A2A5E)'
    };
    return colors[type] || colors.info;
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

function initTimeBasedGreeting() {
    function getGreeting() {
        const hour = new Date().getHours();
        let greeting, emoji;
        
        switch(true) {
            case hour >= 5 && hour < 12:
                greeting = "Good Morning!";
                emoji = "☀️";
                break;
            case hour >= 12 && hour < 17:
                greeting = "Good Afternoon!";
                emoji = "😊";
                break;
            case hour >= 17 && hour < 21:
                greeting = "Good Evening!";
                emoji = "🌆";
                break;
            default:
                greeting = "Good Night!";
                emoji = "🌙";
        }
        
        return { greeting, emoji };
    }
    
    function updateGreeting() {
        const $greetingElement = $('#timeGreeting');
        if (!$greetingElement.length) return;
        
        const { greeting, emoji } = getGreeting();
        $greetingElement.html(`${emoji} <strong>${greeting}</strong> Welcome to American Cultural Association!`);
    }
    
    const $heroContent = $('.aca-hero-content');
    if ($heroContent.length) {
        const greetingHTML = `<div id="timeGreeting" class="aca-greeting fade-in" style="font-size: 1.4rem; margin: 10px 0;"></div>`;
        $heroContent.find('p').after(greetingHTML);
        
        updateGreeting();
        setInterval(updateGreeting, 60000);
    }
}

function initKeyboardNavigation() {
    const $menuItems = $('.navbar-nav .nav-item');
    let focusedIndex = 0;

    if ($menuItems.length > 0) {
        $menuItems.eq(focusedIndex).focus();

        $(document).on('keydown', function(e) {
            if ($(e.target).closest('.navbar-nav').length) {
                switch (e.key) {
                    case 'ArrowDown':
                    case 'ArrowRight':
                        e.preventDefault();
                        focusedIndex = (focusedIndex + 1) % $menuItems.length;
                        $menuItems.eq(focusedIndex).focus();
                        break;
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        e.preventDefault();
                        focusedIndex = (focusedIndex - 1 + $menuItems.length) % $menuItems.length;
                        $menuItems.eq(focusedIndex).focus();
                        break;
                }
            }
            
            if (e.key === 'Escape') {
                const $popupForm = $('#popupForm');
                if ($popupForm.length && $popupForm.css('display') === 'flex') {
                    $popupForm.hide();
                }
                const $notificationPanel = $('#notificationPanel');
                if ($notificationPanel.length && $notificationPanel.hasClass('show')) {
                    $notificationPanel.removeClass('show');
                }
            }
        });
    }
}

function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const $dateTimeElement = $('#date-time-block');
    if ($dateTimeElement.length) {
        $dateTimeElement.text(dateTimeString);
    }
}

function setupNotificationTesting() {
    console.log('🔔 Setting up notification testing...');
    
    $('a').on('click', function(e) {
        if (this.href && !this.href.includes('javascript')) {
            showNotification(`📄 Переход на: ${$(this).text()}`, 'info', 2000);
        }
    });
    
    $('img').on('mouseenter', function() {
        setTimeout(() => {
            showNotification('🖼️ Изображение загружено', 'success', 1500);
        }, 1000);
    });
    
    let scrollNotificationShown = false;
    $(window).on('scroll', function() {
        if (!scrollNotificationShown && $(window).scrollTop() > 500) {
            showNotification('📜 Вы прокрутили страницу!', 'info', 2000);
            scrollNotificationShown = true;
        }
    });
    
    $(window).on('resize', function() {
        showNotification('📱 Размер окна изменен', 'warning', 1500);
    });
    
    console.log('✅ Notification testing setup complete');
}

setTimeout(setupNotificationTesting, 3000);

function initLazyLoading() {
    console.log('Starting Lazy Loading...');
    
    showNotification('Lazy Loading activated! Scroll to load images.', 'info', 4000);
    
    let processedImages = 0;
    
    $('img').each(function(index) {
        const $img = $(this);
        if ($img.width() < 200 || $img.height() < 200 || $img.attr('data-lazy-processed')) {
            return;
        }
        
        $img.attr('data-lazy-processed', 'true');
        
        const originalSrc = $img.attr('src');
        $img.attr('data-original-src', originalSrc);
        
        const placeholder = createLazyPlaceholder(index + 1);
        $img.attr('src', placeholder);
        
        $img.css({
            'border': '3px solid #ff4444',
            'borderRadius': '8px',
            'transition': 'all 0.5s ease'
        });
        
        processedImages++;
        console.log(`Lazy loaded image ${index + 1}`);
    });
    
    console.log(`✅ Lazy loading setup for ${processedImages} images`);
    
    function loadVisibleImages() {
        $('img[data-original-src]').each(function() {
            const $img = $(this);
            const rect = $img[0].getBoundingClientRect();
            const windowHeight = $(window).height();
            
            if (rect.top < windowHeight + 100 && rect.bottom > -100) {
                const originalSrc = $img.attr('data-original-src');
                
                $img.attr('src', originalSrc)
                    .css('border', '3px solid #180165ff')
                    .removeAttr('data-original-src');
                
                console.log('🟢 Loaded:', originalSrc.split('/').pop());
                
                if ($('img[data-original-src]').length > 0) {
                    showNotification('🖼️ Image loaded!', 'success', 2000);
                }
            }
        });
    }
    
    $(window).on('scroll resize', loadVisibleImages);
    setTimeout(loadVisibleImages, 500);
}

function createLazyPlaceholder(number) {
    return `data:image/svg+xml;base64,${btoa(`
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f8f9fa"/>
            <text x="50%" y="45%" font-family="Arial" font-size="16" fill="#3C3B6E" 
                  text-anchor="middle" font-weight="bold">LAZY LOADING</text>
            <text x="50%" y="60%" font-family="Arial" font-size="14" fill="#B22234" 
                  text-anchor="middle">Image ${number}</text>
            <text x="50%" y="75%" font-family="Arial" font-size="12" fill="#666" 
                  text-anchor="middle">Scroll to load</text>
        </svg>
    `)}`;
}

function initCopyButtons() {
    const $copyableElements = $('.card-text-custom, .read-more-content, .aca-accordion-content p');
    
    $copyableElements.each(function() {
        const $element = $(this);
        const $copyButton = $('<button>', {
            class: 'btn btn-sm btn-outline-custom copy-btn',
            html: '<i class="fas fa-copy"></i>',
            'data-bs-toggle': 'tooltip',
            title: 'Copy to clipboard'
        });
        
        const $container = $('<div>', {
            class: 'position-relative'
        });
        
        $element.wrap($container);
        $element.after($copyButton);
        
        new bootstrap.Tooltip($copyButton[0]);
        
        $copyButton.on('click', async function() {
            try {
                await navigator.clipboard.writeText($element.text().trim());
                
                $copyButton.html('<i class="fas fa-check"></i>')
                    .addClass('btn-success');
                
                const tooltip = bootstrap.Tooltip.getInstance($copyButton[0]);
                tooltip.setContent({ '.tooltip-inner': 'Copied to clipboard!' });
                
                setTimeout(() => {
                    $copyButton.html('<i class="fas fa-copy"></i>')
                        .removeClass('btn-success');
                    tooltip.setContent({ '.tooltip-inner': 'Copy to clipboard' });
                }, 2000);
                
            } catch (err) {
                console.error('Failed to copy text: ', err);
                const tooltip = bootstrap.Tooltip.getInstance($copyButton[0]);
                tooltip.setContent({ '.tooltip-inner': 'Failed to copy' });
            }
        });
    });
}

function initCultureSearch() {
    const $searchInput = $('#cultureSearch');
    const $suggestions = $('#searchSuggestions');
    const $searchBtn = $('.search-container .btn');

    if (!$searchInput.length || !$searchBtn.length) return;

    const alwaysVisibleSelectors = [
        '.navbar-custom',
        '.aca-hero',
        '.search-container',
        '.aca-newsletter',
        '.aca-team-section',
        '.aca-faq-section',
        '.aca-footer'
    ];

    function getPageWords() {
        const text = $('body').text();
        const words = text.match(/\b[A-Za-z]{3,}\b/g) || [];
        return [...new Set(words.map(w => w.toLowerCase()))];
    }

    const pageWords = getPageWords();

    function highlightText(query) {
        removeHighlights();
        if (!query.trim()) return;
        const regex = new RegExp(`(${query})`, 'gi');
        $('section, .aca-about, .aca-categories, .aca-gallery, .aca-facts').each(function() {
            $(this).find('*').each(function() {
                const $el = $(this);
                if ($el.children().length === 0 && $el.text().match(regex)) {
                    $el.html($el.text().replace(regex, '<mark class="search-highlight">$1</mark>'));
                }
            });
        });
    }

    function removeHighlights() {
        $('.search-highlight').each(function() {
            const $el = $(this);
            const parent = $el.parent();
            parent[0].replaceChild(document.createTextNode($el.text()), $el[0]);
            parent[0].normalize();
        });
    }

    function filterInsideSections(query) {
        const lowerQuery = query.toLowerCase();
        $('section, .aca-about, .aca-categories, .aca-gallery, .aca-facts').each(function() {
            const $section = $(this);
            if (alwaysVisibleSelectors.some(sel => $section.is(sel))) {
                $section.show();
                return;
            }
            const $items = $section.find('p, h2, h3, h4, li, .card, .fact-item, .gallery-item, .aca-accordion-item');
            let hasVisible = false;
            $items.each(function() {
                const $item = $(this);
                const text = $item.text().toLowerCase();
                if (lowerQuery && text.includes(lowerQuery)) {
                    $item.show();
                    hasVisible = true;
                } else if (lowerQuery.length === 0) {
                    $item.show();
                    hasVisible = true;
                } else {
                    $item.hide();
                }
            });
            $section.toggle(hasVisible);
        });
    }

    function performSearch() {
        const query = $searchInput.val().trim();
        highlightText(query);
        filterInsideSections(query);
    }

    function updateSuggestions() {
        const query = $searchInput.val().toLowerCase().trim();
        $suggestions.empty();
        if (query.length === 0) {
            $suggestions.hide();
            return;
        }
        const filtered = pageWords.filter(w => w.includes(query)).slice(0, 8);
        if (filtered.length === 0) {
            const $div = $('<div>', {
                class: 'suggestion-item',
                text: 'No results found'
            });
            $suggestions.append($div);
        } else {
            filtered.forEach(w => {
                const $div = $('<div>', {
                    class: 'suggestion-item',
                    html: w.replace(new RegExp(query, 'gi'), m => `<b>${m}</b>`)
                }).on('click', function() {
                    $searchInput.val(w);
                    performSearch();
                    $suggestions.hide();
                });
                $suggestions.append($div);
            });
        }
        $suggestions.show();
    }

    $searchInput.on('input', updateSuggestions);
    $searchBtn.on('click', performSearch);
    $searchInput.on('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search-container').length) {
            $suggestions.hide();
        }
    });
}

function initNewsletterForms() {
    const $mainForm = $('#mainNewsletterForm');
    if ($mainForm.length) {
        $mainForm.on('submit', function(e) {
            e.preventDefault();
            const $submitBtn = $(this).find('button[type="submit"]');
            const originalText = $submitBtn.html();
            $submitBtn.prop('disabled', true)
                .html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Please wait...');
            setTimeout(() => {
                alert('Thank you for subscribing to our newsletter!');
                $submitBtn.prop('disabled', false).html(originalText);
                $(this).trigger('reset');
            }, 2000);
        });
    }
}

function loadAllImagesNow() {
    const $images = $('img[data-original-src]');
    let loaded = 0;
    
    $images.each(function() {
        const $img = $(this);
        const originalSrc = $img.attr('data-original-src');
        $img.attr('src', originalSrc)
            .css('border', '3px solid #4444ff')
            .removeAttr('data-original-src');
        loaded++;
    });
    
    showNotification(`🚀 Loaded ${loaded} images instantly!`, 'success', 3000);
    console.log(`🚀 Force loaded ${loaded} images`);
}

function checkLazyLoadingStatus() {
    const waiting = $('img[data-original-src]').length;
    const total = $('img[data-lazy-processed]').length;
    const loaded = total - waiting;
    
    const status = waiting > 0 ? 'WORKING 🟢' : 'COMPLETED ✅';
    
    showNotification(
        `📊 Lazy Loading: ${status}\n${loaded}/${total} images loaded`, 
        waiting > 0 ? 'info' : 'success', 
        4000
    );
    
    console.log(`📊 Status: ${status}`);
    console.log(`📊 ${loaded}/${total} images loaded`);
}

function initAdminButtons() {
    const $enterAdminBtn = $('#enterAdminBtn');
    
    if ($enterAdminBtn.length) {
        $enterAdminBtn.on('click', function() {
            enterAdminMode();
        });
    }

    const isAdmin = localStorage.getItem('adminSession') === 'true';
    if (isAdmin && $enterAdminBtn.length) {
        $enterAdminBtn.hide();
    }
}

// Инициализация при загрузке документа
$(document).ready(function() {
    initPopup();
    initThemeToggle();
    initScrollAnimations();
    initSoundEffects();
    initInteractiveFAQ();
    initRatingStars();
    initKeyboardNavigation();
    initFAQAccordion();
    initReadMore();
    initInteractiveGallery();
    initCulturalFacts();
    initTimeBasedGreeting();
    initNotificationSystem();
    initCopyButtons();
    initNewsletterForms();
    initCultureSearch();
    initAdminButtons();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    setTimeout(initCopyButtons, 3000);

    setTimeout(() => {
        showNotification('Welcome to American Cultural Association! 🎉', 'success', 5000);
    }, 2000);

    renderGallery();
    renderFacts();
    initInteractiveFAQ();
});

window.testNotificationSystem = function() {
    addNotification('info', 'Test Notification', 'This is a test notification from the system.');
};

window.clearAllNotifications = function() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        notifications = [];
        saveNotifications();
        updateNotificationCount();
        renderNotifications();
        showNotification('All notifications cleared', 'success');
    }
};