document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      window.location.href = "/product-listing"; // Redirect to admin page on successful login
    } else {
      alert("Login failed");
    }
  });

  document.getElementById("logout-btn")?.addEventListener("click", async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
      window.location.href = "/login.html";
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed");
    }
  });