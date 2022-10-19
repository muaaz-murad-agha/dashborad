const formElem = document.getElementById('chartForm');
const jsonStr = document.getElementById('jsonString');
const hideBox = document.getElementById('checkbox1');
//const fillList = document.getElementById('employeeList');
const emplChecklist = document.getElementById('emplChecklist');

async function getJSONData(url, data) {
    return (await fetch(url, 
        {
            method: 'POST',
            body: data
        })).json();
}

formElem.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    getChartData(formData);
})

function getChartData(data) {
    const url = '../app/employee.php';
    fetch(url, 
    {
        method: 'POST',
        body: data
    }).then( response => {
        if(!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    }).then( json => {
        updateChart(myChart, json);
    })
    .catch(error => jsonStr.textContent = `Could not fetch data: ${error}`)

}

function updateChart(chart, jsonData) {
    console.log(chart);
    console.log(jsonData);

    chart.data.labels = jsonData.labels;

    let VK = {
        label: 'Verkaufspreis',
        backgroundColor: '#227c9d',
        borderColor: '#227c9d',
        data: jsonData.retail_price,
        stack: 'Stack 0'
    }

    let EK = {
        label: 'Einkaufspreis',
        backgroundColor: '#17c3b2',
        borderColor: '#17c3b2',
        data: jsonData.buying_price,
        stack: 'Stack 1',
//        hidden: true,
    }

    let marge = {
        label: 'Marge',
        backgroundColor: '#fe6d73',
        borderColor: '#fe6d73',
        data: jsonData.marge,
        stack: 'Stack 1',
//        hidden: true,
    }
    chart.data.datasets = [VK, EK, marge];
    chart.update();

}

let labels = [];

let data = {
    labels: labels,
    datasets: [{
        label: '',
        backgroundColor: 'rgb(255, 0, 0)',
        borderColor: 'rgb(255, 0, 0)',
        data: [],
    }]
};

let config = {
    type: 'bar',
    data: data,
    options: {}
};

let myChart = new Chart(
    document.getElementById('myChart'),
    config
);

/*
window.onload = async function () {

    try {
        let users = await getJSONData('../app/employeedata.php', null);
        
        for (let user of users) {
            const option = document.createElement("option");
            option.value = user.name;
            fillList.appendChild(option);
        }
    } catch(e) {
        console.log(e);
    }

}
*/

window.onload = async function () {

    try {
        let users = await getJSONData('../app/employeedata.php', null);
        
        for (let user of users) {
            const liElem = document.createElement("li");
            
            liElem.className = 'list-group-item';
            const input = document.createElement("input");
            input.className = 'form-check-input me-1';
            input.type = 'checkbox';
            input.value = user.id;

            liElem.appendChild(input);
            liElem.innerHTML += user.name;
            emplChecklist.appendChild(liElem);
        }
    } catch(e) {
        console.log(e);
    }
}



console.log(myChart);