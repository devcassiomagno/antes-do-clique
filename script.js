"use strict";

(() => {
    const situations = [
        {
            context: "Uma mensagem inesperada chega ao celular.",
            sender: "Central de Segurança · número desconhecido",
            message: "Sua conta será bloqueada em 10 minutos! Acesse o link enviado e informe sua senha e o código de verificação.",
            answer: "golpe",
            explanation: "A mensagem cria urgência e pede senha e código. Isso é um sinal de golpe.",
            advice: "Não abra o link. Consulte o banco pelo aplicativo ou canal oficial que você já conhece."
        },
        {
            context: "Você quer conferir se há algo errado com sua conta.",
            sender: "Consulta feita por você",
            message: "Você abre o aplicativo oficial do banco que já utiliza, por conta própria. Confere o extrato e não compartilha senhas ou códigos.",
            answer: "seguro",
            explanation: "É uma atitude segura: você iniciou a consulta em um canal habitual e não revelou dados a ninguém.",
            advice: "Lembre-se: aparência e logotipo não bastam. Use aplicativos instalados de fontes confiáveis."
        },
        {
            context: "Uma pessoa diz ser sua filha, mas usa outro número.",
            sender: "Ana · número novo",
            message: "Oi, mãe! Troquei de número. Preciso de um Pix de R$ 680 agora. Não me liga, meu telefone está com problema.",
            answer: "golpe",
            explanation: "Troca de número, pressa e pedido para não ligar são sinais importantes de golpe.",
            advice: "Antes de transferir, ligue para o número antigo do familiar ou confirme pessoalmente."
        }
    ];

    const counter = document.querySelector("#quiz-counter");
    const steps = document.querySelectorAll("#quiz-steps span");
    const layout = document.querySelector("#quiz-layout");
    const context = document.querySelector("#quiz-context");
    const sender = document.querySelector("#quiz-sender");
    const message = document.querySelector("#quiz-text");
    const options = document.querySelectorAll("[data-quiz-answer]");
    const feedback = document.querySelector("#quiz-feedback");
    const next = document.querySelector("#quiz-next");
    const finish = document.querySelector("#quiz-finish");
    const result = document.querySelector("#quiz-result");
    const restart = document.querySelector("#quiz-restart");
    const questionContainer = document.querySelector("#quiz-question");

    if (!layout || !next || options.length === 0) {
        console.warn("Elementos essenciais do quiz não foram encontrados no DOM.");
        return;
    }

    let current = 0;
    let correctAnswers = 0;
    let answered = false;

    function renderSituation() {
        const situation = situations[current];
        if (!situation) return;

        answered = false;
        
        if (counter) counter.textContent = `Situação ${current + 1} de ${situations.length}`;
        if (context) context.textContent = situation.context;
        if (sender) sender.textContent = situation.sender;
        if (message) message.textContent = situation.message;
        
        if (feedback) {
            feedback.hidden = true;
            feedback.replaceChildren();
            feedback.classList.remove("is-incorrect");
        }

        if (next) {
            next.hidden = true;
            const buttonText = current === situations.length - 1 ? "Ver meu resultado" : "Próxima situação";
            if (next.firstChild && next.firstChild.nodeType === Node.TEXT_NODE) {
                next.firstChild.textContent = buttonText + " ";
            } else {
                next.innerText = buttonText;
            }
        }

        options.forEach((button) => {
            button.disabled = false;
            button.classList.remove("is-chosen");
        });

        steps.forEach((step, index) => {
            step.classList.toggle("is-current", index === current);
            step.classList.toggle("is-complete", index < current);
        });
    }

    function answerSituation(choice) {
        if (answered) return;

        answered = true;
        const situation = situations[current];
        const isCorrect = choice === situation.answer;

        if (isCorrect) {
            correctAnswers += 1;
        }

        options.forEach((button) => {
            button.disabled = true;
            button.classList.toggle("is-chosen", button.dataset.quizAnswer === choice);
        });

        if (feedback) {
            const title = document.createElement("strong");
            const explanation = document.createElement("p");
            const advice = document.createElement("p");

            title.textContent = isCorrect ? "Isso mesmo!" : "Atenção a este detalhe:";
            explanation.textContent = situation.explanation;
            advice.textContent = situation.advice;

            feedback.replaceChildren(title, explanation, advice);
            feedback.classList.toggle("is-incorrect", !isCorrect);
            feedback.hidden = false;
            feedback.focus({ preventScroll: true });
        }

        if (next) next.hidden = false;
    }

    function showResult() {
        if (layout) layout.hidden = true;
        if (finish) finish.hidden = false;
        if (counter) counter.textContent = "Dinâmica concluída";
        if (result) result.textContent = `Você acertou ${correctAnswers} de ${situations.length}.`;

        steps.forEach((step) => {
            step.classList.remove("is-current");
            step.classList.add("is-complete");
        });

        if (finish) finish.focus({ preventScroll: true });
    }

    function nextSituation() {
        if (!answered) return;

        if (current < situations.length - 1) {
            current += 1;
            renderSituation();
            if (questionContainer) {
                questionContainer.focus({ preventScroll: true });
            }
        } else {
            showResult();
        }
    }

    function resetQuiz() {
        current = 0;
        correctAnswers = 0;
        if (layout) layout.hidden = false;
        if (finish) finish.hidden = true;
        renderSituation();
        if (questionContainer) {
            questionContainer.focus({ preventScroll: true });
        }
    }

    options.forEach((button) => {
        button.addEventListener("click", () => answerSituation(button.dataset.quizAnswer));
    });

    if (next) next.addEventListener("click", nextSituation);
    if (restart) restart.addEventListener("click", resetQuiz);

    renderSituation();
})();