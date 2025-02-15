from django.db import models

# Create your models here.

class Room(models.Model):
    room_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    temperature = models.FloatField()

    def __str__(self):
        return self.name


class Device(models.Model):
    device_id = models.AutoField(primary_key=True)
    room = models.ForeignKey(Room, related_name='devices', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    logo = models.CharField(max_length=100)         #materialcommunityicons
    status = models.CharField(max_length=10, choices=[('on', 'On'), ('off', 'Off')])
    temperature = models.FloatField()

    def __str__(self):
        return f"{self.name} ({self.room.name})"
