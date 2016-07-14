/**
 * Created by akucera on 7/14/16.
 */

//api key
var api_key = GLOBAL_API_KEY;
data = {};
pieData = {};

function sendRequest(target, onReadyFunction) {
    //create the request
    var request = new XMLHttpRequest();

    request.open('GET', target);
    request.setRequestHeader('X-User', 'adam.kucera@wrent.cz');
    request.setRequestHeader('X-Token', api_key);
    request.onreadystatechange = onReadyFunction;

    request.send();
}

function updateBalance() {
    sendRequest('https://api.budgetbakers.com/api/v1/balance',
        function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    balance = JSON.parse(this.responseText).amount;
                }
                $("#balance").text(balance);
            }
        });
}


function getCategories() {
    sendRequest('https://api.budgetbakers.com/api/v1/categories',
        function () {
            if (this.readyState === 4) {
                var categories = JSON.parse(this.responseText);

                $.each(categories, function(i, object) {
                    data[object.id] = {
                        label: object.name,
                        color: object.color,
                        id: object.id,
                        records: []
                    }
                });
            }
        });
}


function getRecords() {
    sendRequest('https://api.budgetbakers.com/api/v1/records',
        function () {
            if (this.readyState === 4) {
                var records = JSON.parse(this.responseText);

                $.each(records, function(i, object) {
                    var record = {
                        date: object.date,
                        amount: object.amount,
                        note: object.note,
                        paymentType: object.paymentType
                    };
                    if (data[object.categoryId] != undefined) {
                        data[object.categoryId].records.push(record);
                    }
                });
                console.log(data);
                preparePieData();
            }
        });
}

function preparePieData() {
    pieData.content = [];

    for (var category in data) {
        var datum = {
            label: data[category].label,
            color: data[category].color
        };
        var sum = 0;
        $.each(data[category].records, function(i, record) {
           //we will exclude income
            if (record.amount < 0) {
                sum += Math.abs(record.amount);
            }
        });
        datum.value = Math.round(sum);
        pieData.content.push(datum);
    }
    GLOBAl_GRAPH_SETTINGS.data = pieData;
    console.log(GLOBAl_GRAPH_SETTINGS);
    pie = new d3pie("pieChart", GLOBAl_GRAPH_SETTINGS);
}
