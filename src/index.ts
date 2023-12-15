const renderPage = (pageName: string): void => {
  fetch(`pages/${pageName}.html`)
    .then((resp) => resp.text())
    .then((html) => {
      const rootElem = document.getElementById("root") as HTMLElement;
      rootElem.innerHTML = html;

      const form = document.getElementById("root") as HTMLFormElement;

      form.addEventListener("click", function () {
        const inputElem = document.getElementById(
          "input-name"
        ) as HTMLInputElement;
        localStorage.setItem("name", inputElem.value);

        fetch(`pages/quiz.html`)
          .then((resp) => resp.text())
          .then((html) => {
            rootElem.innerHTML = html;
          });
      });
    });
};

renderPage("start");
