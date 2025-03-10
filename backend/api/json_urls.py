from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import json_views

router = DefaultRouter()
router.register(r'stocks', json_views.JSONStockDataViewSet,
                basename='json-stocks')

urlpatterns = [
    path('', include(router.urls)),
]
