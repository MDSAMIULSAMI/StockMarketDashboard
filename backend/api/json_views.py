from django.shortcuts import render
import json
import pandas as pd
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView

# Define the path to JSON file
JSON_DATA_PATH = '../dataset/stock_market_data.json'


def load_json_data():
    """Load data from JSON file."""
    try:
        with open(JSON_DATA_PATH, 'r') as file:
            data = json.load(file)

        # Clean volume data
        for item in data:
            if isinstance(item['volume'], str):
                item['volume'] = int(item['volume'].replace(',', ''))

        return data
    except Exception as e:
        print(f"Error loading JSON data: {e}")
        return []


class JSONStockPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class JSONStockDataViewSet(viewsets.ViewSet):
    """
    API viewset for stock data operations using JSON file as data source.
    """
    pagination_class = JSONStockPagination

    def list(self, request):
        """Get all stock data or filtered by trade_code."""
        data = load_json_data()

        # Filter by trade_code if provided
        trade_code = request.query_params.get('trade_code')
        if trade_code:
            data = [item for item in data if item['trade_code'] == trade_code]

        # Sort by date in descending order
        data = sorted(data, key=lambda x: x['date'], reverse=True)

        # Apply pagination
        page = self.paginate_queryset(data)
        if page is not None:
            return self.get_paginated_response(page)

        return Response(data)

    def paginate_queryset(self, queryset):
        """Apply pagination to the queryset."""
        if self.paginator is None:
            self.paginator = self.pagination_class()
        return self.paginator.paginate_queryset(queryset, self.request, view=self)

    def get_paginated_response(self, data):
        """Return a paginated response."""
        return self.paginator.get_paginated_response(data)

    def retrieve(self, request, pk=None):
        """Get a specific stock data record by ID."""
        data = load_json_data()
        try:
            pk = int(pk)
            # In a real scenario, you would have a proper ID field
            # This is a simplification - matching by index
            if pk < len(data):
                return Response(data[pk])
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({"detail": "Invalid ID"}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        """Create a new stock data record."""
        data = load_json_data()
        new_data = request.data

        # Validate data
        required_fields = ['date', 'trade_code',
                           'open', 'high', 'low', 'close', 'volume']
        for field in required_fields:
            if field not in new_data:
                return Response(
                    {"detail": f"Missing required field: {field}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Generate a new ID
        new_id = len(data)
        new_data['id'] = new_id

        # Add to data
        data.append(new_data)

        # Save back to file
        try:
            with open(JSON_DATA_PATH, 'w') as file:
                json.dump(data, file, indent=2)
            return Response(new_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"detail": f"Error saving data: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, pk=None):
        """Update a stock data record."""
        data = load_json_data()
        try:
            pk = int(pk)
            if pk >= len(data):
                return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

            updated_data = request.data
            data[pk].update(updated_data)

            # Save back to file
            with open(JSON_DATA_PATH, 'w') as file:
                json.dump(data, file, indent=2)

            return Response(data[pk])
        except Exception as e:
            return Response(
                {"detail": f"Error updating data: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def destroy(self, request, pk=None):
        """Delete a stock data record."""
        data = load_json_data()
        try:
            pk = int(pk)
            if pk >= len(data):
                return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

            # Remove item
            removed = data.pop(pk)

            # Save back to file
            with open(JSON_DATA_PATH, 'w') as file:
                json.dump(data, file, indent=2)

            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {"detail": f"Error deleting data: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def unique_trade_codes(self, request):
        """Get all unique trade codes for dropdown."""
        data = load_json_data()
        trade_codes = set(item['trade_code'] for item in data)
        return Response(list(trade_codes))
