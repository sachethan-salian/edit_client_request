const apiBaseUrl = "https://script.google.com/macros/s/AKfycbxkyhvNQ4FGVFHybDViMQbNCMM3eqA4wbcQaOGTYp7AnI-uzcl_MrHLDNgNKoj_fKw_/exec";
let fetchMessagesInterval; // Variable to hold the setInterval ID

document.addEventListener("DOMContentLoaded", () => {
  const senderEmail = localStorage.getItem("email");
  const recipientEmail = localStorage.getItem("recipientEmail");

  if (!senderEmail || !recipientEmail) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("sender-email").value = senderEmail;
  document.getElementById("recipient-email").value = recipientEmail;

  // Display recipient details
  document.getElementById("recipient-name").textContent = recipientEmail; // Initially set to email
  document.getElementById("recipient-status").textContent = "Online";

  // Fetch users list to get usernames
  let users = [];
  fetch(`${apiBaseUrl}?action=getUsers`)
    .then(response => response.json())
    .then(data => {
      users = data;
      // Get username for the recipient
      const recipient = users.find(user => user.email === recipientEmail);
      if (recipient) {
        document.getElementById("recipient-name").textContent = recipient.username; // Display username
      }
    });

  // Function to fetch and display chat messages
  function fetchMessages() {
    fetch(`${apiBaseUrl}?action=getMessages&sender=${senderEmail}&receiver=${recipientEmail}`)
      .then(response => response.json())
      .then(messages => {
        const chatBox = document.getElementById("chat-box");
        chatBox.innerHTML = ""; // Clear chat box to avoid duplicates
        messages.forEach(msg => {
          const messageItem = document.createElement("div");
          messageItem.className = msg.sender === senderEmail ? "outgoing" : "incoming";

          // Create message structure with sender profile and name
          const messageText = document.createElement("p");
          messageText.textContent = msg.message;

          if (msg.sender === senderEmail) {
            messageItem.innerHTML = `
              <div class="details">
                <p><strong>You:</strong> ${msg.message}</p>
              </div>
            `;
          } else {
            const recipient = users.find(user => user.email === msg.sender);
            const recipientName = recipient ? recipient.username : msg.sender; // Default to email if no username is found
            messageItem.innerHTML = `
              <div class="details">
                <p><strong>${recipientName}:</strong> ${msg.message}</p>
              </div>
            `;
          }

          chatBox.appendChild(messageItem);
        });
        // Scroll to the latest message
        chatBox.scrollTop = chatBox.scrollHeight;
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  }

  // Initial fetch of messages
  fetchMessages();

  // Periodically fetch messages every second
  fetchMessagesInterval = setInterval(fetchMessages, 1000);

  // Handle message sending
  document.getElementById("chat-form").addEventListener("submit", e => {
    e.preventDefault();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();
    if (message) {
      fetch(`${apiBaseUrl}?action=sendMessage&sender=${senderEmail}&receiver=${recipientEmail}&message=${message}`)
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            messageInput.value = ""; // Clear input field after sending
            fetchMessages(); // Immediately update chat box with new message
          }
        })
        .catch(error => {
          console.error('Error sending message:', error);
          });
    }
  });

  // Function to stop fetching messages and redirect to index.html
  window.stopsetInterval = function () {
    clearInterval(fetchMessagesInterval);
    window.location.href = "users.html"; // Redirect to index.html
  };
});
