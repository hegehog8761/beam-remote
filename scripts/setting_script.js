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

// f_keys = ["f13", "f14", "f15", "f16", "f17", "f18", "f19", "f20", "f21", "f22", "f23", "f24"]
const allowed_keys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "tilde", "period", "comma", "up", "down", "left", "right", "enter", "backspace", "home", "insert", "numpad0", "numpad1", "numpad2", "numpad2", "numpad3", "numpad4", "numpad4", "numpad5", "numpad6", "numpad6", "numpad8", "numpad8", "numpad9", "numpadadd", "numpadminus", "lcontrol", "lshift", "rcontrol", "rshift", "delete", "end", "pagedown", "pageup", "slash", "tab", "alt", "\\*", "ctrl", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "shift"]
const allowed_modifiers = ["lshift", "lcontrol", "rshift", "rcontrol", "alt", "ctrl", "shift"]



function KeybindUpdater(event) {
    console.log("Checking keybind")
    var regex = `^(${allowed_modifiers.join("|")}(\\-(${allowed_modifiers.join("|")}))? )?(${allowed_keys.join("|")})$`
    if (`${event.target.value}`.match(regex) != null) {
        event.target.parentElement.getElementsByClassName("key_warning")[0].hidden = true
        document.getElementById("save_button").disabled = false
    } else {
        event.target.parentElement.getElementsByClassName("key_warning")[0].hidden = false
        document.getElementById("save_button").disabled = true
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

document.getElementById("height_input").addEventListener("change", function(event) {
    ConstrainGridSizes(event)
    UpdateGridSize()
})

document.getElementById("width_input").addEventListener("change", function(event) {
    ConstrainGridSizes(event)
    UpdateGridSize()
})

function UpdateGridSize() {
    ShowUnsavedWarning();
    GenerateGrid(document.getElementById("height_input").value, document.getElementById("width_input").value)
    PopulateActions()
    RestructureSavedSettings()
}

function RestructureSavedSettings() {
    var button_names = []
    var max_items = Number(document.getElementById("height_input").value) * Number(document.getElementById("width_input").value)
    Object.keys(settings["buttons"]).forEach(button_name => button_names.push(button_name))
    button_names.sort((a, b) => Number(`${a.split('-')[1]}.${a.split('-')[0]}`) - Number(`${b.split('-')[1]}.${b.split('-')[0]}`))
    button_names.slice(0, max_items) // Limit number of buttons
    console.log(`All names: ${button_names}`)
    let button_index = 0
    for (let y = 0; y < Number(document.getElementById("height_input").value); y++) {
        if (button_index >= button_names.length) break
        for (let x = 0; x < Number(document.getElementById("width_input").value); x++) {
            if (button_index >= button_names.length) break
            $(`#${x}-${y}-action`).val(settings["buttons"][button_names[button_index]]["action"]).trigger('change')
            $(`#${x}-${y}-key`).val(settings["buttons"][button_names[button_index]]["key"]).trigger('change')
            button_index++
        }
    }
}

window.addEventListener("beforeunload", function(e) {
    if (changed) {
        e.returnValue = "Warning, some settings have been modified but not saved. If you leave now any changes made will not be saved."
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
            var action_key_break = document.createElement("br")
            var key_label = document.createElement("label")
            key_label.innerText = "Key: "
            key_label.setAttribute("for", `${x}-${y}-key`)
            // var key_input = document.createElement("input")
            // key_input.className = "action_select"
            // key_input.id = `${x}-${y}-key`
            // key_input.setAttribute("list", "key_codes")
            // key_input.addEventListener("input", KeybindUpdater)
            var key_value = document.createElement("input")
            key_value.innerText = "Test"
            key_value.id = `${x}-${y}-key`
            key_value.className = "action_value"
            key_value.addEventListener("input", KeybindUpdater)
            var key_warning = document.createElement("p")
            key_warning.innerHTML = "!! Invalid key formatting, please see <a href=\"https://github.com/hegehog8761/beam-remote/blob/main/docs/bind_formatting.md\">this guide</a>."
            key_warning.style = "color: rgb(255, 51, 51);"
            key_warning.className = "key_warning"
            key_warning.hidden = true

            cell.appendChild(action_label)
            cell.appendChild(action_select)
            cell.appendChild(action_key_break)
            cell.appendChild(key_label)
            // cell.appendChild(key_input)
            cell.appendChild(key_value)
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

function ShowUnsavedWarning() {
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

            $(`#${x}-${y}-action`).on('change', function(event) {
                ShowUnsavedWarning()
                SetDefaultBindFor(event.target)
            })
            $(`#${x}-${y}-key`).on('change', ShowUnsavedWarning)
        }
    }
}

function SetDefaultBindFor(target_input) {
    var bind_sections = $(target_input).val().split(".")
    var common_name = bind_sections[bind_sections.length - 1]
    var target_bind
    var searching = true
    bind_defaults.forEach(binding => {
        if (searching && binding["action"] == common_name) {
            target_bind = binding
            searching = false
        }
    });
    if (target_bind) {
        key_name = target_input.id.replace("-action", "-key")
        document.getElementById(key_name).value = target_bind["control"]
        console.log(`Successfully found binding for ${$(target_input).val()}, was ${target_bind["control"]}`)
    } else {
        console.info(`Failed to find binding for ${$(target_input).val()}`)
    }
}

var bind_defaults

async function LoadBindDefaults() {
    if (!bind_defaults) {
        bind_defaults = await fetch("/get_bind_defaults").then(response => response.json())
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
    
    document.getElementById("dark_toggle").value = window.matchMedia("(prefers-color-scheme: dark)").matches
}

LoadSettings()
LoadBindDefaults()