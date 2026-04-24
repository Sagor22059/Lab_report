@echo off
REM Run this as Administrator to set up the database

echo Starting MySQL service...
net start MySQL80

echo.
echo Importing database schema...
mysql -u root lab_reports_db < database.sql

echo.
echo Database setup complete!
pause
