import * as Canvas from 'canvas';

export function createCanvas() : HTMLCanvasElement {
    return new Canvas();
}

export function createImage() : HTMLImageElement {
    let image = new Canvas.Image();

    image.eventListener = {
        load: [],
        error: []
    };

    image.addEventListener = function(event: string, callback: (err: Error) => void) {
        image.eventListener[event].push(callback);
    };

    image.onload = function() {
        image.eventListener.load.forEach(callback => {
            callback();
        });
    }

    image.onerror = function(err) {
        image.eventListener.error.forEach(callback => {
            callback(err);
        });
    }

    return image;
}
