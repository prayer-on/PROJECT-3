const user = document.querySelector(".form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");
const submitButton = document.getElementById("submit-button");

user.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  try {
    const res = await fetch("https://sophie-bluel-backend-h0j6.onrender.com/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      emailInput.style.border = "thin solid red";
      passwordInput.style.border = "thin solid red";
      passwordInput.style.marginBottom = "5px";
      errorMessage.style.display = "inline";
      submitButton.style.marginTop = "20px";

      return;
    }

    const result = await res.json();
    {
      localStorage.setItem("token", result.token);
      window.location.href = "index.html";
    }
  } catch (error) {
    console.log(error);
  }
});
