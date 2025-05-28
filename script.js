// === ADD STOCK ===

// Add another stock entry block in add-stock.html
function addAnotherBlock() {
  const container = document.getElementById("stockContainer");

  const newBlock = document.createElement("div");
  newBlock.classList.add("stock-block");
  newBlock.innerHTML = `
    <label>Supplier:</label>
    <input type="text" class="supplier" required>

    <label>Delivery Date:</label>
    <input type="date" class="deliveryDate" required>

    <label>Stock Item:</label>
    <select class="stockItem" required>
      <option value="">-- Select --</option>
      <option>Beef Mince</option>
      <option>Chicken Fillets</option>
      <option>Pork Chops</option>
      <option>Lamb Ribs</option>
      <option>Sausages</option>
      <option>Boerewors</option>
    </select>

    <label>Quantity (kg):</label>
    <input type="number" class="quantity" required>
  `;
  container.appendChild(newBlock);
}

// Collect and save all add-stock entries
function submitAllStock() {
  const suppliers = document.querySelectorAll(".supplier");
  const dates = document.querySelectorAll(".deliveryDate");
  const items = document.querySelectorAll(".stockItem");
  const quantities = document.querySelectorAll(".quantity");

  const stockList = [];

  for (let i = 0; i < suppliers.length; i++) {
    const supplier = suppliers[i].value;
    const date = dates[i].value;
    const item = items[i].value;
    const qty = quantities[i].value;

    if (!supplier || !date || !item || !qty) {
      alert("⚠️ Please fill in all fields before submitting.");
      return;
    }

    stockList.push({ supplier, date, item, qty });
  }

  localStorage.setItem("action", "add");
  localStorage.setItem("stockList", JSON.stringify(stockList));
  window.location.href = "confirmation.html";
}

//
// === UPDATE STOCK ===

// Add another stock update block in update-stock.html
function addAnotherUpdateBlock() {
  const container = document.getElementById("updateContainer");

  const newBlock = document.createElement("div");
  newBlock.classList.add("stock-block");
  newBlock.innerHTML = `
    <label>Stock Item:</label>
    <select class="stockItem" onchange="showQuantity(this)" required>
      <option value="">-- Select --</option>
      <option>Beef Mince</option>
      <option>Chicken Fillets</option>
      <option>Pork Chops</option>
      <option>Lamb Ribs</option>
      <option>Sausages</option>
      <option>Boerewors</option>
    </select>

    <label>Current Quantity:</label>
    <p class="currentQty">-</p>

    <label>Batch Number:</label>
    <input type="text" class="batchNumber" required>

    <label>New Quantity (kg):</label>
    <input type="number" class="newQty" required>

    <label>Processing Date:</label>
    <input type="date" class="processingDate" required>

    <label>Expiry Date:</label>
    <input type="date" class="expiryDate" required>
  `;
  container.appendChild(newBlock);
}

// Lookup current quantity when item is selected
function showQuantity(selectElement) {
  const stockItem = selectElement.value;
  const qtyMap = {
    "Beef Mince": 25,
    "Chicken Fillets": 40,
    "Pork Chops": 30,
    "Lamb Ribs": 12,
    "Sausages": 50,
    "Boerewors": 45
  };

  const block = selectElement.closest(".stock-block");
  const qtyDisplay = block.querySelector(".currentQty");

  qtyDisplay.innerText = qtyMap[stockItem] ? qtyMap[stockItem] + " kg" : "-";
}

// Collect and save all update-stock entries
function submitAllUpdates() {
  const items = document.querySelectorAll(".stockItem");
  const batches = document.querySelectorAll(".batchNumber");
  const qtys = document.querySelectorAll(".newQty");
  const processDates = document.querySelectorAll(".processingDate");
  const expiryDates = document.querySelectorAll(".expiryDate");

  const updateList = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i].value;
    const batch = batches[i].value;
    const qty = qtys[i].value;
    const processDate = processDates[i].value;
    const expiryDate = expiryDates[i].value;

    if (!item || !batch || !qty || !processDate || !expiryDate) {
      alert("⚠️ Please complete all fields before submitting.");
      return;
    }

    updateList.push({ item, batch, qty, processDate, expiryDate });
  }

  localStorage.setItem("action", "update");
  localStorage.setItem("updateList", JSON.stringify(updateList));
  window.location.href = "confirmation.html";
}

//
// === CONFIRMATION ===

// On confirmation.html: display all submitted data in a table
function loadConfirmationTable() {
  const tableHead = document.getElementById("tableHead");
  const tableBody = document.querySelector("#summaryTable tbody");

  // Sample keys (you can customize based on your form fields)
  const headers = ["Stock Item", "Batch No.", "Quantity (kg)", "Processing Date", "Expiry Date"];

  // Clear table first
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  // Create header row
  const headerRow = document.createElement("tr");
  headers.forEach((heading) => {
    const th = document.createElement("th");
    th.textContent = heading;
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);

  // Get entries from localStorage (add-stock or update-stock)
  const stockEntries = JSON.parse(localStorage.getItem("stockEntries")) || [];

  stockEntries.forEach((entry) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${entry.stockItem}</td>
      <td>${entry.batchNumber}</td>
      <td>${entry.quantity}</td>
      <td>${entry.processingDate}</td>
      <td>${entry.expiryDate}</td>
    `;

    tableBody.appendChild(row);
  });
}

function loadTrackedStock() {
  const tableBody = document.querySelector("#stockTable tbody");

  const qtyMap = {
    "Beef Mince": 25,
    "Chicken Fillets": 40,
    "Pork Chops": 30,
    "Lamb Ribs": 12,
    "Sausages": 50,
    "Boerewors": 45
  };

  const updates = JSON.parse(localStorage.getItem("updateList")) || [];
  updates.forEach(({ item, qty }) => {
    if (qtyMap[item]) {
      qtyMap[item] = parseInt(qty); // Replace with updated quantity
    }
  });

  Object.entries(qtyMap).forEach(([item, quantity]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item}</td><td>${quantity} kg</td>`;
    tableBody.appendChild(row);
  });
}