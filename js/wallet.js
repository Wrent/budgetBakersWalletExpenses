/**
 * Created by akucera on 7/14/16.
 */

//api key
var api_key = GLOBAL_API_KEY;
data = {};
pieData = {};
minDate = new Date();
today = minDate;

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
                        date: parseDate(object.date),
                        amount: object.amount,
                        note: object.note,
                        paymentType: object.paymentType
                    };

                    if (record.date < minDate) {
                        minDate = record.date;
                    }

                    if (data[object.categoryId] != undefined) {
                        data[object.categoryId].records.push(record);
                    }
                });
                console.log(data);
                preparePieData();
                setSlider();
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

function setSlider() {
    $("#slider").dateRangeSlider(
        "option", {
            bounds: {
                min: minDate,
                max: today
            },
            range: {
                min: {
                    days: 7
                }
            }
    });
    setSliderToLastMonth();
}

function parseDate(dateString) {
    var re = /^([\d]{4})-([\d]{2})-([\d]{2})T([\d]{2}):([\d]{2})/;
    var m;

    if ((m = re.exec(dateString)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        // View your result using the m-variable.
        // eg m[0] etc.
    }

    var date = new Date(m[1], m[2] - 1, m[3], m[4], m[5]);
    return date;
}

function setSliderToLastMonth() {
    var monthBefore = new Date(today.getTime());
    monthBefore.setMonth(monthBefore.getMonth() - 1);
    $("#slider").dateRangeSlider("values", monthBefore, today);
}