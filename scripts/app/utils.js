
define(function() {

    /**
     * Sorting function for dates.
     * @param a
     * @param b
     * @returns {number}
     */
    function sortByDate(a, b){
        var aDate = a.date;
        var bDate = b.date;
        return ((aDate < bDate) ? 1 : ((aDate > bDate) ? -1 : 0));
    }

    /**
     * Parses the data string from the API
     * @param dateString string from API
     * @returns {Date}
     * @private
     */
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

    /**
     * Prints date in App format.
     * @param val
     * @returns {string}
     */
    function printFormattedDate(val) {
        var days = val.getDate(),
            month = val.getMonth() + 1,
            year = val.getFullYear();
        return days + ". " + month + ". " + year;
    }

    /**
     * Prints date and time in App format.
     * @param val
     * @returns {string}
     */
    function printFormattedDateTime(val) {
        var hours = val.getHours() < 10 ? "0" + val.getHours() : val.getHours(),
            minutes = val.getMinutes()< 10 ? "0" + val.getMinutes() : val.getMinutes();
        return printFormattedDate(val) + " " + hours + ":" + minutes;
    }

    /**
     * Function to make our colors lighter.
     * from http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
     * @param color
     * @param percent
     * @returns {string}
     */
    function shadeRGBColor(color, percent) {
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    }


    return {
        sortByDate: sortByDate,
        parseDate: parseDate,
        printFormattedDate: printFormattedDate,
        printFormattedDateTime: printFormattedDateTime,
        shadeRGBColor: shadeRGBColor
    }

});