const apiBaseUrl = "https://script.google.com/macros/s/AKfycbxkyhvNQ4FGVFHybDViMQbNCMM3eqA4wbcQaOGTYp7AnI-uzcl_MrHLDNgNKoj_fKw_/exec";

// Load current user details from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const currentEmail = localStorage.getItem("email");
  if (!currentEmail) {
    window.location.href = "../login.html";
    return;
  }

  document.getElementById("current-username").textContent = currentEmail; // Replace with username if available
  document.getElementById("current-status").textContent = "Online";

  // Fetch and display the users list
  fetch(`${apiBaseUrl}?action=getUsers`)
    .then(response => response.json())
    .then(users => {
      const usersList = document.getElementById("users-list");
      users.forEach(user => {
        if (user.email !== currentEmail) {
          const userItem = document.createElement("div");
          userItem.className = "user-item";
          userItem.innerHTML = `
            <span>${user.username}</span>
            <p>${user.status}</p>
          `;
          userItem.addEventListener("click", () => {
            localStorage.setItem("recipientEmail", user.email);
            window.location.href = "chat.html";
          });
          usersList.appendChild(userItem);
        }
      });
    });
});
