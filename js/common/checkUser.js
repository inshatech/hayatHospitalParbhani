const checkUser = async () => {
  try {
    let page = window.location.pathname.replace("/", "");
    let response = await fetch(`${url}get-user`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("user_id"),
      }),
    });
    let data = await response.json();
    if (data.status == "ok") {
      userRoleCode = data.data[0].role;
      console.log(userRoleCode);
    }
  } catch (error) {
    console.log(error);
  }
};

checkUser();
