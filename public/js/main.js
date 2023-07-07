const NUM_INIT_WORDS = 3;

const text = document.querySelector(".text");
const poem = document.querySelector(".poem");
const endingControls = document.querySelector("#ending-controls");

const WORD_TEMPLATE = document.querySelector(".word");
WORD_TEMPLATE.remove();

const PARAGRAPH_TEMPLATE = document.querySelector(".paragraph");
PARAGRAPH_TEMPLATE.remove();

const FEELING_TEMPLATE = document.querySelector(".feeling");
FEELING_TEMPLATE.remove();

const BREAK_TEMPLATE = document.querySelector(".break");
BREAK_TEMPLATE.remove();

const LINKING_TEMPLATE = document.querySelector(".linking-word");
LINKING_TEMPLATE.remove();

const WORDS_CONTAINER = document.querySelector("#choose-controls");
fetch("/assets/words.txt")
  .then(r => r.text())
  .then(text => {
    // create list of words
    const words = text.trim().split("\n");
    shuffle(words);

    // create and add elements
    words.forEach(word => {
      const el = WORD_TEMPLATE.cloneNode(true);
      el.innerText = word;
      el.addEventListener("click", () => {
        addNewFeeling(word);
      });
      WORDS_CONTAINER.appendChild(el);
    });

    // initialise first few
    for (let i = 0; i < NUM_INIT_WORDS; i++) {
      const word = words[i];
      addNewFeeling(word);
    }
  });

// https://javascript.info/task/shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function toggleToolbox() {
  const toolbox = document.querySelector(".toolbox");
  isExpanded = !isExpanded;
  toolbox.classList.toggle("expanded", isExpanded);
  const handleImg = handleBtn.querySelector("img");
  handleImg.src = isExpanded ? "/img/down-arrow.svg" : "/img/up-arrow.svg";
}

function addNewFeeling(text) {
  let para = null;
  if (poem.children.length === 0) {
    para = PARAGRAPH_TEMPLATE.cloneNode(true);
  } else {
    para = poem.lastChild;
    if (endingControls.hasTrailingLink.value === "false") {
      para.appendChild(newBreak());
      const link = createLinkingWord();
      para.appendChild(link);
    }
    para.appendChild(newBreak());
  }

  const newFeeling = FEELING_TEMPLATE.cloneNode(true);
  newFeeling.innerText = text;
  para.appendChild(newFeeling);
  if (endingControls.hasTrailingLink.value === "true") {
    para.appendChild(newBreak());
    const link = createLinkingWord();
    para.appendChild(link);
  }
  if (poem.children.length === 0) {
    poem.appendChild(para);
  }

  scrollToBottom();
}

function newBreak() {
  const newBreak = BREAK_TEMPLATE.cloneNode(true);
  newBreak.addEventListener("click", createBreak);
  return newBreak;
}

function changeTrailingLink(event) {
  if (poem.children.length > 0) {
    const val = event.target.value;
    const para = poem.lastChild;
    if (val === "true") {
      para.appendChild(newBreak());
      const link = createLinkingWord();
      para.appendChild(link);
    } else {
      const b = para.querySelector(".break:last-of-type");
      b.nextSibling.remove(); // remove break
      b.remove(); // remove and
    }
  }
}

function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}

function clearPoem() {
  poem.innerHTML = "";
}

function createLinkingWord() {
  const link = LINKING_TEMPLATE.cloneNode(true);

  const displayWord = link.querySelector(".linking-word-display");
  displayWord.addEventListener("click", () => {
    link.classList.toggle("expanded");
  });

  const options = link.querySelectorAll(".option");
  options.forEach(option => {
    option.classList.remove("hidden");
    if (option.innerText === displayWord.innerText) {
      option.classList.add("hidden");
    }
    option.addEventListener("click", () => {
      displayWord.innerText = option.innerText;
      link.classList.remove("expanded");
    });
  });

  return link;
}

function activateBreaks() {
  const breaks = document.querySelectorAll(".break");
  for (const b of breaks) {
    b.classList.add("break-active");
  }
}

function createBreak(event) {
  const b = event.target;
  if (!b.classList.contains("break-active")) return;

  const els = [];
  let el = b.nextSibling;
  while (el) {
    els.push(el);
    el = el.nextSibling;
  }
  const para = PARAGRAPH_TEMPLATE.cloneNode(true);
  for (const el of els) {
    para.appendChild(el);
  }
  poem.appendChild(para);

  const breaks = document.querySelectorAll(".break");
  for (const b1 of breaks) {
    b1.classList.remove("break-active");
  }
}

function toggleTheme() {
  isLightMode = !isLightMode;
  const themeLink = document.querySelector(".theme-sheet");
  themeLink.href = isLightMode ? "css/light.css" : "css/dark.css";
}

function changeSize(bigger) {
  const titleOrig = parseInt(getComputedStyle(title).fontSize);
  const poemOrig = parseInt(getComputedStyle(poem).fontSize);
  const mult = bigger ? 1.1 : 0.9;
  title.style.fontSize = (titleOrig * mult) + "px";
  poem.style.fontSize = (poemOrig * mult) + "px";
}

function download() {
  html2canvas(text, {
    logging: false
  }).then(canvas => {
    const imageURI = canvas.toDataURL("image/png");
    // https://stackoverflow.com/a/37673039
    const anchor = document.createElement("a");
    anchor.href = imageURI;
    anchor.target = "_blank";
    anchor.download = "poem.png";
    anchor.click();
  });
}

function submit() {
  const paras = Array.from(document.querySelectorAll(".poem .paragraph"));
  const lines = paras.map(para => {
    const els = Array.from(para.querySelectorAll(".feeling, .linking-word-display"));
    const words = els.map(word => word.innerText);
    const line = words.join(" ");
    return line;
  });
  const text = lines.join("\n");
  console.log(text);
  
  const request = fetch("/submit", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      text: text
    })
  });

  const submitBtn = document.querySelector("#submit");
  submitBtn.setAttribute("disabled", "");

  const submitLabel = submitBtn.querySelector(".control-label");
  const originalText = submitLabel.innerText;
  submitLabel.innerText = "Submitting…";

  const TIMEOUT = 1000;

  request.then(res => res.json())
    .then(res => {
      if (!res.error) {
        submitLabel.innerText = "Submitted!";
      } else {
        submitLabel.innerText = "Something went wrong.";
      }

      setTimeout(() => {
        submitLabel.innerText = originalText;
        submitBtn.removeAttribute("disabled");
      }, TIMEOUT);
    });
}

function cancelInteractions(e) {
  const target = e.target;
  if (!target.closest(".linking-word")) {
    const expanded = document.querySelector(".linking-word.expanded");
    if (expanded) {
      expanded.classList.remove("expanded");
    }
  }
}

// handle
const handleBtn = document.querySelector("#handle");
let isExpanded = true;
handleBtn.addEventListener("click", toggleToolbox);

// trailing and
endingControls.addEventListener("change", changeTrailingLink);

// break
const breakBtn = document.querySelector("#insertBreak");
breakBtn.addEventListener("click", activateBreaks);

// clear
const clearBtn = document.querySelector("#clear");
clearBtn.addEventListener("click", clearPoem);

// reverse
const reverseBtn = document.querySelector("#reverse");
let isLightMode = true;
reverseBtn.addEventListener("click", toggleTheme);

// font size control
const sizeControls = document.querySelectorAll(".sizeControl");
const title = document.querySelector(".title");
for (const sizeControl of sizeControls) {
  sizeControl.addEventListener("click", () => {
    const bigger = sizeControl.id === "bigger";
    changeSize(bigger);
  });
}

// download
const downloadBtn = document.querySelector("#download");
downloadBtn.addEventListener("click", download);

// submit
const submitBtn = document.querySelector("#submit");
submitBtn.addEventListener("click", submit)

// window resize
window.addEventListener("resize", scrollToBottom);

// cancel interactions
window.addEventListener("click", cancelInteractions);