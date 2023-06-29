/**
 * Loads the given services into the given table body and calculates the total cost of all services.
 * @param {Array} services - An array of objects representing the services to load into the table.
 * @param {HTMLTableSectionElement} tbody - The table body element to load the services into.
 * @returns {number} - The total cost of all services.
 */
const loadServices = async(services, tbody) =>{
  let irritation = 0;
  let calculation = 0;
  
  for (let index = 0; index < services.length; index++) {
    const service = services[index];
    irritation++;
    let newRow = tbody.insertRow();

    let newCell;  
    newCell           = newRow.insertCell();
    newCell.innerHTML = irritation;

    for (const [key, value] of Object.entries(service)) {
      let newCell;  
      newCell           = newRow.insertCell();
      newCell.innerHTML = value;
      if (key == 'total') {
        calculation += parseInt(value);
      }
    }
  }
  return calculation
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
 * Loads a bill from the server and populates the HTML with the bill data.
 * @param {string} billId - The ID of the bill to load.
 * @returns None
 */
const loadBill = async(billId) =>{
  let response = await fetch(`${url}get-bill`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      Authorization: localStorage.getItem("jwtTempToken"),
    },
    body: JSON.stringify({
      bill_id: billId,
    }),
  });

  const otherRows = (otherRow, tbody, colSpan)=>{
    let newRow = tbody.insertRow();
    for (const [key, value] of Object.entries(otherRow)) {
      let newCell       = newRow.insertCell();
      newCell.innerHTML = `${key}${value}`;
      newCell.colSpan   = colSpan+1;
    }
  }

  let data = await response.json();
  if (data.status == 'ok') {
    document.getElementById('title').innerHTML = `IPD Bill ${data.data[0].name} Date: ${data.data[0].date}`;
    let billNo = await randomString(3, 'A') + data.data[0].bill_id + await randomString(1, '!')  + await randomString(2, '#');

    document.getElementById('name').innerHTML = `Patient's Name: ${data.data[0].name} (${data.data[0].age}/${data.data[0].sex})`;
    document.getElementById("date").innerHTML = `Date: ${data.data[0].dateTimeStamp}`;
    document.getElementById("mobile").innerHTML = `Mobile: ${data.data[0].mobile}`;
    document.getElementById("bill-no").innerHTML = `Bill No: ${billNo}`;
    document.getElementById("address").innerHTML = `Address: ${data.data[0].city}`;
    document.getElementById("bed-no").innerHTML = `Bed No: ${data.data[0].bedNo}`;
    document.getElementById("doa").innerHTML = `DOA: ${data.data[0].doa}`;
    document.getElementById("dod").innerHTML = `DOD: ${data.data[0].dod}`;

    let tbody = document.getElementById('table').getElementsByTagName('tbody')[0];
    const services = JSON.parse(data.data[0].services);
    const finalTotal = await loadServices(services, tbody);
    const rupeesInWords = `<strong>${await convertNumberToWords(finalTotal)}Rupees only</strong>`.toUpperCase();

    let row1 = {"In words: ": rupeesInWords, "TOTAL: ": `<strong>${finalTotal}/-</strong>`}
    otherRows(row1, tbody, 2);
    
    let row2 = {"Payment Method: ": "", "ADVANCE: ": `<strong>${data.data[0].paid}/-</strong>`}
    otherRows(row2, tbody, 2);

    let discount = 0;
    if (data.data[0].discount > 0) {
      discount = data.data[0].discount;
      let discountRow = {"":"", "DISCOUNT: ":`<strong>${discount}/-</strong>`};
      otherRows(discountRow, tbody, 2);
    }

    let balance = parseInt(finalTotal) - parseInt(data.data[0].paid) - parseInt(discount);
    let row3 = {"": "", "BALANCE: ": `<strong>${balance}/-</strong>`}
    otherRows(row3, tbody, 2);

    let row4 = {'<div class="heading">Name (Paid By):</div>':'<div class="heading">Mobile No.: </div>',
    "<div>Date: </div>":'<div>Time: </div>'}
    otherRows(row4, tbody, 2);

    let sign = {"":`
      <div class="heading sign">
        <div>Signature</div>
        <di>Cashier Signature</di>
      </div>
    `}
    otherRows(sign, tbody, 5);

    let poweredBy = {"" :`<div class="powered">Proudly Powered By: <a href="https://www.inshatech.com" class="link-dark" target="_blank">Insha Technologies</a></div>`};
    otherRows(poweredBy, tbody, 5);

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
          location.assign('../add-bill.html');
        }
      }
    })
  }
}

/**
 * Adds an event listener to the document that waits for the DOM to be loaded. Once the DOM is loaded,
 * it retrieves the billId from the URL and passes it to the loadBill function.
 * @returns None
 */
document.addEventListener("DOMContentLoaded", ()=>{
  let url_string  = window.location.href; 
  let url         = new URL(url_string);
  let billId       = url.searchParams.get("billId");
  loadBill(billId)
});