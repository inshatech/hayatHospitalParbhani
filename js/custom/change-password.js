

/**
 * Attaches an onclick event listener to the body element of the document. When the body is clicked,
 * the value of the 'username' input field is set to the value stored in localStorage under the key 'username'.
 * @returns None
 */
document.getElementsByTagName('body')[0].onclick = () => {
    document.getElementById('username').value = localStorage.getItem('username')
}

/**
 * Attaches an event listener to the "change password" button that sends a PATCH request to the server
 * to update the user's password.
 * @returns None
 */
document.getElementById('change-password-btn').onclick = async () => {
    console.log('working...')
    let password = document.getElementById('password').value ;
    let confPassword = document.getElementById('conf-password').value;

    if(password === confPassword){
        console.log(url)
        let response = await fetch(`${url}user`, {
            method: "PATCH",
            headers: {
                Accept: "*/*",
                Authorization: localStorage.getItem("jwtTempToken"),
            },
            body: JSON.stringify({
                user_id: localStorage.getItem("user_id"),
                password : confPassword
            }),
        });
    
        let data = await response.json();
        console.log(data);

    }
}