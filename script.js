// Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        alert('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
        return;
    }
    
    // In a real app, you would send this to a server
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userEmail', email);
    window.location.href = 'index.html';
}

function handleRegister(event) {
    event.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validation
    if (!fullname || !email || !password || !confirmPassword) {
        alert('الرجاء ملء جميع الحقول');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('كلمة المرور غير متطابقة');
        return;
    }
    
    // In a real app, you would send this to a server
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', fullname);
    window.location.href = 'index.html';
}

function checkAuth() {
    if (localStorage.getItem('loggedIn') === 'true') {
        // Update UI for logged in user
        const nav = document.querySelector('header nav div.space-x-4');
        if (nav) {
            nav.innerHTML = `
                <span class="text-white">مرحباً، ${localStorage.getItem('userName') || 'مستخدم'}</span>
                <button onclick="logout()" class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">تسجيل الخروج</button>
            `;
        }
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

// Initialize auth forms
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    checkAuth();
});

// Exercise Checking and Hint Functionality
function showHint(hintId) {
    const hint = document.getElementById(hintId);
    hint.classList.toggle('hidden');
}

function checkExercise(exerciseId, correctAnswer) {
    const userAnswer = parseInt(document.getElementById(exerciseId).value);
    const feedbackElement = document.getElementById(`${exerciseId}-feedback`);
    
    if (isNaN(userAnswer)) {
        feedbackElement.textContent = 'الرجاء إدخال إجابة صحيحة';
        feedbackElement.className = 'text-red-600';
        feedbackElement.classList.remove('hidden');
        return;
    }

    if (userAnswer === correctAnswer) {
        feedbackElement.textContent = 'إجابة صحيحة! ✓';
        feedbackElement.className = 'text-green-600';
    } else {
        feedbackElement.textContent = `إجابة خاطئة، حاول مرة أخرى (الإجابة الصحيحة: ${correctAnswer})`;
        feedbackElement.className = 'text-red-600';
    }
    feedbackElement.classList.remove('hidden');
}

// Initialize all hints as hidden
document.addEventListener('DOMContentLoaded', function() {
    const hints = document.querySelectorAll('[id^="algebra-hint"]');
    hints.forEach(hint => {
        hint.classList.add('hidden');
    });
});

function checkTextExercise(exerciseId, correctAnswer) {
    const userAnswer = document.getElementById(exerciseId).value.trim();
    const feedbackElement = document.getElementById(`${exerciseId}-feedback`);
    
    if (!userAnswer) {
        feedbackElement.textContent = 'الرجاء إدخال إجابة';
        feedbackElement.className = 'text-red-600';
        feedbackElement.classList.remove('hidden');
        return;
    }

    if (userAnswer === correctAnswer) {
        feedbackElement.textContent = 'إجابة صحيحة! ✓';
        feedbackElement.className = 'text-green-600';
    } else {
        feedbackElement.textContent = 'إجابة خاطئة، حاول مرة أخرى';
        feedbackElement.className = 'text-red-600';
    }
    feedbackElement.classList.remove('hidden');
}

// Quiz Timer Functionality
function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    const interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            submitQuiz();
        }
    }, 1000);
}

// Quiz Submission and Results
function submitQuiz() {
    // Prevent multiple submissions
    const submitBtn = document.getElementById('submit-quiz');
    if (submitBtn.disabled) return;
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري التصحيح...';

    // Calculate score
    const answers = {
        q1: '5',
        q2: '12',
        q3: '8',
        q4: '5',
        q5: '17'
    };
    
    let score = 0;
    const wrongAnswers = [];
    const userAnswers = {};
    
    // Calculate results
    for (let i = 1; i <= 5; i++) {
        const questionName = `q${i}`;
        const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
        
        if (selectedOption) {
            userAnswers[questionName] = selectedOption.value;
            if (userAnswers[questionName] === answers[questionName]) {
                score++;
            } else {
                wrongAnswers.push(i);
            }
        } else {
            wrongAnswers.push(i);
        }
    }
    
    // Save all data needed for results page
    localStorage.setItem('quizScore', score);
    localStorage.setItem('quizWrongAnswers', JSON.stringify(wrongAnswers));
    localStorage.setItem('quizUserAnswers', JSON.stringify(userAnswers));
    localStorage.setItem('quizCorrectAnswers', JSON.stringify(answers));
    
    // Redirect to results page
    window.location.href = 'results.html?fromquiz=1';
}

function displayQuizResults() {
    const score = parseInt(localStorage.getItem('quizScore')) || 0;
    const wrongAnswers = JSON.parse(localStorage.getItem('quizWrongAnswers') || '[]');
    const userAnswers = JSON.parse(localStorage.getItem('quizUserAnswers') || '{}');
    const correctAnswers = JSON.parse(localStorage.getItem('quizCorrectAnswers') || '{}');

    // Display score
    const scoreElement = document.getElementById('score');
    const scoreBar = document.getElementById('score-bar');
    scoreElement.textContent = score;
    scoreElement.classList.add('animate-bounce', 'text-5xl', 'font-bold');
    
    // Animate progress bar
    const percentage = (score / 5) * 100;
    setTimeout(() => {
        scoreBar.style.width = `${percentage}%`;
    }, 100);
    
    // Set result message
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    
    if (score === 5) {
        resultTitle.textContent = 'ممتاز! 🎉';
        resultTitle.className = 'text-2xl font-bold mb-2 text-green-600';
        resultMessage.textContent = 'لقد أجبت على جميع الأسئلة بشكل صحيح';
    } else if (score >= 3) {
        resultTitle.textContent = 'جيد جداً! 👍';
        resultTitle.className = 'text-2xl font-bold mb-2 text-blue-600';
        resultMessage.textContent = `لقد أجبت على ${score} من 5 أسئلة بشكل صحيح`;
    } else {
        resultTitle.textContent = 'يحتاج إلى تحسين 💪';
        resultTitle.className = 'text-2xl font-bold mb-2 text-red-600';
        resultMessage.textContent = `لقد أجبت على ${score} من 5 أسئلة بشكل صحيح`;
    }
    
    // Display detailed results for each question
    for (let i = 1; i <= 5; i++) {
        const questionName = `q${i}`;
        const resultElement = document.getElementById(`${questionName}-result`);
        
        if (userAnswers[questionName]) {
            const selectedOption = document.querySelector(`input[name="${questionName}"][value="${userAnswers[questionName]}"]`);
            const userAnswerText = selectedOption ? selectedOption.parentElement.textContent.trim() : 'إجابة غير معروفة';
            
            resultElement.querySelector('.user-answer').textContent = userAnswerText;
            
            if (userAnswers[questionName] === correctAnswers[questionName]) {
                resultElement.classList.add('bg-green-50', 'border-green-200');
            } else {
                resultElement.classList.add('bg-red-50', 'border-red-200');
                resultElement.querySelector('.correct-answer').textContent = 
                    `الإجابة الصحيحة: ${correctAnswers[questionName]}`;
            }
        } else {
            resultElement.querySelector('.user-answer').textContent = 'لم يتم الإجابة';
            resultElement.classList.add('bg-yellow-50', 'border-yellow-200');
        }
        
        resultElement.classList.remove('hidden');
    }
    
    // Show recommendations
    const recommendations = {
        'rec-algebra': [1],
        'rec-geometry': [2, 4],
        'rec-stats': [3],
        'rec-numbers': [5]
    };
    
    for (const [recId, questions] of Object.entries(recommendations)) {
        if (questions.some(q => wrongAnswers.includes(q))) {
            document.getElementById(recId).classList.remove('hidden');
            document.getElementById(recId).classList.add('animate-pulse');
        }
    }
}

// Initialize timer when quiz page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('time')) {
        const fiveMinutes = 60 * 10; // 10 minutes
        const display = document.getElementById('time');
        startTimer(fiveMinutes, display);
    }
    
    // Load quiz results if coming from quiz submission
    if (window.location.search.includes('fromquiz=1')) {
        submitQuiz();
    }
});