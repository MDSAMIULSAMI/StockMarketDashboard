# JSON Model Branch

This branch implements a version of the Stock Market Dashboard that uses a JSON file as the data source instead of a SQL database.

## Key Features

- Uses JSON file `dataset/stock_market_data.json` for data storage
- Implements full CRUD operations with data persistence
- Maintains the same API structure as the SQL version
- Simplifies deployment by eliminating database dependencies

## Implementation Details

- `json_views.py`: Contains the JSONStockDataViewSet that implements all view methods
- `json_urls.py`: URL routing specific to the JSON implementation

## How to Use

1. Clone this repository and checkout the jsonModel branch:

   ```bash
   git clone <repository-url>
   git checkout jsonModel
   ```

2. Install dependencies:

   ```bash
   cd backend
   pip install -r requirements.txt
   cd ../frontend
   npm install
   ```

3. Run the backend server:

   ```bash
   cd backend
   python manage.py runserver
   ```

4. To use the JSON model instead of SQL:

   ```python
   # In stockmarket_project/urls.py
   from django.contrib import admin
   from django.urls import path, include

   urlpatterns = [
       path('admin/', admin.site.urls),
       path('api/', include('api.json_urls')),  # Use JSON urls instead of standard urls
   ]
   ```

5. Run the frontend:
   ```bash
   cd frontend
   npm start
   ```

## API Endpoints

The API maintains the same structure as the SQL version:

- `GET /api/stocks/` - List all stock data (supports pagination)
- `GET /api/stocks/?trade_code=EXAMPLE` - Filter by trade code
- `GET /api/stocks/1/` - Get details for a specific stock record
- `POST /api/stocks/` - Add a new stock record
- `PUT /api/stocks/1/` - Update a stock record
- `DELETE /api/stocks/1/` - Delete a stock record
- `GET /api/stocks/unique_trade_codes/` - Get list of unique trade codes

## Advantages over SQL Model

- Simpler deployment with no database dependencies
- Easier to backup and restore data (just copy the JSON file)
- More portable between different systems
- No need for database migrations

## Limitations

- Not suitable for high-volume applications
- Less efficient for complex queries
- No built-in transactions or data integrity checks
- Limited concurrency support
