import os
import json
import pandas as pd
from django.core.management.base import BaseCommand
from datetime import datetime


class Command(BaseCommand):
    help = 'Create fixture from CSV file'

    def clean_number(self, value):
        if isinstance(value, str):
            return float(value.replace(',', ''))
        return float(value)

    def handle(self, *args, **kwargs):
        try:
            # Try different possible paths for the CSV file
            possible_paths = [
                os.path.join('dataset', 'stock_market_data.csv'),
                os.path.join('..', 'dataset', 'stock_market_data.csv'),
                os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
                             'dataset', 'stock_market_data.csv')
            ]

            csv_path = None
            for path in possible_paths:
                if os.path.exists(path):
                    csv_path = path
                    break

            if not csv_path:
                self.stdout.write(self.style.ERROR(
                    f"Could not find stock_market_data.csv in any of these locations: {possible_paths}"))
                return

            # Read the CSV file
            self.stdout.write(self.style.SUCCESS(
                f"Reading CSV from {csv_path}"))
            df = pd.read_csv(csv_path)

            # Clean data
            df['volume'] = df['volume'].apply(
                lambda x: str(x).replace(',', ''))
            df['trade_code'] = df['trade_code'].astype(str)

            # Remove duplicates based on trade_code and date
            initial_count = len(df)
            df = df.drop_duplicates(
                subset=['trade_code', 'date'], keep='first')
            removed_count = initial_count - len(df)

            if removed_count > 0:
                self.stdout.write(self.style.WARNING(
                    f"Removed {removed_count} duplicate entries"))

            # Sort by date and trade_code
            df = df.sort_values(['date', 'trade_code'])

            # Convert data to fixture format
            fixture_data = []
            for index, row in df.iterrows():
                try:
                    fixture_data.append({
                        "model": "api.stockdata",
                        "pk": len(fixture_data) + 1,
                        "fields": {
                            "date": row['date'],
                            "trade_code": str(row['trade_code']),
                            "high": self.clean_number(row['high']),
                            "low": self.clean_number(row['low']),
                            "open": self.clean_number(row['open']),
                            "close": self.clean_number(row['close']),
                            "volume": int(row['volume'])
                        }
                    })
                except Exception as e:
                    self.stdout.write(self.style.WARNING(
                        f"Error processing row {index}: {str(e)}"))
                    continue

            # Write to fixture file
            fixture_path = os.path.join('api', 'fixtures', 'initial_data.json')
            os.makedirs(os.path.dirname(fixture_path), exist_ok=True)

            with open(fixture_path, 'w') as f:
                json.dump(fixture_data, f, indent=4)

            self.stdout.write(self.style.SUCCESS(
                f'Successfully created fixture with {len(fixture_data)} records'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
