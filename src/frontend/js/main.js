// Simple function to retrieve the data that is going to be represented by the charts.
// url: URL which returns the data in JSON format
// data: optional parameters to provide data in the body of the POST request

async function getChartData(url, data) {
    return (await fetch(url,
        {
            method: 'POST',
            body: data
        })).json();
}

// Function will be executed as soon as the page starts to load
window.onload = async function () {
    try {

        // Here we request all the necessary data for the charts that we want to create

        let ytdData = await getChartData('../../app/ab_yeartodate.php', null);
        console.log(ytdData);
        let ytdData_i = await getChartData('../../app/ab_yeartodate_i.php', null);
        console.log(ytdData_i);
        let qtdData = await getChartData('../../app/ab_quartertodate.php', null);
        console.log(qtdData);
        let qtdData_i = await getChartData('../../app/ab_quartertodate_i.php', null);
        console.log(qtdData_i);
        let mtdData = await getChartData('../../app/ab_monthtodate.php', null);
        console.log(mtdData);
        let mtdData_i = await getChartData('../../app/ab_monthtodate_i.php', null);
        console.log(mtdData_i);
        let dData = await getChartData('../../app/ab_date.php', null);
        console.log(dData);

        // Gets all elements which are part of the "date" class
        // für Datum in HTML Tabelle
        const dates = document.querySelectorAll('.date');

        // Fills the tables which are positioned over the charts.

        document.getElementById('AB_YTD_amount').innerHTML = new Intl.NumberFormat().format(ytdData.amount.at(-1));
        document.getElementById('AB_YTD_amount_prev').innerHTML = new Intl.NumberFormat().format(ytdData.amount_prev.at(-1));
        document.getElementById('AB_YTD_sales').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ytdData.sales.at(-1));
        document.getElementById('AB_YTD_sales_prev').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ytdData.sales_prev.at(-1));
        // TODO: Change Data
        document.getElementById('AB_YTD_sales_i').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ytdData_i.sales.at(-1));
        document.getElementById('AB_YTD_sales_prev_i').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ytdData_i.sales_prev.at(-1));

        document.getElementById('AB_MTD_amount').innerHTML = new Intl.NumberFormat().format(mtdData.amount.at(-1));
        document.getElementById('AB_MTD_amount_prev').innerHTML = new Intl.NumberFormat().format(mtdData.amount_prev.at(-1));
        document.getElementById('AB_MTD_sales').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(mtdData.sales.at(-1));
        document.getElementById('AB_MTD_sales_prev').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(mtdData.sales_prev.at(-1));

        document.getElementById('AB_MTD_sales_i').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(mtdData_i.sales.at(-1));
        document.getElementById('AB_MTD_sales_prev_i').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(mtdData_i.sales_prev.at(-1));

        document.getElementById('AB_D_amount').innerHTML = new Intl.NumberFormat().format(dData.amount.at(-1));
        document.getElementById('AB_D_amount_prev').innerHTML = new Intl.NumberFormat().format(dData.amount_prev.at(-1));
        document.getElementById('AB_D_sales').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(dData.sales.at(-1));
        document.getElementById('AB_D_sales_prev').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(dData.sales_prev.at(-1));

        document.getElementById('AB_QTD_amount').innerHTML = new Intl.NumberFormat().format(qtdData.amount.at(-1));
        document.getElementById('AB_QTD_amount_prev').innerHTML = new Intl.NumberFormat().format(qtdData.amount_prev.at(-1));
        document.getElementById('AB_QTD_sales').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(qtdData.sales.at(-1));
        document.getElementById('AB_QTD_sales_prev').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(qtdData.sales_prev.at(-1));
        document.getElementById('AB_QTD_sales_i').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(qtdData_i.sales.at(-1));
        document.getElementById('AB_QTD_sales_prev_i').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(qtdData_i.sales_prev.at(-1));
        
        // für Marge in HTML Tabelle
        const marge = document.querySelectorAll('.marge');
        document.getElementById('AB_YTD_marge').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ytdData.marge.at(-1));
        document.getElementById('AB_YTD_marge_prev').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ytdData.marge_prev.at(-1));
     
        document.getElementById('AB_YTD_marge_i').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ytdData_i.marge.at(-1));
        document.getElementById('AB_YTD_marge_prev_i').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ytdData_i.marge_prev.at(-1));
        
        document.getElementById('AB_MTD_marge').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(mtdData.marge.at(-1));
        document.getElementById('AB_MTD_marge_prev').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(mtdData.marge_prev.at(-1));

        document.getElementById('AB_MTD_marge_i').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(mtdData_i.marge.at(-1));
        document.getElementById('AB_MTD_marge_prev_i').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(mtdData_i.marge_prev.at(-1));

        document.getElementById('AB_D_marge').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(dData.marge.at(-1));
        document.getElementById('AB_D_marge_prev').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(dData.marge_prev.at(-1));

        document.getElementById('AB_QTD_marge').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(qtdData.marge.at(-1));
        document.getElementById('AB_QTD_marge_prev').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(qtdData.marge_prev.at(-1));

        document.getElementById('AB_QTD_marge_i').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(qtdData_i.marge.at(-1));
        document.getElementById('AB_QTD_marge_prev_i').innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(qtdData_i.marge_prev.at(-1));

        // Generates a string with the current date and time
        // generiert Uhrzeit in HTML Tabelle
        let today = new Date();
        let datum = "Datum: " + ('0' + today.getDate()).slice(-2) + '.' + ('0' + (today.getMonth() + 1)).slice(-2) + '.' + today.getFullYear();
        let zeit = ('0' + today.getHours()).slice(-2) + ':' + ('0' + today.getMinutes()).slice(-2)
        dates.forEach(date => {
            date.innerHTML = datum + '&nbsp &nbsp &nbsp &nbsp' + zeit;
        });


        // Chart 1: Amount of Products (YTD)

        // Here we create the necessary parts which make up a chart.
        // For a chart we always create the objects labels, data and config and then
        // we pass all the information to the constructor.
        let labels1 = ytdData.labels;

        let data1 = {
            labels: labels1,
            datasets: [{
                label: 'aktuelles Jahr',
                backgroundColor: '#225947',
                borderColor: '#225947',
                tension: 0.1,
                fill: false,
                data: ytdData.amount,
            }, {
                label: 'Vorjahr',
                backgroundColor: '#FB8937',
                borderColor: '#FB8937',
                tension: 0.1,
                fill: false,
                data: ytdData.amount_prev,
            },
            ]
        };

        let config1 = {
            type: 'line',
            data: data1,
            options: {
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                let label = context[0].label;
                                return "KW " + label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'KW',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Anzahl',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    }
                }
            },

        };

        let myChart1 = new Chart(
            document.getElementById('AB-amount-YTD'),
            config1
        )

        // Chart 2: Sales (YTD)

        let labels2 = ytdData.labels;

        let data2 = {
            labels: labels2,
            datasets: [{
                label: 'aktuelles Jahr',
                backgroundColor: '#225947',
                borderColor: '#225947',
                tension: 0.1,
                fill: false,
                data: ytdData.sales,
            }, {
                label: 'Vorjahr',
                backgroundColor: '#FB8937',
                borderColor: '#FB8937',
                tension: 0.1,
                fill: false,
                data: ytdData.sales_prev,
            }],
        };

        let config2 = {
            type: 'line',
            data: data2,
            options: {
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                let label = context[0].label;
                                return "KW " + label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'KW',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Umsatz',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    }
                }
            }
        };

        let myChart2 = new Chart(
            document.getElementById('AB-sales-YTD'),
            config2
        )

        // Chart 2.1 invoiced(YTD)
        let labels2_i = ytdData_i.labels;

        let data2_i = {
            labels: labels2_i,
            datasets: [{
                label: 'aktuelles Jahr',
                backgroundColor: '#225947',
                borderColor: '#225947',
                tension: 0.1,
                fill: false,
                data: ytdData_i.sales,
            }, {
                label: 'Vorjahr',
                backgroundColor: '#FB8937',
                borderColor: '#FB8937',
                tension: 0.1,
                fill: false,
                data: ytdData_i.sales_prev,
            }],
        };

        let config2_i = {
            type: 'line',
            data: data2_i,
            options: {
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                let label = context[0].label;
                                return "KW " + label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'KW',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Umsatz',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    }
                }
            }
        };

        let myChart2_i = new Chart(
            document.getElementById('AB-sales-YTD_i'),
            config2_i
        )

        // Chart 3: Amount of Products (MTD)

        let labels3 = mtdData.labels;

        let data3 = {
            labels: labels3,
            datasets: [{
                label: 'aktueller Monat',
                backgroundColor: '#225947',
                borderColor: '#225947',
                tension: 0.1,
                fill: false,
                data: mtdData.amount,
            }, {
                label: 'Vorjahres Monat',
                backgroundColor: '#FB8937',
                borderColor: '#FB8937',
                tension: 0.1,
                fill: false,
                data: mtdData.amount_prev,
            },
            ]
        };

        let config3 = {
            type: 'line',
            data: data3,
            options: {
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                let label = context[0].label;
                                return label + '.' + ('0' + (today.getMonth() + 1)).slice(-2) + '.';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tag',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Anzahl',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    }
                }
            }
        };

        let myChart3 = new Chart(
            document.getElementById('AB-amount-MTD'),
            config3
        )

        // Chart 4: Sales (MTD)

        let labels4 = mtdData.labels;

        let data4 = {
            labels: labels4,
            datasets: [{
                label: 'aktueller Monat',
                backgroundColor: '#225947',
                borderColor: '#225947',
                tension: 0.1,
                fill: false,
                data: mtdData.sales,
            }, {
                label: 'Vorjahres Monat',
                backgroundColor: '#FB8937',
                borderColor: '#FB8937',
                tension: 0.1,
                fill: false,
                data: mtdData.sales_prev,
            },
            ]
        };

        let config4 = {
            type: 'line',
            data: data4,
            options: {
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                let label = context[0].label;
                                return label + '.' + ('0' + (today.getMonth() + 1)).slice(-2) + '.';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tag',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Umsatz',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    }
                }
            }
        };

        let myChart4 = new Chart(
            document.getElementById('AB-sales-MTD'),
            config4
        )

        // Chart 4: Sales (MTD)

        let labels4_i = mtdData_i.labels;

        let data4_i = {
            labels: labels4_i,
            datasets: [{
                label: 'aktueller Monat',
                backgroundColor: '#225947',
                borderColor: '#225947',
                tension: 0.1,
                fill: false,
                data: mtdData_i.sales,
            }, {
                label: 'Vorjahres Monat',
                backgroundColor: '#FB8937',
                borderColor: '#FB8937',
                tension: 0.1,
                fill: false,
                data: mtdData_i.sales_prev,
            },
            ]
        };

        let config4_i = {
            type: 'line',
            data: data4_i,
            options: {
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                let label = context[0].label;
                                return label + '.' + ('0' + (today.getMonth() + 1)).slice(-2) + '.';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tag',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Umsatz',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    }
                }
            }
        };

        let myChart4_i = new Chart(
            document.getElementById('AB-sales-MTD_i'),
            config4_i
        )

        // Chart 5: Amount of Products (D)

        let labels5 = dData.labels;

        let data5 = {
            labels: labels5,
            datasets: [{
                label: 'aktueller Tag',
                backgroundColor: '#225947',
                borderColor: '#225947',
                tension: 0.1,
                fill: false,
                data: dData.amount,
            }, {
                label: 'Vorjahres Tag',
                backgroundColor: '#FB8937',
                borderColor: '#FB8937',
                tension: 0.1,
                fill: false,
                data: dData.amount_prev,
            },
            ]
        };

        let config5 = {
            type: 'line',
            data: data5,
            options: {
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                let label = context[0].label;
                                return label + ' h';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Stunde',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Anzahl',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    }
                }
            }
        };

        let myChart5 = new Chart(
            document.getElementById('AB-amount-D'),
            config5
        )

        // Chart 6: Sales (D)

        let labels6 = dData.labels;

        let data6 = {
            labels: labels6,
            datasets: [{
                label: 'aktueller Tag',
                backgroundColor: '#225947',
                borderColor: '#225947',
                tension: 0.1,
                fill: false,
                data: dData.sales,
            }, {
                label: 'Vorjahres Tag',
                backgroundColor: '#FB8937',
                borderColor: '#FB8937',
                tension: 0.1,
                fill: false,
                data: dData.sales_prev,
            },
            ]
        };

        let config6 = {
            type: 'line',
            data: data6,
            options: {
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                let label = context[0].label;
                                return label + ' h';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Stunde',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Umsatz',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    }
                }
            }
        };

        let myChart6 = new Chart(
            document.getElementById('AB-sales-D'),
            config6
        )

        // Chart 7: Amount of Products (QTD)

        let labels7 = qtdData.labels;

        let data7 = {
            labels: labels7,
            datasets: [{
                label: 'aktueller Quartal',
                backgroundColor: '#225947',
                borderColor: '#225947',
                tension: 0.1,
                fill: false,
                data: qtdData.amount,
            }, {
                label: 'Vorjahres Quartal',
                backgroundColor: '#FB8937',
                borderColor: '#FB8937',
                tension: 0.1,
                fill: false,
                data: qtdData.amount_prev,
            },
            ]
        };

        let config7 = {
            type: 'line',
            data: data7,
            options: {
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tag',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Anzahl',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    }
                }
            }
        };

        let myChart7 = new Chart(
            document.getElementById('AB-amount-QTD'),
            config7
        )

        // Chart 8: Sales (QTD)

        let labels8 = qtdData.labels;

        let data8 = {
            labels: labels8,
            datasets: [{
                label: 'aktuelles Quartal',
                backgroundColor: '#225947',
                borderColor: '#225947',
                tension: 0.1,
                fill: false,
                data: qtdData.sales,
            }, {
                label: 'Vorjahres Quartal',
                backgroundColor: '#FB8937',
                borderColor: '#FB8937',
                tension: 0.1,
                fill: false,
                data: qtdData.sales_prev,
            },
            ]
        };

        let config8 = {
            type: 'line',
            data: data8,
            options: {
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tag',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Umsatz',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    }
                }
            }
        };

        let myChart8 = new Chart(
            document.getElementById('AB-sales-QTD'),
            config8
        )

        // Chart 8_1: Sales (QTD) invoiced

        let labels8_i = qtdData_i.labels;

        let data8_i = {
            labels: labels8_i,
            datasets: [{
                label: 'aktuelles Quartal',
                backgroundColor: '#225947',
                borderColor: '#225947',
                tension: 0.1,
                fill: false,
                data: qtdData_i.sales,
            }, {
                label: 'Vorjahres Quartal',
                backgroundColor: '#FB8937',
                borderColor: '#FB8937',
                tension: 0.1,
                fill: false,
                data: qtdData_i.sales_prev,
            },
            ]
        };

        let config8_i = {
            type: 'line',
            data: data8,
            options: {
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tag',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Umsatz',
                            font: {
                                weight: 'bold',
                                size: '14'
                            }
                        }
                    }
                }
            }
        };

        let myChart8_i = new Chart(
            document.getElementById('AB-sales-QTD_i'),
            config8_i
        )


    }
    catch (e) {
        console.log(e);
    }

    // Sets a time for reloading the website after 5 minutes.
    setTimeout(function () { location.reload(); }, 5 * 60000);

}

