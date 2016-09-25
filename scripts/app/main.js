
"use strict";


require(["app/wallet", "jquery", "jquery-ui.min", "jquery-slider"], function (wallet, $) {

    //init the data and the app
    wallet.updateBalance();
    wallet.getCategories();
    wallet.getCurrencies();
    wallet.getRecords();

    //init the slider
    $("#slider").dateRangeSlider();

    //set the slider button
    $("#setToLastMonth").click(function() {
        console.log("clicked");
        wallet.setSliderToLastMonth();
    });

    //segments click handling
    $(document).click(function() {
        if(wallet.getPie().getOpenSegment()) {
            wallet.getPie().closeSegment();
            wallet.showRecords();
        }
    });
    $("#pieChart").click(function (e) {
        e.stopPropagation();
    });

});