const mainContainer = window.document.getElementById("mainContainer");
const userInterface = window.document.getElementById("userInterface");
const main = window.document.getElementById("main");
const mainLoginForm = window.document.getElementById("mainLoginForm");
const loginNameInput = window.document.getElementById("loginNameInput");
const loginPasswordInput = window.document.getElementById("loginPasswordInput");
const mainLoginFormButton = window.document.getElementById("mainLoginFormButton");
const mainSignupForm = window.document.getElementById("mainSignupForm");
const signupNameInput = window.document.getElementById("signupNameInput");
const signupEmailInput = window.document.getElementById("signupEmailInput");
const signupPasswordInput = window.document.getElementById("signupPasswordInput");
const signupRePasswordInput = window.document.getElementById("signupRePasswordInput");
const mainSignupFormButton = window.document.getElementById("mainSignupFormButton");
const validNameRegex = /^[a-zA-Z0-9_-]{3,}$/; // Allows alphanumeric, hyphens, underscores, min 3 chars
const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Improved email regex
const validPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$ %^&*-]).{8,}$/; // Strong password
const signupNameError = window.document.createElement("div");
signupNameError.className = "text-danger mt-1"; signupNameInput.parentNode.appendChild(signupNameError);
const signupEmailError = window.document.createElement("div");
signupEmailError.className = "text-danger mt-1"; signupEmailInput.parentNode.appendChild(signupEmailError);
const signupPasswordError = window.document.createElement("div");
signupPasswordError.className = "text-danger mt-1"; signupPasswordInput.parentNode.appendChild(signupPasswordError);
const signupRePasswordError = window.document.createElement("div");
signupRePasswordError.className = "text-danger mt-1"; signupRePasswordInput.parentNode.appendChild(signupRePasswordError);
const userData = (userName, userEmail) => {
    return `
    <div class="user-card">
        <div class="user-card-header">
            <h3><i class="fas fa-user-circle mr-2"></i> ${userName}</h3>
        </div>
        <div class="user-card-body">
            <div class="user-info">
                <i class="fas fa-envelope"></i>
                <span>${userEmail}</span>
            </div>
            <div class="user-info">
                <i class="fas fa-map-marker-alt"></i>
                <span>San Francisco, CA</span>
            </div>
            <div class="user-info">
                <i class="fas fa-calendar-alt"></i>
                <span>Member since June 2025</span>
            </div>
            <button class="btn logout-btn" id="logOutButton">
                Log Out <i class="fas fa-sign-out-alt"></i>
            </button>
        </div>
    </div>
    `;
};
function saveUsersToLocalStorage(users) { localStorage.setItem("users", JSON.stringify(users)); }
function getUsersFromLocalStorage() { return JSON.parse(localStorage.getItem("users")) || []; }
function showAlertModal(title, content) {
    const modal = new bootstrap.Modal(document.getElementById("alertModal"));
    const modalTitle = document.getElementById("alertModalLabel");
    const modalBody = document.querySelector("#alertModal .modal-body");
    modalTitle.textContent = title;
    modalBody.textContent = content;
    modal.show();
}
mainSignupFormButton.addEventListener("click", (event) => {
    event.preventDefault();
    const name = signupNameInput.value.trim();
    const email = signupEmailInput.value.trim().toLowerCase();
    const password = signupPasswordInput.value.trim();
    const confirmPassword = signupRePasswordInput.value.trim();
    signupNameError.textContent = "";
    signupEmailError.textContent = "";
    signupPasswordError.textContent = "";
    signupRePasswordError.textContent = "";
    let isValid = true;
    if (!validNameRegex.test(name)) {
    signupNameError.textContent = "Name must be at least 3 characters and can include letters, numbers, hyphens, or underscores.";
        isValid = false;
    }
    if (!validEmailRegex.test(email)) {
    signupEmailError.textContent = "Please enter a valid email address.";
        isValid = false;
    }
    if (!validPasswordRegex.test(password)) {
    signupPasswordError.textContent = "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number, and one special character.";
        isValid = false;
    }
    if (password !== confirmPassword) {
    signupRePasswordError.textContent = "Passwords do not match.";
        isValid = false;
    }
    if (!isValid) return showAlertModal("Validation Error", "Please fix the errors before submitting.");
    const users = getUsersFromLocalStorage();
    if (users.some((user) => user.email === email)) {
    signupEmailError.textContent = "This email is already registered.";
    return;
    }
    const newUser = { name, email, password };
    users.push(newUser);
    saveUsersToLocalStorage(users);
    showAlertModal("Success", "You have successfully signed up!");
    signupNameInput.value = "";
    signupEmailInput.value = "";
    signupPasswordInput.value = "";
    signupRePasswordInput.value = "";
});
mainLoginFormButton.addEventListener("click", (event) => {
    event.preventDefault();
    const email = loginNameInput.value.trim().toLowerCase();
    const password = loginPasswordInput.value.trim();
    const users = getUsersFromLocalStorage();
    const user = users.find(
    (user) => user.email === email && user.password === password);
    if (user) {
    mainContainer.classList.add("d-none");
    userInterface.classList.remove("d-none");
    userInterface.innerHTML = userData(user.name, user.email);
    document.getElementById("logOutButton").addEventListener("click", () => {
        mainContainer.classList.remove("d-none");
        userInterface.classList.add("d-none");
        userInterface.innerHTML = "";
    });
    } else {
    showAlertModal("Login Failed", "Invalid email or password. Please try again.");
    }
    loginNameInput.value = "";
    loginPasswordInput.value = "";
});
function clearLocalStorage() { window.localStorage.clear(); return window.localStorage; }