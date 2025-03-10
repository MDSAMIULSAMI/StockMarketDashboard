import os
import pandas as pd
from django.core.management.base import BaseCommand
from api.models import StockData
from api.serializers import StockDataSerializer
from datetime import datetime


class Command(BaseCommand):
    help = 'Load stock market data from CSV file'

    def handle(self, *args, **kwargs):
        # Clear existing data
        StockData.objects.all().delete()

        # Read the CSV file
        df = pd.read_csv('dataset/stock_market_data.csv')

        # Convert data to list of StockData objects
        stock_objects = []
        for _, row in df.iterrows():
            stock_objects.append(
                StockData(
                    date=datetime.strptime(row['date'], '%Y-%m-%d').date(),
                    trade_code=row['trade_code'],
                    high=row['high'],
                    low=row['low'],
                    open=row['open'],
                    close=row['close'],
                    volume=row['volume']
                )
            )

        # Bulk create the objects
        StockData.objects.bulk_create(stock_objects)

        self.stdout.write(self.style.SUCCESS(
            f'Successfully loaded {len(stock_objects)} stock records'))
