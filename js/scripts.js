// words
let text = document.getElementById("text");
let poem = document.getElementById("poem");
let words = document.getElementsByClassName("word");
for (let i = 0; i < 3; i++) { // fill in three
  let pos = Math.floor(Math.random() * words.length);
  let word = words[pos];
  addNewFeeling(word.textContent);
}
for (let word of words) { // add eventlisteners
  word.addEventListener("click", (event) => {
    addNewFeeling(event.target.textContent);
  });
}
function addNewFeeling(text) {
  let newFeeling = document.createElement("span");
  newFeeling.classList.add("feeling");
  newFeeling.textContent = text;
  poem.appendChild(newFeeling);
  poem.appendChild(document.createTextNode(" and "));
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}

// handle
let handleBtn = document.getElementById("handle");
let isExpanded = true;
let handleImg = handleBtn.firstChild;
handleBtn.addEventListener("click", () => {
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
clearBtn.addEventListener("click", () => {
  poem.innerHTML = "";
});

// export
let exportBtn = document.getElementById("export");
exportBtn.addEventListener("click", () => {
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

// // reverse
// let reverseBtn = document.getElementById("reverse");
// let isLightMode = true;
// reverseBtn.addEventListener("click", () => {
//   if (isLightMode) {
//     document.documentElement.style.setProperty("--bg-col", "var(--dark)");
//     document.documentElement.style.setProperty("--text-col", "var(--light)");
//     document.documentElement.style.setProperty("--mid-col", "var(--lessdark)");
//     document.documentElement.style.setProperty("--link-col", "var(--darklink)");
//     document.documentElement.style.setProperty("--link-hover", "var(--darklinkhover)");
//     document.documentElement.style.setProperty("--link-active", "var(--darklinkactive)");
//   } else {
//     document.documentElement.style.setProperty("--bg-col", "var(--light)");
//     document.documentElement.style.setProperty("--text-col", "var(--dark)");
//     document.documentElement.style.setProperty("--mid-col", "var(--lesslight)");
//     document.documentElement.style.setProperty("--link-col", "var(--lightlink)");
//     document.documentElement.style.setProperty("--link-hover", "var(--lightlinkhover)");
//     document.documentElement.style.setProperty("--link-active", "var(--lightlinkactive)");
//   }
//   isLightMode = !isLightMode;
// });