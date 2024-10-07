document.addEventListener('DOMContentLoaded', () => {
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let correctAnswers = 0;

    // Shuffle questions and answers
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function loadQuestions() {
        fetch('questions.json')
            .then(response => response.json())
            .then(data => {
                questions = data;
                shuffle(questions);
                questions.forEach(question => shuffle(question.question_answers));
                loadQuestion();
            })
            .catch(error => console.error('Error loading questions:', error));
    }

    const scoreElement = document.querySelector('.score');
    const questionDisplayElement = document.getElementById('question-display');
    const questionTextElement = document.getElementById('question-text');
    const answersListElement = document.getElementById('answers-list');
    const phoneImageElement = document.getElementById('phone-image');
    const resultModal = document.getElementById('resultModal');
    const resultText = document.getElementById('result-text');
    const nextQuestionButton = document.createElement('button');
    nextQuestionButton.textContent = 'Next Question';
    nextQuestionButton.style.display = 'none';
    nextQuestionButton.addEventListener('click', () => {
        resultModal.style.display = 'none';
        currentQuestionIndex++;
        loadQuestion();
    });

    const closeModalButton = document.querySelector('.close');
    closeModalButton.addEventListener('click', () => {
        resultModal.style.display = 'none';
    });

    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            showFinalScore();
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        questionDisplayElement.innerHTML = currentQuestion.question_display; // Use innerHTML to interpret HTML code
        questionTextElement.textContent = currentQuestion.question_text;
        phoneImageElement.src = `${currentQuestion.question_type}.jpg`;

        answersListElement.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        currentQuestion.question_answers.forEach((answer, index) => {
            const li = document.createElement('li');
            li.textContent = `${letters[index]}. ${answer.answer}`;
            li.addEventListener('click', () => handleAnswerClick(answer.correct, li, currentQuestion.answer_reason));
            answersListElement.appendChild(li);
        });

        scoreElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
        nextQuestionButton.style.display = 'none'; // Hide the button initially
        answersListElement.appendChild(nextQuestionButton); // Append the button below the answers
    }

    function handleAnswerClick(isCorrect, selectedElement, answerReason) {
        const currentQuestion = questions[currentQuestionIndex];
        currentQuestion.question_answers.forEach((answer, index) => {
            const li = answersListElement.children[index];
            if (answer.correct) {
                li.style.backgroundColor = 'lightgreen';
                li.style.color = 'black'; // Set text color to black
            } else {
                li.style.backgroundColor = 'lightcoral';
                li.style.color = 'black'; // Set text color to black
            }
            // Disable further clicks on all answers
            li.style.pointerEvents = 'none';
        });

        // Highlight the selected answer with a border
        selectedElement.style.border = '2px solid blue';

        // Show result in modal
        resultText.innerHTML = `${isCorrect ? 'Correct!' : 'Wrong!'}<br><br>${answerReason}`;
        resultModal.style.display = 'flex';

        if (isCorrect) {
            score += 10;
            correctAnswers++;
        }

        // Show the "Next Question" button
        nextQuestionButton.style.display = 'block';
    }

    function showFinalScore() {
        scoreElement.textContent = `You answered ${correctAnswers} out of ${questions.length} questions correctly. Your total score is ${score}.`;
        questionDisplayElement.textContent = '';
        questionTextElement.textContent = '';
        answersListElement.innerHTML = '';
        phoneImageElement.src = '';
        nextQuestionButton.style.display = 'none'; // Hide the button when quiz is finished
    }

    loadQuestions();
});