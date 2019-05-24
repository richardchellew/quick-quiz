
const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
finalScore.innerText = mostRecentScore;

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

username.addEventListener('keyup', () => {
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = e => {
  console.log("clicked the same button!");
  e.preventDefault();
  
  const score = {
    // score: mostRecentScore,
    score: Math.floor(Math.random() * 100),
    name: username.value
  };
  
  highScores.push(score);
  highScores.sort( (a,b) => b.score - a.score );
  highScores.splice(5);
  console.log(highScores);
  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("/");
};
