const { test } = require('node:test');
const assert = require('node:assert/strict');
const notch = require('../NotchModel.js');
const bar = require('../BarModel.js');
const screen = { name: 'eDP-1', width: 1728, height: 1117, devicePixelRatio: 2 };
function rect(display = screen, options = {}, position = 'top', apple = true) {
  const height = bar.notchHeight(display.name, display.width, display.height, display.devicePixelRatio);
  return notch.rect(display, position, apple, options, height, 0);
}

test('16-inch M2 Pro geometry leaves a 180px logical camera gap', () => {
  assert.deepEqual(rect(), { x: 774, y: 0, width: 180, height: 32 });
  assert.equal(notch.padding(), 2);
});

test('scaling changes logical dimensions while keeping physical cutout sizing', () => {
  for (const scale of [1, 1.5, 2, 2.5]) {
    const display = { name: 'eDP-1', width: Math.round(3456 / scale), height: Math.round(2234 / scale), devicePixelRatio: scale };
    const cutout = rect(display);
    assert.equal(cutout.width, Math.ceil(360 / scale));
    assert.equal(cutout.height, Math.ceil(64 / scale));
    assert.equal(cutout.x * 2 + cutout.width, display.width);
  }
});

test('external, non-notched, rotated, non-Apple, and other bar positions stay unsplit', () => {
  assert.equal(rect({ ...screen, name: 'DP-1' }), null);
  assert.equal(rect({ ...screen, width: 1920, height: 1200 }), null);
  assert.equal(rect({ ...screen, width: 1117, height: 1728 }), null);
  assert.equal(rect(screen, {}, 'top', false), null);
  for (const position of ['bottom', 'left', 'right']) assert.equal(rect(screen, {}, position), null);
  assert.equal(rect(screen, { enabled: false }), null);
});

test('physical width/height and logical padding can be calibrated', () => {
  assert.deepEqual(rect(screen, { width: 400, height: 72 }), { x: 764, y: 0, width: 200, height: 36 });
  assert.equal(notch.padding({ padding: 0 }), 0);
  assert.equal(notch.padding({ padding: 5 }), 5);
  assert.equal(notch.rect(screen, 'top', true, {}, 32, 40).height, 40);
});

test('invalid sizing falls back to finite defaults', () => {
  for (const width of [-1, 0, 'bad', Infinity, NaN, null]) assert.deepEqual(rect(screen, { width }), rect());
  for (const padding of [-1, 'bad', Infinity, NaN, null]) assert.equal(notch.padding({ padding }), 2);
});

test('four empty-space destinations and camera exclusion', () => {
  const cutout = rect();
  assert.deepEqual(notch.dropZone(100, 1728, cutout, 2), { side: 'left', region: 'left', notchSide: '' });
  assert.deepEqual(notch.dropZone(760, 1728, cutout, 2), { side: 'left', region: 'center', notchSide: 'left' });
  assert.deepEqual(notch.dropZone(980, 1728, cutout, 2), { side: 'right', region: 'center', notchSide: 'right' });
  assert.deepEqual(notch.dropZone(1660, 1728, cutout, 2), { side: 'right', region: 'right', notchSide: '' });
  for (const x of [-1, 772, 864, 956, 1729]) assert.equal(notch.dropZone(x, 1728, cutout, 2), null);
});

test('moving to either notch edge preserves widget settings', () => {
  const right = [{ id: 'omarchy.clock', format: 'h:mm AP' }];
  const center = [];
  assert.equal(notch.moveEntry(right, center, 0, 0, false, 'center', 'left'), true);
  assert.deepEqual(center, [{ id: 'omarchy.clock', format: 'h:mm AP', notchSide: 'left' }]);
  // Moving to the other side without changing the array index must persist.
  assert.equal(notch.moveEntry(center, center, 0, 1, true, 'center', 'right'), true);
  assert.deepEqual(center, [{ id: 'omarchy.clock', format: 'h:mm AP', notchSide: 'right' }]);
  assert.equal(notch.moveEntry(center, right, 0, 0, false, 'right', ''), true);
  assert.deepEqual(right, [{ id: 'omarchy.clock', format: 'h:mm AP' }]);
});

test('string entries, reorder, and unchanged drops', () => {
  const entries = ['a', 'b', 'c'];
  assert.equal(notch.moveEntry(entries, entries, 0, 3, true, 'center', 'right'), true);
  assert.deepEqual(entries, ['b', 'c', { id: 'a', notchSide: 'right' }]);
  assert.equal(notch.moveEntry(entries, entries, 2, 3, true, 'center', 'right'), false);
  assert.equal(notch.moveEntry(entries, entries, -1, 0, true, 'center', 'left'), false);
});
