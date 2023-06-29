/**
 * This function is executed when the window loads. It fetches user data from the server
 * and populates the profile page with the user's information. If the user is not logged in,
 * it redirects them to the login page.
 * @returns None
 */
window.onload = async ()=>{
    try {
        let page  = window.location.pathname.replace('/','');
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
            let image       = data.data[0].image;
            let name        = data.data[0].name;
            let designation = data.data[0].designation;
            let email       = data.data[0].email;
            let mobile      = data.data[0].mobile; 
            let address     = data.data[0].address;            
            let roleCode    = data.data[0].role;

            let role;
            if (data.data[0].role == "0") {
                role = 'Super Admin';
            } else if(data.data[0].role == "1"){
                role = 'Administrator';
            }else{
                role = 'User';
            }
            if (page == "profile.html") {
                // document.getElementById("profile-image").src            = image;
                document.getElementById("username").value               = name;
                document.getElementById("profile-name").innerHTML       = name;
                document.getElementById("profile-designation").innerHTML  = designation;
                document.getElementById("email").value                  = email;
                document.getElementById("mobile").value                 = mobile;
                document.getElementById("address").value                = address;
                document.getElementById("profile-role").innerHTML       = role;
                document.getElementById("roleCode").value               = roleCode;

                document.getElementById("name-sideNav").innerHTML       = name;
                document.getElementById("details-sideNav").innerHTML    = `${designation} (${role})`;
            }else{
                // document.getElementById("image-sideNav").src            = image;
                document.getElementById("name-sideNav").innerHTML       = name;
                document.getElementById("details-sideNav").innerHTML    = `${designation} (${role})`;
            }     
            
        }else{
            window.location = 'login.html';
        }
    } catch (error) {
        console.log(error);
    }
};