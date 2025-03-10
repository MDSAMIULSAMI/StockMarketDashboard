from django.shortcuts import render
import json
import pandas as pd
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .models import StockData
from .serializers import StockDataSerializer

# Create your views here.


class StockDataViewSet(viewsets.ModelViewSet):
    """
    API viewset for CRUD operations on StockData.
    """
    queryset = StockData.objects.all().order_by('-date')
    serializer_class = StockDataSerializer

    def get_queryset(self):
        queryset = StockData.objects.all().order_by('-date')

        # Filter by trade_code if provided
        trade_code = self.request.query_params.get('trade_code')
        if trade_code:
            queryset = queryset.filter(trade_code=trade_code)

        return queryset

    @action(detail=False, methods=['get'])
    def unique_trade_codes(self, request):
        """Get all unique trade codes for dropdown."""
        trade_codes = StockData.objects.values_list(
            'trade_code', flat=True).distinct()
        return Response(list(trade_codes))


@api_view(['POST'])
def load_data_from_json(request):
    """Load data from JSON file into the database."""
    try:
        with open('../dataset/stock_market_data.json', 'r') as file:
            data = json.load(file)

        count = 0
        for item in data:
            # Convert volume string to integer (remove commas)
            if isinstance(item['volume'], str):
                item['volume'] = int(item['volume'].replace(',', ''))

            # Check if record already exists
            if not StockData.objects.filter(trade_code=item['trade_code'], date=item['date']).exists():
                serializer = StockDataSerializer(data=item)
                if serializer.is_valid():
                    serializer.save()
                    count += 1

        return JsonResponse({'message': f'Successfully loaded {count} new records'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@api_view(['POST'])
def load_data_from_csv(request):
    """Load data from CSV file into the database."""
    try:
        df = pd.read_csv('../dataset/stock_market_data.csv')

        # Convert volume strings to integers
        df['volume'] = df['volume'].apply(lambda x: int(
            str(x).replace(',', '')) if isinstance(x, str) else x)

        count = 0
        for _, row in df.iterrows():
            data = row.to_dict()

            # Check if record already exists
            if not StockData.objects.filter(trade_code=data['trade_code'], date=data['date']).exists():
                serializer = StockDataSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    count += 1

        return JsonResponse({'message': f'Successfully loaded {count} new records'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
