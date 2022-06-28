@echo off
for /f "tokens=*" %%a in (.env) do (
  echo setting %%a
  set %%a
)
