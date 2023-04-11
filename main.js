const API_KEY = "q6QJdBHEv0mp52IY8V8hUlZQOLpsmlpt4qJOsm6H";

const API_URL = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=Code&difficulty=Hard`;

// query needed elements
const quesCountEl = document.querySelector("[data-questions-count]");
const categoryEl = document.querySelector("[data-category]");
const quizContainerEl = document.querySelector("[data-quiz-container]");

let wrongAnswers = 0;

function shuffle(arr) {
  const resultArr = [...arr]; // get a copy

  for (let i = 0, n = resultArr.length; i < n; i++) {
    index = Math.floor(Math.random() * n); // get a rand index
    // swap the value at i with the value at rand-index
    const tmp = resultArr[index];
    resultArr[index] = resultArr[i];
    resultArr[i] = tmp;
  }

  return resultArr;
}

// wrap the getQuestions function in another function
// so it can have access to a private var 'oldVal'
// with this var if the function is called again
// it will return the old value without the need to fetch the data again
const getQuestions = (function tmp() {
  let oldVal = null;

  async function getQuestions() {
    if (oldVal !== null) {
      // don't fetch if you have done it already
      return oldVal;
    }

    const res = await fetch(API_URL);
    const questions = await res.json();

    oldVal = questions;

    return questions;
  }

  return getQuestions;
})();

function CreateQuestion(questionObj, questions, index) {
  const rightAns =
    questionObj.answers[
      Object.keys(questionObj.answers).filter(
        (key) => questionObj.correct_answers[key + "_correct"] === "true"
      )[0]
    ];

  const containerDiv = document.createElement("div");
  containerDiv.className = "quiz";

  // question  element
  const createQuestionTitle = () => {
    const quesH2 = document.createElement("h2");
    quesH2.className = "question";

    const questionNumSpan = document.createElement("span");
    questionNumSpan.className = "question-num";
    questionNumSpan.textContent = index;

    const quesTextSpan = document.createElement("span");
    // replace special characters in the question title with html entities
    const replaceEntities = (text) => {
      const entities = [
        ["amp", "&"],
        ["apos", "'"],
        ["#x27", "'"],
        ["#x2F", "/"],
        ["#39", "'"],
        ["#47", "/"],
        ["lt", "<"],
        ["gt", ">"],
        ["nbsp", " "],
        ["quot", '"'],
      ];

      for (let i = 0, n = entities.length; i < n; i++) {
        const regex = new RegExp(`&${entities[i][0]};`, "g");

        text = text.replace(regex, entities[i][1]);
      }

      return text;
    };

    quesTextSpan.textContent = replaceEntities(questionObj.question);

    quesH2.append(questionNumSpan);
    quesH2.append(quesTextSpan);

    return quesH2;
  };

  const createAnswers = () => {
    // answers container element
    const answersEl = document.createElement("ul");
    answersEl.className = "answers";

    // create answers
    const keys = Object.keys(questionObj.answers);
    for (let i = 0; i < keys.length; i++) {
      if (questionObj.answers[keys[i]] === null) continue;

      const ansEl = document.createElement("li");
      ansEl.className = "answer";
      ansEl.addEventListener("click", (e) => {
        ansEl.querySelector("input").click();
      });

      const radioBtn = document.createElement("input");
      radioBtn.setAttribute("type", "radio");
      radioBtn.setAttribute("name", "answer");
      radioBtn.setAttribute("id", keys[i]);

      const label = document.createElement("label");
      label.setAttribute("for", keys[i]);
      label.textContent = questionObj.answers[keys[i]];

      ansEl.append(radioBtn);
      ansEl.append(label);

      answersEl.append(ansEl);
    }

    return answersEl;
  };

  // create Count Down
  const createCountDown = () => {
    const countLimit = 60;

    const countDownDiv = document.createElement("div");
    countDownDiv.className = "count-down";

    const timeLeft = document.createElement("span");
    timeLeft.textContent = countLimit;

    countDownDiv.append(document.createTextNode("Time Left: "));
    countDownDiv.append(timeLeft);
    countDownDiv.append(document.createTextNode(" sec"));

    const interval = setInterval(() => {
      if (countDownDiv.dataset.done === "true") {
        clearInterval(interval);
        return;
      }

      timeLeft.textContent--;

      if (+timeLeft.textContent <= 0) {
        clearInterval(interval);
        countDownDiv.parentElement.querySelector("button").click(); // submit
      }
    }, 1000);

    return countDownDiv;
  };

  // create Submit Btn
  const createSubmitBtn = () => {
    const submitBtn = document.createElement("button");
    submitBtn.setAttribute("type", "submit");
    submitBtn.className = "submit-btn";
    submitBtn.textContent = "Submit";

    submitBtn.onclick = (e) => {
      const quiz = e.target.closest(".quiz");

      quiz.querySelector(".count-down").setAttribute("data-done", "true");

      quiz.style.pointerEvents = "none";

      const answer = quiz.querySelector("input[type=radio]:checked + label");

      if (answer === null) {
        wrongAnswers++;
      } else if (answer.textContent !== rightAns) {
        wrongAnswers++;
        answer.parentElement.classList.add("wrong");
      } else {
        answer.parentElement.classList.add("correct");
      }

      // if last question
      if (index >= questions.length) {
        quiz.remove();
        showResults();
        return;
      }

      setTimeout(() => {
        quiz.remove();
        categoryEl.textContent = questions[index].category;
        const quesEl = CreateQuestion(questions[index], questions, index + 1);
        quizContainerEl.append(quesEl);
      }, 1000);
    };

    return submitBtn;
  };

  containerDiv.append(createQuestionTitle());
  containerDiv.append(createAnswers());

  const createQuestionFooter = () => {
    const footer = document.createElement("div");
    footer.className = "question-footer";
    return footer;
  };

  const footer = createQuestionFooter();
  footer.append(createCountDown());
  footer.append(createSubmitBtn());

  containerDiv.append(footer);

  return containerDiv;
}

function createPopup(msg) {
  const createConfirmBtn = () => {
    // confirm btn
    const confirmBtn = document.createElement("button");
    confirmBtn.setAttribute("type", "submit");
    confirmBtn.className = "confirm";
    confirmBtn.textContent = "Continue";

    confirmBtn.addEventListener("click", (e) => {
      e.target.parentElement.remove();
      document.body.classList.remove("blur");

      wrongAnswers = 0;
      main();
    });

    return confirmBtn;
  };

  const popUp = document.createElement("div");
  popUp.classList.add("pop-up");

  const messageP = document.createElement("p");
  messageP.textContent = msg;
  messageP.className = "popup-msg";

  popUp.append(messageP);
  popUp.append(createConfirmBtn());

  document.body.append(popUp);
  document.body.classList.add("blur");
}

function showResults() {
  createPopup(`You Finished the quiz with ${wrongAnswers} wrong answers!`);
}

function main() {
  getQuestions().then((questions) => {
    questions = shuffle(questions); // shuffle the questions array

    quesCountEl.textContent = questions.length; // update questions count
    categoryEl.textContent = questions[0].category; // update question category

    // create a question element from the first obj and append it
    const quesEl = CreateQuestion(questions[0], questions, 1);
    quizContainerEl.append(quesEl);
  });
}

main();
