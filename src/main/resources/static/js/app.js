const app = (function () {
    let author = "", blueprints = [], clickCount = 0, currentBlueprintName = null;
    const api = apiclient;

    function setAuthor(newAuthor) { author = newAuthor; }

    function updateBlueprintsTable() {
        $("#blueprintsBody").empty();
        blueprints.forEach(bp => $("#blueprintsBody").append(
            `<tr><td>${bp.name}</td><td>${bp.points.length}</td><td><button class="btn btn-info open-blueprint" data-name="${bp.name}">Abrir</button></td></tr>`
        ));
        $("#totalPoints").text(blueprints.reduce((sum, bp) => sum + bp.points.length, 0));
    }

    function fetchAndUpdateBlueprints() {
        return new Promise((resolve, reject) => {
            api.getBlueprintsByAuthor(author, data => data ? resolve(data) : reject("Error obteniendo planos actualizados."));
        }).then(data => {
            blueprints = data.map(bp => ({ name: bp.name, points: bp.points, author: bp.author }));
            updateBlueprintsTable();
        });
    }

    function getBlueprintsByAuthor(autor) {
        setAuthor(autor);
        currentBlueprintName = null;
        api.getBlueprintsByAuthor(autor, data => {
            if (!data || data.length === 0) {
                alert("No se encontraron planos para el autor.");
                $("#blueprintsBody, #totalPoints").empty();
                $("#blueprintsTable, #totalContainer, #blueprintCanvas, #blueprintName, #new, #SaveUp, #dele").hide();
                return;
            }
            blueprints = data.map(bp => ({ name: bp.name, points: bp.points, author: bp.author }));
            $("#selectedAuthor").text(author);
            updateBlueprintsTable();
            $("#blueprintsTable, #totalContainer, #new, #SaveUp, #dele").show();
        });
    }

    function drawBlueprint(blueprintName) {
        let blueprint = blueprints.find(bp => bp.name === blueprintName);
        if (!blueprint) return alert("No se encontraron datos del plano.");
        currentBlueprintName = blueprintName;
        let ctx = document.getElementById("blueprintCanvas").getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (blueprint.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(blueprint.points[0].x, blueprint.points[0].y);
            blueprint.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        $("#blueprintName").text(`Plano: ${blueprintName}`).show();
        $("#blueprintCanvas").show();
    }

    function setupCanvasEventListeners() {
        document.getElementById("blueprintCanvas")?.addEventListener("pointerdown", event => {
            if (!currentBlueprintName) return alert("No hay un plano abierto.");
            let rect = event.target.getBoundingClientRect();
            let x = event.clientX - rect.left, y = event.clientY - rect.top;
            blueprints.find(bp => bp.name === currentBlueprintName)?.points.push({ x, y });
            drawBlueprint(currentBlueprintName);
            $("#clickCounter").text(++clickCount);
        });
    }

    $(document).on("click", ".open-blueprint", function () {
        clickCount = 0;
        $("#clickCounter").text(clickCount);
        drawBlueprint($(this).data("name"));
    });

    $(document).on("click", "#new", function () {
        let ctx = document.getElementById("blueprintCanvas").getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let blueprintName = prompt("Ingrese el nombre del nuevo plano:");
        if (!blueprintName) return alert("Debe ingresar un nombre para el nuevo plano.");
        currentBlueprintName = blueprintName;
        clickCount = 0;
        $("#clickCounter").text(clickCount);
        $("#blueprintName").text(`Plano: ${blueprintName}`).show();
        $("#blueprintCanvas").show();
        api.createBlueprint({ name: blueprintName, points: [], author: author })
            .then(fetchAndUpdateBlueprints)
            .then(() => alert("Plano creado exitosamente."))
            .catch(error => alert("Hubo un error al crear el plano."));
    });

    $(document).on("click", "#SaveUp", function () {
        if (!currentBlueprintName) return alert("No hay un plano abierto.");
        let blueprint = blueprints.find(bp => bp.name === currentBlueprintName);
        if (!blueprint) return alert("No se encontró el plano actual.");
        let blueprintData = { author: author, name: blueprint.name, points: blueprint.points };
        (blueprint.author ? api.updateBlueprint(blueprintData) : api.createBlueprint(blueprintData))
            .then(fetchAndUpdateBlueprints)
            .then(() => alert(blueprint.author ? "Plano actualizado exitosamente." : "Plano creado exitosamente."))
            .catch(error => alert(`Hubo un error al ${blueprint.author ? 'actualizar' : 'crear'} el plano.`));
    });

    $(document).on("click", "#dele", function () {
        if (!currentBlueprintName) return alert("No hay un plano abierto.");
        let ctx = document.getElementById("blueprintCanvas").getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        api.deleteBlueprint(author, currentBlueprintName)
            .then(fetchAndUpdateBlueprints)
            .then(() => {
                currentBlueprintName = null;
                clickCount = 0;
                $("#clickCounter").text(clickCount);
                $("#blueprintName").text("").hide();
                $("#blueprintCanvas").hide();
                alert("Plano eliminado exitosamente.");
            })
            .catch(error => alert("Hubo un error al eliminar el plano."));
    });

    $(document).ready(function () {
        $("#getBlueprints").click(function () {
            let authorName = $("#authorName").val().trim();
            authorName ? (setAuthor(authorName), getBlueprintsByAuthor(authorName)) : alert("Por favor, ingrese un nombre de autor.");
        });
        setupCanvasEventListeners();
    });

    return { getBlueprintsByAuthor };
})();