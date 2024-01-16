// Buscar página html e renderizar no elemento root
const renderPage = (pageName: string): void => {
  fetch(`pages/${pageName}.html`)
    .then((resp) => resp.text())
    .then((html) => {
      const rootElem = document.getElementById("root") as HTMLElement;
      rootElem.innerHTML = html; // renderizar o html
      // ----------------
      const form = document.getElementById("root") as HTMLFormElement;

      // ouvinte de evento de envio de formulário

      form.addEventListener("submit", function (event) {
        const inputElem = document.getElementById(
          "input-name"
        ) as HTMLInputElement;
        localStorage.setItem("name", inputElem.value);
        event.preventDefault();

        // fetch da pagina quiz  e renderizando
        fetch("pages/quiz.html")
          .then((resp) => resp.text())
          .then((html) => {
            rootElem.innerHTML = html;

            // mudando o background da pagina quiz.html

            const element = document.querySelector(".container") as HTMLElement;
            const body = document.body;
            body.style.backgroundColor = "#EFF0F3";
            element.style.backgroundColor = "#EFF0F3";

            //fetch do arquivo questions.json, renderizando a pergunta, 4 alternativas e a resposta correta

            // renderizando a pagina de questionario

            // ------------DICA: poderia chamar as questões com await, pegando pelo arquivo JSON ------------
            // DICA: Usando o interfase para identificar elas

            fetch("questions.json")
              .then((resp) => resp.json())
              .then((data) => {
                const question = data.questions[0]; // buscando os dados da primeira questão do arquivo json

                // criando os elementos
                const questionContainer = document.querySelector(
                  ".question-container"
                ) as HTMLDivElement;
                const buttonContainer = document.querySelector(
                  ".btn-list"
                ) as HTMLDivElement;
                questionContainer.innerHTML = question.question;
                buttonContainer.innerHTML = ""; // renderiza os botões

                // callback
                // forEach: executa um função em cada elemnto de um array
                // PERCORRER AS OPTIONS PARA SER REDERIZADO PARA TELA
                question.options.forEach(
                  (options: string, index: string): any => {
                    const button = document.createElement(
                      "button"
                    ) as HTMLElement;
                    button.innerText = options; // rederiza as options em texto para o button

                    if (index === question.correct) {
                      //o botão de resposta correta com um identificador exclusivo
                      button.dataset.correct = "";
                    }

                    buttonContainer.appendChild(button); // Renderizando e atribuindo o valor para esses botões

                    // ouvinte para o evento no button
                    button.addEventListener("click", function () {
                      const isRight = button.hasAttribute("data-correct"); // O usuario selecionou a correta ---

                      // mudando a cor quando clica no botão
                      if (isRight) {
                        button.style.backgroundColor = "#ABD1C6";
                      } else {
                        button.style.backgroundColor = "#D22E2E";
                      }

                      const buttonResp = document.getElementById(
                        "next-btn"
                      ) as HTMLFormElement;

                      // ouvinte para o evento, quando clicar no botão responder
                      buttonResp.addEventListener("click", function () {
                        // quando apertar no botão disparar um alert

                        if (isRight) {
                          alert("Resposta Correta!");
                        } else {
                          alert("Responda Incorreta!");
                        }

                        // ir para a pagina leaderbord e renderizando a pagina
                        fetch("pages/leaderboard.html")
                          .then((resp) => resp.text())
                          .then((html) => {
                            rootElem.innerHTML = html;

                            // design do background
                            const body = document.body;

                            body.style.backgroundColor = "#004643";

                            // armazenar os resultados no localStorage

                            const resultObj = [
                              // variavel para organizar os dados no localStorange
                              {
                                name: localStorage.getItem("name"),
                                isRight: isRight,
                              },
                            ];

                            const verification =
                              localStorage.getItem("results");

                            // verificação do objeto no localStorage
                            if (verification !== null) {
                              const verificationResult =
                                JSON.parse(verification); // os dados se tornarão um objeto JavaScript.

                              resultObj.push(...verificationResult); // inseri a verifição na variavel resultObj
                            }

                            const result = JSON.stringify(resultObj); // O JSON.stringify converte um valor JavaScript em uma string JSON

                            localStorage.setItem("results", result); // Vai armazenar os dados no localStorage, na chave chamada (results)

                            // Inserir resultados no leaderboard

                            function displayResults(): void {
                              // verificação
                              let results = localStorage.getItem("results");
                              if (results !== null) {
                                results = JSON.parse(results); //
                              }

                              // Ordernar os resultados

                              const answersOrdered = resultObj.sort(
                                (a, b): number =>
                                  (b.isRight ? 1 : 0) - (a.isRight ? 1 : 0) // ALGORITIMO DE ORDENAÇÃO
                              );

                              // organiza a pontuação da resposta decrescente
                              const playMove = Math.min(
                                answersOrdered.length,
                                3
                              );

                              // remover quando tiver 3 jogadores
                              if (answersOrdered.length === 3) {
                                // === mesmo valor e tipo
                                localStorage.removeItem("results");
                              }

                              // criando os elementos
                              const leaderboardItems =
                                document.querySelectorAll(".podium-item");
                              for (
                                let i = 0;
                                i < answersOrdered.length &&
                                i < leaderboardItems.length;
                                i++
                              ) {
                                const leaderboardItem = leaderboardItems[
                                  i
                                ] as HTMLElement;
                                const nameElement: any =
                                  leaderboardItem.querySelector(
                                    "#namePodium"
                                  ) as HTMLElement;
                                const rankingElement =
                                  leaderboardItem.querySelector(
                                    "#rankingPodium"
                                  ) as HTMLElement;

                                nameElement.innerText = answersOrdered[i].name;
                                rankingElement.innerText = (i + 1).toString();
                              }

                              for (
                                let i = playMove;
                                i < answersOrdered.length;
                                i++
                              ) {
                                const remainingItem = document.querySelector(
                                  ".remaining-item"
                                ) as HTMLElement;

                                remainingItem.className = "remaining-item";
                                remainingItem.innerText = `${i + 1}. ${
                                  answersOrdered[i].name
                                }`;
                              }
                            }

                            displayResults();

                            const newGameButton = document.querySelector(
                              ".btn-component.btn-gold"
                            ) as HTMLElement;

                            newGameButton.addEventListener("click", () =>
                              renderPage("start")
                            );
                          });
                      });
                    });
                  }
                );
              });
          });
      });
    });
};

renderPage("start");
