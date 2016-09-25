
"use strict";

define(["app/graphSettings", "app/API_SETTINGS", "app/utils", "d3pie.min", "jquery", "jquery-ui.min", "jquery-slider"], function (graphSettings, API_KEY, utils, d3pie, $) {

    //api key
    var api_key = API_KEY.API_KEY;
    var balance;
    var pie;
    var data = {};
    var curr = {};
    var pieData = {};
    var recordsInRange = {};
    var minDate = new Date();
    var today = minDate;

    /**
     * Updates the app to the current balance.
     */
    function updateBalance() {
        _sendRequest('https://api.budgetbakers.com/api/v1/balance',
            function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        balance = JSON.parse(this.responseText).amount;
                    }
                    $("#balance").text(Math.round(balance) + " " + _getReferentialCurrencyCode());
                }
            });
    }

    /**
     * Loads categories from the API.
     */
    function getCategories() {
        _sendRequest('https://api.budgetbakers.com/api/v1/categories',
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

    /**
     * Loads currencies from the API.
     */
    function getCurrencies() {
        _sendRequest('https://api.budgetbakers.com/api/v1/currencies',
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
            });
    }

    /**
     * Loads records from the API.
     */
    function getRecords() {
        _sendRequest('https://api.budgetbakers.com/api/v1/records',
            function () {
                if (this.readyState === 4) {
                    var records = JSON.parse(this.responseText);

                    $.each(records, function(i, object) {
                        var record = {
                            date: utils.parseDate(object.date),
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
                    _showDataPort();
                    _setSlider();
                    _preparePieData();
                    showRecords();
                }
            });
    }

    /**
     * Shows records in the table.
     * @param filterCategory are we viewing just one cathegory?
     */
    function showRecords(filterCategory) {

        recordsInRange.sort(utils.sortByDate);

        $("#records").find('tbody').empty();
        $.each(recordsInRange, function(i, record) {
            if (typeof filterCategory === 'undefined' || filterCategory == record.category.label) {
                $("#records").find('tbody:last-child')
                    .append($('<tr>').css("background-color", utils.shadeRGBColor(record.category.color, 0.4))
                        .append($('<td>')
                            .append(utils.printFormattedDateTime(record.date))
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

    /**
     * Function called when the button is clicked, sets the slider to last month.
     */
    function setSliderToLastMonth() {
        var monthBefore = new Date(today.getTime());
        monthBefore.setMonth(monthBefore.getMonth() - 1);
        $("#slider").dateRangeSlider("values", monthBefore, today);
    }

    /**
     * Private function sending requests to the API.
     * @param target API target
     * @param onReadyFunction which function call when it is ready
     * @private
     */
    function _sendRequest(target, onReadyFunction) {
        //create the request
        var request = new XMLHttpRequest();

        request.open('GET', target);
        request.setRequestHeader('X-User', 'adam.kucera@wrent.cz');
        request.setRequestHeader('X-Token', api_key);
        request.onreadystatechange = onReadyFunction;

        request.send();
    };

    /**
     * Iterates through currencies and finds which one is referential.
     * @returns {string}
     * @private
     */
    function _getReferentialCurrencyCode() {
        var code = "Unknown currency";
        $.each(curr, function(i, object) {
            if (object.referential) {
                code = object.code;
            }
        });
        return code;
    }

    /**
     * Creates the pie chart.
     * @private
     */
    function _preparePieData() {
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

                if (_includeRecord(record.date)) {
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
        graphSettings.GRAPH_SETTINGS.data = pieData;
        $("#periodSum").text(Math.round(totalSum));
        graphSettings.GRAPH_SETTINGS.callbacks = {};
        graphSettings.GRAPH_SETTINGS.callbacks.onClickSegment = _onClickSegment;
        pie = new d3pie("pieChart", graphSettings.GRAPH_SETTINGS);
    }

    /**
     * Function which is called when a segment is clicked.
     * @param segmentData data from clicked segment.
     * @private
     */
    function _onClickSegment(segmentData) {
        showRecords(segmentData.data.label);
    }

    /**
     * Inits the slider from the data.
     * @private
     */
    function _setSlider() {
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
                valueLabels: "change",
                formatter: function(val){
                    val = new Date(val);
                    return utils.printFormattedDate(val);
                }
        });
        setSliderToLastMonth();

        $("#slider").on("valuesChanged", function(e, data) {
            pie.destroy();
            _preparePieData();
            showRecords();
            $("#periodStart").text(utils.printFormattedDate($("#slider").dateRangeSlider("values").min));
            $("#periodEnd").text(utils.printFormattedDate($("#slider").dateRangeSlider("values").max));
        })
    };

    /**
     * Decisive function to determine whether to include record into the view.
     * @param date date of the record
     * @returns {boolean}
     * @private
     */
    function _includeRecord(date) {
        var values = $("#slider").dateRangeSlider("values");
        if (date <= values.max && date >= values.min) {
            return true;
        }
        return false;
    }


    function _showDataPort() {
        $("#dataPort").show();
        $("#loadingPlaceholder").hide();
    }

    function getPie() {
        return pie;
    }

    return {
        updateBalance: updateBalance,
        getCategories: getCategories,
        getCurrencies: getCurrencies,
        getRecords: getRecords,
        showRecords: showRecords,
        getPie: getPie,
        setSliderToLastMonth: setSliderToLastMonth
    };
});