from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'stocks', views.StockDataViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('load-from-json/', views.load_data_from_json, name='load-from-json'),
    path('load-from-csv/', views.load_data_from_csv, name='load-from-csv'),
]
