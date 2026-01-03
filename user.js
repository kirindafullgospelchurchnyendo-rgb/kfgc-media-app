// user.js

import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const nameEl = document.getElementById("userName");
const dpEl = document.getElementById("userDp");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (nameEl) nameEl.textContent = user.displayName || "Member";
    if (dpEl && user.photoURL) dpEl.src = user.photoURL;
  }
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    location.replace("auth.html");
  });
}