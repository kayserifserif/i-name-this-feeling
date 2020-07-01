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

let clear = document.getElementById("clear");
clear.addEventListener("click", (event) => {
  poem.innerHTML = "";
});