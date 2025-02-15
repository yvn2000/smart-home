from rest_framework import serializers
from ..models import Room, Device

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    devices = DeviceSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ('room_id', 'name', 'temperature', 'devices')