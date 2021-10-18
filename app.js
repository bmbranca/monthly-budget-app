const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

//Before adding local storage
// const dummyTransactions = [
//   { id: 1, text: "Flower", amount: -20 },
//   { id: 2, text: "Salary", amount: 300 },
//   { id: 3, text: "Book", amount: -10 },
//   { id: 4, text: "Camera", amount: 150 },
// ];

//JSON.parse going in...
const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

//setting transactions to what's in LS or an empty array
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();
  //checks to see if input field is empty
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount");
    //creates an object for a new transaction
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    //pushes newly created transaction obj to transactions array
    transactions.push(transaction);

    //runs function to create for history li
    addTransactionDOM(transaction);

    //updates balance, income, and expense
    updateValues();

    //Sets new item in LS
    updateLocalStorage();

    //clears input field
    text.value = "";
    amount.value = "";
  }
}

// Generate random ID for transaction object
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

//Adds transactions to the DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
  ${transaction.text}<span>${sign}
  ${Math.abs(transaction.amount)}
  </span>
  <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

  list.appendChild(item);
}

//Updates balance, income and expenses
function updateValues() {
  //puts each individual item amount in array
  const values = transactions.map((item) => {
    return item.amount;
  });

  //give cash balance
  const totalMoney = values.reduce((acc, item) => (acc += item), 0);

  //gives total income
  const income = values
    .filter((item) => {
      return item > 0;
    })
    .reduce((acc, item) => (acc += item), 0);

  //gives total expense
  const expense = values
    .filter((item) => {
      return item < 0;
    })
    .reduce((acc, item) => (acc += item), 0);

  let localMoneyBalance = totalMoney.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  balance.innerText = `${localMoneyBalance}`;
  money_plus.innerText = `$${income.toFixed(2)}`;
  money_minus.innerText = `$${expense.toFixed(2)}`;

  // (2500).toLocaleString("en-US", {
  //   style: "currency",
  //   currency: "USD",
  // });
}

//Delete transaction by ID
//filters thru to see if id(which is the id of the transaction which was clicked). the only items left have ids that don't match the button that was clicked.
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  //Removes from LS
  updateLocalStorage();
  init();
}

//Update localStorage
//JSON.stringify when pushing to LS
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

//Runs when page loads
function init() {
  //clears DOM item list
  list.innerHTML = "";
  //runs function for each item
  transactions.forEach(addTransactionDOM);
  //calculates total balance, expenses, income
  updateValues();
}

init();

form.addEventListener("submit", addTransaction);
