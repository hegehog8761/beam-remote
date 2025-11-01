function GenerateGrid(rows, cols) {
    const button_grid = document.getElementById("button_grid")
    button_grid.style.setProperty("--rows", rows)
    button_grid.style.setProperty("--cols", cols)
    while (button_grid.rows.length > 0) {
        button_grid.deleteRow(0)
    }

    for (let y = 0; y < rows; y++) {
        var row = button_grid.insertRow();

        for (let x = 0; x < cols; x++) {
            var cell = row.insertCell();
            cell.className = "grid_cell"
            var button = document.createElement('button');
            if (Object.keys(settings["buttons"]).includes(`${x}-${y}`)) {
                button.textContent = bind_locales[settings["buttons"][`${x}-${y}`]["action"]];
            } else {
                button.textContent = " "
                button.disabled = true
            }
            
            button.className = "grid_button"
            button.id = `button_${x}-${y}`
            button.addEventListener("pointerdown", ButtonDepressed)
            button.addEventListener("pointerup", ButtonReleased)
            cell.appendChild(button)
        }
    }
}

function ButtonDepressed(event) {
    if (event.srcElement.disabled) return
    fetch("/key_down", {
        method: "POST",
        body: JSON.stringify({"keyCode": settings["buttons"][event.srcElement.id.split("button_")[1]]["key"]}),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
    
}

function ButtonReleased(event) {
    if (event.srcElement.disabled) return
    fetch("/key_up", {
        method: "POST",
        body: JSON.stringify({"keyCode": settings["buttons"][event.srcElement.id.split("button_")[1]]["key"]}),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
}


var bind_locales
var settings

async function LoadSettings() {
    if (!bind_locales) {
        bind_locales = await fetch("/get_bind_locales").then(response => response.json())
    }
    if (!settings) {
        settings = await fetch("/get_settings").then(response => response.json())
    }

    GenerateGrid(settings["grid_height"], settings["grid_width"])
}

LoadSettings()