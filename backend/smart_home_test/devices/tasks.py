from celery import shared_task
from .models import Device, Energy
import random  # For simulating energy values

@shared_task
def update_device_energy():
    devices = Device.objects.all()
    for device in devices:
        # Get the current energy reading (this is just a simulation; you can use real data)
        #current_energy = random.uniform(90, 110)  # Simulating energy consumption between 90 mW and 110 mW
        current_energy = random.uniform(max(device.energy_consumption - 20, 0), device.energy_consumption+20)

        if (device.status=="Off" or device.status=="off"):
            current_energy = 0
        
        # Get the energy instance for the device, or create it if it doesn't exist
        energy, created = Energy.objects.get_or_create(device=device)

        # Shift energy values (store old values)
        energy.energy7 = energy.energy6
        energy.energy6 = energy.energy5
        energy.energy5 = energy.energy4
        energy.energy4 = energy.energy3
        energy.energy3 = energy.energy2
        energy.energy2 = energy.energy1
        energy.energy1 = current_energy

        # Update the average energy
        energy.update_average()

        # Save the energy values
        energy.save()

    return "Energy updated successfully"