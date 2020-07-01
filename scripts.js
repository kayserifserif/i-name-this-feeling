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
let clear = document.getElementById("clear");
clear.addEventListener("click", () => {
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