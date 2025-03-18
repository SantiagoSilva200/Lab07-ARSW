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
        },

        createBlueprint: function (blueprintData) {
            return $.ajax({
                url: `${API_URL}`,
                type: 'POST',
                data: JSON.stringify(blueprintData), 
                contentType: "application/json"
            });
        },

        updateBlueprint: function (blueprintData) {
            return $.ajax({
                url: `${API_URL}/${blueprintData.author}/${blueprintData.name}`,
                type: 'PUT',
                data: JSON.stringify(blueprintData), 
                contentType: "application/json"
            });
        },

        deleteBlueprint: function (author, blueprintName) {
            return $.ajax({
                url: `${API_URL}/${author}/${blueprintName}`,
                type: 'DELETE',
                contentType: "application/json"
            });
        }
    };
})();