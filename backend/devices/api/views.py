from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Room, Device
from .serializers import RoomSerializer, DeviceSerializer
import logging

# Set up logging
logger = logging.getLogger(__name__)

class RoomListView(APIView):
    def get(self, request):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)

class AddDeviceView(APIView):
    def post(self, request):
        serializer = DeviceSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
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