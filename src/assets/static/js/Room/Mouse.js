class MouseClass {
    mouseCoordinate(event, axis) {
        var property = (axis == "X") ? "scrollLeft" : "scrollTop";
        if (event.pageX) {
            return event["page"+axis];
        } else {
            return event["client"+axis] + (document.documentElement[property] ? document.documentElement[property] : document.body[property]);;
        }
    };

    getCursorToPixel(canvas, coordinate) {
        var rect = canvas.getBoundingClientRect();
        var x = coordinate - (rect.left + window.scrollX);
        var y = coordinate - (rect.top + window.scrollY);

        return {
            x: x,
            y: y
        }
    }

    getCursorToCanvas(canvas, evt) {
        var rect = canvas.getBoundingClientRect();

        if(evt.touches) {
            evt = evt.touches[0];
        }

        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    getCursorToCanvasCoordinate(canvas, coordinate) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: coordinate - rect.left,
            y: coordinate - rect.top
        };
    }
}