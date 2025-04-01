# PowerShell скрипт для настройки переменных окружения

# Функция для запроса ввода с валидацией
function Get-ValidatedInput {
    param (
        [string]$Prompt,
        [string]$DefaultValue,
        [scriptblock]$ValidationScript = { $true }
    )
    
    do {
        $promptWithDefault = if ($DefaultValue) {
            "$($Prompt) [$($DefaultValue)]: "
        } else {
            "$($Prompt): "
        }
        
        $userInput = Read-Host -Prompt $promptWithDefault
        
        if ([string]::IsNullOrWhiteSpace($userInput) -and $DefaultValue) {
            $userInput = $DefaultValue
        }
        
        $isValid = & $ValidationScript $userInput
        
        if (-not $isValid) {
            Write-Host "Введены некорректные данные. Попробуйте снова." -ForegroundColor Red
        }
        
    } while (-not $isValid)
    
    return $userInput
}

# Определяем путь к директории проекта
$projectPath = Join-Path $PSScriptRoot ""

# Определяем файл .env.local
$envFile = Join-Path $projectPath ".env.local"

# Проверяем существует ли уже файл .env.local
$envExists = Test-Path $envFile

# Показываем заголовок
Write-Host ""
Write-Host "===== НАСТРОЙКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ ДЛЯ РАБОТЫ С ЯНДЕКС 360 API =====" -ForegroundColor Cyan
Write-Host ""

# Если файл существует, спрашиваем о перезаписи
if ($envExists) {
    Write-Host "Файл .env.local уже существует." -ForegroundColor Yellow
    $overwrite = Read-Host "Хотите перезаписать его? (y/n)"
    
    if ($overwrite -ne "y") {
        Write-Host "Операция отменена. Существующий файл .env.local сохранен." -ForegroundColor Green
        exit 0
    }
}

# Запрашиваем ID организации
$orgId = Get-ValidatedInput -Prompt "Введите ID вашей организации в Яндекс 360" -ValidationScript {
    param($input)
    return -not [string]::IsNullOrWhiteSpace($input) -and $input -ne "_"
}

# Создаем содержимое файла .env.local
$envContent = @"
# Настройки API Яндекс 360
ORG_ID=$orgId

# Заполнено автоматически скриптом setup-env.ps1
"@

# Записываем файл
Set-Content -Path $envFile -Value $envContent -Encoding UTF8

Write-Host ""
Write-Host "Файл .env.local успешно создан!" -ForegroundColor Green
Write-Host "Переменные окружения настроены для работы с Яндекс 360 API." -ForegroundColor Green
Write-Host ""
Write-Host "Настройки:"
Write-Host "- ORG_ID: $orgId"
Write-Host ""
Write-Host "Теперь вы можете запустить приложение командой: ./start.ps1" -ForegroundColor Cyan
Write-Host "" 