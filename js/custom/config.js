const url = "https://hms.inshatech.com/"; //http://localhost/hayat-api/

let jwtToken;
let jwtTokenTime;
// let userRoleCode;

// const checkUser = async (userRoleCode) => {
//     try {
//         let page = window.location.pathname.replace("/", "");
//         let response = await fetch(`${url}get-user`, {
//             method: "POST",
//             headers: {
//             Accept: "*/*",
//             Authorization: localStorage.getItem("jwtTempToken"),
//             },
//             body: JSON.stringify({
//             user_id: localStorage.getItem("user_id"),
//             }),
//         });
//         let data = await response.json();
//         if (data.status == "ok") {
//             userRoleCode = data.data[0].role;
//             if(userRoleCode != 2){
//                 document.getElementById("reports").innerHTML = `
//                     <li>
//                         <a href="reports.html">
//                             <i class="fa-solid fa-clipboard-list"></i>
//                             <span>Reports</span>
//                         </a>
//                     </li>
//                 `;
//                 if (page == 'index.html') {
//                     document.getElementById('home_page_report').innerHTML = `
                        
//                         <div class="feature-card mx-auto text-center home-link">
//                             <a href="reports.html">
//                                 <div class="card mx-auto bg-gray">
//                                 <h3 class="fa-solid fa-clipboard-list text-success"></h3>
//                                 </div>
//                                 <p class="mb-0">Reports</p>
//                             </a>
//                         </div>
//                     `;
//                 }else if(page == 'add-ipd.html'){
//                     document.getElementById('manageBed').innerHTML = `
//                         <button class="btn m-1 btn-sm btn-success" id="addBed" type="button" onclick="addBedPopUp();"><i class="fa-solid fa-plus"></i></button>
//                         <button class="btn m-1 btn-sm btn-danger" id="deleteBed" type="button" onclick="askDeleteBed();"><i class="fa-solid fa-trash-can"></i></button>
//                     `;
//                 }else if(page == 'opd.html'){
//                     document.getElementById('removeServicesBtn').disabled = false;
//                 }  
//             }else if(userRoleCode == 2){
//                 if(page == 'reports.html'){
//                     document.getElementById('date-search-btn').setAttribute('disabled', true);
//                     Swal.fire({
//                         title: "Access Denied?",
//                         text: `You don't have permission to access this page.`,
//                         icon: "warning",
//                         showCancelButton: false,
//                         allowOutsideClick: false,
//                         allowEscapeKey: false,
//                         confirmButtonColor: "#ea4c62",
//                         cancelButtonColor: "#ea4c62",
//                         confirmButtonText: `Okay!`,
//                     }).then((result) => {
//                         if (result.isConfirmed) {
//                             window.location = 'index.html';
//                         }
//                     });
//                 }
//             }
//         }
//     } catch (error) {
//         console.log(error);
//     }
// };
// checkUser(userRoleCode);

document.onerror = (error) => {
    console.log(error);
};
