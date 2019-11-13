const batch = 24603;
const baseUrl = `https://wagon-chat.herokuapp.com/${batch}/messages`;
const ul = document.querySelector(".list-unstyled");
const cd = document.querySelectorAll(".countdown");

const onPost = (event) => {
  event.preventDefault();
  const post = event.target[0].value;
  const from = event.target[1].value;
  const message = { author: from, content: post };

  fetch(baseUrl, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  });
  document.querySelectorAll(".hidden").classList.remove("hidden");
};

const onRefresh = () => {
  document.querySelectorAll(".hidden").classList.add("hidden");
  ul.innerText = '';
  fetch(baseUrl)
    .then(response => response.json())
    .then((data) => {
      const array = data.messages;
      // processs the messages in the array
      array.forEach((message) => {
        // calculate how long ago
        const li = document.createElement('li');
        const minsCreated = message.created_at.split(":")[1];
        const minsNow = new Date(Date.now()).getMinutes();
        const hoursNow = new Date(Date.now()).getHours();
        const hoursCreated = parseInt(message.created_at.split(":")[0].slice(-2), 10) + 8;
        let hoursAgo = hoursNow - hoursCreated;
        if (hoursAgo < 0) hoursAgo += 24;
        let minAgo = minsNow - minsCreated;
        minAgo += (60 * hoursAgo);
        // create the li
        li.innerHTML = `<h6>${message.content} <br>- (${minAgo} mins ago) <strong>by ${message.author}</strong></h6>`;
        // insert li into ul
        ul.insertAdjacentElement('beforeend', li);
        ul.insertAdjacentText('beforeend', "---------------------------------");
      });
      // end of processing
    });
};
let num = parseInt(document.querySelector("#countdown").innerText, 10);
const cycle = () => {
  num -= 1;
  document.querySelector("#countdown").innerText = num;
  if (num === 0) {
    document.querySelector("#refresh").click();
    num = 10;
  }
};
setInterval(cycle, 1000);

document.querySelector("#comment-form").addEventListener("submit", onPost);
document.querySelector("#refresh").addEventListener("click", onRefresh);
document.querySelector("#refresh").click();
