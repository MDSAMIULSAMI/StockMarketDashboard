# SQL Model Branch

This branch implements the Stock Market Dashboard using a SQL database (SQLite by default) for data storage.

## Key Features

- Uses Django ORM with SQLite database (can be easily switched to PostgreSQL or MySQL)
- Implements robust data models with proper relationships
- Full CRUD operations with database integrity
- Data versioning through Django migrations

## Implementation Details

- Django Models: Defined in `api/models.py`
- API Views: Implemented using Django REST Framework in `api/views.py`
- URL Routes: Configured in `api/urls.py`
- Database Schema: Managed through migrations in `api/migrations/`

## How to Use

1. Clone this repository and checkout the sqlModel branch:

   ```bash
   git clone <repository-url>
   git checkout sqlModel
   ```

2. Install dependencies:

   ```bash
   cd backend
   pip install -r requirements.txt
   cd ../frontend
   npm install
   ```

3. Initialize the database:

   ```bash
   cd backend
   python manage.py migrate
   python manage.py loaddata initial_data.json  # Load initial data
   ```

4. Run the backend server:

   ```bash
   cd backend
   python manage.py runserver
   ```

5. Run the frontend:
   ```bash
   cd frontend
   npm start
   ```

## API Endpoints

- `GET /api/stocks/` - List all stock data (paginated)
- `GET /api/stocks/?trade_code=EXAMPLE` - Filter by trade code
- `GET /api/stocks/1/` - Get details for a specific stock record
- `POST /api/stocks/` - Add a new stock record
- `PUT /api/stocks/1/` - Update a stock record
- `DELETE /api/stocks/1/` - Delete a stock record
- `GET /api/stocks/unique_trade_codes/` - Get list of unique trade codes

## Advantages of SQL Model

- Robust data integrity with database constraints
- Efficient querying for large datasets
- Transaction support for data consistency
- Support for complex queries and relationships
- Better performance for high-volume applications

## Database Versioning

This project uses Django's migration system for database versioning:

1. Migrations are stored in `api/migrations/` directory
2. Database schema changes are tracked through migration files
3. Database data is dumped to `initial_data.json` for sharing

To create new migrations after model changes:

```bash
python manage.py makemigrations
```

To apply migrations:

```bash
python manage.py migrate
```

To create a data dump:

```bash
python manage.py dumpdata > data_dump.json
```

## Switching to Another Database

Django's ORM makes it easy to switch to a different database. To use PostgreSQL or MySQL:

1. Install the appropriate database adapter:

   ```bash
   pip install psycopg2  # For PostgreSQL
   # or
   pip install mysqlclient  # For MySQL
   ```

2. Update the DATABASES setting in `stockmarket_project/settings.py`:

   ```python
   # For PostgreSQL
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'stockmarket',
           'USER': 'postgres',
           'PASSWORD': 'password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }

   # For MySQL
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'stockmarket',
           'USER': 'root',
           'PASSWORD': 'password',
           'HOST': 'localhost',
           'PORT': '3306',
       }
   }
   ```

3. Run migrations:

   ```bash
   python manage.py migrate
   ```

4. Load your data:
   ```bash
   python manage.py loaddata initial_data.json
   ```
