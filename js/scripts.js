let text = document.getElementById("text");
let poem = document.getElementById("poem");
let words = document.getElementsByClassName("word");

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
function addNewFeeling(text) {
  let newFeeling = document.createElement("span");
  newFeeling.textContent = text;
  newFeeling.classList.add("feeling");
  poem.appendChild(newFeeling);
  let newBreak = document.createElement("span");
  newBreak.textContent = "\240";
  newBreak.classList.add("break");
  poem.appendChild(newBreak);
  poem.appendChild(document.createTextNode("and"));
  poem.appendChild(newBreak.cloneNode(true));
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}

// handle
let handleBtn = document.getElementById("handle");
let isExpanded = true;
let handleImg = handleBtn.firstChild;
handleBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let toolbox = document.getElementById("toolbox");
  if (isExpanded) {
    toolbox.style.height = "110px";
    handleImg.src = "../img/up-arrow.svg";
  } else {
    toolbox.style.height = "auto";
    handleImg.src = "../img/down-arrow.svg";
  }
  isExpanded = !isExpanded;
});

// clear
let clearBtn = document.getElementById("clear");
clearBtn.addEventListener("click", (event) => {
  event.preventDefault();
  poem.innerHTML = "";
});

// export
let exportBtn = document.getElementById("export");
exportBtn.addEventListener("click", (event) => {
  event.preventDefault();
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
  event.preventDefault();
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
  sizeControl.addEventListener("click", () => {
    let titleOrig = parseInt(getComputedStyle(title).fontSize);
    let poemOrig = parseInt(getComputedStyle(poem).fontSize);
    let mult = (sizeControl.id === "bigger") ? 1.1 : 0.9;
    title.style.fontSize = (titleOrig * mult) + "px";
    poem.style.fontSize = (poemOrig * mult) + "px";
  });
}