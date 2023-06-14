function parseCalendar(jsonDoc) {
    var description = new Array();
    var openDays = new Array();
    var fromHour = new Array();
    var toHour = new Array();
    if (jsonDoc.day instanceof Array) {
        $.each(jsonDoc.day, function(i, v) {
            openDays.push(v.date.substring(0, 10));

            fromHour = [];
            toHour = [];

            if (v.hour instanceof Array) {
                $.each(v.hour, function(j, w) {
                    fromHour.push(w.from);
                    toHour.push(w.to);
                })
            } else {
                fromHour.push(v.hour.from);
                toHour.push(v.hour.to);
            }

            var hoursDescription = "\nFrom: ";
            var arrayLength = fromHour.length;
            for (var ix = 0; ix < arrayLength; ix++) {
                hoursDescription = hoursDescription + fromHour.shift() + " To: " + toHour.shift() + "\nFrom: ";
            }
            var workDesc = "Open: " + v.day_of_week.desc + hoursDescription;
            var n = workDesc.length;
            description.push(workDesc.substring(0, n - 6));
        });
    } else {
        openDays.push(jsonDoc.day.date.substring(0, 10));

        fromHour = [];
        toHour = [];

        if (jsonDoc.day.hour instanceof Array) {
            $.each(jsonDoc.day.hour, function(j, w) {
                fromHour.push(w.from);
                toHour.push(w.to);
            })
        } else {
            fromHour.push(jsonDoc.day.hour.from);
            toHour.push(jsonDoc.day.hour.to);
        }

        var hoursDescription = "\nFrom: ";
        var arrayLength = fromHour.length;
        for (var ix = 0; ix < arrayLength; ix++) {
            hoursDescription = hoursDescription + fromHour.shift() + " To: " + toHour.shift() + "\nFrom: ";
        }
        var workDesc = "Open: " + jsonDoc.day.day_of_week["-desc"] + hoursDescription;
        var n = workDesc.length;
        description.push(workDesc.substring(0, n - 6));
    }

    var events = [];
    for (var i = 0; i < openDays.length; i++) {
        events.push({
            title: description[i],
            start: openDays[i]
        })
    }

    return events;
}


$(document).ready(function() {

    $.getJSON("https://api-eu.hosted.exlibrisgroup.com/proxy_add_cors?dest=https%3A%2F%2Fapi-eu.hosted.exlibrisgroup.com%2Falmaws%2Fv1%2Fconf%2Flibraries%2FMAIN%2Fopen-hours%3Fapikey%3Dl7xx08b23ba160004847a2e95b79ca5d0cf2%26format%3Djson",
        function(json) {
            var events = parseCalendar(json);

            $('#calendar').fullCalendar({
                header: {
                    left: 'title',
                    center: '',
                    right: 'prev,next prevYear,nextYear today'
                },
                titleFormat: 'MMMM YYYY',

                eventLimit: true, // allow "more" link when too many events

                events: events

            });

            var d = new Date("June 1, 2023 1:00:00");
            $('#calendar').fullCalendar('gotoDate', d);
        });
});