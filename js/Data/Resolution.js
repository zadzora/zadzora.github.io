const Resolution = {
    RESOLUTION_SCALE: 1,
    SCALE_MODE: 'SMOOTH', // FIT OR SMOOTH
};

Object.defineProperty(Resolution, "DEFAULT_WIDTH", {
    get : function () { return 1800 * this.RESOLUTION_SCALE },
});
Object.defineProperty(Resolution, "MAX_WIDTH", {
    get : function () {
        var tmp = 3840;
        if(!game.device.os.desktop)  tmp = 2650; //2650
        return tmp
    },
});
Object.defineProperty(Resolution, "DEFAULT_HEIGHT", {
    get : function () { return 1080 },
});

Object.defineProperty(Resolution, "MAX_HEIGHT", {
    get : function () { return 1080 },
});