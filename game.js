const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

// use fetch to grab data
fetch("https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple"
).then(res => {
  return res.json();
})
// blob = data obj
.then(blob => {
  // use map to format the questions
  questions = blob.results.map(loadedQuestion => {
    
    // for each mapped over question
    const formattedQuestion = {
      question: loadedQuestion.question
    };

    // copy the array of incorrect answers
    const answerChoices = [...loadedQuestion.incorrect_answers];

    // set correct answer property to random number e.g. answer: 2
    formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
    
    answerChoices.splice(
      formattedQuestion.answer - 1, // index = random number - 1 (zero based)
      0, // howmany = no. of items to be removed, 0 = items not removed*
      loadedQuestion.correct_answer // the value to splice into array
    );

    // forEach answerChoice assign choice to dynamic 'choice?' property
    answerChoices.forEach((choice, index) => {
      formattedQuestion["choice" + (index + 1)] = choice;
    });

    // return formattedQuestion object which can then be used by the app.
    return formattedQuestion;
  });
  startGame();
})
.catch( err => {
  console.error(err);
});

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  // console.log(availableQuestions);
  getNewQuestion();
  game.classList.remove('hidden');
  loader.classList.add('hidden');
}

getNewQuestion = () => {
  // if no available questions OR if question counter is greater than max counter go to end page
  if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    // save mostRecentScore to localStorage
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("/end.html");
  }

  questionCounter++;

  // progressText.innerText = questionCounter + '/' + MAX_QUESTIONS;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

  // update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  // generate random question based on length of available questions e.g. 1,2,3
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  // assign current question to random question
  currentQuestion = availableQuestions[questionIndex];
  // inject question from object to DOM innerText
  question.innerText = currentQuestion.question;

  // replace each choice-text element innertext
  choices.forEach(choice => {
    // get data-number value of each element
    const number = choice.dataset['number'];
    // append to word 'choice1' and assign to DOM innerText
    choice.innerText = currentQuestion['choice' + number];
  });

  // splice out array random question index generated
  availableQuestions.splice(questionIndex, 1);
  // console.log(availableQuestions);
  // set accepting answers to true
  acceptingAnswers = true;
};

// for each choice addEventListener listening for clicks
choices.forEach(choice => {
  choice.addEventListener('click', e => {
    // if false return
    if (!acceptingAnswers) return;

    // else set accepting answers to false
    acceptingAnswers = false;
    // selectedChoice is the clicked element
    const selectedChoice = e.target;
    // console.log('Selected Choice:', selectedChoice);
    // selectedAnswer is the data-number on the selected element
    const selectedAnswer = selectedChoice.dataset['number'];
    // console.log('Selected Answer:', selectedAnswer);
    // get a new question

    // ternary - if selectedAnswer is correct, apply 'correct' class
    const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
    
    // if the 'correct' class is applied, call incrementScore
    if(classToApply === 'correct') {
      incrementScore(CORRECT_BONUS);
    }

    // parentElement used to traverse the DOM to select the parent container to style
    selectedChoice.parentElement.classList.add(classToApply);

    // setTimeout used to delay the removal of the feedback class
    setTimeout( () => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 500)
    
    
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerHTML = score;
}