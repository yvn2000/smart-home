from rest_framework import serializers
from ..models import Room, Device, Energy, User, House, GuestCode, Automation, Pet, Thermo

from ..models import (
    AirConditioner, Light, Television, AirPurifier, Blinds, SmartLock,
    Fridge, WashingMachine, Oven, Speaker, CoffeeMaker, Roomba, Room, Device
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'user_type']


class HouseSerializer(serializers.ModelSerializer):
    owner = UserSerializer()
    landlord = UserSerializer()

    class Meta:
        model = House
        fields = ['id', 'name', 'owner', 'landlord']


class PetSerializer(serializers.ModelSerializer):
    unlocked_hats = serializers.ListField(child=serializers.CharField())
    unlocked_bgs = serializers.ListField(child=serializers.CharField())
    
    class Meta:
        model = Pet
        fields = '__all__'



class GuestCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuestCode
        fields = ["id", "code"]


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    devices = DeviceSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ('room_id', 'name', 'temperature', 'devices')

class EnergySerializer(serializers.ModelSerializer):
    class Meta:
        model = Energy
        fields = '__all__'




class AutomationSerializer(serializers.ModelSerializer):
    device_id = serializers.IntegerField(write_only=True)
    start_time = serializers.DateTimeField(required=False)
    end_time = serializers.DateTimeField(required=False)
    phrase = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Automation
        fields = [
            'auto_id',
            'device_id', 'automation_type', 'function',
            'start_time', 'end_time', 'phrase', 'active'
        ]

    def validate(self, data):
        # Existing validation logic
        return data

    def create(self, validated_data):
        # Explicitly handle device relationship
        device = Device.objects.get(pk=validated_data.pop('device_id'))
        return Automation.objects.create(device=device, **validated_data)



class ThermoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thermo
        fields = ['thermo_id', 'temperature', 'mode', 'code']








class TelevisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Television
        fields = '__all__'


# Serializer for AirConditioner
class AirConditionerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirConditioner
        fields = '__all__'  # Or specify the fields you want to include

# Serializer for Light
class LightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Light
        fields = '__all__'


# Similarly, create serializers for other models
class AirPurifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirPurifier
        fields = '__all__'


class BlindsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blinds
        fields = '__all__'

class SmartLockSerializer(serializers.ModelSerializer):
    class Meta:
        model = SmartLock
        fields = '__all__'

class FridgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fridge
        fields = '__all__'

class WashingMachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = WashingMachine
        fields = '__all__'

class OvenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oven
        fields = '__all__'

class SpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speaker
        fields = '__all__'

class CoffeeMakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoffeeMaker
        fields = '__all__'

class RoombaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roomba
        fields = '__all__'




