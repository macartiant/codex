const revealItems = Array.from(document.querySelectorAll(".reveal"));
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const maxStep = Math.max(...revealItems.map((item) => Number(item.dataset.step)));

let currentStep = 0;

function renderStep() {
  revealItems.forEach((item) => {
    const itemStep = Number(item.dataset.step);
    const shouldShow = itemStep <= currentStep;
    item.classList.toggle("visible", shouldShow);
  });

  previousButton.disabled = currentStep === 0;
  nextButton.disabled = currentStep === maxStep;
}

function goForward() {
  if (currentStep < maxStep) {
    currentStep += 1;
    renderStep();
  }
}

function goBackward() {
  if (currentStep > 0) {
    currentStep -= 1;
    renderStep();
  }
}

nextButton.addEventListener("click", goForward);
previousButton.addEventListener("click", goBackward);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    goForward();
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goBackward();
  }
});

renderStep();
