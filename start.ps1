# PowerShell скрипт для запуска приложения из правильной директории

# Проверяем, где мы находимся
$currentPath = Get-Location
Write-Host "Текущая директория: $currentPath"

# Определяем путь к директории проекта
$projectPath = Join-Path $PSScriptRoot ""

# Проверяем существование package.json
$packageJsonPath = Join-Path $projectPath "package.json"
if (Test-Path $packageJsonPath) {
    Write-Host "Найден файл package.json в $projectPath"
} else {
    Write-Host "Ошибка: файл package.json не найден в $projectPath" -ForegroundColor Red
    Write-Host "Убедитесь, что вы находитесь в корне проекта или структура проекта корректна" -ForegroundColor Red
    exit 1
}

# Переходим в директорию проекта и запускаем приложение
Write-Host "Переходим в директорию проекта: $projectPath" -ForegroundColor Green
Set-Location $projectPath

Write-Host "Запускаем приложение..." -ForegroundColor Green
npm run dev

# Возвращаемся обратно в исходную директорию
Set-Location $currentPath 