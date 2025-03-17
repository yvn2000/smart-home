from django.db import transaction, IntegrityError
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password, check_password
#from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed  # Import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import User
from ..models import House, GuestCode, Pet, Thermo
from .serializers import UserSerializer, HouseSerializer, GuestCodeSerializer, PetSerializer, ThermoSerializer

from ..models import Room, Device, Energy, ActivityLog, Automation
from django.utils.timezone import now, localtime

from ..models import (
    AirConditioner, Light, Television, AirPurifier, Blinds, SmartLock,
    Fridge, WashingMachine, Oven, Speaker, CoffeeMaker, Roomba
)

from .serializers import RoomSerializer, DeviceSerializer, EnergySerializer, AutomationSerializer

from .serializers import (
    AirConditionerSerializer, LightSerializer, TelevisionSerializer,
    AirPurifierSerializer, BlindsSerializer,
    SmartLockSerializer, FridgeSerializer, WashingMachineSerializer,
    OvenSerializer, SpeakerSerializer, CoffeeMakerSerializer, RoombaSerializer,
)

import logging

# Set up logging
logger = logging.getLogger(__name__)

class TokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        print(str(refresh_token))

        if not refresh_token:
            print("not refresh token")
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create a refresh token object from the provided refresh token
            print("before refreshing")
            refresh = RefreshToken(refresh_token)
            new_access_token = str(refresh.access_token)  # This is the new access token
            print("Refreshed token: ",new_access_token)

            return Response({"access_token": new_access_token}, status=status.HTTP_200_OK)
        except Exception as e:
            print()
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LandlordListView(APIView):
    def get(self, request):
        landlords = User.objects.filter(user_type=User.LANDLORD)
        serializer = UserSerializer(landlords, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserAccessView(APIView):
    """
    View to check if a user has access to statistics, device control, and pet features.
    """
    
    def post(self, request):
        token = request.data.get("token")
        
        if not token:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Decode JWT token
            access_token = AccessToken(token)
            user_id = access_token["user_id"]
            user = User.objects.get(id=user_id)
            
            # Return access permissions
            return Response({
                "has_access_to_statistics": user.has_access_to_statistics(),
                "has_access_to_device_control": user.has_access_to_device_control(),
                "has_access_to_pet": user.has_access_to_pet(),
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



#Register/Login

class RegisterUserView(APIView):
    """
    Register a new Home Owner or Landlord.
    """
    permission_classes = [AllowAny]  # Allow anyone to register

    def post(self, request):
        data = request.data
        print("Request Data:", request.data)  # Debugging

        required_fields = ["first_name", "last_name", "email", "password", "confirm_password", "account_type"]

        # Check if all required fields are present
        for field in required_fields:
            if field not in data:
                return Response({"error": f"Missing field: {field}"}, status=status.HTTP_400_BAD_REQUEST)

        first_name = data["first_name"]
        last_name = data["last_name"]
        email = data["email"]
        password = data["password"]
        confirm_password = data["confirm_password"]
        user_type = data["account_type"].lower().replace(" ", "_")  # Convert to match enum keys

        # Validate passwords
        if password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate account type
        if user_type not in [User.HOME_OWNER, User.LANDLORD]:  # Use the constants from User model
            return Response({"error": "Invalid account type"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST)

        #  Create user properly
        user = User.objects.create_user(
            username=email,  # Using email as username
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
        )

        # ✅ Assign `user_type` and Save Again
        user.user_type = user_type
        user.save()

        print("User Created:", user)  # Debugging

        return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    Login for Home Owner and Landlord.
    """

    permission_classes = [AllowAny]  # Allow anyone to login
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)


        try:
            # Fetch the user by email
            user = User.objects.get(email=email)

            # Check if the password matches the hashed password
            if not check_password(password, user.password):
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            #else:
                #print("User Exists: ", email, password, user.password)

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        login(request, user)
        #return Response({"message": "Login successful", "user_type": user.user_type}, status=status.HTTP_200_OK)

        # Generate JWT Token
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user_name": user.first_name,
            "last_name": user.last_name,
            "user_type": user.user_type,
            "has_device_access": user.has_access_to_device_control(),
            "has_stats_access": user.has_access_to_statistics(),
            "has_pet_access": user.has_access_to_pet(),
            "isNew": user.new_user,
        }, status=status.HTTP_200_OK)


class GuestLoginView(APIView):
    """
    Guest login using house name and guest code.
    """
    def post(self, request):
        house_id = request.data.get("house_id")
        guest_code = request.data.get("guest_code")

        if not house_name or not guest_code:
            return Response({"error": "House name and guest code are required"}, status=status.HTTP_400_BAD_REQUEST)

        #house = get_object_or_404(House, name=house_name)
        #guest_user = get_object_or_404(User, user_type=User.GUEST, house=house, guest_code=guest_code)

        try:
            house = House.objects.get(id=house_id)
            user = User.objects.get(house=house, guest_code=guest_code, user_type=User.GUEST)
        except (House.DoesNotExist, User.DoesNotExist):
            return Response({"error": "Invalid house or guest code"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate JWT Token
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Guest login successful",
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user_type": user.user_type
        }, status=status.HTTP_200_OK)

        #return Response({"message": "Guest login successful", "house": house.name}, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    """
    Get First Name, Last Name and User Type.
    """

    def post(self, request):
        token = request.data.get("token")  # Token sent in the body

        if not token:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the JWT token without any authentication checks
            access_token = AccessToken(token)
            user_id = access_token['user_id']  # Extract the user ID from the token
            user = User.objects.get(id=user_id)  # Get the user object by the user_id

            first_name = user.first_name
            last_name = user.last_name
            user_type = user.user_type


            return Response({"first_name": first_name, "last_name": last_name, "user_type":user_type}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UpdateUserNameView(APIView):
    """
    Update First Name and Last Name.
    """

    def post(self, request):
        token = request.data.get("token")  # Token sent in the body

        if not token:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the JWT token without any authentication checks
            access_token = AccessToken(token)
            user_id = access_token['user_id']  # Extract the user ID from the token
            user = User.objects.get(id=user_id)  # Get the user object by the user_id

            newFirst = request.data.get("firstName")
            newLast = request.data.get("lastName")

            user.first_name = newFirst
            user.last_name = newLast

            user.save()


            return Response({"message": "User Name Updated"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserNoobView(APIView):
    def post(self, request):
        token = request.data.get("token")  # Token sent in the body

        if not token:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the JWT token without any authentication checks
            access_token = AccessToken(token)
            user_id = access_token['user_id']  # Extract the user ID from the token
            user = User.objects.get(id=user_id)  # Get the user object by the user_id

            noobility = request.data.get("noobility")

            if noobility == False:
                print("Not a Noob >:)")
                return Response({"message": "Not a Noob >:)"}, status=status.HTTP_200_OK)

            user.new_user = False

            user.save()


            return Response({"message": "User Noobility Updated"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


#House

class ListHousesView(APIView):
    """
    List all houses (for Home Owner or Landlord).
    """

    def post(self, request):
        token = request.data.get("token")  # Token sent in the body

        if not token:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the JWT token without any authentication checks
            access_token = AccessToken(token)
            user_id = access_token['user_id']  # Extract the user ID from the token
            user = User.objects.get(id=user_id)  # Get the user object by the user_id

            houses = []

            if user.user_type == User.HOME_OWNER:
                houses = House.objects.filter(owner=user)
            elif user.user_type == User.LANDLORD:
                houses = House.objects.filter(landlord=user)

            # Serialize the houses
            houses_data = HouseSerializer(houses, many=True).data
            return Response(houses_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AddHouseView(APIView):
    """
    Add a new house (for Home Owner).
    
    """

    def post(self, request):

        token = request.data.get("token")  # Token sent in the body
        landlord_email = request.data.get("landlord_email")
        house_name = request.data.get("house_name")

        if not token:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)


        try:
            # Decode the JWT token without any authentication checks
            access_token = AccessToken(token)
            user_id = access_token['user_id']  # Extract the user ID from the token
            user = User.objects.get(id=user_id)  # Get the user object by the user_id


            landlord=User.objects.get(email=landlord_email)


            house = House.objects.create(
                name=house_name,
                owner=user,
                landlord=landlord,
            )

            Pet.objects.create(house=house)

            house.save()
            
            print(f"House created: {house.name}, Owner: {house.owner}, Landlord: {house.landlord}")
            print(f"House & Pet created: {house.name}")
            #return Response(house, status=status.HTTP_200_OK)
            return Response({
                "house": HouseSerializer(house).data,
                "pet": PetSerializer(house.pet).data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("Error:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DeleteHouseView(APIView):
    """
    Delete a house (for Home Owner).
    """

    #permission_classes = [IsAuthenticated]  # Only authenticated users can access

    def delete(self, request, house_id):
        token = request.data.get("token")
        access_token = AccessToken(token)
        user_id = access_token['user_id']  # Extract the user ID from the token
        user = User.objects.get(id=user_id)  # Get the user object by the user_id
        try:
            house = House.objects.get(id=house_id)
        except House.DoesNotExist:
            return Response({"error": "House not found"}, status=status.HTTP_404_NOT_FOUND)

        # Only Home Owners can delete their own houses
        if house.owner != user:
            print("You can only delete your own house.")
            return Response({"error": "You can only delete your own house."}, status=status.HTTP_403_FORBIDDEN)

        house.delete()
        return Response({"message": "House deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class AssignExistingHouseView(APIView):
    """
    Assign an existing house to an owner or landlord.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.user_type not in [User.HOME_OWNER, User.LANDLORD]:
            return Response({"error": "Only Home Owners or Landlords can assign a house"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        house_id = data.get("house_id")
        user_id = data.get("user_id")

        house = get_object_or_404(House, id=house_id)
        user = get_object_or_404(User, id=user_id)

        if user.user_type == User.HOME_OWNER:
            house.owner = user
        elif user.user_type == User.LANDLORD:
            house.landlord = user
        else:
            return Response({"error": "User must be a Home Owner or Landlord"}, status=status.HTTP_400_BAD_REQUEST)

        house.save()
        return Response({"message": "User assigned to house successfully"}, status=status.HTTP_200_OK)


#Thermostat

class AddThermostatView(APIView):
    def post(self, request, house_id):
        house = get_object_or_404(House, id=house_id)
        thermo_code = request.data.get("code")

        print(thermo_code)
        
        # Check if house already has a thermostat
        if hasattr(house, 'thermostat'):
            return Response(
                {"error": "House already has a thermostat"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate input data
        temperature = 22.0
        mode = 'Cool'

        print(mode, temperature)
        
        try:
            temperature = float(temperature)
        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid temperature value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if mode not in dict(Thermo.MODE_CHOICES):
            return Response(
                {"error": "Invalid thermostat mode"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(thermo_code)!=10:
            return Response(
                {"error": "Invalid thermostat code: not 10 characters"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create thermostat
        thermostat = Thermo.objects.create(
            house=house,
            temperature=temperature,
            mode=mode,
            code=thermo_code,
        )

        print(thermostat)
        
        return Response({
            "id": thermostat.thermo_id,
            "temperature": thermostat.temperature,
            "mode": thermostat.mode,
            "code": thermostat.code,
        }, status=status.HTTP_201_CREATED)

class DeleteThermostatView(APIView):
    def delete(self, request, house_id):
        house = get_object_or_404(House, id=house_id)
        
        if not hasattr(house, 'thermostat'):
            return Response(
                {"error": "No thermostat exists for this house"},
                status=status.HTTP_404_NOT_FOUND
            )
            
        house.thermostat.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UpdateThermostatView(APIView):
     def post(self, request, house_id):

        try:
            house = get_object_or_404(House, id=house_id)
            thermostat = house.thermostat
            temp = request.data.get("temperature")
            newMode = request.data.get("mode")
        except Thermo.DoesNotExist:
            return Response({"error": "Thermostat not found"}, status=status.HTTP_404_NOT_FOUND)
        except House.DoesNotExist:
            return Response({"error": "House not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            thermostat.temperature=float(temp)
            thermostat.mode=newMode
            thermostat.save()
            return Response({
                "temperature": thermostat.temperature,
                "mode": thermostat.mode,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class GetThermostatView(APIView):
     def get(self, request, house_id):

        try:
            house = get_object_or_404(House, id=house_id)
            thermostat = house.thermostat
        except Thermo.DoesNotExist:
            return Response({"error": "Thermostat not found"}, status=status.HTTP_404_NOT_FOUND)
        except House.DoesNotExist:
            return Response({"error": "House not found"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            "temperature": thermostat.temperature,
            "mode": thermostat.mode,
            "code": thermostat.code,
        }, status=status.HTTP_201_CREATED)






class AddGuestCodeView(APIView):
    def post(self, request, house_id):
        """
        Adds a new 4-digit guest code to a specific house.
        """
        house = get_object_or_404(House, id=house_id)
        code = request.data.get("code")

        # Validate that code is exactly 4 digits
        if not code or not code.isdigit() or len(code) != 4:
            return Response({"error": "Guest code must be a 4-digit number."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the code already exists for this house
        if GuestCode.objects.filter(house=house, code=code).exists():
            return Response({"error": "This guest code already exists for this house."}, status=status.HTTP_400_BAD_REQUEST)

        # Create and save the new guest code
        guest_code = GuestCode.objects.create(house=house, code=code)
        return Response({"message": "Guest code added successfully.", "guest_code": guest_code.code}, status=status.HTTP_201_CREATED)

class ListGuestCodesView(APIView):
    def get(self, request, house_id):
        """
        Lists all guest codes for a specific house.
        """
        house = get_object_or_404(House, id=house_id)
        guest_codes = GuestCode.objects.filter(house=house)
        
        serializer = GuestCodeSerializer(guest_codes, many=True)
        return Response({"house": house.name, "guest_codes": serializer.data}, status=status.HTTP_200_OK)

class DeleteGuestCodeView(APIView):
    def delete(self, request, house_id):
        try:
            house = House.objects.get(id=house_id)
            code = request.data.get("code")

            
            if not code or not code.isdigit() or len(code) != 4:
                return Response({"error": "Guest code must be a 4-digit number."}, status=status.HTTP_400_BAD_REQUEST)

            
            try:
                guest_code = GuestCode.objects.get(house=house, code=code)
                guest_code.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
                
            except GuestCode.DoesNotExist:
                return Response({"error": "Guest code does not exist."}, status=status.HTTP_404_NOT_FOUND)

        except House.DoesNotExist:
            return Response({"error": "House not found."}, status=status.HTTP_404_NOT_FOUND)

        





#Rooms


class RoomListByHouseView(APIView):
    def get(self, request, house_id):
        try:
            house = House.objects.get(id=house_id)  # Retrieve the house
            rooms = Room.objects.filter(house=house)  # Get all rooms in the house
            serializer = RoomSerializer(rooms, many=True)  # Serialize room data
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except House.DoesNotExist:
            return Response({"error": "House not found"}, status=status.HTTP_404_NOT_FOUND)


class AddRoomView(APIView):
    def post(self, request, house_id):
        """
        Add a new room to a house.
        """
        house = get_object_or_404(House, id=house_id)
        serializer = RoomSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(house=house)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteRoomView(APIView):
    def delete(self, request, room_id):
        """
        Delete a room by its ID.
        """
        room = get_object_or_404(Room, room_id=room_id)
        room.delete()
        return Response({"message": "Room deleted successfully"}, status=status.HTTP_204_NO_CONTENT)




#Devices


class AddDeviceView(APIView):
    def post(self, request):
        serializer = DeviceSerializer(data=request.data)

        if serializer.is_valid():

            
            logo = request.data.get('logo')

            # Check the logo and create the respective device model instance
            if logo == 'air-conditioner':
                #AirConditionerSerializer(data=request.data).is_valid(raise_exception=True)
                AirConditioner.objects.create(**serializer.validated_data)
            elif logo == 'lamp-outline':
                #LightSerializer(data=request.data).is_valid(raise_exception=True)
                Light.objects.create(**serializer.validated_data)
            elif logo == 'television':
                #TelevisionSerializer(data=request.data).is_valid(raise_exception=True)
                Television.objects.create(**serializer.validated_data)
            elif logo == 'air-filter':
                #AirFilterSerializer(data=request.data).is_valid(raise_exception=True)
                AirPurifier.objects.create(**serializer.validated_data)
            elif logo == 'blinds':
                #BlindsSerializer(data=request.data).is_valid(raise_exception=True)
                Blinds.objects.create(**serializer.validated_data)
            elif logo == 'door':
                #DoorSerializer(data=request.data).is_valid(raise_exception=True)
                SmartLock.objects.create(**serializer.validated_data)
            elif logo == 'fridge-outline':
                #FridgeSerializer(data=request.data).is_valid(raise_exception=True)
                Fridge.objects.create(**serializer.validated_data)
            elif logo == 'washing-machine':
                #WashingMachineSerializer(data=request.data).is_valid(raise_exception=True)
                WashingMachine.objects.create(**serializer.validated_data)
            elif logo == 'toaster-oven':
                #ToasterOvenSerializer(data=request.data).is_valid(raise_exception=True)
                Oven.objects.create(**serializer.validated_data)
            elif logo == 'speaker':
                #SpeakerSerializer(data=request.data).is_valid(raise_exception=True)
                Speaker.objects.create(**serializer.validated_data)
            elif logo == 'coffee-maker-outline':
                #CoffeeMakerSerializer(data=request.data).is_valid(raise_exception=True)
                CoffeeMaker.objects.create(**serializer.validated_data)
            elif logo == 'robot-vacuum':
                #RobotVacuumSerializer(data=request.data).is_valid(raise_exception=True)
                Roomba.objects.create(**serializer.validated_data)
            #else:
                #return Response({'error': 'Invalid logo type'}, status=status.HTTP_400_BAD_REQUEST)
            
            

            #serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteDeviceView(APIView):
    def delete(self, request, device_id):
        try:

            device = Device.objects.get(device_id=device_id)



            device.delete()

            logger.info(f"Device with ID: {device_id} deleted successfully")
            return Response({'message': 'device deleted'}, status=status.HTTP_200_OK)

        except Device.DoesNotExist:
            logger.error(f"Device with ID: {device_id} not found")
            return Response({'error': 'device not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error occurred while deleting device with ID {device_id}: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class UpdateDeviceStatusView(APIView):
    def post(self, request, device_id):
        status_value = request.POST.get("status")  # Using request.POST instead of JSON
        status_bool = True


        if status_value not in ["on", "off"]:
            return Response({"error": "Invalid status. Must be 'on' or 'off'."}, status=status.HTTP_400_BAD_REQUEST)


        if (status_value=="on"):
            status_bool = True
        else:
            status_bool = False

        print("New Value: ", status_value)


        try:
            device = Device.objects.get(device_id=device_id)
            print("Old Value ", device.status)
            device.status = status_value
            #device.status = 'off'
            device.statusBool = status_bool
            device.save()
            print("Saved value? ", device.status)

            device_type = None

            try:
                device_type = AirConditioner.objects.get(device_id=device_id)

                house_id = device_type.room.house.id  # Direct access

                house = House.objects.get(pk=house_id)
                pet = house.pet

                old_health = device_type.get_health_status()

                if (status_bool==True):
                    if (device.power_save==True):
                        device.energy_consumption = device_type.base_energy
                    else:
                        device.energy_consumption = device_type.base_energy + device.extra_energy
                else:
                    device.energy_consumption = 0
                device.save()

                new_health = AirConditioner.objects.get(device_id=device_id).get_health_status()
                #print("Old Health: ", old_health, ", New Health: "+new_health)

                if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                    pet.actual_xp += 5
                                
                pet.save()

            except AirConditioner.DoesNotExist:
                pass

            if not device_type:
                try:
                    device_type = Light.objects.get(device_id=device_id)

                    house_id = device_type.room.house.id  # Direct access

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device_type.get_health_status()

                    if (status_bool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device_type.base_energy
                        else:
                            device.energy_consumption = device_type.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0
                    device.save()

                    new_health = Light.objects.get(device_id=device_id).get_health_status()
                    #print("Old Health: ", old_health, ", New Health: "+new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()

                except Light.DoesNotExist:
                    pass
            
            if not device_type:
                try:
                    device_type = Television.objects.get(device_id=device_id)

                    house_id = device_type.room.house.id  # Direct access

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device_type.get_health_status()

                    if (status_bool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device_type.base_energy
                        else:
                            device.energy_consumption = device_type.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0
                    
                    device.save()

                    new_health = Television.objects.get(device_id=device_id).get_health_status()
                    print("Old Health: ", old_health, ", New Health: ", new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()


                except Television.DoesNotExist:
                    pass
            
            if not device_type:
                try:
                    device_type = AirPurifier.objects.get(device_id=device_id)

                    house_id = device_type.room.house.id  # Direct access

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device_type.get_health_status()

                    if (status_bool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device_type.base_energy
                        else:
                            device.energy_consumption = device_type.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0
                    device.save()

                    new_health = AirPurifier.objects.get(device_id=device_id).get_health_status()
                    #print("Old Health: ", old_health, ", New Health: ", new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()

                except AirPurifier.DoesNotExist:
                    pass

            

            if not device_type:
                try:
                    device_type = Blinds.objects.get(device_id=device_id)

                    house_id = device_type.room.house.id  # Direct access

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device_type.get_health_status()


                    if (status_bool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device_type.base_energy
                        else:
                            device.energy_consumption = device_type.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0
                    device.save()

                    new_health = Blinds.objects.get(device_id=device_id).get_health_status()
                    #print("Old Health: ", old_health, ", New Health: ", new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()

                except Blinds.DoesNotExist:
                    pass

            if not device_type:
                try:
                    device_type = SmartLock.objects.get(device_id=device_id)

                    house_id = device_type.room.house.id  # Direct access

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device_type.get_health_status()


                    if (status_bool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device_type.base_energy
                        else:
                            device.energy_consumption = device_type.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0
                    device.save()

                    new_health = SmartLock.objects.get(device_id=device_id).get_health_status()
                    #print("Old Health: ", old_health, ", New Health: ", new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()


                except SmartLock.DoesNotExist:
                    pass

            if not device_type:
                try:
                    device_type = Fridge.objects.get(device_id=device_id)

                    house_id = device_type.room.house.id  # Direct access

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device_type.get_health_status()


                    if (status_bool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device_type.base_energy
                        else:
                            device.energy_consumption = device_type.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0
                    device.save()

                    new_health = Fridge.objects.get(device_id=device_id).get_health_status()
                    #print("Old Health: ", old_health, ", New Health: ", new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()

                except Fridge.DoesNotExist:
                    pass

            if not device_type:
                try:
                    device_type = WashingMachine.objects.get(device_id=device_id)

                    house_id = device_type.room.house.id  # Direct access

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device_type.get_health_status()

                    if (status_bool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device_type.base_energy
                        else:
                            device.energy_consumption = device_type.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0
                    device.save()

                    new_health = WashingMachine.objects.get(device_id=device_id).get_health_status()
                    #print("Old Health: ", old_health, ", New Health: ", new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()


                except WashingMachine.DoesNotExist:
                    pass

            if not device_type:
                try:
                    device_type = Oven.objects.get(device_id=device_id)

                    house_id = device_type.room.house.id  # Direct access

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device_type.get_health_status()

                    if (status_bool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device_type.base_energy
                        else:
                            device.energy_consumption = device_type.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0
                    device.save()

                    new_health = device_type.get_health_status()
                    #print("Old Health: ", old_health, ", New Health: ", new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()

                except Oven.DoesNotExist:
                    pass

            if not device_type:
                try:
                    device_type = Speaker.objects.get(device_id=device_id)

                    house_id = device_type.room.house.id  # Direct access

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device_type.get_health_status()


                    if (status_bool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device_type.base_energy
                        else:
                            device.energy_consumption = device_type.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0
                    device.save()

                    
                    new_health = Speaker.objects.get(device_id=device_id).get_health_status()
                    #print("Old Health: ", old_health, ", New Health: ", new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()

                except Speaker.DoesNotExist:
                    pass

            if not device_type:
                try:
                    device_type = CoffeeMaker.objects.get(device_id=device_id)

                    house_id = device_type.room.house.id  # Direct access

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device_type.get_health_status()

                    if (status_bool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device_type.base_energy
                        else:
                            device.energy_consumption = device_type.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0
                    device.save()

                    new_health = CoffeeMaker.objects.get(device_id=device_id).get_health_status()
                    #print("Old Health: ", old_health, ", New Health: ", new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()

                except CoffeeMaker.DoesNotExist:
                    pass

            if not device_type:
                try:
                    device_type = Roomba.objects.get(device_id=device_id)

                    house_id = device_type.room.house.id  # Direct access

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device_type.get_health_status()


                    if (status_bool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device_type.base_energy
                        else:
                            device.energy_consumption = device_type.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0
                    device.save()

                    new_health = Roomba.objects.get(device_id=device_id).get_health_status()
                    #print("Old Health: ", old_health, ", New Health: ", new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()


                except Roomba.DoesNotExist:
                    pass


            if not device_type:
                return Response({'detail': 'Device not found.'}, status=status.HTTP_404_NOT_FOUND)

            return Response({"message": f"Device status updated to {status_value}"}, status=status.HTTP_200_OK)

        except Device.DoesNotExist:
            return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PowerSaveView(APIView):
    def post(self, request, device_id):
        try:
            #save_input = request.POST.get("power")  # Using request.POST instead of JSON
            save_input = request.data.get("power")
            
            if not isinstance(save_input, bool):
                return Response({'error': 'Invalid input - must be boolean'}, 
                               status=status.HTTP_400_BAD_REQUEST)

            device = Device.objects.get(device_id=device_id)

            house_id = device.room.house.id  # Direct access

            house = House.objects.get(pk=house_id)
            pet = house.pet

            device_type = device.get_concrete_device()

            old_health = device_type.get_health_status()

            # Store previous state for energy calculation
            was_power_save = device.power_save
            device.power_save = save_input

            device.save()

            if (save_input==True):
                if (device.status=='on'):
                    device.energy_consumption = device.energy_consumption - device.extra_energy
            else:
                if (device.status=='on'):
                    device.energy_consumption = device.energy_consumption + device.extra_energy

            device.save()

            new_health = device.get_concrete_device().get_health_status()
            #print("Old Health: ", old_health, ", New Health: ", new_health)

            if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                pet.actual_xp += 5
                            
            pet.save()

            return Response({"message": f"Power Saving Mode Was Changed"}, status=status.HTTP_200_OK)
        

        except Device.DoesNotExist:
            return Response({'error': 'Device not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")  # Prints full error in console
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)








#Automation

class AddAutomationView(APIView):
    def post(self, request):
        serializer = AutomationSerializer(data=request.data)

        if serializer.is_valid():
            automation = serializer.save()
            return Response({
                'status': 'success',
                'automation_id': automation.pk
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class DeviceAutomationsListView(APIView):
    def get(self, request, device_id):
        try:
            device = Device.objects.get(pk=device_id)
            automations = Automation.objects.filter(device=device)
            serializer = AutomationSerializer(automations, many=True)

            automations_with_device = [
                {**automation, 'device_name': device.name} 
                for automation in serializer.data
            ]

            #print(automations_with_device)
            
            return Response({
                'status': 'success',
                'automations': automations_with_device
            }, status=status.HTTP_200_OK)
            
        except Device.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Device not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)



class DeleteAutomationView(APIView):
    def delete(self, request):
        automation_id = request.data.get('automation_id')
        if not automation_id:
            return Response({
                'status': 'error',
                'message': 'Automation ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            automation = Automation.objects.get(pk=automation_id)
            automation.delete()
            return Response({'status': 'success'}, status=status.HTTP_204_NO_CONTENT)
        except Automation.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Automation not found'
            }, status=status.HTTP_404_NOT_FOUND)





#Activity Log

class AddDeviceActionView(APIView):
    def post(self, request, device_id):
        action = request.data.get('action', None)

        if not action:
            return Response({'error': 'Action is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            #print(f"Received action: {action} for device {device_id}")

            device = Device.objects.get(device_id=device_id)
            #print(f"Device found: {device.name}")

            # Create new activity log entry
            ActivityLog.objects.create(device=device, action=action)
            #print("Activity log entry created.")

            # Delete only the oldest logs beyond the 5 most recent ones
            logs_to_delete = ActivityLog.objects.filter(
                device=device
            ).order_by('-timestamp').values_list('id', flat=True)[10:]

            ActivityLog.objects.filter(id__in=logs_to_delete).delete()
            #print(f"Deleted {len(logs_to_delete)} old logs.")

            # Get updated log
            latest_logs = ActivityLog.objects.filter(device=device).order_by('-timestamp')[:5]
            #print(f"Latest logs: {[log.action for log in latest_logs]}")

            return Response({
                'message': 'Action added successfully',
                'activity_log': [log.action for log in latest_logs]
            })

        except Device.DoesNotExist:
            return Response({'error': 'Device not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")  # Prints full error in console
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetDeviceActivityView(APIView):
    def get(self, request, device_id):
        try:
            # Check if device exists
            device = Device.objects.get(device_id=device_id)

            # Fetch the last 5 actions from ActivityLog (ordered by most recent)
            recent_actions = ActivityLog.objects.filter(device=device).order_by('-timestamp')[:10]

            # Extract only the action strings
            action_list = [log.action for log in recent_actions]

            return Response({"activity_log": action_list}, status=status.HTTP_200_OK)

        except Device.DoesNotExist:
            logger.error(f"Device with id {device_id} not found.")
            return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error occurred: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetTodaysAllDevicesActivityView(APIView):
    def get(self, request):
        try:
            # Get the current date
            today = localtime(now()).date()

            # Fetch all activity logs that occurred today, ordered by most recent
            recent_actions = ActivityLog.objects.filter(
                timestamp__date=today
            ).order_by('-timestamp')

            # Format response: Group by device
            activity_log = [
                {
                    "device_id": log.device.device_id,
                    "device_name": log.device.name,
                    "action": log.action,
                    "timestamp": log.timestamp
                }
                for log in recent_actions
            ]

            return Response({"activity_log": activity_log}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error occurred: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetTodaysHouseDevicesActivityView(APIView):
    def get(self, request, house_id):
        try:
            # Get the current date
            today = localtime(now()).date()

            # Ensure the house exists
            house = get_object_or_404(House, id=house_id)

            # Get all devices in that house (via rooms)
            devices_in_house = Device.objects.filter(room__house=house)

            # Fetch activity logs only for devices in this house
            recent_actions = ActivityLog.objects.filter(
                device__in=devices_in_house,
                timestamp__date=today
            ).order_by('-timestamp')

            # Format response: Group by device
            activity_log = [
                {
                    "device_id": log.device.device_id,
                    "device_name": log.device.name,
                    "action": log.action,
                    "timestamp": log.timestamp
                }
                for log in recent_actions
            ]

            return Response({"activity_log": activity_log}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error occurred: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#Energy

class EnergyListView(APIView):
    def get(self, request, device_id=None):
        if device_id:
            try:
                energy = Energy.objects.get(device_id=device_id)
                serializer = EnergySerializer(energy)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Energy.DoesNotExist:
                return Response({"error": "Energy data not found for this device"}, status=status.HTTP_404_NOT_FOUND)
        else:
            energy_data = Energy.objects.all()
            serializer = EnergySerializer(energy_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
class HouseEnergyView(APIView):
    def get(self, request, house_id):
        try:
            house = House.objects.get(pk=house_id)
            
            # Get all devices in the house through rooms
            devices = Device.objects.filter(room__house=house)
            
            total_energy = 0
            total_energy_1 = 0
            total_energy_2 = 0
            total_energy_3 = 0
            total_energy_4 = 0
            total_energy_5 = 0
            total_energy_6 = 0
            total_energy_7 = 0
            device_count = 0
            
            for device in devices:
                try:
                    energy = Energy.objects.get(device=device)
                    total_energy += energy.energy1
                    total_energy_1 += energy.energy1
                    total_energy_2 += energy.energy2
                    total_energy_3 += energy.energy3
                    total_energy_4 += energy.energy4
                    total_energy_5 += energy.energy5
                    total_energy_6 += energy.energy6
                    total_energy_7 += energy.energy7
                    device_count += 1
                except Energy.DoesNotExist:
                    continue
            
            return Response({
                "house_id": house_id,
                "total_devices": device_count,
                "total_energy": total_energy,
                "total_energy1": total_energy_1,
                "total_energy2": total_energy_2,
                "total_energy3": total_energy_3,
                "total_energy4": total_energy_4,
                "total_energy5": total_energy_5,
                "total_energy6": total_energy_6,
                "total_energy7": total_energy_7,
                "average_energy": total_energy / device_count if device_count > 0 else 0
            }, status=status.HTTP_200_OK)
            
        except House.DoesNotExist:
            return Response({"error": "House not found"}, status=status.HTTP_404_NOT_FOUND)

class UpdateEnergyConsumptionView(APIView):
    def patch(self, request, device_id):
        try:
            # Get the device by device_id
            device = Device.objects.get(device_id=device_id)
            
            # Get the value to add from the request (this would be passed in the request body)
            increment_value = request.data.get('increment_value')

            # Check if increment_value is provided and is a number
            if increment_value is None or not isinstance(increment_value, (int, float)):
                return Response({"error": "Invalid or missing 'increment_value'"}, status=status.HTTP_400_BAD_REQUEST)

            # Update the energy consumption by adding the increment value
            device.energy_consumption += increment_value
            device.save()  # Save the updated device

            return Response({"message": "Energy consumption updated successfully", "new_energy_consumption": device.energy_consumption}, status=status.HTTP_200_OK)

        except Device.DoesNotExist:
            return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SetEnergyConsumptionView(APIView):
    def patch(self, request, device_id):
        try:
            # Get the device by device_id
            device = Device.objects.get(device_id=device_id)
            
            # Get the value to add from the request (this would be passed in the request body)
            increment_value = request.data.get('increment_value')

            #print(f"Value: ", increment_value)

            # Check if increment_value is provided and is a number
            if increment_value is None or not isinstance(increment_value, (int, float)):
                return Response({"error": "Invalid or missing 'increment_value'"}, status=status.HTTP_400_BAD_REQUEST)


            # Ensure the device instance is up to date
            device.refresh_from_db()
            # Update the energy consumption by adding the increment value
            #with transaction.atomic():
            device.energy_consumption = increment_value
            #print(f"Before SAVE: Increment Value itself: ", increment_value)
            #print(f"Before SAVE: New Energy Consumption: ", device.energy_consumption)
            device.save()
            #print(f"AFTER SAVE: Increment Value itself: ", increment_value)
            #print(f"AFTER SAVE: New Energy Consumption: ", device.energy_consumption)
            #device.save(update_fields=['energy_consumption'])

            print(f"New Energy Consumption: ", device.energy_consumption)
            device.save()
            device.save()
            device.save()
            device.save()
            device.save()
            device.save()

            # Fetch again to verify
            # device.refresh_from_db()
            #print(f"After Update: {device.energy_consumption}")  # Debugging print

            return Response({"message": "Energy consumption updated successfully", "new_energy_consumption": device.energy_consumption}, status=status.HTTP_200_OK)

        except Device.DoesNotExist:
            return Response({"error": "Device not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#General Devices

class GetDeviceInfoView(APIView):
    def get(self, request, device_id):
        try:
            # Check if device exists by fetching it based on the device_id
            device = None
            device_type = None

            # Determine the device type (e.g., AirConditioner, Light, Television, etc.)
            try:
                device = AirConditioner.objects.get(device_id=device_id)
                device_type = 'AirConditioner'
            except AirConditioner.DoesNotExist:
                pass

            if not device:
                try:
                    device = Light.objects.get(device_id=device_id)
                    device_type = 'Light'
                except Light.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Television.objects.get(device_id=device_id)
                    device_type = 'Television'
                except Television.DoesNotExist:
                    pass

            if not device:
                try:
                    device = AirPurifier.objects.get(device_id=device_id)
                    device_type = 'AirPurifier'
                except AirPurifier.DoesNotExist:
                    pass


            if not device:
                try:
                    device = Blinds.objects.get(device_id=device_id)
                    device_type = 'Blinds'
                except Blinds.DoesNotExist:
                    pass

            if not device:
                try:
                    device = SmartLock.objects.get(device_id=device_id)
                    device_type = 'SmartLock'
                except SmartLock.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Fridge.objects.get(device_id=device_id)
                    device_type = 'Fridge'
                except Fridge.DoesNotExist:
                    pass

            if not device:
                try:
                    device = WashingMachine.objects.get(device_id=device_id)
                    device_type = 'WashingMachine'
                except WashingMachine.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Oven.objects.get(device_id=device_id)
                    device_type = 'Oven'
                except Oven.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Speaker.objects.get(device_id=device_id)
                    device_type = 'Speaker'
                except Speaker.DoesNotExist:
                    pass

            if not device:
                try:
                    device = CoffeeMaker.objects.get(device_id=device_id)
                    device_type = 'CoffeeMaker'
                except CoffeeMaker.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Roomba.objects.get(device_id=device_id)
                    device_type = 'Roomba'
                except Roomba.DoesNotExist:
                    pass

            # If device is still None, that means it was not found in any of the device models
            if not device:
                return Response({'detail': 'Device not found.'}, status=status.HTTP_404_NOT_FOUND)

            # Now, choose the correct serializer based on the device type
            if device_type == 'AirConditioner':
                serializer = AirConditionerSerializer(device)
            elif device_type == 'Light':
                serializer = LightSerializer(device)
            elif device_type == 'Television':
                serializer = TelevisionSerializer(device)
            elif device_type == 'AirPurifier':
                serializer = AirPurifierSerializer(device)
            elif device_type == 'Blinds':
                serializer = BlindsSerializer(device)
            elif device_type == 'SmartLock':
                serializer = SmartLockSerializer(device)
            elif device_type == 'Fridge':
                serializer = FridgeSerializer(device)
            elif device_type == 'WashingMachine':
                serializer = WashingMachineSerializer(device)
            elif device_type == 'Oven':
                serializer = OvenSerializer(device)
            elif device_type == 'Speaker':
                serializer = SpeakerSerializer(device)
            elif device_type == 'CoffeeMaker':
                serializer = CoffeeMakerSerializer(device)
            elif device_type == 'Roomba':
                serializer = RoombaSerializer(device)

            # Return the serialized data
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetDeviceHealthView(APIView):
    def get(self, request, device_id):
        try:
            # Check if device exists by fetching it based on the device_id
            device = None
            device_type = None

            # Determine the device type (e.g., AirConditioner, Light, Television, etc.)
            try:
                device = AirConditioner.objects.get(device_id=device_id)
                device_type = 'AirConditioner'
            except AirConditioner.DoesNotExist:
                pass

            if not device:
                try:
                    device = Light.objects.get(device_id=device_id)
                    device_type = 'Light'
                except Light.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Television.objects.get(device_id=device_id)
                    device_type = 'Television'
                except Television.DoesNotExist:
                    pass

            if not device:
                try:
                    device = AirPurifier.objects.get(device_id=device_id)
                    device_type = 'AirPurifier'
                except AirPurifier.DoesNotExist:
                    pass


            if not device:
                try:
                    device = Blinds.objects.get(device_id=device_id)
                    device_type = 'Blinds'
                except Blinds.DoesNotExist:
                    pass

            if not device:
                try:
                    device = SmartLock.objects.get(device_id=device_id)
                    device_type = 'SmartLock'
                except SmartLock.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Fridge.objects.get(device_id=device_id)
                    device_type = 'Fridge'
                except Fridge.DoesNotExist:
                    pass

            if not device:
                try:
                    device = WashingMachine.objects.get(device_id=device_id)
                    device_type = 'WashingMachine'
                except WashingMachine.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Oven.objects.get(device_id=device_id)
                    device_type = 'Oven'
                except Oven.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Speaker.objects.get(device_id=device_id)
                    device_type = 'Speaker'
                except Speaker.DoesNotExist:
                    pass

            if not device:
                try:
                    device = CoffeeMaker.objects.get(device_id=device_id)
                    device_type = 'CoffeeMaker'
                except CoffeeMaker.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Roomba.objects.get(device_id=device_id)
                    device_type = 'Roomba'
                except Roomba.DoesNotExist:
                    pass

            # If device is still None, that means it was not found in any of the device models
            if not device:
                return Response({'detail': 'Device not found.'}, status=status.HTTP_404_NOT_FOUND)

            health_status = device.get_health_status()

            # Return the health status in the response
            return Response({"device_id": device_id, "health_status": health_status}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpdateDeviceView(APIView):
    def post(self, request, device_id):
        try:
            # Check if device exists by fetching it based on the device_id
            device = None
            device_type = None

            # Determine the device type (e.g., AirConditioner, Light, Television, etc.)
            try:
                device = AirConditioner.objects.get(device_id=device_id)

                house_id = device.room.house.id  # Direct access

                #print("House ID: ", house_id)

                house = House.objects.get(pk=house_id)
                pet = house.pet





                old_health = device.get_health_status()

                device_type = 'AirConditioner'
                serializer = AirConditionerSerializer(device, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                
                

                fan_energy = 150 if device.fan_speed=='High' else 0

                device.extra_energy = fan_energy
                
                #print(device.fan_speed)
                #if (device.fan_speed=='High'):
                    #device.extra_energy += 150
                #else:
                    #if (device.extra_energy>0):
                        #device.extra_energy -= 150

                device.save()

                if (device.statusBool==True):
                    if (device.power_save==True):
                        device.energy_consumption = device.base_energy
                    else:
                        device.energy_consumption = device.base_energy + device.extra_energy
                else:
                    device.energy_consumption = 0

                
                device.save()

                new_health = device.get_health_status()
                print("Old Health: ", old_health, ", New Health: "+new_health)

                if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                    pet.actual_xp += 5
                
                pet.save()
                
                return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)

            except AirConditioner.DoesNotExist:
                pass

            if not device:
                try:
                    device = Light.objects.get(device_id=device_id)

                    house_id = device.room.house.id  # Direct access

                    #print("House ID: ", house_id)

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device.get_health_status()

                    device_type = 'Light'
                    serializer = LightSerializer(device, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                    

                    
                    intensity_energy = 180 if device.intensity>80 else 0

                    device.extra_energy = intensity_energy

                    
                    device.save()

                    if (device.statusBool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device.base_energy
                        else:
                            device.energy_consumption = device.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0

                    device.save()

                    new_health = device.get_health_status()
                    print("Old Health: ", old_health, ", New Health: "+new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()
                    
                    return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)

                except Light.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Television.objects.get(device_id=device_id)


                    house_id = device.room.house.id  # Direct access

                    #print("House ID: ", house_id)

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device.get_health_status()

                    device_type = 'Television'
                    serializer = TelevisionSerializer(device, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                    
                    brightness_energy = 120 if device.brightness > 80 else 0
                    input_energy = 100 if device.input_source == 'Stream' else 0
                    
                    device.extra_energy = brightness_energy + input_energy

                    device.save()

                    new_health = device.get_health_status()
                    #print("Old Health: ", old_health, ", New Health: "+new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()
                    

                    if (device.statusBool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device.base_energy
                        else:
                            device.energy_consumption = device.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0

                    device.save()

                    #print("Extra energy: ", device.extra_energy)
                    
                    return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)

                except Television.DoesNotExist:
                    pass


            if not device:
                try:
                    device = AirPurifier.objects.get(device_id=device_id)
                    device_type = 'AirPurifier'
                    serializer = AirPurifierSerializer(device, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
                except AirPurifier.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Blinds.objects.get(device_id=device_id)
                    device_type = 'Blinds'
                    serializer = BlindsSerializer(device, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
                except Blinds.DoesNotExist:
                    pass

            if not device:
                try:
                    device = SmartLock.objects.get(device_id=device_id)
                    device_type = 'SmartLock'
                    serializer = SmartLockSerializer(device, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
                except SmartLock.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Fridge.objects.get(device_id=device_id)
                    device_type = 'Fridge'
                    serializer = FridgeSerializer(device, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
                except Fridge.DoesNotExist:
                    pass

            if not device:
                try:
                    device = WashingMachine.objects.get(device_id=device_id)
                    device_type = 'WashingMachine'
                    serializer = WashingMachineSerializer(device, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
                except WashingMachine.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Oven.objects.get(device_id=device_id)
                    device_type = 'Oven'
                    serializer = OvenSerializer(device, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
                except Oven.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Speaker.objects.get(device_id=device_id)


                    house_id = device.room.house.id  # Direct access

                    #print("House ID: ", house_id)

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device.get_health_status()


                    device_type = 'Speaker'
                    serializer = SpeakerSerializer(device, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                    
                    vol_energy = 30 if device.volume>=70 else 0
                    
                    device.extra_energy = vol_energy

                    device.save()
                    

                    if (device.statusBool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device.base_energy
                        else:
                            device.energy_consumption = device.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0

                    device.save()

                    new_health = device.get_health_status()
                    #print("Old Health: ", old_health, ", New Health: "+new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()

                    #print("Extra energy: ", device.extra_energy)
                    
                    return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)

                except Speaker.DoesNotExist:
                    pass

            if not device:
                try:
                    device = CoffeeMaker.objects.get(device_id=device_id)
                    device_type = 'CoffeeMaker'
                    serializer = CoffeeMakerSerializer(device, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
                except CoffeeMaker.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Roomba.objects.get(device_id=device_id)

                    house_id = device.room.house.id  # Direct access

                    #print("House ID: ", house_id)

                    house = House.objects.get(pk=house_id)
                    pet = house.pet

                    old_health = device.get_health_status()


                    device_type = 'Roomba'
                    serializer = RoombaSerializer(device, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                    
                    mode_energy = 40 if device.mode=='Spotless' else 0
                    
                    device.extra_energy = mode_energy

                    device.save()
                    

                    if (device.statusBool==True):
                        if (device.power_save==True):
                            device.energy_consumption = device.base_energy
                        else:
                            device.energy_consumption = device.base_energy + device.extra_energy
                    else:
                        device.energy_consumption = 0

                    device.save()


                    new_health = device.get_health_status()
                    #print("Old Health: ", old_health, ", New Health: "+new_health)

                    if ((old_health=='Sick' or old_health=='Faulty') and (new_health=='Healthy')):
                        pet.actual_xp += 5
                                    
                    pet.save()


                    #print("Extra energy: ", device.extra_energy)
                    
                    return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)

                except Roomba.DoesNotExist:
                    pass

            # If device is still None, that means it was not found in any of the device models
            if not device:
                return Response({'detail': 'Device not found.'}, status=status.HTTP_404_NOT_FOUND)


            #if serializer.is_valid():
                #serializer.save()
                #return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#Television
'''
class GetTelevisionInfoView(APIView):
    def get(self, request, device_id):
        try:
            # Check if device exists
            television = Television.objects.get(device_id=device_id)

            serializer = TelevisionSerializer(television)

            print(f"Data: " ,serializer.data)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Television.DoesNotExist:
            return Response({'detail': 'Television not found.'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TelevisionHealthView(APIView):
    def get(self, request, device_id):
        try:
            # Fetch the air conditioner device by ID
            tv = Television.objects.get(device_id=device_id)

            # Get the health status using the model method
            health_status = tv.get_health_status()

            # Return the health status in the response
            return Response({"device_id": device_id, "health_status": health_status}, status=status.HTTP_200_OK)
        
        except Television.DoesNotExist:
            return Response({"error": "Television not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpdateTelevisionView(APIView):
    def post(self, request, device_id):
        try:
            television = Television.objects.get(device_id=device_id)
        except Television.DoesNotExist:
            return Response({'detail': 'Television not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Update the television properties with the data from the request
        serializer = TelevisionSerializer(television, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Television updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''




class GetDeviceInfoView(APIView):
    def get(self, request, device_id):
        try:
            # Check if device exists by fetching it based on the device_id
            device = None
            device_type = None

            # Determine the device type (e.g., AirConditioner, Light, Television, etc.)
            try:
                device = AirConditioner.objects.get(device_id=device_id)
                device_type = 'AirConditioner'
            except AirConditioner.DoesNotExist:
                pass

            if not device:
                try:
                    device = Light.objects.get(device_id=device_id)
                    device_type = 'Light'
                except Light.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Television.objects.get(device_id=device_id)
                    device_type = 'Television'
                except Television.DoesNotExist:
                    pass

            if not device:
                try:
                    device = AirPurifier.objects.get(device_id=device_id)
                    device_type = 'AirPurifier'
                except AirPurifier.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Blinds.objects.get(device_id=device_id)
                    device_type = 'Blinds'
                except Blinds.DoesNotExist:
                    pass

            if not device:
                try:
                    device = SmartLock.objects.get(device_id=device_id)
                    device_type = 'SmartLock'
                except SmartLock.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Fridge.objects.get(device_id=device_id)
                    device_type = 'Fridge'
                except Fridge.DoesNotExist:
                    pass

            if not device:
                try:
                    device = WashingMachine.objects.get(device_id=device_id)
                    device_type = 'WashingMachine'
                except WashingMachine.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Oven.objects.get(device_id=device_id)
                    device_type = 'Oven'
                except Oven.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Speaker.objects.get(device_id=device_id)
                    device_type = 'Speaker'
                except Speaker.DoesNotExist:
                    pass

            if not device:
                try:
                    device = CoffeeMaker.objects.get(device_id=device_id)
                    device_type = 'CoffeeMaker'
                except CoffeeMaker.DoesNotExist:
                    pass

            if not device:
                try:
                    device = Roomba.objects.get(device_id=device_id)
                    device_type = 'Roomba'
                except Roomba.DoesNotExist:
                    pass

            # If device is still None, that means it was not found in any of the device models
            if not device:
                return Response({'detail': 'Device not found.'}, status=status.HTTP_404_NOT_FOUND)

            # Now, choose the correct serializer based on the device type
            if device_type == 'AirConditioner':
                serializer = AirConditionerSerializer(device, data=request.data, partial=True)
            elif device_type == 'Light':
                serializer = LightSerializer(device, data=request.data, partial=True)
            elif device_type == 'Television':
                serializer = TelevisionSerializer(device, data=request.data, partial=True)
            elif device_type == 'AirPurifier':
                serializer = AirPurifierSerializer(device, data=request.data, partial=True)
            elif device_type == 'Blinds':
                serializer = BlindsSerializer(device, data=request.data, partial=True)
            elif device_type == 'SmartLock':
                serializer = SmartLockSerializer(device, data=request.data, partial=True)
            elif device_type == 'Fridge':
                serializer = FridgeSerializer(device, data=request.data, partial=True)
            elif device_type == 'WashingMachine':
                serializer = WashingMachineSerializer(device, data=request.data, partial=True)
            elif device_type == 'Oven':
                serializer = OvenSerializer(device, data=request.data, partial=True)
            elif device_type == 'Speaker':
                serializer = SpeakerSerializer(device, data=request.data, partial=True)
            elif device_type == 'CoffeeMaker':
                serializer = CoffeeMakerSerializer(device, data=request.data, partial=True)
            elif device_type == 'Roomba':
                serializer = RoombaSerializer(device, data=request.data, partial=True)

            # Return the serialized data
            #return Response(serializer.data, status=status.HTTP_200_OK)

            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Device updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#Pet
class PetStateView(APIView):
    def get(self, request, house_id):
        try:
            house = House.objects.get(pk=house_id)
            pet = house.pet  # Using OneToOne relationship
            
            data = {
                'pet_id': pet.pet_id,
                'pet_state': pet.mood,
                'current_hat': pet.current_hat,
                'current_bg': pet.current_bg,
                'unlocked_hats': pet.available_hats,
                'unlocked_bgs': pet.available_bgs,
                'pending_xp': pet.pending_xp,
                'actual_xp': pet.actual_xp,
            }
            #return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(data, status=status.HTTP_200_OK)
            
        except House.DoesNotExist:
            return Response({"error": "House not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdatePetView(APIView):
    def post(self, request, pet_id):
        try:
            pet = Pet.objects.get(pk=pet_id)

            newMood = request.data.get('newMood')
            newHat = request.data.get('newHat')
            newBG = request.data.get('newBG')

            pet.mood = newMood
            pet.current_hat = newHat
            pet.current_bg = newBG

            #print(pet.mood)
            #print(pet.current_hat)
            #print(pet.current_bg)

            pet.save()
            
            
            #return Response(serializer.data, status=status.HTTP_200_OK)
            #return Response(data, status=status.HTTP_200_OK)
            return Response({"message": "Pet Updated!",}, status=status.HTTP_200_OK)
            
        except Pet.DoesNotExist:
            return Response({"error": "Pet not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdatePetRewardsView(APIView):
    def post(self, request, pet_id):
        try:
            pet = Pet.objects.get(pk=pet_id)
            
            # Validate incoming data
            unlocked_hats = request.data.get('unlocked_hats', []) or []
            unlocked_bgs = request.data.get('unlocked_bgs', []) or []

            #print("Unlocked bgs",unlocked_bgs)

            # Ensure we're working with lists
            if not isinstance(unlocked_hats, list):
                return Response({"error": "unlocked_hats must be a list"}, status=400)
            if not isinstance(unlocked_bgs, list):
                return Response({"error": "unlocked_bgs must be a list"}, status=400)
            
            # Ensure base cosmetics are always present
            if 'hat0' not in unlocked_hats:
                unlocked_hats.append('hat0')
            if 'bg1' not in unlocked_bgs:
                unlocked_bgs.append('bg1')

            # Validate against model options
            valid_hats = set(Pet.HAT_OPTIONS)
            valid_bgs = set(Pet.BG_OPTIONS)
            
            invalid_hats = set(unlocked_hats) - valid_hats
            invalid_bgs = set(unlocked_bgs) - valid_bgs


            if invalid_hats:
                return Response({"error": f"Invalid hats: {invalid_hats}"}, status=400)
            if invalid_bgs:
                return Response({"error": f"Invalid backgrounds: {invalid_bgs}"}, status=400)


                
            pet.unlocked_hats = list(set(unlocked_hats))
            pet.unlocked_bgs = list(set(unlocked_bgs))

            pet.save()

            return Response("Rewards Updated", status=status.HTTP_200_OK)
            
        except Pet.DoesNotExist:
            return Response({"error": "Pet not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SickDeviceCountView(APIView):
    def get(self, request, house_id):
        try:
            house = House.objects.get(pk=house_id)
            pet = house.pet
            sick_count = 0
            
            # Get all devices in the house through rooms
            devices = Device.objects.filter(room__house=house)
            
            for device in devices:
                # Get concrete device instance
                concrete_device = device.get_concrete_device()
                if concrete_device:
                    health = concrete_device.get_health_status()
                    if health in ['Sick', 'Faulty']:
                        sick_count += 1
            
            print("Sick_Count: ", sick_count)

            if pet.death_persisted:
                if sick_count == 0:
                    # Auto-reset if all devices are fixed
                    pet.reset_to_defaults()
                    return Response({
                        "house_id": house_id,
                        "sick_device_count": 0,
                        "pet_status": "healthy"
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        "house_id": house_id,
                        "sick_device_count": sick_count,
                        "pet_status": "death"
                    }, status=status.HTTP_200_OK)
                

            pet_status = self.get_pet_status(sick_count)
            if pet_status == 'death':
                pet.is_dead = True
                pet.death_persisted = True
                pet.save()
                

            return Response({
                "house_id": house_id,
                "sick_device_count": sick_count,
                "pet_status": self.get_pet_status(sick_count)
            }, status=status.HTTP_200_OK)
        
        except House.DoesNotExist:
            return Response({"error": "House not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_pet_status(self, count):
        if count == 0:
            return "healthy"
        elif 1 <= count < 3:
            return "sick"
        else:
            return "death"

class ResetPetView(APIView):
    def post(self, request, pet_id):
        try:
            pet = Pet.objects.get(pk=pet_id)
            pet.reset_to_defaults()
            return Response(PetStateSerializer(pet).data, status=status.HTTP_200_OK)
        except Pet.DoesNotExist:
            return Response({"error": "Pet not found"}, status=status.HTTP_404_NOT_FOUND)

class UpdatePetMoodView(APIView):
    def post(self, request, pet_id):
        try:
            pet = Pet.objects.get(pk=pet_id)
            new_mood = request.data.get('mood')
            #print("Mood:", new_mood)
            #print("Mood:", new_mood.replace(" ", ""))
            
            if new_mood not in dict(Pet.MOOD_CHOICES):
                print("Invalid Mood")
                return Response({"error": "Invalid mood value"}, status=status.HTTP_400_BAD_REQUEST)
                
            pet.mood = new_mood
            pet.save()
            
            return Response("Mood Updated", status=status.HTTP_200_OK)
            
        except Pet.DoesNotExist:
            return Response({"error": "Pet not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



#AC


class UpdateACView(APIView):
    def post(self, request, device_id):
        try:
            television = Television.objects.get(device_id=device_id)
        except Television.DoesNotExist:
            return Response({'detail': 'Television not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Update the television properties with the data from the request
        serializer = TelevisionSerializer(television, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Television updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)










