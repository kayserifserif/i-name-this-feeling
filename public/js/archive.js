const CONTAINER = document.querySelector(".archive");

const FEELING_TEMPLATE = document.querySelector(".feeling");
FEELING_TEMPLATE.remove();
const LINKING_TEMPLATE = document.querySelector(".linking-word");
LINKING_TEMPLATE.remove();
const PARAGRAPH_TEMPLATE = document.querySelector(".paragraph");
PARAGRAPH_TEMPLATE.remove();

const ENTRY_TEMPLATE = document.querySelector(".entry");
ENTRY_TEMPLATE.remove();

const fetchEntries = fetch("/fetch")
  .then(res => res.json());

const fetchLinking = fetch("/assets/links.txt")
  .then(res => res.text())
  .then(text => text.trim().split("\n"));

Promise.all([fetchEntries, fetchLinking])
  .then(values => {
    const [entries, links] = values;
    const data = entries.data.reverse();
    populate(data, links);

    const loader = document.querySelector(".loading");
    loader.remove();
  });

function populate(data, links) {
  data.forEach(entry => {
    const div = ENTRY_TEMPLATE.cloneNode(true);
    CONTAINER.appendChild(div);

    const title = entry.title;
    if (title) {
      div.querySelector(".entry-title").innerText = entry.title;
    }
    
    const author = entry.author;
    if (author) {
      div.querySelector(".entry-author").innerText = entry.author;
    }

    const dateStr = entry.created_at;
    if (dateStr) {
      div.querySelector(".entry-timestamp").innerText = dateStr;
    }

    const paras = entry.text;
    const poemHtml = div.querySelector(".entry-text");
    paras.forEach(para => {
      const paraHtml = PARAGRAPH_TEMPLATE.cloneNode(true);
      poemHtml.appendChild(paraHtml);

      para.forEach((word, i) => {
        const el = (links.includes(word)) ? LINKING_TEMPLATE.cloneNode(true) : FEELING_TEMPLATE.cloneNode(true);
        el.innerText = word;
        paraHtml.appendChild(el);

        if (i < para.length - 1) {
          paraHtml.appendChild(document.createTextNode(" "));
        }
      });
    });
  });
}