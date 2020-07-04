let text = document.getElementById("text");
let poem = document.getElementById("poem");
let words = document.getElementsByClassName("word");
let endingControls = document.getElementById("ending_controls");
endingControls.reset();

// randomise
function shuffle(elems) { // https://j11y.io/javascript/shuffling-the-dom/
  allElems = (function(){
    var ret = [], l = elems.length;
    while (l--) { ret[ret.length] = elems[l]; }
    return ret;
  })();

  var shuffled = (function(){
    var l = allElems.length, ret = [];
    while (l--) {
      var random = Math.floor(Math.random() * allElems.length),
          randEl = allElems[random].cloneNode(true);
      allElems.splice(random, 1);
      ret[ret.length] = randEl;
    }
    return ret; 
  })(), l = elems.length;

  while (l--) {
    elems[l].parentNode.insertBefore(shuffled[l], elems[l].nextSibling);
    elems[l].parentNode.removeChild(elems[l]);
  }
}
shuffle(words);

// initialise first three
for (let i = 0; i < 3; i++) {
  let pos = Math.floor(Math.random() * words.length);
  let word = words[pos];
  addNewFeeling(word.textContent);
}

// words
for (let word of words) {
  word.addEventListener("click", (event) => {
    addNewFeeling(event.target.textContent);
  });
}
function newBreak() {
  let newBreak = document.createElement("span");
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
      para.appendChild(document.createTextNode("and"));
    }
    para.appendChild(newBreak());
  }
  let newFeeling = document.createElement("span");
  newFeeling.textContent = text;
  newFeeling.classList.add("feeling");
  para.appendChild(newFeeling);
  if (endingControls.isTrailingAnd.value === "yesTrailingAnd") {
    para.appendChild(newBreak());
    para.appendChild(document.createTextNode("and"));
  }
  if (poem.children.length == 0) {
    poem.appendChild(para);
  }
  scrollToBottom();
}

// handle
let handleBtn = document.getElementById("handle");
let isExpanded = true;
let handleImg = handleBtn.firstChild;
handleBtn.addEventListener("click", (event) => {
  let toolbox = document.getElementById("toolbox");
  if (isExpanded) {
    toolbox.style.height = "80px";
    handleImg.src = "../img/up-arrow.svg";
  } else {
    toolbox.style.height = "auto";
    handleImg.src = "../img/down-arrow.svg";
  }
  isExpanded = !isExpanded;
});

// break
let breakBtn = document.getElementById("insertBreak");
let breaks = document.getElementsByClassName("break");
breakBtn.addEventListener("click", () => {
  for (let b of breaks) {
    b.classList.add("break-active");
  }
});
function createBreak(event) {
  let b = event.target;
  let els = [];
  let el = b.nextSibling;
  while (el) {
    els.push(el);
    el = el.nextSibling;
  }
  let para = document.createElement("p");
  for (let el of els) {
    para.appendChild(el);
  }
  poem.appendChild(para);
  for (let b1 of breaks) {
    b1.classList.remove("break-active");
  }
}

// clear
let clearBtn = document.getElementById("clear");
clearBtn.addEventListener("click", (event) => {
  poem.innerHTML = "";
});

// download
let downloadBtn = document.getElementById("download");
downloadBtn.addEventListener("click", (event) => {
  html2canvas(text, {
    logging: false
  }).then(canvas => {
    let imageURI = canvas.toDataURL("image/png");
    // https://stackoverflow.com/a/37673039
    let anchor = document.createElement("a");
    anchor.href = imageURI;
    anchor.target = "_blank";
    anchor.download = "poem.png";
    anchor.click();
  });
});

// reverse
let reverseBtn = document.getElementById("reverse");
let isLightMode = true;
reverseBtn.addEventListener("click", (event) => {
  var themeLink = document.getElementsByTagName("link")[1];
  if (isLightMode) {
    themeLink.href = "css/dark.css";
  } else {
    themeLink.href = "css/light.css";
  }
  isLightMode = !isLightMode;
});

// font size control
let sizeControls = document.getElementsByClassName("sizeControl");
let title = document.getElementById("title");
for (let sizeControl of sizeControls) {
  sizeControl.addEventListener("click", (event) => {
    let titleOrig = parseInt(getComputedStyle(title).fontSize);
    let poemOrig = parseInt(getComputedStyle(poem).fontSize);
    let mult = (sizeControl.id === "bigger") ? 1.1 : 0.9;
    title.style.fontSize = (titleOrig * mult) + "px";
    poem.style.fontSize = (poemOrig * mult) + "px";
  });
}

// trailing and
endingControls.addEventListener("change", (event) => {
  if (poem.children.length > 0) {
    let val = event.target.value;
    let para = poem.lastChild;
    if (val === "yesTrailingAnd") {
      para.appendChild(newBreak());
      para.appendChild(document.createTextNode("and"));
    } else {
      let b = para.querySelector(".break:last-of-type");
      b.nextSibling.remove(); // remove break
      b.remove(); // remove and
    }
  }
})

// window resize
window.addEventListener("resize", () => {
  scrollToBottom();
});