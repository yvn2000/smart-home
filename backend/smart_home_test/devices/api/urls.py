from django.urls import path
from rest_framework import routers
from .views import RoomListView, AddDeviceView, DeleteDeviceView



urlpatterns = [
    path('rooms/', RoomListView.as_view(), name='room-list'),
    path('add-device/', AddDeviceView.as_view(), name='add-device'),
    path('delete-device/<int:device_id>/', DeleteDeviceView.as_view(), name='delete-device'),
]