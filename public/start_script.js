const origin = window.location.origin;
document.getElementById("cr").addEventListener("click", () => {
  const rid = document.getElementById("crid").value;
  const uid = document.getElementById("uid1").value;
  if (rid && uid) {
    fetch(origin + "/create-room" + `?roomId=${rid}&userId=${uid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          window.location.href = origin + "/room/" + rid + "/" + uid;
        } else flashError({ err: "Room-Id already exist" }, "create");
      });
  } else flashError({ err: "Fill all fields" }, "create");
});

document.getElementById("er").addEventListener("click", () => {
  const rid = document.getElementById("rid").value;
  const uid = document.getElementById("uid2").value;
  if (rid && uid) {
    fetch(origin + "/enter-room" + `?roomId=${rid}&userId=${uid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          window.location.href = origin + "/room/" + rid + "/" + uid;
        } else flashError({ err: "Room-Id does not exist" }, "join");
      });
  } else flashError({ err: "Fill all fields" }, "join");
});

function flashError({ err }, ele) {
  const error = document.createElement("span");
  error.className = "err";
  error.innerHTML = err;
  document.getElementById(ele).appendChild(error);
  setTimeout(() => {
    document.getElementById(ele).removeChild(error);
  }, 3000);
}
