$script = @'
function npm {
  param([Parameter(ValueFromRemainingArguments=$true)] [string[]]$args)
  $node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $node) { Write-Error "node not found in PATH."; return }
  $candidates = @(
    Join-Path $env:APPDATA 'npm\node_modules\npm\bin\npm-cli.js'
    Join-Path $env:ProgramFiles 'nodejs\node_modules\npm\bin\npm-cli.js'
    Join-Path $env:ProgramFiles(x86) 'nodejs\node_modules\npm\bin\npm-cli.js'
  )
  $cmd = Get-Command npm.cmd -ErrorAction SilentlyContinue
  if ($cmd) { $candidates += Join-Path (Split-Path $cmd.Source -Parent) 'node_modules\npm\bin\npm-cli.js' }
  $found = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
  if (-not $found) { Write-Error "npm-cli.js not found. Ensure npm is installed."; return }
  & node $found @args
}
'@

if (!(Test-Path -Path $PROFILE)) { New-Item -Type File -Path $PROFILE -Force | Out-Null }
Add-Content -Path $PROFILE -Value "`n# npm shim added by add-npm-shim.ps1`n"
Add-Content -Path $PROFILE -Value $script
Write-Output "npm shim appended to $PROFILE" 
