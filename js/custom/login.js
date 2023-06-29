/**
 * Handles the login button click event. Sends a POST request to the server with the
 * entered username and password. If successful, sets the JWT token and user ID in local storage
 * and redirects to the index page. If unsuccessful, displays an error message.
 * @returns None
 */
let loginBtn = (document.getElementById("login-btn").onclick = async () => {
  let password = document.getElementById("password").value;
  let username = document.getElementById("username").value;
  if (password != "" && username != "") {
    document.getElementById("login-btn").disabled = true;
    document.getElementById("login-btn").innerHTML = `
      <div id="spinner" class="spinner-border spinner-border-sm text-sucess mx-2"  role="status">
      <span class="visually-hidden">Loading...</span>
      </div>Processing...
    `;
    document.getElementById("spinner").style.display = "block";
    try{   
      let response = await fetch(`${url}login`, {
        method: "POST",
        body: JSON.stringify({
          password: password,
          username: username,
        }),
      });
      let data = await response.json();
      if (data.status === "ok") {
        localStorage.setItem('jwtTempToken',response.headers.get('authorization'))
        localStorage.setItem('user_id',data.user_id)
        window.location = 'index.html'
      } else {
        document.getElementById("login-btn").disabled = false;
        document.getElementById("login-btn").innerHTML = "Sign In";
        password = "";
        username = "";
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
      }
    }catch{
      document.getElementById("login-btn").disabled = false;
      document.getElementById("login-btn").innerHTML = "Sign In";
      password = "";
      username = "";
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Something went wrong please try again!",
      });
    }
  } else {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Please fill the blank fields!",
    });
  }
});
