/* Elements */
const inputRoll = document.getElementById('inputRoll');
const buttonRoll = document.getElementById('buttonRoll');

let repliesContain = document.getElementById('repliesContain')

/* Functions */

function inputValidation() {
  const regex = "";
  if (inputRoll.value.length <= 0) return false
  if (false) return false
  return true
}

function resultRoll() {
  console.log("Roulez !")
}

function reply(username, result) {
  let reply = document.createElement("div");
      reply.className = "rolldice__reply";
      reply.innerHTML = `<span class="rolldice__reply-username">${username}</span>
                         <span class="rolldice__reply-result">${result}</span>`;
  repliesContain.appendChild(reply)
}

/* Events */

buttonRoll.addEventListener("click", (event) => {
  if(inputValidation()) {
    reply("khu", inputRoll.value)
  }
});

inputRoll.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && inputValidation()) {
    reply("khu", inputRoll.value)
  } 
});
