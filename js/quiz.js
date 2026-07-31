/* ============================================================
   LOVE QUIZ — every path leads somewhere sweet. Questions and
   the final message are both edited from js/config.js.
   ============================================================ */

(function () {
  "use strict";

  const dotsWrap = document.getElementById("quiz-dots");
  const questionEl = document.getElementById("quiz-question");
  const optionsEl = document.getElementById("quiz-options");
  const quizCard = document.getElementById("quiz-card");
  const resultCard = document.getElementById("quiz-result");
  const resultText = document.getElementById("quiz-result-text");
  const restartBtn = document.getElementById("quiz-restart");

  if (!quizCard) return;

  const questions = CONFIG.quiz || [];
  let current = 0;

  function renderDots() {
    dotsWrap.innerHTML = "";
    questions.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "quiz-dot" + (i === current ? " active" : i < current ? " done" : "");
      dotsWrap.appendChild(dot);
    });
  }

  function renderQuestion() {
    const q = questions[current];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = "";
    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.textContent = opt;
      btn.addEventListener("click", () => selectOption(btn));
      optionsEl.appendChild(btn);
    });
    renderDots();
  }

  function selectOption(btn) {
    [...optionsEl.children].forEach((c) => c.classList.remove("selected"));
    btn.classList.add("selected");
    setTimeout(() => {
      current += 1;
      if (current >= questions.length) {
        showResult();
      } else {
        renderQuestion();
      }
    }, 420);
  }

  function showResult() {
    quizCard.classList.add("hidden");
    resultCard.classList.remove("hidden");
    resultText.textContent = CONFIG.quizResultMessage;
    spawnFloater(window.innerWidth / 2, window.innerHeight * 0.4, "❤️", 10);
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      current = 0;
      resultCard.classList.add("hidden");
      quizCard.classList.remove("hidden");
      renderQuestion();
    });
  }

  document.addEventListener("DOMContentLoaded", renderQuestion);
})();
