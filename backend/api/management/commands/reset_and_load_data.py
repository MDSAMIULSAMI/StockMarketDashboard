from django.core.management.base import BaseCommand
from django.db import connection
from api.models import StockData
from django.core.management import call_command
import os


class Command(BaseCommand):
    help = 'Reset database and load initial data'

    def handle(self, *args, **kwargs):
        try:
            # Check if fixture exists
            fixture_path = os.path.join('api', 'fixtures', 'initial_data.json')
            if not os.path.exists(fixture_path):
                self.stdout.write(self.style.ERROR(
                    f'Fixture file not found at {fixture_path}'))
                return

            # Clear all data from StockData table
            self.stdout.write('Clearing existing data...')
            try:
                count = StockData.objects.all().count()
                StockData.objects.all().delete()
                self.stdout.write(self.style.SUCCESS(
                    f'Cleared {count} existing records'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f'Error clearing data: {str(e)}'))
                return

            # Reset the sequence
            try:
                with connection.cursor() as cursor:
                    cursor.execute(
                        "SELECT setval(pg_get_serial_sequence('api_stockdata', 'id'), 1, false);")
                self.stdout.write(self.style.SUCCESS('Reset ID sequence'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f'Error resetting sequence: {str(e)}'))
                return

            # Load the fixture
            self.stdout.write('Loading fixture data...')
            try:
                call_command('loaddata', fixture_path, verbosity=2)
                count = StockData.objects.all().count()
                self.stdout.write(self.style.SUCCESS(
                    f'Successfully loaded {count} records'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f'Error loading fixture: {str(e)}'))
                return

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Unexpected error: {str(e)}'))
