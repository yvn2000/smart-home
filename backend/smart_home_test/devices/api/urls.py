from django.urls import path
from rest_framework import routers
from .views import (
    RoomListByHouseView, #RoomListView, 
    AddRoomView, DeleteRoomView, AddDeviceView,
    DeleteDeviceView, EnergyListView, AddDeviceActionView, 
    GetDeviceActivityView, UpdateDeviceStatusView, 
    UpdateEnergyConsumptionView, 
    GetDeviceInfoView, UpdateDeviceView,
    SetEnergyConsumptionView, GetDeviceHealthView,
    GetTodaysAllDevicesActivityView,

    TokenRefreshView,

    LandlordListView, UserAccessView,

    RegisterUserView, LoginView, GuestLoginView,
    AddHouseView, AssignExistingHouseView,

    AddGuestCodeView, ListGuestCodesView,

    ListHousesView, AddHouseView, DeleteHouseView,

    GetTodaysHouseDevicesActivityView,

    AddAutomationView, DeleteAutomationView, DeviceAutomationsListView,

    PowerSaveView,
    SickDeviceCountView, PetStateView, UpdatePetView, UpdatePetRewardsView,
    UpdatePetMoodView, ResetPetView
)




urlpatterns = [

    path('landlords/', LandlordListView.as_view(), name='landlord-list'),
    path('user-has-access/', UserAccessView.as_view(), name='user-has-access'),

    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('login-guest/', GuestLoginView.as_view(), name='login-guest'),


    path('houses/', ListHousesView.as_view(), name='list_houses'),
    path('houses/add/', AddHouseView.as_view(), name='add_house'),
    path('houses/delete/<int:house_id>/', DeleteHouseView.as_view(), name='delete_house'),

    path('houses/<int:house_id>/add-guest/', AddGuestCodeView.as_view(), name='add-guest'),
    path('houses/<int:house_id>/list-guests/', ListGuestCodesView.as_view(), name='list-guest'),


    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #Pet
    path('house/<int:house_id>/pet/', PetStateView.as_view(), name='get-pet'),
    path('<int:pet_id>/update-pet/', UpdatePetView.as_view(), name='update-pet'),
    path('<int:pet_id>/update-pet-rewards/', UpdatePetRewardsView.as_view(), name='update-pet-rewards'),
    path('pets/<int:pet_id>/update-mood/', UpdatePetMoodView.as_view(), name='update-pet-mood'),
    path('house/<int:house_id>/sick-devices/', SickDeviceCountView.as_view(), name='get-sick-count'),
    path('pets/<int:pet_id>/reset/', ResetPetView.as_view(), name='reset-pet'),



    #path('rooms/', RoomListView.as_view(), name='room-list'),
    path('houses/<int:house_id>/rooms/', RoomListByHouseView.as_view(), name='room-list-by-house'),
    path('houses/<int:house_id>/add-room/', AddRoomView.as_view(), name='add-room'),
    path('delete-room/<int:room_id>/', DeleteRoomView.as_view(), name='delete-room'),
    path('add-device/', AddDeviceView.as_view(), name='add-device'),
    path('delete-device/<int:device_id>/', DeleteDeviceView.as_view(), name='delete-device'),

    path('update-device-status/<int:device_id>/', UpdateDeviceStatusView.as_view(), name='update-device-status'),

    path('power-save/<int:device_id>/', PowerSaveView.as_view(), name='power-save'),

    #energy
    path('energy/', EnergyListView.as_view(), name='energy-list'),
    path('energy/<int:device_id>/', EnergyListView.as_view(), name='energy-detail'),
    path('device/<int:device_id>/update_energy/', UpdateEnergyConsumptionView.as_view(), name='update-energy-consumption'),
    path('device/<int:device_id>/set_energy/', SetEnergyConsumptionView.as_view(), name='set-energy-consumption'),


    #activity
    path('device/<int:device_id>/activity/add-action/', AddDeviceActionView.as_view(), name='add_device_action'),
    path('device/<int:device_id>/get-activity/', GetDeviceActivityView.as_view(), name='get-device-activity'),
    path('get-daily-activity/', GetTodaysAllDevicesActivityView.as_view(), name='get-daily-activity'),
    path('get-daily-activity/<int:house_id>/', GetTodaysHouseDevicesActivityView.as_view(), name='get-house-activity'),



    #automation
    path('automations/add/', AddAutomationView.as_view(), name='create-automation'),
    path('automations/delete/', DeleteAutomationView.as_view(), name='delete-automation'),
    path('automations-list/device/<int:device_id>/', DeviceAutomationsListView.as_view(), name='device-automations'),



    #full device info
    path('device/<int:device_id>/get_device_info/', GetDeviceInfoView.as_view(), name='get_device_info'),
    path('device/<int:device_id>/get_device_health/', GetDeviceHealthView.as_view(), name='get_device_health'),
    path('device/<int:device_id>/update_device_info/', UpdateDeviceView.as_view(), name='update_television'),
]