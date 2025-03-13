const apimock = (function () {
    const mockdata = [];

    mockdata["johnconnor"] = [
        { author: "johnconnor", points: [{ x: 150, y: 120 }, { x: 215, y: 115 }], name: "house" },
        { author: "johnconnor", points: [{ x: 340, y: 240 }, { x: 15, y: 215 }], name: "gear" },
        { author: "johnconnor", points: [{ x: 400, y: 300 }, { x: 200, y: 250 }], name: "bridge" }
    ];

    mockdata["maryweyland"] = [
        { author: "maryweyland", points: [{ x: 140, y: 140 }, { x: 115, y: 115 }], name: "house2" },
        { author: "maryweyland", points: [{ x: 140, y: 140 }, { x: 115, y: 115 }], name: "gear2" },
        { author: "maryweyland", points: [{ x: 220, y: 180 }, { x: 310, y: 170 }], name: "tower" }
    ];

    mockdata["santiagosilva"] = [
        { author: "santiagosilva", points: [{ x: 100, y: 200 }, { x: 150, y: 250 }], name: "roadmap" },
        { author: "santiagosilva", points: [{ x: 50, y: 50 }, { x: 75, y: 80 }], name: "park" },
        { author: "santiagosilva", points: [{ x: 200, y: 220 }, { x: 250, y: 270 }], name: "school" },
        { author: "santiagosilva", points: [{ x: 100, y: 200 }, { x: 200, y: 200 },  { x: 200, y: 300 }, { x: 100, y: 300 }, { x: 100, y: 200 }, { x: 100, y: 200 }, { x: 150, y: 150 }, { x: 200, y: 200 }],name: "House"}
    ];

    mockdata["santiagocordoba"] = [
        { author: "santiagocordoba", points: [{ x: 150, y: 30 }, { x: 120, y: 45}], name: "road" },
        { author: "santiagocordoba", points: [{ x: 180, y: 90 }, { x: 200, y: 120 }], name: "LeBronTheGoat" }
    ];

    return {
        getBlueprintsByAuthor: function (authname, callback) {
            console.log("Buscando planos de:", authname); 
            callback(mockdata[authname] || []);
        },

        getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
            if (mockdata[authname]) {
                callback(mockdata[authname].find(function (e) { return e.name === bpname }) || null);
            } else {
                callback(null);
            }
        }
    };
})();