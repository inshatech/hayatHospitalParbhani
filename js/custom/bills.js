let bill_list = {};

/**
 * Returns today's date in the format of "YYYY-MM-DD".
 * @returns {string} - today's date in the format of "YYYY-MM-DD".
 */
const todaysDate = ()=>{
  let date = new Date();
  let month = date.getMonth() + 1
  let day = date.getDate();
  let todaysDate = `${date.getFullYear()}-${month}-${day}`;
  return todaysDate;
}

/**
 * Deletes all rows in a given table.
 * @param {HTMLTableElement} tableName - The table element to delete rows from.
 * @returns None
 */
function DeleteRows(tableName) {
  let rowCount = tableName.tBodies[0].rows.length;
  for (var i = rowCount; i > 0; i--) {
    tableName.deleteRow(i);
  }
}

const appendRecords = async(bill, tbody)=>{
  let newRow = tbody.insertRow();
  let newCell;

  newCell           = newRow.insertCell();
  newCell.innerHTML = bill.bill_id;

  newCell           = newRow.insertCell();
  newCell.innerHTML = bill.date;

  newCell           = newRow.insertCell();
  newCell.innerHTML = bill.name;

  let amount = parseInt(bill.gTotal) + parseInt(bill.paid) + parseInt(bill.discount);
  newCell           = newRow.insertCell();
  newCell.innerHTML = `${amount}/-`;

  newCell           = newRow.insertCell();
  newCell.innerHTML = `${parseInt(bill.paid)}/-`;

  newCell           = newRow.insertCell();
  newCell.innerHTML = `${bill.discount}/-`;

  paidAndDiscount   = parseInt(bill.paid) + parseInt(bill.discount);  
  newCell           = newRow.insertCell();
  newCell.innerHTML = `${amount - paidAndDiscount}/-`;

  newCell           = newRow.insertCell();
  newCell.innerHTML = `
    <a href="./templates/bill.html?billId=${bill.bill_id}">
      <span class="btn m-1 btn-dark">
        <i class="fa-solid fa-print"></i>
      </span>
    </a>
  `;
}

const fullRow = (rowData, colSpan, tbody)=>{
  let newRow = tbody.insertRow();
  let newCell;
  newCell           = newRow.insertCell();
  newCell.innerHTML = `${rowData}`;
  newCell.colSpan = colSpan;
}

document.getElementsByTagName("body")[0].onload = async () => {
  try {
    let response = await fetch(`${url}get-bill`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        date: todaysDate(),
      }),
    });

    let data = await response.json();
    let billTable = document.getElementById("billTable");
    let tbody = document.getElementById('billTable').getElementsByTagName('tbody')[0];
    if (data.status == 'ok') {
      DeleteRows(billTable);
      const billList = data.data;
      for (const bill of billList) {
        bill_list[bill.bill_id] = bill;
        appendRecords(bill, tbody);
      }
    }else if(data.message != 'Authorization failed!'){
      DeleteRows(billTable);
      fullRow(`<div class="text-center">No records found!</div>`, 8, tbody);
    }else{
      window.location = './login.html';
    }
  } catch (error) {
    console.log(error);
  }
};

document.getElementById("date-search-btn").onclick = async () => {
  let from = document.getElementById("inputDateFrom").value;
  let to = document.getElementById("inputDateTo").value;
  if (from != "" && to != "") {
    document.getElementById("date-search-btn").innerHTML = `<div id="spinner" class="spinner-border spinner-border-sm text-success mx-2"  role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`;
    let response = await fetch(`${url}get-bill`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("jwtTempToken"),
      },
      body: JSON.stringify({
        between_dates: {
          start_date: from,
          end_date: to,
        },
      }),
    });

    let data = await response.json();
    let billTable = document.getElementById("billTable");
    let tbody = document.getElementById('billTable').getElementsByTagName('tbody')[0];
    document.getElementById("date-search-btn").innerHTML = `<i class="fa-solid fa-magnifying-glass  "></i> Search`;
    if (data.status == "ok") {
      DeleteRows(billTable);
      const billList = data.data;
      for (const bill of billList) {
        bill_list[bill.bill_id] = bill;
        appendRecords(bill, tbody);
      }
    }else if(data.message != 'Authorization failed!'){
      DeleteRows(billTable);
      fullRow(`<div class="text-center">No records found!</div>`, 8, tbody);
    }else{
      window.location = './login.html';
    }
  }
}