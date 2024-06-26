// main.js

document.getElementById('expense-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const expenseName = document.getElementById('expense-name').value;
  const expenseAmount = document.getElementById('expense-amount').value;

  if (expenseName && expenseAmount) {
    addExpense(expenseName, expenseAmount);
    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
  }
});

function addExpense(name, amount) {
  const table = document.getElementById('expenses-table').getElementsByTagName('tbody')[0];
  const newRow = table.insertRow();

  const nameCell = newRow.insertCell(0);
  const amountCell = newRow.insertCell(1);
  const actionCell = newRow.insertCell(2);

  nameCell.textContent = name;
  amountCell.textContent = `$${amount}`;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', function() {
    table.deleteRow(newRow.rowIndex - 1);
  });
  actionCell.appendChild(deleteButton);
}
