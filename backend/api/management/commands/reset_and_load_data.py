from django.core.management.base import BaseCommand
from django.db import connection
from api.models import StockData
from django.core.management import call_command


class Command(BaseCommand):
    help = 'Reset database and load initial data'

    def handle(self, *args, **kwargs):
        try:
            # Clear all data from StockData table
            self.stdout.write('Clearing existing data...')
            StockData.objects.all().delete()

            # Reset the sequence
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT setval(pg_get_serial_sequence('api_stockdata', 'id'), 1, false);")

            # Load the fixture
            self.stdout.write('Loading fixture data...')
            call_command('loaddata', 'initial_data.json', verbosity=1)

            self.stdout.write(self.style.SUCCESS(
                'Successfully reset and loaded data'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
