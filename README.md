# Stock Market Data Visualization

A full-stack web application for visualizing and managing stock market data. Built with React.js frontend and Django REST API backend.

## Features

- **Data Visualization**: Interactive charts (line, bar, area, multi-axis) for stock market data
- **CRUD Operations**: Create, read, update, and delete stock data records
- **Filtering & Sorting**: Filter data by trade code and date range, sort by any column
- **Responsive Design**: Works on desktop and mobile devices
- **Performance Optimized**: Pagination and efficient data loading

## Tech Stack

### Frontend

- React.js
- React Bootstrap for UI components
- Recharts for data visualization
- Axios for API requests
- React Table for data tables

### Backend

- Django
- Django REST Framework
- SQLite database (can be easily switched to PostgreSQL, MySQL, etc.)
- Pandas for data processing

## Project Structure

```
├── backend/                # Django backend
│   ├── api/                # REST API app
│   │   ├── management/     # Custom management commands
│   │   ├── migrations/     # Database migrations
│   │   ├── models.py       # Data models
│   │   ├── serializers.py  # API serializers
│   │   ├── urls.py         # API routes
│   │   └── views.py        # API views
│   └── stockmarket_project/# Django project settings
├── frontend/               # React frontend
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # React components
│       │   ├── StockChart.js # Chart visualization
│       │   └── StockTable.js # Data table with CRUD
│       ├── App.js          # Main application
│       └── index.js        # Entry point
└── dataset/                # Stock market data files
    ├── stock_market_data.csv
    └── stock_market_data.json
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Create and activate a virtual environment:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Run migrations:

   ```
   python manage.py migrate
   ```

5. Load data from CSV:

   ```
   python manage.py load_stock_data
   ```

6. Start the Django development server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

## Git Branches

- `main`: Current development branch
- `jsonModel`: Version using JSON data source
- `sqlModel`: Version using SQL database

## License

This project is licensed under the MIT License - see the LICENSE file for details.
