let allExpenses = [];

const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');

const API_BASE = 'http://127.0.0.1:5000/api/expenses'

function loadExpenses(){
    fetch(API_BASE)
        .then(res => res.json())
        .then(expenses => {
            allExpenses = expenses; 
            renderExpenses(expenses);
            updateMonthlyChart(expenses);
        })
        .catch(err => console.error('Error loading expenses:', err));
}
form.addEventListener('submit', function(e){
    e.preventDefault();

    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if(amount && category && date) {
        fetch(API_BASE,{
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body:JSON.stringify({amount,category,date})
        })
        .then(res=>res.json())
        .then(data=>{
            console.log('Expense added:',data);
            loadExpenses();
            form.reset();
        }) 
        .catch(err=>console.error('Error adding expense',err));       
}else{
    alert('Please fill all the required fields');
}

});

function renderExpenses(expenses) {
    expenseList.innerHTML = '';
    expenses.forEach((exp, index) => {
        const li = document.createElement('li');
        const dateStr = new Date(exp.date).toLocaleDateString();
        li.textContent = `${dateStr} - ${exp.category}: ₹${parseFloat(exp.amount).toFixed(2)}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '70px';
        deleteButton.style.backgroundColor = 'Red';
        deleteButton.style.color = 'white';
        deleteButton.style.border = 'none';
        deleteButton.style.padding = '5px 10px';
        deleteButton.style.cursor = 'pointer';

        deleteButton.addEventListener('click', ()=>{
            fetch(`${API_BASE}/${exp.id}`,{
                method: 'DELETE'     
            })
            .then(()=>loadExpenses())
            .catch(err=>console.error('Error deleting expense:',err));
        });

        li.appendChild(deleteButton);
        expenseList.appendChild(li);
    });    
}
let chartInstance = null;
function updateMonthlyChart(expenses){
    const monthlyData = {};
    expenses.forEach(exp=>{
        const date = new Date(exp.date);
        const thisMonth = date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
        if(thisMonth){
            monthlyData[exp.category] = (monthlyData[exp.category] || 0) + parseFloat(exp.amount);
        }
    });
    const labels = Object.keys(monthlyData);
    const data = Object.values(monthlyData);

    if(chartInstance){
        chartInstance.destroy();
    }

    chartInstance = new Chart(document.getElementById('monthlyChart'),{
        type: 'pie',
        data:{
            labels: labels,
            datasets: [{
                label: 'Expenses of this Month',
                data: data,
                backgroundColor:['#ff6384','#36a2eb','#ffcd56','#4bc0c0','#9966ff']
            }]
        }
    });
}
document.getElementById('apply-filter').addEventListener('click', () => {
    const category = document.getElementById('filter-category').value;
    const date = document.getElementById('filter-date').value;

    let filtered = allExpenses;

    if (category) {
        filtered = filtered.filter(exp => exp.category === category);
    }

    if (date) {
        // Compare only date part, ignoring time
        const selectedDate = new Date(date).toISOString().split('T')[0];
        filtered = filtered.filter(exp => exp.date.startsWith(selectedDate));
    }

    renderExpenses(filtered);
});

document.addEventListener('DOMContentLoaded', loadExpenses);