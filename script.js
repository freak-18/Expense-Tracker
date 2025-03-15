let chart;

// Display only the appropriate section when navigating
function navigateTo(section) {
    document.querySelectorAll('.card-section').forEach(card => {
        card.style.display = 'none';
    });
    document.getElementById(`${section}-section`).style.display = 'block';
}

window.onload = () => {
    navigateTo('income'); // Start with income section
    loadIncome();
    loadExpenses();
    updateTotal();
    updateBalance();
    updateChart();
};

// Income Functions
function loadIncome() {
    const savedIncome = JSON.parse(localStorage.getItem("income"));
    if (savedIncome) {
        document.getElementById("total-income").textContent = savedIncome;
    }
}

function setIncome() {
    const incomeInput = document.getElementById("income-amount").value;
    const income = parseInt(incomeInput);
    if (isNaN(income) || income <= 0) {
        alert("Please enter a valid income amount.");
        return;
    }
    localStorage.setItem("income", JSON.stringify(income));
    document.getElementById("total-income").textContent = income;
}

// Expense Functions
function addExpense() {
    const nameInput = document.getElementById("expense-name").value;
    const amountInput = document.getElementById("expense-amount").value;

    const amount = parseInt(amountInput);
    if (!nameInput || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid expense name and amount.");
        return;
    }

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push({ name: nameInput, amount });
    localStorage.setItem("expenses", JSON.stringify(expenses));

    loadExpenses();
    updateTotal();
    updateBalance();
    updateChart();
}

function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    expenses.forEach(expense => {
        const listItem = document.createElement("li");
        listItem.textContent = `${expense.name}: ₹${expense.amount}`;
        expenseList.appendChild(listItem);
    });
}
function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    expenses.forEach((expense, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `${expense.name}: ₹${expense.amount} <button onclick="deleteExpense(${index})">Delete</button>`;
        expenseList.appendChild(listItem);
    });
}

function deleteExpense(index) {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
    updateTotal();
    updateBalance();
    updateChart();
}



// Balance & Total Functions
function updateTotal() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById("total-amount").textContent = totalAmount;
}

function updateBalance() {
    const totalIncome = JSON.parse(localStorage.getItem("income")) || 0;
    const totalExpense = JSON.parse(localStorage.getItem("expenses") || "[]").reduce((sum, exp) => sum + exp.amount, 0);
    const balance = totalIncome - totalExpense;
    document.getElementById("current-balance").textContent = balance;
}

function updateChart() {
    const ctx = document.getElementById("expenseChart").getContext("2d");
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: expenses.map(exp => exp.name),
            datasets: [{
                label: 'Expenses',
                data: expenses.map(exp => exp.amount),
                backgroundColor: [
                    '#e74c3c', '#3498db', '#f1c40f', '#1abc9c', '#9b59b6', 
                    '#e67e22', '#ff6b6b', '#f8a5c2', '#3dc1d3', '#f5cd79',
                    '#574b90', '#63cdda', '#786fa6', '#cf6a87', '#c44569',
                    '#f19066', '#778beb', '#786fa6', '#e15f41', '#546de5'
                ], // Added more colors
                borderColor: '#2c3e50',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            const dataset = tooltipItem.dataset;
                            const index = tooltipItem.dataIndex;
                            const amount = dataset.data[index];
                            const total = dataset.data.reduce((sum, val) => sum + val, 0);
                            const percentage = ((amount / total) * 100).toFixed(0);
                            return `${dataset.label}: ₹${amount} (${percentage}%)`;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: { color: '#ecf0f1' }
                }
            }
        }
    });
}


function setIncome() {
    const incomeInput = document.getElementById("income-amount");
    const income = parseInt(incomeInput.value);
    if (isNaN(income) || income <= 0) {
        alert("Please enter a valid income amount.");
        return;
    }
    localStorage.setItem("income", JSON.stringify(income));
    document.getElementById("total-income").textContent = income;
    incomeInput.value = ''; // Clear input after submission
}

function addExpense() {
    const nameInput = document.getElementById("expense-name");
    const amountInput = document.getElementById("expense-amount");

    const amount = parseInt(amountInput.value);
    if (!nameInput.value || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid expense name and amount.");
        return;
    }

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push({ name: nameInput.value, amount });
    localStorage.setItem("expenses", JSON.stringify(expenses));

    nameInput.value = ''; // Clear input after submission
    amountInput.value = '';

    loadExpenses();
    updateTotal();
    updateBalance();
    updateChart();
}
