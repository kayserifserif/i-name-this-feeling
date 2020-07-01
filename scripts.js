// words
let text = document.getElementById("text");
let poem = document.getElementById("poem");
let words = document.getElementsByClassName("word");
for (let word of words) {
  word.addEventListener("click", (event) => {
    let text = event.target.textContent;
    let newFeeling = document.createElement("span");
    newFeeling.classList.add("feeling");
    newFeeling.textContent = text;
    poem.appendChild(newFeeling);
    poem.appendChild(document.createTextNode(" and "));
  });
}

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

// reverse
let reverseBtn = document.getElementById("reverse");
let isLightMode = true;
reverseBtn.addEventListener("click", () => {
  if (isLightMode) {
    document.documentElement.style.setProperty("--bg-col", "var(--dark)");
    document.documentElement.style.setProperty("--text-col", "var(--light)");
    document.documentElement.style.setProperty("--mid-col", "var(--lessdark)");
    document.documentElement.style.setProperty("--link-col", "var(--darklink)");
    document.documentElement.style.setProperty("--link-hover", "var(--darklinkhover)");
    document.documentElement.style.setProperty("--link-active", "var(--darklinkactive)");
  } else {
    document.documentElement.style.setProperty("--bg-col", "var(--light)");
    document.documentElement.style.setProperty("--text-col", "var(--dark)");
    document.documentElement.style.setProperty("--mid-col", "var(--lesslight)");
    document.documentElement.style.setProperty("--link-col", "var(--lightlink)");
    document.documentElement.style.setProperty("--link-hover", "var(--lightlinkhover)");
    document.documentElement.style.setProperty("--link-active", "var(--lightlinkactive)");
  }
  isLightMode = !isLightMode;
});