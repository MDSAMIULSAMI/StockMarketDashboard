from api.serializers import StockDataSerializer
from api.models import StockData
import os
import pandas as pd
import django
import sys
from datetime import datetime

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stockmarket_project.settings')
django.setup()

# Import models after setting up Django environment


def load_from_csv():
    """Load data from the CSV file into the database."""
    try:
        csv_path = '../dataset/stock_market_data.csv'
        print(f"Loading data from {csv_path}...")

        # Read the CSV file
        df = pd.read_csv(csv_path)

        # Clean the data
        df['volume'] = df['volume'].apply(lambda x: int(
            str(x).replace(',', '')) if isinstance(x, str) else x)

        # Convert date strings to datetime objects
        df['date'] = pd.to_datetime(df['date'])

        print(f"Found {len(df)} records in the CSV file")

        # Clear existing data if needed
        # StockData.objects.all().delete()

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
                        print(f"Processed {count} records...")
                else:
                    print(
                        f"Invalid data at index {index}: {serializer.errors}")

        print(f"Successfully loaded {count} new records into the database.")
    except Exception as e:
        print(f"Error: {str(e)}")


if __name__ == "__main__":
    load_from_csv()
