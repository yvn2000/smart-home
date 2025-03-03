from django.contrib import admin
from .models import Device
from .models import Room, Energy, ActivityLog, Automation
from .models import User, House, GuestCode, Pet


from .models import (
    AirConditioner, Light, Television, AirPurifier, Thermostat, Blinds, SmartLock,
    Fridge, WashingMachine, Oven, Speaker, CoffeeMaker, Roomba, Room, Device
)

# Register your models here.

admin.site.register(Device)
admin.site.register(Room)
admin.site.register(Energy)
admin.site.register(ActivityLog)
admin.site.register(Automation)

admin.site.register(User)
admin.site.register(House)
admin.site.register(Pet)
admin.site.register(GuestCode)


admin.site.register(AirConditioner)
admin.site.register(Light)
admin.site.register(Television)
admin.site.register(AirPurifier)
admin.site.register(Thermostat)
admin.site.register(Blinds)
admin.site.register(SmartLock)
admin.site.register(Fridge)
admin.site.register(WashingMachine)
admin.site.register(Oven)
admin.site.register(Speaker)
admin.site.register(CoffeeMaker)
admin.site.register(Roomba)

