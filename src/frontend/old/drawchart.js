const formElem = document.getElementById('chartForm');
const jsonStr = document.getElementById('jsonString');
const hideBox = document.getElementById('checkbox1');
const compareBtn = document.getElementById('compare');

async function getJSONData(url, data) {
    return (await fetch(url, 
        {
            method: 'POST',
            body: data
        })).json();
}

formElem.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    try {
        let data = await getJSONData('../app/chartdata.php', formData);
        updateChart(myChart, data);
    } catch (e) {
        console.log(e);
    }
})

function updateChart(chart, jsonData) {
    console.log(chart);
    console.log(jsonData);

    chart.data.labels = jsonData.labels;

    let VK = {
        label: 'Verkaufspreis',
        backgroundColor: '#227c9d',
        borderColor: '#227c9d',
        data: jsonData.retail_price,
        stack: 'Stack 2'
    }

    let EK = {
        label: 'Einkaufspreis',
        backgroundColor: '#17c3b2',
        borderColor: '#17c3b2',
        data: jsonData.buying_price,
        stack: 'Stack 3',
        hidden: true,
    }

    let marge = {
        label: 'Marge',
        backgroundColor: '#fe6d73',
        borderColor: '#fe6d73',
        data: jsonData.marge,
        stack: 'Stack 3',
        hidden: true,
    }

    chart.data.datasets = [VK, EK, marge];
    chart.update();

}


function addPrevYear(chart, jsonData) {

    let VK = {
        label: 'Verkaufspreis Vorjahr',
        backgroundColor: '#D3ECA7',
        borderColor: '#D3ECA7',
        data: jsonData.retail_price,
        stack: 'Stack 0'
    }

    let EK = {
        label: 'Einkaufspreis Vorjahr',
        backgroundColor: '#B33030',
        borderColor: '#B33030',
        data: jsonData.buying_price,
        stack: 'Stack 1',
        hidden: true,
    }

    let marge = {
        label: 'Marge Vorjahr',
        backgroundColor: '#19282F',
        borderColor: '#19282F',
        data: jsonData.marge,
        stack: 'Stack 1',
        hidden: true,
    }

    chart.data.datasets = [VK, EK, marge].concat(chart.data.datasets);
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


hideBox.onclick = function () {
    console.log(this);
    if(this.checked) {
        myChart.data.datasets[0].hidden = true;
        myChart.data.datasets[1].hidden = false;
        myChart.data.datasets[2].hidden = false;
    } else {
        myChart.data.datasets[0].hidden = false;
        myChart.data.datasets[1].hidden = true;
        myChart.data.datasets[2].hidden = true;
    }
    
    myChart.update();
}

compareBtn.onclick = async function () {
    const dates = new FormData(formElem);
    let newDates = new FormData();



    for(const [key, date] of dates.entries()) {
        let pastDate = new Date(date);
        pastDate.setFullYear(pastDate.getFullYear() -1);
        newDates.append(key, pastDate.toISOString().split('T')[0]);
    }

    try {
        let data = await getJSONData('../app/chartdata.php', dates);
        updateChart(myChart, data);

        data = await getJSONData('../app/chartdata.php', newDates);
        console.log(data);
        addPrevYear(myChart, data);
    } catch (e) {
        console.log(e);
    }
}
