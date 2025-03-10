#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Create necessary directories
mkdir -p api/fixtures

# Collect static files
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate

# Create fixture from CSV if it doesn't exist
python manage.py create_fixture

# Reset and load initial data
python manage.py reset_and_load_data 