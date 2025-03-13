const apiclient = (function () {
    const API_URL = "http://localhost:8080/blueprints";

    return {
        getBlueprintsByAuthor: function (authname, callback) {
            console.log("Obteniendo planos de:", authname);
            $.get(`${API_URL}/${authname}`)
                .done(function (data) {
                    callback(data);
                })
                .fail(function (error) {
                    console.error("Error obteniendo planos del autor:", error);
                    callback([]);
                });
        },

        getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
            console.log(`Obteniendo plano '${bpname}' del autor '${authname}'`);
            $.get(`${API_URL}/${authname}/${bpname}`)
                .done(function (data) {
                    callback(data);
                })
                .fail(function (error) {
                    console.error("Error obteniendo el plano:", error);
                    callback(null);
                });
        }
    };
})();
