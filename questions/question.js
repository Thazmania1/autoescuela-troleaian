window.addEventListener("load", () => {
    const answers = document.querySelectorAll(".answer-item");
    const explanationBtn = document.getElementById("explanation-button");
    const questionList = document.getElementById("question-list");

    let answered = false;

    answers.forEach(answer => {
        answer.addEventListener("click", () => {
            if (answered) return; // user can only answer once
            answered = true;

            // Reveal explanation button
            explanationBtn.classList.remove("hidden");

            const span = answer.querySelector("span");

            // Always show green tick on the correct answer
            const correctAnswer = document.querySelector(".answer-item[correct]");
            const correctSpan = correctAnswer.querySelector("span");
            correctSpan.classList.add("correct-tick");

            // If THIS answer is wrong → show red X
            if (!answer.hasAttribute("correct")) {
                span.classList.add("wrong-x");
            }
        });
    });

    for(i = 1; i <= 1000; i++)
    {
        const newQuestionItem = document.createElement("div");
        newQuestionItem.textContent = i;
        newQuestionItem.classList.add("question-item");
        newQuestionItem.setAttribute("explodable", true);

        questionList.append(newQuestionItem);
    }
});

function openExplanation()
{
    document.body.style.overflow = "hidden";
    document.getElementById("explanation-overlay").classList.remove("hidden");
}