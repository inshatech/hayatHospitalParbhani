/**
 * Loads the given services into the given table body and returns the total cost of all services.
 * @param {Object} services - An object containing the services to load into the table body.
 * @param {HTMLTableSectionElement} tbody - The table body element to load the services into.
 * @returns {number} - The total cost of all services.
 */
const loadServices = async(services, tbody) =>{
  let irritation = 0;
  let calculation = 0;
  for (const [key, value] of Object.entries(services)) {
    irritation++;
    let newCell;
    calculation += parseInt(value);
    let newRow = tbody.insertRow();

    newCell           = newRow.insertCell();
    newCell.innerHTML = irritation;
    
    newCell           = newRow.insertCell();
    newCell.innerHTML = key;

    newCell           = newRow.insertCell();
    newCell.innerHTML = `${value}/-`;
        
    newCell           = newRow.insertCell();
    newCell.innerHTML = `${value}/-`;
  }
  return calculation
}

/**
 * Inserts a new row into a table body with the given data and column span.
 * @param {Object} otherRow - the data to insert into the new row
 * @param {HTMLTableSectionElement} tbody - the table body to insert the row into
 * @param {number} colSpan - the number of columns the new row should span
 * @returns None
 */
const otherRows = (otherRow, tbody, colSpan)=>{
  let newRow = tbody.insertRow();
  for (const [key, value] of Object.entries(otherRow)) {
    let newCell       = newRow.insertCell();
    newCell.innerHTML = `${key}${value}`;
    newCell.colSpan   = colSpan;
  }
}

/**
 * Prints the current window and closes it when the print dialog is closed.
 * Also prevents the context menu from appearing when right-clicking.
 * @returns None
 */
const print = ()=>{
  window.print();
  window.onfocus=function(){ window.close();}
  document.addEventListener("contextmenu", event => event.preventDefault());
}

const loadDoctor = async(doctor_id) =>{
  try {
    let response = await fetch(`${url}get-user`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        user_id: doctor_id, 
      }),
    });

    let data = await response.json();
    if (data.status != 'false') {
      console.log(data.data[0].name)
      return data.data[0].name
    }
  }catch(e){
    console.log(e.message)
  }
}

/**
 * Loads the receipt for the given opdId by making a POST request to the server.
 * @param {string} opdId - The id of the opd for which the receipt is to be loaded.
 * @returns None
 */
const loadReceipt = async(opdId) =>{
  let response = await fetch(`${url}get-opd`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({
      opd_id: opdId,
    }),
  });

  let data = await response.json();
  if (data.status == 'ok') {
    const doctor_name = await loadDoctor(data.data[0].doctor_id);
    document.getElementById('title').innerHTML = `Receipt ${data.data[0].patient_details.name} Date: ${data.data[0].date}`;
    let billNo = await randomString(3, 'A') + data.data[0].opd_id + await randomString(1, '!')  + await randomString(2, '#');
    let patientId = await randomString(3, 'A') + data.data[0].patient_id + await randomString(1, '!')  + await randomString(2, '#');

    document.getElementById('name').innerHTML = `Patient's Name: ${data.data[0].patient_details.name} (${data.data[0].patient_details.age}/${data.data[0].patient_details.sex})`;
    document.getElementById("date").innerHTML = `Date: ${data.data[0].dateTimeStamp}`;
    document.getElementById("mobile").innerHTML = `Mobile: ${data.data[0].patient_details.mobile}`;
    document.getElementById("bill-no").innerHTML = `Bill No: ${billNo}`;
    document.getElementById("patient-id").innerHTML = `Patient Id: ${patientId}`;
    document.getElementById("daySrNO").innerHTML = data.data[0].srNo;

    let tbody = document.getElementById('table').getElementsByTagName('tbody')[0];
    const services = JSON.parse(data.data[0].services);
    const finalTotal = await loadServices(services, tbody);
    const rupeesInWords = `<strong>${await convertNumberToWords(finalTotal)}Rupees only</strong>`.toUpperCase();

    let row1 = {"In words: ": rupeesInWords, "Billed Amount: ": `<strong>${finalTotal}/-</strong>`}
    otherRows(row1, tbody, 2);

    let row2 = {"Payment Method: ": "", "Received Amount: ": `<strong>${finalTotal}/-</strong>`}
    otherRows(row2, tbody, 2);

    let row3 = {"":`<div>Doctor: <strong>${doctor_name}</strong></div><div class="heading sign">SIGNATURE</div>`}
    otherRows(row3, tbody, 4);

    let poweredBy = {"" :`<div class="powered">Proudly Powered By: <a href="https://www.inshatech.com" class="link-dark" target="_blank">Insha Technologies</a></div>`};
    otherRows(poweredBy, tbody, 4);

    print();

  }else{
    Swal.fire({
      title:'Error Occurred!',
      text:data.message,
      icon:'error',
      confirmButtonColor: '#ea4c62',
      confirmButtonText: 'Okay'
    }).then ((result) => {
      if (result.isConfirmed) {
        if (data.message == 'Authorization failed!') {
          location.assign('../login.html');
        }else{
          location.assign('../opd.html');
        }
      }
    })
  }
}

/**
 * Adds an event listener to the document that waits for the DOM to be loaded. Once the DOM is loaded,
 * it retrieves the URL of the current page and extracts the "opdId" parameter from the URL. It then
 * calls the "loadReceipt" function with the extracted "opdId" parameter.
 * @returns None
 */
document.addEventListener("DOMContentLoaded", ()=>{
  let url_string  = window.location.href; 
  let url         = new URL(url_string);
  let opdId       = url.searchParams.get("opdId");
  loadReceipt(opdId)
});