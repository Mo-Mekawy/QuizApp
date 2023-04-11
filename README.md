# Documentation for Quiz App Files

The Quiz App is a web application that allows users to take a quiz on various topics. The application is built using HTML, CSS, and JavaScript.
The following files are included in the application:

- index.html - This file contains the HTML code for the quiz application. It includes the quiz container, question count, category, and question elements.

- style.css - This file contains the CSS code for the quiz application. It includes the styling for the quiz container, question count, category, and question elements.

- main.js - This file contains the JavaScript code for the quiz application. It includes the logic for fetching questions from an API, shuffling the questions, creating question elements, and handling user input.

### The main.js file is divided into several functions, each with a specific purpose. The functions are as follows:

`main()` - This function is the entry point of the application. It fetches the questions from the API, shuffles them, and creates the first question element.

`getQuestions()` - This function fetches the questions from the API. It uses async/await to handle the asynchronous nature of the fetch request. It also caches the questions to avoid unnecessary API calls.

`shuffle(arr)` - This function shuffles the questions array using the Fisher-Yates shuffle algorithm.

`CreateQuestion(questionObj, questions, index)` - This function creates a question element from a question object. It takes in the question object, the questions array, and the index of the current question. It creates the question title, answers, count down, and submit button.

`showResults()` - This function displays the results of the quiz after the user has answered all the questions. It creates a popup with the number of wrong answers and a continue button.

`createPopup(msg)` - This function creates a popup with a message and a continue button. It is used to display the results of the quiz.

`Event Listeners` - The main.js file also includes several event listeners for handling user input. These include event listeners for clicking on an answer, submitting a question, and clicking on the continue button in the popup.

Overall, the Quiz App is a simple and straightforward application that allows users to take a quiz on various topics. It is built using HTML, CSS, and JavaScript and includes several functions for fetching questions, shuffling them, creating question elements, and handling user input.
