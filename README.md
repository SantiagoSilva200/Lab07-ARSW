# Lab07-ARSW

### Hecho por:
- Santiago Córdoba Dueñas
- Santiago Silva Roa

## Punto 1

Se agrego al canvas el contar los click que se hacen.

```javascript
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
```

![Descripción de la imagen](img/img_19.png)

## Punto 2

Se hara una muestra del funcionamiento.

- Plano sin la detección de nuevos puntos sobre el plano:

![Descripción de la imagen](img/img_20.png)

- Se hace un click sobre el canvas.

![Descripción de la imagen](img/img_21.png)

- Despues de dos clicks sobre el canvas.

![Descripción de la imagen](img/img_22.png)

- Despues de n click sobre el canvas.

![Descripción de la imagen](img/img_23.png)

## Punto 3

Muestra del funcionamiento de la funcionalidad save/update.

- Author1 antes de que se cambie el canvas y se use la funcionalidad de save/update.

![Descripción de la imagen](img/img_24.png)

![Descripción de la imagen](img/img_25.png)

- Estado de los planos del Autho1 despúes de hacer cambios y usar save/update.

![Descripción de la imagen](img/img_26.png)

![Descripción de la imagen](img/img_27.png)

Como se pudo observar se actualiza de manera correcta los planos con los cambios que se esten haciendo.

## Punto 4

Al igual que en los anteriores puntos también se hara la muestra del funcionamiento con un ejemplo.

- Se crea un nuevo plano.

![Descripción de la imagen](img/img_28.png)

![Descripción de la imagen](img/img_29.png)

Cuando se crea este plano, se genera una petición POST, que actualiza el número de planos que tiene el usuario, en este
caso Author2 creando asi un nuevo plano sin puntos.

![Descripción de la imagen](img/img_30.png)

Realizamos clics en el canvas para generar puntos en este y lo guardamos.

![Descripción de la imagen](img/img_31.png)

![Descripción de la imagen](img/img_32.png)

Como se pudo observar se actualiza correctamente los planos de este usuario.

## Punto 5

Se hace un ejemplo para la muestra del funcionamiento de la función delete.

- Eliminaremos el mismo plano que estabamos usando para el ejemplo es decir "PruebaLab".

![Descripción de la imagen](img/img_33.png)

![Descripción de la imagen](img/img_34.png)

Como se puede ver se elimina correctamente el plano tanto del front como de la persistencia.