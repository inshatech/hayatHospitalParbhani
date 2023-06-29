/**
 * Adds a new row to the given table with the specified heading, row span, and column span.
 * @param {HTMLTableElement} table - The table to add the row to.
 * @param {string} heading - The heading for the new row.
 * @param {number} rowSpan - The number of rows that the cell should span.
 * @param {number} colSpan - The number of columns that the cell should span.
 * @returns None
 */
const addRow = (table, heading, rowSpan, colSpan)=>{
  let row = table.insertRow();
  let cell = row.insertCell();
  cell.innerHTML = heading;
  cell.rowSpan = rowSpan;
  cell.colSpan = colSpan;
}
/**
 * Populates a table body with patient condition data.
 * @param {Object} condition - An object containing patient condition data.
 * @param {HTMLTableSectionElement} tbody - The table body element to populate.
 * @returns None
 */
const patientCondition = async(condition, tbody)=>{
  let irritation = 0;
  let count = 0;
  let length = Object.entries(condition).length;
  for (const [key, value] of Object.entries(condition)) {
    irritation++;
    count++;
    if (irritation <= 3) {
      if (irritation == 1) {
        var newRow = tbody.insertRow();
      }
      var newCell = newRow.insertCell();
      if (key == "ECG") {
        newCell.colSpan = 3;
        irritation = 0
      }
      var newText = document.createTextNode(`${key.replace(/\s*_/g,' ')} = ${value}`);
      newCell.appendChild(newText);
      if (count == length || irritation == 3) {
        irritation = 0
      }
    }
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

/**
 * Loads a fitness certificate from the server and populates the certificate HTML with the data.
 * @param {string} fitnessId - The ID of the fitness certificate to load.
 * @returns None
 */
const loadCertificate = async(fitnessId) =>{
  let response = await fetch(`${url}getFitness`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({
      fitness_id: fitnessId,
    }),
  });

  let data = await response.json();
  if (data.status == 'ok') {
    document.getElementById('title').innerHTML = `Fitness Certificate for ${data.data[0].name} Date: ${data.data[0].date}`;
    document.getElementById("referer").innerHTML = `Referring Doctor/Hospital: ${data.data[0].referer}`;
    document.getElementById("date").innerHTML = `Date: ${data.data[0].date}`;
    document.getElementById("name").innerHTML = `Patient's Name: ${data.data[0].name}`;
    // document.getElementById("address").innerHTML = `Address: ${data.data[0].address}`;
    document.getElementById("age-sex").innerHTML = `Age/Sex: ${data.data[0].age}/${data.data[0].sex}`;
    document.getElementById("city").innerHTML = `Address: ${data.data[0].city}`;
    document.getElementById("mobile").innerHTML = `Mobile: ${data.data[0].mobile}`;
    document.getElementById("postedFor").innerHTML = `Posted for: ${data.data[0].postedFor}`;

    let tbody = document.getElementById('table').getElementsByTagName('tbody')[0];

    /**
     * Adds a new row to the given table body with the given text and colspan.
     * @param {HTMLTableSectionElement} tbody - The table body to add the row to.
     * @param {string} text - The text to add to the row.
     * @param {number} colspan - The number of columns the row should span.
     * @param {number} [rowIndex] - The index at which to insert the new row. Defaults to the end of the table.
     * @returns None
     */
    addRow(tbody, '<div class="heading">Complaints: </div>', 4, 0);
    /**
     * Parses the complaints data from the given data object and passes it to the patientCondition function
     * to update the table body.
     * @param {object} data - The data object containing the complaints data.
     * @param {HTMLElement} tbody - The table body element to update with the patient condition data.
     * @returns None
     */
    const complaints = JSON.parse(data.data[0].complaints);
    patientCondition(complaints, tbody);

    addRow(table, '<div class="heading">Past History Of : </div>', 3, 0);
    const history = JSON.parse(data.data[0].history);
    patientCondition(history, tbody);

    addRow(table, '<div class="heading">Personal H/O: </div>', 3, 0);
    const personal = JSON.parse(data.data[0].personal);
    patientCondition(personal, tbody);
    
    addRow(table, '<div class="heading">General Examination: </div>', 6, 0);
    const examination = JSON.parse(data.data[0].examination);
    patientCondition(examination, tbody);

    addRow(table, '<div class="heading">Systemic Examination: </div>', 3, 0);
    const other = JSON.parse(data.data[0].other);
    patientCondition(other, tbody);

    let opinion = `<div class="heading footer">Opinion : ${data.data[0].opinion} <div class="heading sign">DOCTOR'S SIGNATURE</div></div>`;
    addRow(table, opinion, 1, 4);

    let poweredBy = `<div class="powered">Proudly Powered By: <a href="https://www.inshatech.com" class="link-dark" target="_blank">Insha Technologies</a></div>`;
    addRow(table, poweredBy, 0, 4);

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
          location.assign('../add-fitness.html');
        }
      }
    })
  }
}

/**
 * Adds an event listener to the document that waits for the DOM to be loaded. Once the DOM is loaded,
 * it retrieves the fitnessId parameter from the URL and passes it to the loadCertificate function.
 * @returns None
 */
document.addEventListener("DOMContentLoaded", ()=>{
  let url_string  = window.location.href; 
  let url         = new URL(url_string);
  let fitnessId   = url.searchParams.get("fitnessId");
  loadCertificate(fitnessId)
});