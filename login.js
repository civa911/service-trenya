document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginContainer = document.getElementById("login-container");
  const registerContainer = document.getElementById("register-container");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");

  // Убедимся, что по умолчанию только форма входа отображается
  function showOnlyLoginForm() {
    loginContainer.classList.remove("hidden");
    registerContainer.classList.add("hidden");
  }

  function showOnlyRegisterForm() {
    registerContainer.classList.remove("hidden");
    loginContainer.classList.add("hidden");
  }

  // Переключение на форму регистрации
  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    showOnlyRegisterForm();
  });

  // Переключение на форму входа
  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    showOnlyLoginForm();
  });

  // Обработка входа
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "admin@mail.ru" && password === "admin") {
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "lk.html";
    } else {
      alert("Неверный email или пароль!");
    }
  });

  // Обработка регистрации
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-password-confirm").value;

    if (password.length < 6) {
      alert("Пароль должен быть не менее 6 символов.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }

    alert(`Регистрация завершена для ${username} (${email})! Теперь вы можете войти.`);
    showOnlyLoginForm();
  });

  // При загрузке показываем форму входа
  showOnlyLoginForm();
});
