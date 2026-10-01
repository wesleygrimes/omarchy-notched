# Upstream provenance

`Bar.qml` and `BarModel.js` are derived from the MIT-licensed Omarchy bar.
The untouched base is in `upstream-base/` for comparison and future merges.

- Installed Omarchy version: 4.0.2
- Source paths: `shell/plugins/bar/Bar.qml`, `shell/plugins/bar/BarModel.js`
- Distribution: https://github.com/omarchy-mac/omarchy-mac
- Upstream: https://github.com/omacom/omarchy

Notched was developed independently from the local Omarchy bar. No code from
other community notch plugins is bundled.

When updating, compare the installed Omarchy bar against `upstream-base/`,
merge the host changes into our `Bar.qml`, and replace `BarModel.js` if needed.
Run the checks and verify dragging on a real display before refreshing the base.

## Base file SHA-256

- `Bar.qml`: `ebcc6028fcef438849d3abc5e30b068ad96ddd3689a9dbec6befc8386084b84b`
- `BarModel.js`: `7175d4b551271a86bf32b86be20665a6744faddc6e425a4e76863674d5799ef4`
