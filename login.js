 // Select all necessary elements
const signUp = document.getElementById('sign-up'),
      signIn = document.getElementById('sign-in'),
      resetPass = document.getElementById('reset-pass'),
      backToLogin = document.getElementById('back-to-login'),
      backToRequestReset = document.getElementById('back-to-request-reset'),
      loginIn = document.getElementById('login-in'),
      loginUp = document.getElementById('login-up'),
      requestResetPassword = document.getElementById('request-reset-password'),
      verifyOtpResetPassword = document.getElementById('verify-otp-reset-password');

// Toggle to Sign Up Form
signUp.addEventListener('click', () => {
    loginIn.classList.remove('block');
    loginUp.classList.remove('none');
    loginIn.classList.toggle('none');
    loginUp.classList.toggle('block');
});

// Toggle to Sign In Form
signIn.addEventListener('click', () => {
    loginIn.classList.remove('none');
    loginUp.classList.remove('block');
    loginIn.classList.toggle('block');
    loginUp.classList.toggle('none');
});

// Show Request Reset Password Form
resetPass.addEventListener('click', () => {
    loginIn.classList.remove('block');
    requestResetPassword.classList.remove('none');
    loginIn.classList.toggle('none');
    requestResetPassword.classList.toggle('block');
});

// Back to Sign In from Request Reset Password
backToLogin.addEventListener('click', () => {
    requestResetPassword.classList.remove('block');
    loginIn.classList.remove('none');
    requestResetPassword.classList.toggle('none');
    loginIn.classList.toggle('block');
});

// Back to Request Reset Password from Verify OTP
backToRequestReset.addEventListener('click', () => {
    verifyOtpResetPassword.classList.remove('block');
    requestResetPassword.classList.remove('none');
    verifyOtpResetPassword.classList.toggle('none');
    requestResetPassword.classList.toggle('block');
    
});

// Show Verify OTP Form
function showVerifyOTPForm() {
    requestResetPassword.classList.remove('block');
    verifyOtpResetPassword.classList.remove('none');
    requestResetPassword.classList.toggle('none');
    verifyOtpResetPassword.classList.toggle('block');
}

const API_URL = "https://script.google.com/macros/s/AKfycbyeQ9ro0F_FIfe0i201HDGkn91J09VBSTI5wOcwse-U-NVCo1ll6BBabmuohyKYmf6n/exec";

// Check if the user is already logged in by checking localStorage

//-------
const userStatusUrl = "https://script.google.com/macros/s/AKfycbyeQ9ro0F_FIfe0i201HDGkn91J09VBSTI5wOcwse-U-NVCo1ll6BBabmuohyKYmf6n/exec"; // Replace with your web app URL
const email = localStorage.getItem("email"); // Assuming 'userEmail' is stored in local storage

window.onload = async function () {
    showLoading();
    const passwordResetMessage = localStorage.getItem("passwordResetMessage");
  
    if (passwordResetMessage) {
    // Display the message (you can use a div or modal to show it)
    showPopupMessage(passwordResetMessage);  // Simple alert for demonstration
    
    // Remove the message from localStorage after displaying
    localStorage.removeItem("passwordResetMessage");
  }
    
  if (!email) {
      hideLoading();
    showPopupMessage("Email is not found in local storage!");
    return;
  }

  try {
    const response = await fetch(userStatusUrl);
    const data = await response.json();

    // Find the user details by email
    const clientData = data.find(row => row[1] === email); // Assuming column index 2 contains the email

    if (clientData) {
        hideLoading();
      window.location.href = "main.html";
    } else {
        hideLoading();
      showPopupMessage("Your session is expired!, Please Login");
    }
  } catch (error) {
      hideLoading();
    console.error("Error fetching data:", error);
    alert("Failed to load user details.");
  }
};
  // Show errors if validation fails
async function register() {
  showLoading();

  // Input validation
  const username = document.getElementById("r_username").value;
  const email = document.getElementById("r_email").value;
  const password = document.getElementById("r_password").value;

  if (username.length < 4) {
    showPopupMessage("Username must be at least 4 characters long.");
    hideLoading();
    return;
  }

  if (!isValidEmail(email)) {
    showPopupMessage("Please enter a valid email address.");
    hideLoading();
    return;
  }

  if (password.length < 4 || !/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
  showPopupMessage("Password must be at least 4 characters long and contain at least one special character.");
  hideLoading();
  return;
}
  // If validation passes, proceed with registration
  const data = {
    action: "register",
    username: username,
    email: email,
    password: password,
  };

  const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
  const responseText = await res.text();

  // Parse the JSON response
  const responseJSON = JSON.parse(responseText);

  // Check if there's an error message
  if (!responseJSON.success) {
    showPopupMessage(responseJSON.message);
  } else {
hideLoading();
  // Store success message in localStorage for displaying on login page
  localStorage.setItem("passwordResetMessage", "Registration Done successfully! Please login.");

  // Redirect to login page
  window.location.href = "index.html";
  }
    hideLoading();
  // Redirect to login page
  window.location.href = "#";
}


// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
async function login() {
      const data = {
        action: "login",
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value,
      };
    showLoading();
      const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
      const result = await res.json();
      if (result.success) {
          localStorage.setItem("email", data.email);
        localStorage.setItem("passwordResetMessage", "Login Successfully done.");
      // Redirect to login page
          hideLoading();
      window.location.href = "index.html";
      } else {
          hideLoading();
        showPopupMessage("Invalid credentials");
      }
    }

 function showPopupMessage(message) {
    popupMsg.textContent = message;
    popupMsg.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        popupMsg.classList.remove('show');
    }, 3000);
    }

    function showLoading() {
                loadimg.style.display = "flex";
            }

function hideLoading() {
                loadimg.style.display = "none";
            }

// Request OTP
async function requestPasswordReset() {
  const email = document.getElementById("resetEmail").value;

  const data = {
    action: "requestPasswordReset",
    email: email,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      showPopupMessage(result.message);
      document.getElementById("request-reset-password").style.display = "none";
      document.getElementById("verify-otp-reset-password").style.display = "block";
    } else {
      showPopupMessage(result.message, "red");
    }
  } catch (error) {
    showPopupMessage("Failed to connect to the server.", "red");
  }
}

// Verify OTP & Reset Password
async function verifyOTPAndResetPassword() {
  const email = document.getElementById("resetEmail").value;
  const otp = document.getElementById("otp").value;
  const newPassword = document.getElementById("newPassword").value;

  const data = {
    action: "resetPasswordWithOTP",
    email: email,
    otp: otp,
    newPassword: newPassword,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      showPopupMessage(result.message);
        document.getElementById("verify-otp-reset-password").style.display = "none";
        
      // Store success message in localStorage for displaying on login page
      localStorage.setItem("passwordResetMessage", "Password changed successfully! Please login.");
      
      // Redirect to login page
      window.location.href = "index.html";
    } else {
      showPopupMessage(result.message, "red");
    }
  } catch (error) {
    showPopupMessage("Failed to connect to the server.", "red");
  }
}

// Event Listeners
document.getElementById("request-reset-password").addEventListener("submit", (e) => {
  e.preventDefault();
  requestPasswordReset();
});

document.getElementById("verify-otp-reset-password").addEventListener("submit", (e) => {
  e.preventDefault();
  verifyOTPAndResetPassword();
});

//-----------
// Function to fetch user details by email
function fetchUserDetails(email) {
  const requestData = {
    action: 'fetchUserDetails',
    email: email
  };

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const user = data.user;
      // Store username, email, and role in localStorage
      localStorage.setItem('username', user.username);
      localStorage.setItem('email', user.email);
      localStorage.setItem('role', user.role);
      console.log('User details fetched and stored in localStorage:', user);
        window.location.href = "t2.html";
    } else {
      console.error('Error fetching user details:', data.message);
        showPopupMessage("Failed to featch");
    }
  })
  .catch(error => {
    console.error('Error in fetchUserDetails:', error);
      showPopupMessage("Error to featch");
  });
}

// Function to modify user details (username, password, role, profile path)
function modifyUserDetails(email, newDetails) {
  const requestData = {
    action: 'modifyUserDetails',
    email: email,
    ...newDetails // Spread the new details like username, password, role, etc.
  };

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('User details updated successfully');
    } else {
      console.error('Error modifying user details:', data.message);
    }
  })
  .catch(error => {
    console.error('Error in modifyUserDetails:', error);
  });
}