const NUM_INIT_WORDS = 3;

const text = document.querySelector(".text");
const poem = document.querySelector(".poem");
const endingControls = document.getElementById("ending-controls");

const WORD_TEMPLATE = document.querySelector(".word");
WORD_TEMPLATE.remove();

const LINKING_TEMPLATE = document.querySelector(".linking-word");
LINKING_TEMPLATE.remove();

const WORDS_CONTAINER = document.querySelector("#choose-controls");
fetch("words.txt")
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

function newBreak() {
  const newBreak = document.createElement("span");
  newBreak.textContent = " ";
  newBreak.classList.add("break");
  newBreak.addEventListener("click", createBreak);
  return newBreak;
}

function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}

function addNewFeeling(text) {
  let para = null;
  if (poem.children.length == 0) {
    para = document.createElement("p");
  } else {
    para = poem.lastChild;
    if (endingControls.isTrailingAnd.value === "noTrailingAnd") {
      para.appendChild(newBreak());
      const link = createLinkingWord();
      para.appendChild(link);
    }
    para.appendChild(newBreak());
  }

  const newFeeling = document.createElement("span");
  newFeeling.textContent = text;
  newFeeling.classList.add("feeling");
  para.appendChild(newFeeling);
  if (endingControls.isTrailingAnd.value === "yesTrailingAnd") {
    para.appendChild(newBreak());
    const link = createLinkingWord();
    para.appendChild(link);
  }
  if (poem.children.length == 0) {
    poem.appendChild(para);
  }

  scrollToBottom();
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

// handle
const handleBtn = document.getElementById("handle");
let isExpanded = true;
handleBtn.addEventListener("click", (event) => {
  const toolbox = document.querySelector(".toolbox");
  isExpanded = !isExpanded;
  toolbox.classList.toggle("expanded", isExpanded);
  const handleImg = handleBtn.querySelector("img");
  handleImg.src = isExpanded ? "img/down-arrow.svg" : "img/up-arrow.svg";
});

// break
const breakBtn = document.getElementById("insertBreak");
breakBtn.addEventListener("click", () => {
  const breaks = document.querySelectorAll(".break");
  for (const b of breaks) {
    b.classList.add("break-active");
  }
});
function createBreak(event) {
  const b = event.target;
  if (!b.classList.contains("break-active")) return;

  const els = [];
  let el = b.nextSibling;
  while (el) {
    els.push(el);
    el = el.nextSibling;
  }
  const para = document.createElement("p");
  for (const el of els) {
    para.appendChild(el);
  }
  poem.appendChild(para);

  const breaks = document.querySelectorAll(".break");
  for (const b1 of breaks) {
    b1.classList.remove("break-active");
  }
}

// clear
const clearBtn = document.getElementById("clear");
clearBtn.addEventListener("click", () => {
  poem.innerHTML = "";
});

// download
const downloadBtn = document.getElementById("download");
downloadBtn.addEventListener("click", () => {
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
});

// reverse
const reverseBtn = document.getElementById("reverse");
let isLightMode = true;
reverseBtn.addEventListener("click", (event) => {
  var themeLink = document.getElementsByTagName("link")[1];
  isLightMode = !isLightMode;
  themeLink.href = isLightMode ? "css/light.css" : "css/dark.css";
});

// font size control
const sizeControls = document.getElementsByClassName("sizeControl");
const title = document.querySelector(".title");
for (const sizeControl of sizeControls) {
  sizeControl.addEventListener("click", (event) => {
    const titleOrig = parseInt(getComputedStyle(title).fontSize);
    const poemOrig = parseInt(getComputedStyle(poem).fontSize);
    const mult = (sizeControl.id === "bigger") ? 1.1 : 0.9;
    title.style.fontSize = (titleOrig * mult) + "px";
    poem.style.fontSize = (poemOrig * mult) + "px";
  });
}

// trailing and
endingControls.addEventListener("change", (event) => {
  if (poem.children.length > 0) {
    const val = event.target.value;
    const para = poem.lastChild;
    if (val === "yesTrailingAnd") {
      para.appendChild(newBreak());
      const link = createLinkingWord();
      para.appendChild(link);
    } else {
      const b = para.querySelector(".break:last-of-type");
      b.nextSibling.remove(); // remove break
      b.remove(); // remove and
    }
  }
})

// window resize
window.addEventListener("resize", () => {
  scrollToBottom();
});

window.addEventListener("click", e => {
  const target = e.target;
  if (!target.closest(".linking-word")) {
    const expanded = document.querySelector(".linking-word.expanded");
    if (expanded) {
      expanded.classList.remove("expanded");
    }
  }
});