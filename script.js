const entities = [
  {
    name: "1) Intake Workspace",
    description:
      "A lightweight portal where due diligence questionnaires are uploaded, tagged, and assigned an owner.",
  },
  {
    name: "2) Question Classifier",
    description:
      "A first-pass model labels each question by theme (security, privacy, legal, commercial) and difficulty.",
  },
  {
    name: "3) Evidence Retriever",
    description:
      "A retrieval layer links each question to existing policy documents, prior answers, and controls evidence.",
  },
  {
    name: "4) Draft Answer Generator",
    description:
      "The assistant proposes a draft answer with citations, confidence level, and highlighted assumptions.",
  },
  {
    name: "5) Human Reviewer",
    description:
      "Subject matter experts validate, edit, and approve responses, feeding corrections back into the next iteration.",
  },
];

const STEPS_PER_ENTITY = 3;
const maxStep = entities.length * STEPS_PER_ENTITY - 1;
let currentStep = 0;

const entityIndex = document.getElementById("entity-index");
const entityName = document.getElementById("entity-name");
const entityDescription = document.getElementById("entity-description");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const progress = document.getElementById("progress");
const slide = document.querySelector(".slide");

const revealItems = [entityIndex, entityName, entityDescription];
revealItems.forEach((item) => item.classList.add("reveal-item"));

let renderedEntityIndex = -1;

function getStepState(step) {
  return {
    entityPosition: Math.floor(step / STEPS_PER_ENTITY),
    visibleCount: (step % STEPS_PER_ENTITY) + 1,
  };
}

function renderProgress(activeEntity) {
  progress.innerHTML = "";

  entities.forEach((entity, index) => {
    const item = document.createElement("li");

    if (index < activeEntity) {
      item.classList.add("completed");
    }

    if (index === activeEntity) {
      item.classList.add("active");
    }

    item.setAttribute("aria-label", entity.name);
    progress.appendChild(item);
  });
}

function setVisibleCount(visibleCount, animated) {
  revealItems.forEach((item, index) => {
    const shouldShow = index < visibleCount;

    item.classList.toggle("is-visible", shouldShow);
    item.classList.toggle("animate", animated && shouldShow);
  });
}

function renderStep(previousStep = currentStep) {
  const { entityPosition, visibleCount } = getStepState(currentStep);
  const previousState = getStepState(previousStep);

  if (entityPosition !== renderedEntityIndex) {
    const entity = entities[entityPosition];
    entityIndex.textContent = `Entity ${entityPosition + 1} of ${entities.length}`;
    entityName.textContent = entity.name;
    entityDescription.textContent = entity.description;
    renderedEntityIndex = entityPosition;
  }

  const movedForward = currentStep > previousStep;
  const sameEntity = entityPosition === previousState.entityPosition;
  const animated = movedForward && sameEntity;

  setVisibleCount(visibleCount, animated);

  previousButton.disabled = currentStep === 0;
  nextButton.disabled = currentStep === maxStep;
  renderProgress(entityPosition);
}

function showNext() {
  if (currentStep < maxStep) {
    const previousStep = currentStep;
    currentStep += 1;
    renderStep(previousStep);
  }
}

function showPrevious() {
  if (currentStep > 0) {
    const previousStep = currentStep;
    currentStep -= 1;
    renderStep(previousStep);
  }
}

nextButton.addEventListener("click", showNext);
previousButton.addEventListener("click", showPrevious);

slide.addEventListener("click", (event) => {
  const clickedControl = event.target.closest("button");
  if (!clickedControl) {
    showNext();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown") {
    event.preventDefault();
    showNext();
  }

  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    showPrevious();
  }
});

renderStep();
