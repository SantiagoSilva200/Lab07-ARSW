const app = (function () {
    let author = "";
    let blueprints = [];
    let clickCount = 0;
    let currentBlueprintName = null;

    const api = apiclient;

    function setAuthor(newAuthor) {
        author = newAuthor;
    }

    function getBlueprintsByAuthor(autor) {
        setAuthor(autor);

        api.getBlueprintsByAuthor(autor, function(data) {
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

        currentBlueprintName = blueprintName;

        let canvas = document.getElementById("blueprintCanvas");
        let ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    function setupCanvasEventListeners() {
        let canvas = document.getElementById("blueprintCanvas");
        if (canvas) {
            canvas.addEventListener("pointerdown", function(event) {
                if (!currentBlueprintName) {
                    alert("No hay un plano abierto.");
                    return;
                }

                let rect = canvas.getBoundingClientRect();
                let x = event.clientX - rect.left;
                let y = event.clientY - rect.top;
                console.log(`Click en: (${x}, ${y})`);

                clickCount++;
                $("#clickCounter").text(clickCount);

                let blueprint = blueprints.find(bp => bp.name === currentBlueprintName);
                if (blueprint) {
                    blueprint.points.push({ x: x, y: y });
                    drawBlueprint(currentBlueprintName);
                }
            });
        }
    }

    $(document).on("click", ".open-blueprint", function () {
        let blueprintName = $(this).data("name");

        clickCount = 0;
        $("#clickCounter").text(clickCount);

        drawBlueprint(blueprintName);
    });

    $(document).on("click", "#SaveUp", function () {
        if (!currentBlueprintName) {
            alert("No hay un plano abierto.");
            return;
        }

        let blueprint = blueprints.find(bp => bp.name === currentBlueprintName);
        if (!blueprint) {
            alert("No se encontró el plano actual.");
            return;
        }

        let blueprintData = {
            author: author,
            name: blueprint.name,
            points: blueprint.points
        };

        api.updateBlueprint(blueprintData)
            .then(function () {
                return new Promise(function (resolve, reject) {
                    api.getBlueprintsByAuthor(author, function (data) {
                        if (data) {
                            resolve(data);
                        } else {
                            reject("Error obteniendo planos actualizados.");
                        }
                    });
                });
            })
            .then(function (data) {
                blueprints = data.map(bp => ({
                    name: bp.name,
                    points: bp.points
                }));

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

                alert("Plano actualizado exitosamente.");
            })
            .catch(function (error) {
                console.error("Error al actualizar el plano:", error);
                alert("Hubo un error al actualizar el plano.");
            });
    });

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

    $(document).ready(function () {
        setupCanvasEventListeners();
    });

    return {
        getBlueprintsByAuthor: getBlueprintsByAuthor
    };
})();