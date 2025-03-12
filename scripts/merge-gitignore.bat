@echo off

rem Paths to your backend and frontend .gitignore files
set BACKEND_GITIGNORE=..\backend\.gitignore
set FRONTEND_GITIGNORE=..\frontend\.gitignore
set ROOT_GITIGNORE=..\.gitignore

rem Create or overwrite root .gitignore
echo # Merged .gitignore > %ROOT_GITIGNORE%
echo. >> %ROOT_GITIGNORE%

echo # Backend rules >> %ROOT_GITIGNORE%
type %BACKEND_GITIGNORE% >> %ROOT_GITIGNORE%
echo. >> %ROOT_GITIGNORE%

echo # Frontend rules >> %ROOT_GITIGNORE%
type %FRONTEND_GITIGNORE% >> %ROOT_GITIGNORE%

echo.
echo .gitignore files merged successfully into root .gitignore.
pause
