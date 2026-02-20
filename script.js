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
  const visibleKeys = new Set(revealOrder.slice(0, currentStep));

  revealMap.forEach((value, key) => {
    const elements = Array.isArray(value) ? value : [value];
    const shouldBeVisible = visibleKeys.has(key);

    elements.forEach(element => {
      if (shouldBeVisible) {
        element.classList.add("visible");
      } else {
        element.classList.remove("visible");
      }
    });
  });
}

function renderFlowSlide() {
  const flow = document.createElement("section");
  flow.className = "flow";
  flow.setAttribute("aria-label", "Slide sequence");

  activeSlideConfig.flow.forEach((item, index) => {
    flow.append(buildFlowItem(item));

    if (index < activeSlideConfig.connectors.length) {
      flow.append(buildConnector(activeSlideConfig.connectors[index], index));
    }
  });
  return flow;
}

function renderComparisonSlide() {
  const grid = document.createElement("section");
  grid.className = "comparison-grid";
  revealMap.set("comparison-grid", grid);

  // Headers
  const headerElements = [];
  activeSlideConfig.headers.forEach(header => {
    const div = document.createElement("div");
    div.className = `comparison-header ${header.class || ""}`;
    div.innerHTML = `${header.icon} ${header.text}`;
    headerElements.push(div);
    grid.append(div);
  });
  revealMap.set("headers", headerElements);

  // Rows
  activeSlideConfig.rows.forEach((row, index) => {
    // Left Cell
    const leftCell = document.createElement("div");
    leftCell.className = "comparison-cell";
    leftCell.innerHTML = `<span class="cell-icon">${row.left.icon}</span> ${row.left.text}`;
    revealMap.set(`row-${index}-left`, leftCell);
    grid.append(leftCell);

    // Right Cell
    const rightCell = document.createElement("div");
    rightCell.className = "comparison-cell";
    rightCell.innerHTML = `<span class="cell-icon">${row.right.icon}</span> ${row.right.text}`;
    revealMap.set(`row-${index}-right`, rightCell);
    grid.append(rightCell);
  });

  return grid;
}

function renderSlide() {
  revealMap = new Map();
  revealOrder = activeSlideConfig.interactions.map((entry) => entry.reveal);
  slideContent.innerHTML = "";

  const title = document.createElement("h1");
  title.textContent = activeSlideConfig.title;
  revealMap.set("headline", title);

  let mainContent;
  if (activeSlideConfig.layout === "comparison") {
    mainContent = renderComparisonSlide();
  } else {
    mainContent = renderFlowSlide();
  }

  const messageSection = document.createElement("section");
  messageSection.className = "message";

  activeSlideConfig.messages.forEach((text, index) => {
    const message = document.createElement("p");

    if (text.includes("It is a sequencing problem.")) {
      message.innerHTML = text.replace("It is a sequencing problem.", "<strong>It is a sequencing problem.</strong>");
    } else {
      message.textContent = text;
    }

    revealMap.set(`message-${index + 1}`, message);
    messageSection.append(message);
  });

  slideContent.append(title, mainContent, messageSection);
  // Do not reset step here, let loadSlide handle it
}

async function loadSlide(index, startAtEnd = false) {
  if (index < 0 || index >= presentationConfig.slides.length) return;

  currentSlideIndex = index;
  const slideInfo = presentationConfig.slides[currentSlideIndex];

  try {
    const timestamp = new Date().getTime();
    const slideResponse = await fetch(`${PRESENTATION_FOLDER}/${slideInfo.folder}/${slideInfo.index}?t=${timestamp}`);
    activeSlideConfig = await slideResponse.json();

    renderSlide();

    if (startAtEnd) {
      setStep(revealOrder.length);
    } else {
      setStep(0);
    }
  } catch (error) {
    console.error("Failed to load slide:", error);
    slideContent.innerHTML = `<p>Error loading slide ${index + 1}</p>`;
  }
}

async function loadPresentation() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`${PRESENTATION_FOLDER}/index.json?t=${timestamp}`);
    if (!response.ok) throw new Error("Presentation not found");

    presentationConfig = await response.json();
    await loadSlide(0);
  } catch (error) {
    console.error(error);
    slideContent.innerHTML = `<h1>Presentation '${PRESENTATION_FOLDER}' not found</h1>`;
  }
}

function goForward() {
  if (currentStep < revealOrder.length) {
    setStep(currentStep + 1);
  } else if (currentSlideIndex < presentationConfig.slides.length - 1) {
    loadSlide(currentSlideIndex + 1, false);
  }
}

function goBackward() {
  if (currentStep > 0) {
    setStep(currentStep - 1);
  } else if (currentSlideIndex > 0) {
    loadSlide(currentSlideIndex - 1, true);
  }
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

  if (event.code === "Space" || event.key === " ") {
    event.preventDefault();
    setStep(revealOrder.length);
  }
});

loadPresentation();
