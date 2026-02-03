@echo off
echo ========================================
echo   AI Pengatur File - Backend Deployment
echo ========================================
echo.

set LARAVEL_PATH=..\..\..\ai-pengatur-file-api

echo [1/8] Checking Laravel project...
if not exist "%LARAVEL_PATH%" (
    echo ERROR: Laravel project not found at %LARAVEL_PATH%
    echo Please update LARAVEL_PATH in this script
    pause
    exit /b 1
)

echo [2/8] Copying migrations...
xcopy /Y /I migrations\*.php "%LARAVEL_PATH%\database\migrations\"

echo [3/8] Copying seeders...
xcopy /Y /I seeders\*.php "%LARAVEL_PATH%\database\seeders\"

echo [4/8] Copying models...
xcopy /Y /I models\*.php "%LARAVEL_PATH%\app\Models\"

echo [5/8] Copying controllers...
if not exist "%LARAVEL_PATH%\app\Http\Controllers\Api" mkdir "%LARAVEL_PATH%\app\Http\Controllers\Api"
xcopy /Y /I controllers\*.php "%LARAVEL_PATH%\app\Http\Controllers\Api\"

echo [6/8] Copying middleware...
xcopy /Y /I middleware\*.php "%LARAVEL_PATH%\app\Http\Middleware\"

echo [7/8] Copying routes...
xcopy /Y routes\api.php "%LARAVEL_PATH%\routes\"

echo [8/8] Copying config...
xcopy /Y /I config\*.php "%LARAVEL_PATH%\config\"

echo.
echo ========================================
echo   Files copied successfully!
echo ========================================
echo.
echo Next steps:
echo 1. cd %LARAVEL_PATH%
echo 2. composer require laravel/sanctum
echo 3. php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
echo 4. php artisan migrate
echo 5. php artisan db:seed --class=AdminSeeder
echo.
pause
