/**
 * Created by akucera on 9/25/16.
 */

requirejs.config({
    baseUrl: 'scripts/lib',
    paths: {
        app: '../app'
    },
    shim: {
        "jquery-ui.min": ["jquery"],
        "jquery-slider": ["jquery", "jquery-ui.min"]
    }
});
requirejs(['app/main']);