import QtQuick
import QtQml.Models
import QtTest
import "../ModelSync.js" as ModelSync

TestCase {
  id: testCase
  name: "IncrementalWidgetLists"
  when: windowShown
  property int creations: 0
  property int removals: 0
  ListModel { id: rows }
  Item {
    Repeater {
      id: repeater
      model: rows
      delegate: Item {
        required property string payload
        property var entry: JSON.parse(payload)
        property int instanceId: 0
        Component.onCompleted: instanceId = ++testCase.creations
        Component.onDestruction: testCase.removals++
      }
    }
  }

  function sync(entries) {
    ModelSync.sync(rows, entries, function(entry) { return typeof entry === "string" ? entry : entry.id })
    wait(0)
  }
  function init() { rows.clear(); wait(0); creations = 0; removals = 0 }

  function test_reorder_preserves_live_widgets() {
    sync(["clock", "weather", "audio"])
    var clock = repeater.itemAt(0)
    var weather = repeater.itemAt(1)
    var audio = repeater.itemAt(2)
    sync(["audio", "clock", "weather"])
    compare(repeater.itemAt(0), audio)
    compare(repeater.itemAt(1), clock)
    compare(repeater.itemAt(2), weather)
    compare(creations, 3)
    compare(removals, 0)
  }

  function test_remove_and_insert_only_affect_moved_widget() {
    sync(["clock", "weather", "audio"])
    var clock = repeater.itemAt(0)
    var weather = repeater.itemAt(1)
    sync(["clock", "weather"])
    compare(repeater.itemAt(0), clock)
    compare(repeater.itemAt(1), weather)
    compare(creations, 3)
    compare(removals, 1)
    sync(["clock", "network", "weather"])
    compare(repeater.itemAt(0), clock)
    compare(repeater.itemAt(2), weather)
    compare(creations, 4)
    compare(removals, 1)
  }

  function test_settings_update_and_noop_preserve_instances() {
    sync([{ id: "clock", format: "h:mm AP", notchSide: "left" }])
    var clock = repeater.itemAt(0)
    sync([{ id: "clock", format: "HH:mm", notchSide: "right" }])
    compare(repeater.itemAt(0), clock)
    compare(clock.entry.format, "HH:mm")
    compare(clock.entry.notchSide, "right")
    sync([{ id: "clock", format: "HH:mm", notchSide: "right" }])
    compare(creations, 1)
    compare(removals, 0)
  }

  function test_duplicate_ids_do_not_break_model() {
    sync(["clock", "clock", "audio"])
    var second = repeater.itemAt(1)
    sync(["audio", "clock", "clock"])
    compare(repeater.itemAt(2), second)
    compare(creations, 3)
    compare(removals, 0)
  }
}
