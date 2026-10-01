// Update a QML ListModel by key instead of resetting a Repeater's JS array.
// Payloads are JSON strings so arbitrary widget settings remain ordinary JS
// objects in the delegate rather than becoming nested QML ListModels.
function sync(model, entries, entryId) {
  var seen = {}
  var rows = entries.map(function(entry) {
    var id = entryId(entry)
    var count = seen[id] || 0
    seen[id] = count + 1
    return { key: id + "#" + count, payload: JSON.stringify(entry) }
  })
  // Delete absent rows before inserting new ones. Unrelated delegates survive.
  for (var old = model.count - 1; old >= 0; old--) {
    var key = model.get(old).key
    if (!rows.some(function(row) { return row.key === key })) model.remove(old)
  }
  for (var i = 0; i < rows.length; i++) {
    var found = -1
    for (var j = i; j < model.count; j++) {
      if (model.get(j).key === rows[i].key) { found = j; break }
    }
    if (found < 0) model.insert(i, rows[i])
    else {
      if (found !== i) model.move(found, i, 1)
      if (model.get(i).payload !== rows[i].payload) model.setProperty(i, "payload", rows[i].payload)
    }
  }
}

if (typeof module !== "undefined") module.exports = { sync: sync }
