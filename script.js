document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('load-data').disabled = false;
});

document.getElementById('load-data').addEventListener('click', loadData);
document.getElementById('clear').addEventListener('click', clearData);

function loadData() {
    const url = document.getElementById('url-input').value;
    const loadDataButton = document.getElementById('load-data');
    const clearButton = document.getElementById('clear');
    const statusMessage = document.getElementById('status-message');
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            statusMessage.textContent = `Дані формату JSON успішно завантажено. Кількість записів рівна ${data.length}. Відобразити ваш варіант таблиці?`;
            createDisplayButtons(data);
            loadDataButton.disabled = true;
            clearButton.disabled = false;
        })
        .catch(error => {
            statusMessage.textContent = `Помилка: ${error.message}`;
        });
}

function createDisplayButtons(data) {
    const displayOptions = document.getElementById('display-options');
    displayOptions.innerHTML = `
        <button class="yes" onclick='showTable(${JSON.stringify(data)})'>Так</button>
        <button class="no" onclick="resetPage()">Ні</button>
    `;
}

function showTable(data) {
    document.getElementById('status-message').textContent = ''; // Приховати текст повідомлення
    document.getElementById('display-options').innerHTML = ''; // Приховати кнопки після натискання

    const tableContainer = document.getElementById('table-container');
    let tableHTML = `
        <h2>Таблиця для варіанту 4</h2>
        <table>
            <thead>
                <tr>
                    <th onclick="sortTable(0)">ID</th>
                    <th onclick="sortTable(1)">City</th>
                    <th onclick="sortTable(2)">Zipcode</th>
                    <th onclick="sortTable(3)">Phone</th>
                </tr>
            </thead>
            <tbody>
    `;
    data.forEach(user => {
        tableHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.address.city}</td>
                <td>${user.address.zipcode}</td>
                <td>${user.phone}</td>
            </tr>
        `;
    });
    tableHTML += `
            </tbody>
        </table>
    `;
    tableContainer.innerHTML = tableHTML;
}

function sortTable(columnIndex) {
    const table = document.querySelector('table tbody');
    const rows = Array.from(table.rows);
    const sortedRows = rows.sort((a, b) => {
        const aText = a.cells[columnIndex].innerText.toLowerCase();
        const bText = b.cells[columnIndex].innerText.toLowerCase();
        return aText.localeCompare(bText);
    });

    table.innerHTML = '';
    sortedRows.forEach(row => table.appendChild(row));

    const headers = document.querySelectorAll('th');
    headers.forEach(header => header.classList.remove('sort-active'));
    headers[columnIndex].classList.add('sort-active');
}

function resetPage() {
    document.getElementById('url-input').value = '';
    document.getElementById('status-message').textContent = '';
    document.getElementById('display-options').innerHTML = '';
    document.getElementById('table-container').innerHTML = '';
    document.getElementById('load-data').disabled = false;
    document.getElementById('clear').disabled = true;
}

function clearData() {
    resetPage();
}
