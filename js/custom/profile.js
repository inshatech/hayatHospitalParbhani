/**
 * Attaches an event listener to the "edit-btn" element that updates the user's profile information
 * if the form is valid and the user confirms the update.
 * @param {Event} e - The event object.
 * @returns None
 */
document.getElementById("edit-btn").onclick = async (e) => {
    try {
        if (window.navigator.onLine) {
            let valid = document.forms["form"].checkValidity();
            if (valid) {
                e.preventDefault();
                let username    = document.getElementById("username").value;
                let designation = document.getElementById("profile-designation").innerHTML;
                let email       = document.getElementById("email").value;
                let mobile      = document.getElementById("mobile").value;
                let address     = document.getElementById("address").value;
                let roleCode    = document.getElementById("roleCode").value;

                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't update this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#00b894',
                    cancelButtonColor: '#ea4c62',
                    confirmButtonText: 'Yes, update it!'
                }).then ((result) => {
                    if (result.isConfirmed) {
                        updateNow(username, designation, email, mobile, address, roleCode);
                    }
                })
            }            
        }        
    } catch (error) {
        console.log(error);
    }
};

/**
 * Updates the user's information with the given parameters.
 * @param {string} username - The user's name.
 * @param {string} designation - The user's designation.
 * @param {string} email - The user's email address.
 * @param {string} mobile - The user's mobile number.
 * @param {string} address - The user's address.
 * @returns None
 */
const updateNow = async(username, designation, email, mobile, address) => {
    let editBtn = document.getElementById("edit-btn");
    editBtn.innerHTML = `
        <div id="spinner" class="spinner-border spinner-border-sm text-success mx-2"  role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;

    let response = await fetch(`${url}user`, {
        method: "PUT",
        headers: {
            Accept: "*/*",
            Authorization: localStorage.getItem("jwtTempToken"),
        },
        body: JSON.stringify({
            user_id: localStorage.getItem("user_id"),
            name: username,
            designation: designation,
            mobile: mobile,
            email: email,
            address: address,
            role: 0,
            permissions: { Read: true, Write: true },
        }),
    });

    let data = await response.json();
    if (data.status == "ok") {
        editBtn.innerHTML = "Update Now";
        Swal.fire({
            title:'Updated!',
            text: data.message,
            icon: 'success',
            confirmButtonColor: '#00b894',
            confirmButtonText: 'Okay'
        })
    }else{
        Swal.fire({
            title:'Error Occurred!',
            text:data.message,
            icon:'error',
            confirmButtonColor: '#ea4c62',
            confirmButtonText: 'Okay'
        })
    }
}