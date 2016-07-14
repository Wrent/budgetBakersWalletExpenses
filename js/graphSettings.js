/**
 * Created by akucera on 7/14/16.
 */

var GLOBAl_GRAPH_SETTINGS = {
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
        "canvasHeight": 600,
        "canvasWidth": 900,
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
            "size": 8
        }
    }
};