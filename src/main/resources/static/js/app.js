const app = (function () {
    let author = "";  
    let blueprints = []; 

    function setAuthor(newAuthor) {
        author = newAuthor;
    }

    function getBlueprintsByAuthor(autor) {
        setAuthor(autor);

        apimock.getBlueprintsByAuthor(autor, function(data) {
            if (!data || data.length === 0) {
                alert("No se encontraron planos para el autor.");
                $("#blueprintsBody").empty();
                $("#totalPoints").text("0");
                $("#blueprintsTable").hide();
                $("#totalContainer").hide();
                $("#blueprintCanvas").hide();
                $("#blueprintName").hide();
                return;
            }

            blueprints = data.map(bp => ({
                name: bp.name,
                points: bp.points
            }));

            $("#selectedAuthor").text(author);
            $("#blueprintsBody").empty();

            blueprints.forEach(bp => {
                $("#blueprintsBody").append(
                    `<tr>
                        <td>${bp.name}</td>
                        <td>${bp.points.length}</td>
                        <td><button class="btn btn-info open-blueprint" data-name="${bp.name}">Abrir</button></td>
                    </tr>`
                );
            });

            let totalPoints = blueprints.reduce((sum, bp) => sum + bp.points.length, 0);
            $("#totalPoints").text(totalPoints);
            $("#blueprintsTable").show();
            $("#totalContainer").show();
        });
    }

    function drawBlueprint(blueprintName) {
        let blueprint = blueprints.find(bp => bp.name === blueprintName);
        if (!blueprint) {
            alert("No se encontraron datos del plano.");
            return;
        }

        let canvas = document.getElementById("blueprintCanvas");
        let ctx = canvas.getContext("2d");

        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar líneas entre los puntos
        if (blueprint.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(blueprint.points[0].x, blueprint.points[0].y);

            for (let i = 1; i < blueprint.points.length; i++) {
                ctx.lineTo(blueprint.points[i].x, blueprint.points[i].y);
            }

            ctx.strokeStyle = "blue";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        $("#blueprintName").text(`Plano: ${blueprintName}`).show();
        $("#blueprintCanvas").show();
    }

    $(document).on("click", ".open-blueprint", function () {
        let blueprintName = $(this).data("name");
        drawBlueprint(blueprintName);
    });

    return {
        getBlueprintsByAuthor: getBlueprintsByAuthor
    };
})();

$(document).ready(function () {
    $("#getBlueprints").click(function () {
        let authorName = $("#authorName").val().trim();
        if (authorName) {
            app.getBlueprintsByAuthor(authorName);
        } else {
            alert("Por favor, ingrese un nombre de autor.");
        }
    });
});
