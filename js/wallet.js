/**
 * Created by akucera on 7/14/16.
 */

//api key
var api_key = GLOBAL_API_KEY;
data = {};
curr = {};
pieData = {};
recordsInRange = {};
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
                $("#balance").text(balance + " " + getReferentialCurrencyCode());
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

function getCurrencies() {
    sendRequest('https://api.budgetbakers.com/api/v1/currencies',
        function () {
            if (this.readyState === 4) {
                var currencies = JSON.parse(this.responseText);

                $.each(currencies, function(i, object) {
                    curr[object.id] = {
                        code: object.code,
                        referential: object.referential,
                        ratioToReferential: object.ratioToReferential
                    }
                });
            }
            console.log(curr);
        });
}

function getReferentialCurrencyCode() {
    var code = "Unknown currency";
    $.each(curr, function(i, object) {
        if (object.referential) {
            code = object.code;
        }
    });
    return code;
}


function getRecords() {
    sendRequest('https://api.budgetbakers.com/api/v1/records',
        function () {
            if (this.readyState === 4) {
                var records = JSON.parse(this.responseText);

                $.each(records, function(i, object) {
                    var record = {
                        date: parseDate(object.date),
                        amount: object.amount * 1/curr[object.currencyId].ratioToReferential,
                        note: object.note,
                        paymentType: object.paymentType,
                    };


                    if (record.date < minDate) {
                        minDate = record.date;
                    }

                    if (data[object.categoryId] != undefined) {
                        data[object.categoryId].records.push(record);
                    }
                });
                console.log(data);
                setSlider();
                preparePieData();
                showRecords();
            }
        });
}

function showRecords(filterCategory) {


    recordsInRange.sort(SortByDate);

    $("#records").find('tbody').empty();
    $.each(recordsInRange, function(i, record) {
        if (typeof filterCategory === 'undefined' || filterCategory == record.category.label) {
            $("#records").find('tbody:last-child')
                .append($('<tr>').css("background-color", shadeRGBColor(record.category.color, 0.4))
                    .append($('<td>')
                        .append(printFormattedDateTime(record.date))
                    )
                    .append($('<td>')
                        .append(record.category.label)
                    )
                    .append($('<td>')
                        .append(record.note)
                    )
                    .append($('<td>')
                        .append(record.amount)
                    )
                    .append($('<td>')
                        .append(record.paymentType)
                    )
                );
        }
    });
}

function SortByDate(a, b){
    var aDate = a.date;
    var bDate = b.date;
    return ((aDate < bDate) ? 1 : ((aDate > bDate) ? -1 : 0));
}


function preparePieData() {
    pieData.content = [];
    recordsInRange = [];
    var totalSum = 0;

    for (var category in data) {
        var datum = {
            label: data[category].label,
            color: data[category].color
        };
        var sum = 0;
        $.each(data[category].records, function(i, record) {

            if (includeRecord(record.date)) {
                record.category = datum;
                recordsInRange.push(record);
                //we will exclude income for the graph
                if (record.amount < 0) {
                    sum += Math.abs(record.amount);
                }
            }

        });
        datum.value = Math.round(sum);
        totalSum += sum;
        pieData.content.push(datum);
    }
    GLOBAl_GRAPH_SETTINGS.data = pieData;
    console.log(GLOBAl_GRAPH_SETTINGS);
    $("#periodSum").text(totalSum);
    GLOBAl_GRAPH_SETTINGS.callbacks = {};
    GLOBAl_GRAPH_SETTINGS.callbacks.onClickSegment = onClickSegment;
    pie = new d3pie("pieChart", GLOBAl_GRAPH_SETTINGS);
}

function onClickSegment(segmentData) {
    showRecords(segmentData.data.label);
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
            },
            formatter: function(val){
                val = new Date(val);
                printFormattedDate(val);
            }
    });
    setSliderToLastMonth();

    $("#slider").on("valuesChanged", function(e, data) {
        pie.destroy();
        preparePieData();
        showRecords();
    })
}

function parseDate(dateString) {
    var re = /^([\d]{4})-([\d]{2})-([\d]{2})T([\d]{2}):([\d]{2})/;
    var m;

    if ((m = re.exec(dateString)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
    }

    var date = new Date(m[1], m[2] - 1, m[3], m[4], m[5]);
    return date;
}

function setSliderToLastMonth() {
    var monthBefore = new Date(today.getTime());
    monthBefore.setMonth(monthBefore.getMonth() - 1);
    $("#slider").dateRangeSlider("values", monthBefore, today);
}

function includeRecord(date) {
    var values = $("#slider").dateRangeSlider("values");
    if (date <= values.max && date >= values.min) {
        return true;
    }
    return false;
}

function printFormattedDate(val) {
    var days = val.getDate(),
        month = val.getMonth() + 1,
        year = val.getFullYear();
    return days + ". " + month + ". " + year;
}

function printFormattedDateTime(val) {
    var hours = val.getHours() < 10 ? "0" + val.getHours() : val.getHours(),
        minutes = val.getMinutes()< 10 ? "0" + val.getMinutes() : val.getMinutes();
    return printFormattedDate(val) + " " + hours + ":" + minutes;
}


//from http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeRGBColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}