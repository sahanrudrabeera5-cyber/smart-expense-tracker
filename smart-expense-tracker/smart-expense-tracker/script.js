
// Get HTML elements
const form = document.getElementById("transaction-form");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expensesElement = document.getElementById("expenses");

const transactionList = document.getElementById("transaction-list");

// Load saved transactions
let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

// Add a new transaction
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter valid details.");
        return;
    }

    const transaction = {
        id: Date.now() + Math.random(),
        description: description,
        amount: amount,
        type: type,
        category: category
    };

    transactions.push(transaction);

    saveTransactions();
    updateDashboard();

    form.reset();

});

// Save transactions in browser
function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

// Update dashboard
function updateDashboard() {

    let income = 0;
    let expenses = 0;

    transactionList.innerHTML = "";

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;
        }

        const li = document.createElement("li");

        const details = document.createElement("span");
        details.textContent =
            transaction.description + " (" +
            transaction.category + ")";

        const amountText = document.createElement("span");

        amountText.textContent =
            (transaction.type === "income" ? "+ ₹" : "- ₹") +
            transaction.amount.toFixed(2);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteTransaction(transaction.id);
        });

        li.appendChild(details);
        li.appendChild(amountText);
        li.appendChild(deleteButton);

        transactionList.appendChild(li);

    });

    const balance = income - expenses;

    balanceElement.textContent = "₹" + balance.toFixed(2);
    incomeElement.textContent = "₹" + income.toFixed(2);
    expensesElement.textContent = "₹" + expenses.toFixed(2);

}

// Delete transaction
function deleteTransaction(id) {

    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });

    saveTransactions();
    updateDashboard();

}

// Display saved transactions
updateDashboard();
