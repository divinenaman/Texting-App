const url = window.location.origin.replace(/^http/, "ws");
const { roomId, userId } = getDetails();
var ws = new WebSocket(url);
console.log(roomId + " " + userId);

function getDetails() {
  const params = window.location.href
    .substring(window.location.origin.length + 2)
    .split("/");
  return { roomId: params[1], userId: params[2] };
}

ws.onopen = () => {
  console.log("connected");
  send({ type: "join-room", roomId, userId });
};

async function send(message) {
  console.log(message);
  await ws.send(JSON.stringify(message));
}

document.getElementById("send").addEventListener("click", handleMsg);
document.addEventListener("keypress", (e) =>
  e.keyCode == 13 ? handleMsg() : null
);
document.getElementById("leave").addEventListener("click", handleDisconnect);

function handleMsg() {
  const text = document.getElementById("msg").value;
  if (text) {
    send({ type: "send-text", text, roomId, userId });
    displayLocalText(userId, text);
    handleScroll();
  }
}

function handleDisconnect() {
  send({ type: "leave-room", roomId, userId });
  window.location.href = window.location.origin + "/start";
}

function displayConnectedUsers(rid, uids) {
  uids.forEach((uid) => {
    if (document.querySelector(`.users #${uid}`) == null) {
      const ele = document.createElement("div");
      ele.id = uid;
      ele.className = "user";
      ele.innerHTML += `<span class="material-icons">person</span><br/><span>${uid}</span>`;
      document.querySelector(".users").appendChild(ele);
      if (uid !== userId) flashJoin(uid);
    }
  });
}

function flashJoin(uid) {
  const ele = document.createElement("p");
  ele.innerHTML = `${uid} jonied`;
  ele.className = "flash-msg";
  ele.style.color = "green";
  document.querySelector(".textarea").appendChild(ele);
  handleScroll();
}

function flashDisconnect(uid) {
  const ele = document.createElement("p");
  ele.innerHTML = `${uid} left`;
  ele.className = "flash-msg";
  ele.style.color = "red";
  document.querySelector(".textarea").appendChild(ele);
  handleScroll();
}

function displayLocalText(uid, text) {
  const ele = document.createElement("div");
  ele.className = "text-box";
  ele.innerHTML += `<span class="author">${uid + ": "}</span><span>${text}</span>`;
  document.querySelector(".textarea").appendChild(ele);
}

function displayRecievedText(uid, text) {
  const ele = document.createElement("div");
  ele.className = "text-box";
  ele.innerHTML += `<span class="author">${uid + ": "}</span><span>${text}</span>`;
  document.querySelector(".textarea").appendChild(ele);
  handleScroll();
}

function handleDisconnectedUser(uid) {
  if (document.querySelector(`.users #${uid}`)) {
    document
      .querySelector(".users")
      .removeChild(document.querySelector(`.users #${uid}`));
    flashDisconnect(uid);
  }
}

function handleScroll() {
  document
    .querySelector(".textarea")
    .scrollTo(0, document.querySelector(".textarea").scrollHeight);
}

ws.onmessage = (data) => {
  const msg = JSON.parse(data.data);
  try {
    if (msg.type === "entered-room") {
      const { allUsers } = msg;
      displayConnectedUsers(roomId, allUsers);
    } else if (msg.type === "created-room") {
      displayConnectedUsers(roomId, [userId]);
    } else if (msg.type === "recieved-text") {
      const { userId, text } = msg;
      console.log("recieved" + msg);
      displayRecievedText(userId, text);
    } else if (msg.type === "user-left") {
      const { userId } = msg;
      handleDisconnectedUser(userId);
    }
  } catch (err) {
    console.log(err);
  }
};
