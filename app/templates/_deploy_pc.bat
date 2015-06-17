@echo off
REM Uhhh a batch file... :)

SET TARGET="C:\Users\%USERNAME%\AppData\Local\Nxt Wallet\nxt\html\ui\plugins\<%= pluginName %>\"

mkdir %TARGET%
mkdir %TARGET%\html
mkdir %TARGET%\html\pages
mkdir %TARGET%\html\modals
mkdir %TARGET%\css
mkdir %TARGET%\js

xcopy css %TARGET%\css /S /E /V /Y
xcopy html %TARGET%\html  /S /E /V /Y
xcopy js %TARGET%\js /S /E /V /Y
xcopy manifest.json %TARGET%  /V /Y