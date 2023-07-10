const NUM_INIT_WORDS = 3;

const text = document.querySelector(".text");
const poem = document.querySelector(".poem");

const WORD_TEMPLATE = document.querySelector(".word");
WORD_TEMPLATE.remove();
const PARAGRAPH_TEMPLATE = document.querySelector(".paragraph");
PARAGRAPH_TEMPLATE.remove();
const FEELING_TEMPLATE = document.querySelector(".feeling");
FEELING_TEMPLATE.remove();
const BREAK_TEMPLATE = document.querySelector(".break");
BREAK_TEMPLATE.remove();
const LINKING_OPTION_TEMPLATE = document.querySelector(".linking-word .option");
LINKING_OPTION_TEMPLATE.remove();
const LINKING_TEMPLATE = document.querySelector(".linking-word");
LINKING_TEMPLATE.remove();

const BREAKPOINT = 1000;

const files = ["/assets/words.txt", "/assets/links.txt"];
const promises = files.map(file => fetch(file).then(res => res.text()));
Promise.all(promises)
  .then(values => {
    const [words, links] = values.map(arr => arr.trim().split("\n"));
    populateFeelingWords(words);
    populateLinkingWords(links);
    startWithFeelings(words);
  });

function populateFeelingWords(words) {
  shuffle(words);
  words.forEach(word => addFeeling(word));
  // // create and add elements
  // const WORDS_CONTAINER = document.querySelector("#choose-controls");
  // words.forEach(word => {
  //   const el = WORD_TEMPLATE.cloneNode(true);
  //   el.innerText = word;
  //   el.addEventListener("click", () => {
  //     selectFeeling(word);
  //   });
  //   // WORDS_CONTAINER.appendChild(el);
  //   WORDS_CONTAINER.insertBefore(el, WORDS_CONTAINER.firstElementChild);
  // });
}

function populateLinkingWords(links) {
  const list = LINKING_TEMPLATE.querySelector(".linking-options");
  links.forEach(link => {
    const el = LINKING_OPTION_TEMPLATE.cloneNode(true);
    el.innerText = link;
    list.appendChild(el);
  });
}

function startWithFeelings(words) {
  for (let i = 0; i < NUM_INIT_WORDS; i++) {
    const word = words[i];
    selectFeeling(word);
  }
}

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

function isToolboxExpanded() {
  if (document.body.scrollWidth < BREAKPOINT) {
    const toolbox = document.querySelector(".toolbox");
    return toolbox.classList.contains("expanded");
  } else {
    return true;
  }
}

function toggleToolbox(expand) {
  if (expand === undefined) {
    isExpanded = !isExpanded;
  } else {
    isExpanded = expand;
  }

  const btn = document.querySelector("#toolbox-btn");
  const show = btn.querySelector("#show-toolbox-btn");
  const hide = btn.querySelector("#hide-toolbox-btn");
  show.classList.toggle("hidden", isExpanded);
  hide.classList.toggle("hidden", !isExpanded);

  const toolbox = document.querySelector(".toolbox");
  toolbox.classList.toggle("expanded", isExpanded);
}

function addFeeling(text) {
  // create and add elements
  const WORDS_CONTAINER = document.querySelector("#choose-controls");
  const freeform = document.querySelector("#freeform-form");
  const el = WORD_TEMPLATE.cloneNode(true);
  el.innerText = text;
  el.addEventListener("click", () => selectFeeling(text));
  WORDS_CONTAINER.insertBefore(el, freeform);
}

function selectFeeling(text) {
  const paras = document.querySelectorAll(".paragraph");
  let para = null;
  if (paras.length > 0) {
    para = paras[paras.length - 1];
    if (endingControls.hasTrailingLink.value === "false") {
      para.appendChild(newBreak());
      para.appendChild(newLinkingWord());
    }
    para.appendChild(newBreak());
  } else {
    para = PARAGRAPH_TEMPLATE.cloneNode(true);
    poem.appendChild(para);
  }

  const feeling = newFeelingWord(text);
  para.appendChild(feeling);

  if (endingControls.hasTrailingLink.value === "true") {
    para.appendChild(newBreak());
    para.appendChild(newLinkingWord());
  }

  scrollToBottom();
}

function removeFeeling(feeling) {
  const followingBreak = feeling.nextElementSibling;
  if (followingBreak) {
    const followingLink = followingBreak.nextElementSibling;
    followingLink.remove();
    followingBreak.remove();
  }

  const precedingBreak = feeling.previousElementSibling;
  if (precedingBreak) {
    precedingBreak.remove();
  }

  feeling.remove();
}

function newBreak() {
  const newBreak = BREAK_TEMPLATE.cloneNode(true);
  newBreak.addEventListener("click", useBreak);
  return newBreak;
}

function changeLeadingLink(event) {
  const feelings = document.querySelectorAll(".feeling");
  const links = document.querySelectorAll(".linking-word");

  const addLink = () => {
    const firstFeeling = feelings[0];
    const para = firstFeeling.closest(".paragraph");
    const link = newLinkingWord();
    para.insertBefore(link, firstFeeling);
    const b = newBreak();
    para.insertBefore(b, firstFeeling);
  }

  const removeLink = () => {
    const firstLink = links[0];
    const nextBreak = firstLink.nextElementSibling;
    firstLink.remove();
    nextBreak.remove();
  }

  if (feelings) {
    if (event.target.value === "true") {
      addLink();
    } else {
      removeLink();
    }
  }
}

function changeTrailingLink(event) {
  const feelings = document.querySelectorAll(".feeling");
  const links = document.querySelectorAll(".linking-word");

  const addLink = () => {
    const lastFeeling = feelings[feelings.length - 1];
    const para = lastFeeling.closest(".paragraph");
    const b = newBreak();
    para.appendChild(b);
    const link = newLinkingWord();
    para.appendChild(link);
  }

  const removeLink = () => {
    const lastLink = links[links.length - 1];
    const prevBreak = lastLink.previousElementSibling;
    prevBreak.remove();
    lastLink.remove();
  }

  if (feelings) {
    if (event.target.value === "true") {
      addLink();
    } else {
      removeLink();
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
  const para = PARAGRAPH_TEMPLATE.cloneNode(true);
  poem.appendChild(para);
}

function newFeelingWord(text) {
  const feeling = FEELING_TEMPLATE.cloneNode(true);
  feeling.innerText = text;
  feeling.addEventListener("click", () => removeFeeling(feeling));
  return feeling;
}

function newLinkingWord() {
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

function useBreak(event) {
  const b = event.target;
  if (!b.classList.contains("break-active")) return;

  const els = [];
  let el = b.nextElementSibling;
  while (el) {
    els.push(el);
    el = el.nextElementSibling;
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
  const title = document.querySelector("#title-input").value;

  html2canvas(text, {
    logging: false
  }).then(canvas => {
    const imageURI = canvas.toDataURL("image/png");
    // https://stackoverflow.com/a/37673039
    const anchor = document.createElement("a");
    anchor.href = imageURI;
    anchor.download = `${title}.txt`;
    anchor.click();
  });

  const poemText = getPoemText();
  const blob = new Blob([poemText], { type: "text/plain;charset=UTF-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${title}.txt`;
  anchor.click();
}

function reviewSubmission() {
  document.querySelector(".title label").classList.remove("hidden");
  document.querySelector(".author").classList.remove("hidden");
  document.querySelectorAll("#title-input, #author-input").forEach(input => input.disabled = false);

  document.querySelector(".review-btns").classList.remove("hidden");

  document.querySelector(".toolbox").classList.add("hidden");
}

function cancelSubmission() {
  document.querySelector(".title label").classList.add("hidden");
  document.querySelector(".author").classList.add("hidden");
  document.querySelectorAll("#title-input, #author-input").forEach(input => input.disabled = true);

  document.querySelector(".review-btns").classList.add("hidden");

  document.querySelector(".toolbox").classList.remove("hidden");
}

function getPoemText() {
  const paras = Array.from(document.querySelectorAll(".poem .paragraph"));
  const lines = paras.map(para => {
    const els = Array.from(para.querySelectorAll(".feeling, .linking-word-display"));
    const words = els.map(word => word.innerText);
    const line = words.join(" ");
    return line;
  });
  const text = lines.join("\n");
  return text;
}

function submit() {
  const text = getPoemText();
  const title = document.querySelector("#title-input").value;
  const author = document.querySelector("#author-input").value;

  const body = { title, author, text };
  console.log(body);
  
  const request = fetch("/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });

  const cancelBtn = document.querySelector("#cancel-btn");
  cancelBtn.disabled = true;

  const submitBtn = document.querySelector("#submit-btn");
  submitBtn.disabled = true;

  const originalText = submitBtn.innerText;
  submitBtn.innerText = "Submitting…";

  const TIMEOUT = 1000;

  request.then(res => res.json())
    .then(res => {
      if (!res.error) {
        submitBtn.innerText = "Submitted!";
      } else {
        submitBtn.innerText = "Something went wrong.";
      }

      setTimeout(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        cancelSubmission();
      }, TIMEOUT);
    });
}

function handleResize() {
  const width = document.body.scrollWidth;
  if (width < BREAKPOINT) {
    toggleToolbox(false);
  } else if (width >= BREAKPOINT) {
    toggleToolbox(true);
  }
  
  scrollToBottom();
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

const titleForm = document.querySelector(".title-form");
const titleInput = document.querySelector(".title-input");
titleForm.addEventListener("submit", e => {
  e.preventDefault();
  titleInput.blur();
});

const authorForm = document.querySelector(".author-form");
const authorInput = document.querySelector(".author-input");
authorForm.addEventListener("submit", e => {
  e.preventDefault();
  authorInput.blur();
});

// toolbox
const toolboxBtn = document.querySelector("#toolbox-btn");
let isExpanded = isToolboxExpanded();
toolboxBtn.addEventListener("click", () => toggleToolbox());

// freeform input
const freeform = document.querySelector("#freeform-form");
freeform.addEventListener("submit", e => {
  e.preventDefault();
  const input = e.target.freeformInput;
  const val = input.value;
  if (val) {
    addFeeling(val);
    input.value = "";
  }
});

// strats controls
const stratsBtns = document.querySelectorAll("#strats-controls button");
stratsBtns.forEach(btn => btn.addEventListener("click", () => {
  toggleToolbox(false);
}));

// leading link
const beginningControls = document.querySelector("#beginning-controls");
beginningControls.addEventListener("change", changeLeadingLink);

// trailing link
const endingControls = document.querySelector("#ending-controls");
endingControls.addEventListener("change", changeTrailingLink);

// break
const breakBtn = document.querySelector("#break-btn");
breakBtn.addEventListener("click", activateBreaks);

// clear
const clearBtn = document.querySelector("#clear-btn");
clearBtn.addEventListener("click", clearPoem);

// theme
const themeBtn = document.querySelector("#theme-btn");
let isLightMode = true;
themeBtn.addEventListener("click", toggleTheme);

// font size control
const sizeControls = document.querySelectorAll(".size-control");
const title = document.querySelector(".title");
for (const sizeControl of sizeControls) {
  sizeControl.addEventListener("click", () => {
    const bigger = sizeControl.id === "bigger-btn";
    changeSize(bigger);
  });
}

// download
const downloadBtn = document.querySelector("#download-btn");
downloadBtn.addEventListener("click", download);

// submit
const reviewBtn = document.querySelector("#review-btn");
const cancelBtn = document.querySelector("#cancel-btn");
const submitBtn = document.querySelector("#submit-btn");
reviewBtn.addEventListener("click", reviewSubmission);
cancelBtn.addEventListener("click", cancelSubmission);
submitBtn.addEventListener("click", submit);

// window resize
window.addEventListener("resize", handleResize);

// cancel interactions
window.addEventListener("click", cancelInteractions);