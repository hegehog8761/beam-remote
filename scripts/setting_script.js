function ConstrainGridSizes(eventCaller) {
    var field = eventCaller.target;
    if (field.value <= 0) {
        field.value = 1;
    }

    if (Math.round(Number(field.value)) != Number(field.value)) {
        field.value = Math.round(Number(field.value));
    }
}

changed = false

f_keys = ["f37", "f38", "f39", "f40", "f41", "f42", "f43", "f44", "f45", "f46", "f47", "f48"]

function KeybindUpdater(event) {
    if (f_keys.includes(event.target.value)) {
        event.target.parentElement.getElementsByClassName("key_warning")[0].hidden = true
    } else {
        event.target.parentElement.getElementsByClassName("key_warning")[0].hidden = false
    }
}

function SettingUpdater() {
    document.getElementsByClassName("top_bar_holder")[0].hidden = true
    changed = false
    new_settings = {
        "grid_height": document.getElementById("height_input").value,
        "grid_width": document.getElementById("width_input").value,
        "buttons": {}
    }
    for (let y = 0; y < document.getElementById("height_input").value; y++) {
        for (let x = 0; x < document.getElementById("width_input").value; x++) {
            if (document.getElementById(`${x}-${y}-action`) == null || document.getElementById(`${x}-${y}-key`) == null) continue
            console.log(`Action: ${$(`#${x}-${y}-action`).val()}\nKey: ${$(`#${x}-${y}-key`).val()}`)
            if ($(`#${x}-${y}-action`).val() == null || $(`#${x}-${y}-key`).val() == "") continue
            new_settings["buttons"][`${x}-${y}`] = {}
            new_settings["buttons"][`${x}-${y}`]["action"] = $(`#${x}-${y}-action`).val()
            new_settings["buttons"][`${x}-${y}`]["key"] = $(`#${x}-${y}-key`).val()
        }
    }

    fetch("/set_settings", {
        method: "POST",
        body: JSON.stringify(new_settings),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
}

document.getElementById("height_input").addEventListener("focusout", function(event) {ConstrainGridSizes(event)})
document.getElementById("width_input").addEventListener("focusout", function(event) {ConstrainGridSizes(event)})

window.addEventListener("beforeunload", function(e) {
    if (changed) {
        e.returnValue = "Warning, some settings have been modified but not saved.If you leave now any changes made will not be saved."
        return e.returnValue;
    }
})

var bind_locales
var settings

function GenerateGrid(rows, cols) {
    const button_grid = document.getElementById("button_grid")
    while (button_grid.rows.length > 0) {
        button_grid.deleteRow(0)
    }

    for (let y = 0; y < rows; y++) {
        var row = button_grid.insertRow();
        row.className = "button_config_cell"

        for (let x = 0; x < cols; x++) {
            var cell = row.insertCell();
            cell.className = "button_config_cell"
            var action_label = document.createElement("label");
            action_label.innerText = "Action: "
            action_label.setAttribute("for", `${x}-${y}-action`)
            var action_select = document.createElement("select")
            action_select.className = "action_select"
            action_select.id = `${x}-${y}-action`
            var key_label = document.createElement("label")
            key_label.innerText = "Key: "
            key_label.setAttribute("for", `${x}-${y}-key`)
            var key_input = document.createElement("input")
            key_input.className = "action_select"
            key_input.id = `${x}-${y}-key`
            key_input.setAttribute("list", "key_codes")
            key_input.addEventListener("input", KeybindUpdater)
            var key_warning = document.createElement("p")
            key_warning.innerText = "!! Warning, using non-default keys can cause unexpected behaviours"
            key_warning.style = "color: #e1c863ff;"
            key_warning.className = "key_warning"
            key_warning.hidden = true

            cell.appendChild(action_label)
            cell.appendChild(action_select)
            cell.appendChild(key_label)
            cell.appendChild(key_input)
            cell.appendChild(key_warning)
        }
    }
}

function PopulateActions() {
    var drop_downs = document.getElementsByClassName("action_select")

    Array.from(drop_downs).forEach(drop_down => {
        var no_option = document.createElement("option")
        no_option.value = null
        no_option.innerText = "No action"
        drop_down.appendChild(no_option)
        Object.keys(bind_locales).forEach(bind_key =>{
            var option = document.createElement("option")
            option.value = bind_key
            option.innerText = bind_locales[bind_key]
            drop_down.appendChild(option)
        })
    });

    // Change select boxes to selectize mode to be searchable
    $("select").select2();
}

function UnsavedWarning() {
    document.getElementsByClassName("top_bar_holder")[0].hidden = false
    changed = true
}

function FillSettings() {
    for (let y = 0; y < settings["grid_height"]; y++) {
        for (let x = 0; x < settings["grid_width"]; x++) {
            if (Object.keys(settings["buttons"]).includes(`${x}-${y}`) && settings["buttons"][`${x}-${y}`]["action"] != "") {
                $(`#${x}-${y}-action`).val(settings["buttons"][`${x}-${y}`]["action"]).trigger('change')
            }
            if (Object.keys(settings["buttons"]).includes(`${x}-${y}`) && settings["buttons"][`${x}-${y}`]["key"] != "") {
                $(`#${x}-${y}-key`).val(settings["buttons"][`${x}-${y}`]["key"]).trigger('change')
            }

            $(`#${x}-${y}-action`).on('change', UnsavedWarning)
            $(`#${x}-${y}-key`).on('change', UnsavedWarning)
        }
    }
}

async function LoadSettings() {
    if (!bind_locales) {
        bind_locales = await fetch("/get_bind_locales").then(response => response.json())
    }
    if (!settings) {
        settings = await fetch("/get_settings").then(response => response.json())
    }

    document.getElementById("height_input").value = settings["grid_height"]
    document.getElementById("width_input").value = settings["grid_width"]


    GenerateGrid(settings["grid_height"], settings["grid_width"])
    PopulateActions()
    FillSettings()
    document.getElementsByClassName("top_bar_holder")[0].hidden = true
    changed = false
    
}

LoadSettings()