const PRESENTATION_FOLDER = "Agile";
const slideContent = document.getElementById("slide-content");

let activeSlideConfig;
let revealOrder = [];
let revealMap = new Map();
let currentStep = 0;

function buildFlowItem(item) {
  const wrapper = document.createElement("article");
  wrapper.className = "flow-item";

  const icon = document.createElement("div");
  icon.className = "icon";
  icon.textContent = item.icon;
  icon.setAttribute("aria-hidden", "true");

  const label = document.createElement("p");
  label.textContent = item.label;

  wrapper.append(icon, label);
  revealMap.set(item.id, wrapper);

  return wrapper;
}

function buildConnector(symbol, index) {
  const connector = document.createElement("div");
  connector.className = "connector";
  connector.textContent = symbol;
  connector.setAttribute("aria-hidden", "true");
  revealMap.set(`connector-${index + 1}`, connector);

  return connector;
}

function setStep(step) {
  currentStep = Math.min(Math.max(step, 0), revealOrder.length);

  revealMap.forEach((element) => {
    element.classList.remove("visible");
  });

  for (let index = 0; index < currentStep; index += 1) {
    const key = revealOrder[index];
    const element = revealMap.get(key);
    if (element) {
      element.classList.add("visible");
    }
  }
}

function renderSlide() {
  revealMap = new Map();
  revealOrder = activeSlideConfig.interactions.map((entry) => entry.reveal);
  slideContent.innerHTML = "";

  const title = document.createElement("h1");
  title.textContent = activeSlideConfig.title;
  revealMap.set("headline", title);

  const flow = document.createElement("section");
  flow.className = "flow";
  flow.setAttribute("aria-label", "Slide sequence");

  activeSlideConfig.flow.forEach((item, index) => {
    flow.append(buildFlowItem(item));

    if (index < activeSlideConfig.connectors.length) {
      flow.append(buildConnector(activeSlideConfig.connectors[index], index));
    }
  });

  const messageSection = document.createElement("section");
  messageSection.className = "message";

  activeSlideConfig.messages.forEach((text, index) => {
    const message = document.createElement("p");

    if (index === 1) {
      message.innerHTML = text.replace("It is a sequencing problem.", "<strong>It is a sequencing problem.</strong>");
    } else {
      message.textContent = text;
    }

    revealMap.set(`message-${index + 1}`, message);
    messageSection.append(message);
  });

  slideContent.append(title, flow, messageSection);
  setStep(0);
}

async function loadPresentation() {
  const presentationResponse = await fetch(`${PRESENTATION_FOLDER}/index.json`);
  const presentationConfig = await presentationResponse.json();

  const firstSlide = presentationConfig.slides[0];
  const slideResponse = await fetch(`${PRESENTATION_FOLDER}/${firstSlide.folder}/${firstSlide.index}`);
  activeSlideConfig = await slideResponse.json();

  renderSlide();
}

function goForward() {
  setStep(currentStep + 1);
}

function goBackward() {
  setStep(currentStep - 1);
}

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

loadPresentation();
