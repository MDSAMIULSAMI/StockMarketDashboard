from rest_framework import serializers
from .models import StockData


class StockDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockData
        fields = ['id', 'date', 'trade_code',
                  'high', 'low', 'open', 'close', 'volume']
