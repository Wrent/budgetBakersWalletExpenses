
"use strict";

define(function () {

    /**
     * Default Pie configuration.
     * @type {{header: {title: {text: string, fontSize: number, font: string}, subtitle: {text: string, color: string, fontSize: number, font: string}, titleSubtitlePadding: number}, footer: {text: string, color: string, fontSize: number, font: string, location: string}, size: {canvasHeight: number, canvasWidth: number, pieOuterRadius: string}, labels: {outer: {format: string, pieDistance: number}, mainLabel: {font: string}, percentage: {color: string, font: string, decimalPlaces: number}, value: {color: string, font: string}, lines: {enabled: boolean, color: string}, truncation: {enabled: boolean}}, effects: {pullOutSegmentOnClick: {effect: string, speed: number, size: number}}}}
     */
    var GRAPH_SETTINGS = {
        "header": {
            "title": {
                "text": "Expenses overview",
                "fontSize": 22,
                "font": "verdana"
            },
            "subtitle": {
                "text": "Click a graph segment to get details about this category during this period.",
                "color": "#999999",
                "fontSize": 10,
                "font": "verdana"
            },
            "titleSubtitlePadding": 12
        },
        "footer": {
            "text": "Source: BudgetBakers.com.",
            "color": "#999999",
            "fontSize": 11,
            "font": "open sans",
            "location": "bottom-center"
        },
        "size": {
            "canvasHeight": 500,
            "canvasWidth": 500,
            "pieOuterRadius": "88%"
        },
        "labels": {
            "outer": {
                "format": "label-value2",
                "pieDistance": 32
            },
            "mainLabel": {
                "font": "verdana"
            },
            "percentage": {
                "color": "#e1e1e1",
                "font": "verdana",
                "decimalPlaces": 0
            },
            "value": {
                "color": "black",
                "font": "verdana"
            },
            "lines": {
                "enabled": true,
                "color": "#cccccc"
            },
            "truncation": {
                "enabled": true
            }
        },
        "effects": {
            "pullOutSegmentOnClick": {
                "effect": "linear",
                "speed": 400,
                "size": 15
            }
        }
    };

    return {
        GRAPH_SETTINGS: GRAPH_SETTINGS
    }

});