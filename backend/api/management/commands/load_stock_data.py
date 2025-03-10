import os
import pandas as pd
from django.core.management.base import BaseCommand
from api.models import StockData
from api.serializers import StockDataSerializer


class Command(BaseCommand):
    help = 'Load stock market data from CSV file'

    def handle(self, *args, **options):
        try:
            csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))),
                                    'dataset', 'stock_market_data.csv')

            self.stdout.write(self.style.SUCCESS(
                f"Loading data from {csv_path}..."))

            # Check if file exists
            if not os.path.exists(csv_path):
                self.stdout.write(self.style.ERROR(
                    f"File not found: {csv_path}"))
                # Try relative path
                csv_path = '../dataset/stock_market_data.csv'
                if not os.path.exists(csv_path):
                    self.stdout.write(self.style.ERROR(
                        f"File not found: {csv_path}"))
                    return

            # Read the CSV file
            df = pd.read_csv(csv_path)

            # Clean the data
            df['volume'] = df['volume'].apply(lambda x: int(
                str(x).replace(',', '')) if isinstance(x, str) else x)

            # Convert date strings to datetime objects
            df['date'] = pd.to_datetime(df['date'])

            self.stdout.write(self.style.SUCCESS(
                f"Found {len(df)} records in the CSV file"))

            # Process and insert data
            count = 0
            for index, row in df.iterrows():
                data = {
                    'date': row['date'].strftime('%Y-%m-%d'),
                    'trade_code': row['trade_code'],
                    'high': row['high'],
                    'low': row['low'],
                    'open': row['open'],
                    'close': row['close'],
                    'volume': row['volume']
                }

                # Check if record already exists
                exists = StockData.objects.filter(
                    trade_code=data['trade_code'], date=data['date']).exists()

                if not exists:
                    serializer = StockDataSerializer(data=data)
                    if serializer.is_valid():
                        serializer.save()
                        count += 1
                        if count % 1000 == 0:
                            self.stdout.write(self.style.SUCCESS(
                                f"Processed {count} records..."))
                    else:
                        self.stdout.write(self.style.WARNING(
                            f"Invalid data at index {index}: {serializer.errors}"))

            self.stdout.write(self.style.SUCCESS(
                f"Successfully loaded {count} new records into the database."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {e}"))
