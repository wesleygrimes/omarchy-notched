# Known issues

## Native crash during a rapid bar switch/restart

During the initial installation test, Quickshell 0.3.1 with Qt 6.11.2 on
Arch Linux ARM/Asahi crashed with SIGSEGV while switching to the new bar and
immediately restarting the shell. Its native stack included `__dynamic_cast`,
QML object finalization, a repeater, and loader activation. The log also recorded
an IPC exit request. There was no memory exhaustion.

The exact trigger remains unresolved; the report does not prove which plugin
or host component caused the fault. A subsequent controlled restart and widget
drags between both notch edges completed without another crash. The shell
recovered and the layout was preserved.

For a fresh installation, let the plugin activate normally. Do not immediately
restart while it is loading. After a code update, let it settle before running
`omarchy restart shell`. This avoids the timing seen in the test; it is not a
confirmed fix for the native fault.

If the shell fails to recover, use `omarchy restart shell`. To switch back to
the built-in bar once the shell is running, use `omarchy bar use omarchy.bar`.

If you reproduce this, include your Omarchy, Quickshell, and Qt versions, laptop
model, steps, and relevant stack frames in a GitHub issue. Review crash logs for
personal information before posting them. Full core dumps are not needed.
