from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError



class User(AbstractUser):
    HOME_OWNER = 'home_owner'
    LANDLORD = 'landlord'
    GUEST = 'guest'

    USER_TYPE_CHOICES = [
        (HOME_OWNER, 'Home Owner'),
        (LANDLORD, 'Landlord'),
        (GUEST, 'Guest'),
    ]

    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    
    # Regular login credentials for Home Owners and Landlords
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)

    # Guests log in using a 4-digit code (only applicable for guests)
    guest_code = models.CharField(max_length=4, blank=True, null=True, unique=False)  
    house = models.ForeignKey("House", on_delete=models.CASCADE, blank=True, null=True)  # Guest is tied to a house

    allowed_devices = models.ManyToManyField('Device', blank=True)  # Guests can control specific devices

    # Fix conflicts with Django auth system
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_groups",  
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_permissions",
    )
      

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def has_access_to_statistics(self):
        return self.user_type in {self.HOME_OWNER, self.LANDLORD}

    def has_access_to_device_control(self):
        return self.user_type in {self.HOME_OWNER, self.GUEST}

    def has_access_to_pet(self):
        return self.user_type in {self.HOME_OWNER, self.GUEST}

    def __str__(self):
        if self.user_type == self.GUEST:
            return f"Guest ({self.guest_code}) - {self.house}"
        return f"{self.username} ({self.get_user_type_display()})"


class House(models.Model):
    name = models.CharField(max_length=100)
    #owner = models.OneToOneField(User, related_name="owned_house", on_delete=models.CASCADE, limit_choices_to={'user_type': User.HOME_OWNER})
    owner = models.ForeignKey(User, related_name="owned_houses", on_delete=models.CASCADE)
    landlord = models.ForeignKey(User, related_name="managed_houses", on_delete=models.CASCADE, limit_choices_to={'user_type': User.LANDLORD})
    
    def __str__(self):
        return self.name



class Pet(models.Model):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('death', 'Death'),
    ]
    
    # Available cosmetic options
    HAT_OPTIONS = [f'hat{i}' for i in range(3)]  # hat0 to hat2
    BG_OPTIONS = [f'bg{i}' for i in range(1, 4)]  # bg1 to bg3

    pet_id = models.AutoField(primary_key=True)
    house = models.OneToOneField(
        'House',
        on_delete=models.CASCADE,
        related_name='pet',
        unique=True,
        verbose_name='Associated House'
    )
    
    # Current equipped items
    current_hat = models.CharField(
        max_length=10,
        default='hat0'
    )
    current_bg = models.CharField(
        max_length=10,
        default='bg1'
    )
    
    # Unlocked cosmetics storage
    unlocked_hats = models.JSONField(default=['hat0'])  # Starts with hat0
    unlocked_bgs = models.JSONField(default=['bg1'])    # Starts with bg1
    
    mood = models.CharField(
        max_length=10,
        choices=MOOD_CHOICES,
        default='happy'
    )
    pending_xp = models.PositiveIntegerField(default=0)
    actual_xp = models.PositiveIntegerField(default=5)

    is_dead = models.BooleanField(default=False)
    death_persisted = models.BooleanField(default=False)

    def __str__(self):
        return f"Pet of {self.house.name}"

    class Meta:
        verbose_name = "House Pet"
        verbose_name_plural = "House Pets"

    def clean(self):
        """Validate cosmetics and house uniqueness"""
        # House validation
        if Pet.objects.exclude(pk=self.pk).filter(house=self.house).exists():
            raise ValidationError("A house can only have one pet")
        
        # Cosmetic validation
        if self.current_hat not in self.unlocked_hats:
            raise ValidationError("Current hat must be unlocked")
        if self.current_bg not in self.unlocked_bgs:
            raise ValidationError("Current background must be unlocked")

    def save(self, *args, **kwargs):
        """Automatically handle cosmetic defaults"""
        # Ensure base cosmetics are always unlocked
        if 'hat0' not in self.unlocked_hats:
            self.unlocked_hats.append('hat0')
        if 'bg1' not in self.unlocked_bgs:
            self.unlocked_bgs.append('bg1')
            
        super().save(*args, **kwargs)

    def reset_to_defaults(self):
        """Reset cosmetics and XP on death"""
        self.unlocked_hats = ['hat0']
        self.unlocked_bgs = ['bg1']
        self.current_hat = 'hat0'
        self.current_bg = 'bg1'
        self.pending_xp = 0
        self.actual_xp = 5  # Set to 5 as per requirement
        self.mood = 'happy'
        self.is_dead = False
        self.death_persisted = False
        self.save()

    def unlock_cosmetic(self, cosmetic_type, cosmetic_name):
        """Helper method to unlock new cosmetics"""
        if cosmetic_type == 'hat' and cosmetic_name in self.HAT_OPTIONS:
            if cosmetic_name not in self.unlocked_hats:
                self.unlocked_hats.append(cosmetic_name)
        elif cosmetic_type == 'bg' and cosmetic_name in self.BG_OPTIONS:
            if cosmetic_name not in self.unlocked_bgs:
                self.unlocked_bgs.append(cosmetic_name)
        self.save()

    @property
    def available_hats(self):
        """Return sorted list of unlocked hats"""
        return sorted(self.unlocked_hats, key=lambda x: int(x[3:]))

    @property
    def available_bgs(self):
        """Return sorted list of unlocked backgrounds"""
        return sorted(self.unlocked_bgs, key=lambda x: int(x[2:]))


class GuestCode(models.Model):
    house = models.ForeignKey(House, related_name="guest_codes", on_delete=models.CASCADE)
    code = models.CharField(max_length=4)  # 4-digit guest code

    class Meta:
        unique_together = ('house', 'code')  # Ensure unique guest codes per house

    def __str__(self):
        return f"Guest Code {self.code} for {self.house.name}"


class Room(models.Model):
    house = models.ForeignKey(House, related_name="rooms", on_delete=models.CASCADE, null=True, blank=True)
    room_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    temperature = models.FloatField(default=22)

    def __str__(self):
        return f"{self.name} ({self.house.name})"
    #def __str__(self):
        #return f"{self.name}"

class Device(models.Model):
    device_id = models.AutoField(primary_key=True)
    room = models.ForeignKey(Room, related_name='devices', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    logo = models.CharField(max_length=100)  # MaterialCommunityIcons
    status = models.CharField(max_length=10, choices=[('on', 'On'), ('off', 'Off')], default='Off')
    statusBool = models.BooleanField(default=False)
    energy_consumption = models.FloatField(default=0)  # Energy in kWh per second
    extra_energy = models.FloatField(default=0)  # Energy in kWh per second
    #health = models.CharField(max_length=20, choices=[('Healthy', 'Healthy'), ('Sick', 'Sick'), ('Faulty', 'Faulty')], default='Healthy')
    power_save = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.room.name}, {self.room.house.name})"
    
    def get_concrete_device(self):
        """Returns the concrete device instance"""
        for model in [AirConditioner, Light, Television, AirPurifier,
                     Thermostat, Blinds, SmartLock, Fridge,
                     WashingMachine, Oven, Speaker, CoffeeMaker, Roomba]:
            try:
                return model.objects.get(device_id=self.device_id)
            except model.DoesNotExist:
                continue
        return None


class ActivityLog(models.Model):
    device = models.ForeignKey(Device, related_name='activity_logs', on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)  # Store time of action

    class Meta:
        ordering = ['-timestamp']  # Always get newest actions first

    def __str__(self):
        return f"{self.device.name}: {self.action} ({self.timestamp})"


class Automation(models.Model):
    auto_id = models.AutoField(primary_key=True)
    AUTOMATION_TYPE_CHOICES = [
        ('time', 'Time Based'),
        ('voice', 'Voice Based'),
    ]
    
    device = models.ForeignKey(Device, related_name='automations', on_delete=models.CASCADE)

    automation_type = models.CharField(max_length=10,choices=AUTOMATION_TYPE_CHOICES)

    function = models.CharField(max_length=255)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    phrase = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.function} for {self.device.name} ({self.automation_type})"

    def clean(self):
        super().clean()
        if self.automation_type == 'time' and not (self.start_time and self.end_time):
            raise ValidationError("Time-based automations require both start and end times.")
        if self.automation_type == 'voice' and not self.phrase:
            raise ValidationError("Voice-based automations require a phrase.")




class Energy(models.Model):
    device = models.OneToOneField(Device, related_name='energy', on_delete=models.CASCADE)
    energy1 = models.FloatField(default=100)  # Energy value in mW for current time
    energy2 = models.FloatField(default=100)  # Energy value 5 seconds ago
    energy3 = models.FloatField(default=100)  # Energy value 10 seconds ago
    energy4 = models.FloatField(default=100)  # Energy value 15 seconds ago
    energy5 = models.FloatField(default=100)  # Energy value 20 seconds ago
    energy6 = models.FloatField(default=100)  # Energy value 25 seconds ago
    energy7 = models.FloatField(default=100)  # Energy value 30 seconds ago
    average = models.FloatField(default=100)  # Average energy consumption over the last 5 readings

    def update_average(self):
        # Calculate average energy from the 5 values
        self.average = (self.energy1 + self.energy2 + self.energy3 + self.energy4 + self.energy5 + self.energy6 + self.energy7) / 5
        self.save()

    def __str__(self):
        return f"Energy data for {self.device.name}"



class AirConditioner(Device):
    temperature = models.FloatField(default=20)
    fan_speed = models.CharField(max_length=10, choices=[('Auto', 'Auto'), ('High', 'High'), ('Medium', 'Medium'), ('Low', 'Low')], default='Low')
    mode = models.CharField(max_length=10, choices=[('Cool', 'Cool'), ('Dry', 'Dry'), ('Fan', 'Fan'), ('Heat', 'Heat')], default='Cool')
    base_energy = models.FloatField(default=216)  # Energy in kWh per second

    def get_health_status(self):
        """
        Determines the health status of the AirConditioner:
        - "Healthy" if energy_consumption <= 2 * base_energy.
        - "Sick" if energy consumption is slightly above 2 * base_energy.
        - "Faulty" if energy consumption is too high.
        """
        threshold = self.base_energy * 1.5  # 2x base energy limit

        if self.energy_consumption <= threshold:
            return "Healthy"
        elif threshold < self.energy_consumption <= threshold * 1.5:  
            return "Sick"
        else:
            return "Faulty"



class AirPurifier(Device):
    fan_speed = models.CharField(max_length=10, choices=[('Auto', 'Auto'), ('High', 'High'), ('Medium', 'Medium'), ('Low', 'Low')], default='Low')
    air_quality = models.CharField(max_length=10, choices=[('Fresh', 'Fresh'), ('Moderate', 'Moderate'), ('Dirty', 'Dirty')], default='Fresh')
    filter_status = models.CharField(max_length=10, choices=[('Optimal', 'Optimal'), ('Moderate', 'Moderate'), ('Clogged', 'Clogged'), ('Blocked', 'Blocked')], default='Optimal')
    clog_percentage = models.IntegerField(default=90)
    base_energy = models.FloatField(default=108)  # Energy in kWh per second

    def get_health_status(self):
        threshold = self.base_energy * 1.5  # 2x base energy limit

        if self.energy_consumption <= threshold:
            return "Healthy"
        elif threshold < self.energy_consumption <= threshold * 1.5:  
            return "Sick"
        else:
            return "Faulty"

class Light(Device):
    intensity = models.IntegerField(default=40)
    max_intensity = models.IntegerField(default=100)
    rgb = models.CharField(max_length=10, default='white')
    base_energy = models.FloatField(default=180)  # Energy in kWh per second

    def get_health_status(self):
        threshold = self.base_energy * 1.5  # 2x base energy limit

        if self.energy_consumption <= threshold:
            return "Healthy"
        elif threshold < self.energy_consumption <= threshold * 1.5:  
            return "Sick"
        else:
            return "Faulty"

class Speaker(Device):
    song_name = models.CharField(max_length=100, default='Sigma Boy')
    artist_name = models.CharField(max_length=100, default='Ligma James')
    song_length = models.IntegerField(default=100)
    song_progress = models.IntegerField(default=40)
    music_playing = models.BooleanField(default=False)
    volume = models.IntegerField(default=40)
    max_volume = models.IntegerField(default=100)
    audio_source = models.CharField(max_length=20, choices=[('Spotify', 'Spotify'), ('Apple Music', 'Apple Music')], default='Spotify')
    base_energy = models.FloatField(default=36)  # Energy in kWh per second

    def get_health_status(self):
        threshold = self.base_energy * 1.5  # 2x base energy limit

        if self.energy_consumption <= threshold:
            return "Healthy"
        elif threshold < self.energy_consumption <= threshold * 1.5:  
            return "Sick"
        else:
            return "Faulty"

class Thermostat(Device):
    temperature = models.FloatField(default=20)
    fan_speed = models.CharField(max_length=10, choices=[('Auto', 'Auto'), ('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')], default='Low')
    mode = models.CharField(max_length=10, choices=[('Cool', 'Cool'), ('Dry', 'Dry'), ('Fan', 'Fan'), ('Heat', 'Heat')], default='Cool')
    humidity_level = models.CharField(max_length=10, choices=[('Low', 'Low'), ('Moderate', 'Moderate'), ('High', 'High')], default='Moderate')
    base_energy = models.FloatField(default=72)  # Energy in kWh per second

    def get_health_status(self):
        threshold = self.base_energy * 1.5  # 2x base energy limit

        if self.energy_consumption <= threshold:
            return "Healthy"
        elif threshold < self.energy_consumption <= threshold * 1.5:  
            return "Sick"
        else:
            return "Faulty"

class Television(Device):
    volume = models.IntegerField(default=40)
    max_volume = models.IntegerField(default=100)
    input_source = models.CharField(max_length=10, choices=[('HDMI', 'HDMI'), ('Cable', 'Cable'), ('Stream', 'Stream')], default='HDMI')
    hdmi_input = models.IntegerField(default=1)
    cable_channel = models.IntegerField(default=50)
    stream_app = models.CharField(max_length=10, choices=[('Youtube', 'Youtube'), ('Hulu', 'Hulu')], default='Youtube')
    brightness = models.IntegerField(default=50)
    max_brightness = models.IntegerField(default=100)
    base_energy = models.FloatField(default=360)  # Energy in kWh per second

    def get_health_status(self):
        threshold = self.base_energy * 1.5  # 2x base energy limit

        if self.energy_consumption <= threshold:
            return "Healthy"
        elif threshold < self.energy_consumption <= threshold * 2:  
            return "Sick"
        else:
            return "Faulty"

class Blinds(Device):
    open_status = models.CharField(max_length=10, choices=[('Open', 'Open'), ('Close', 'Close')], default='Open')
    openness_value = models.IntegerField(default=40)
    max_openness_value = models.IntegerField(default=100)
    base_energy = models.FloatField(default=18)  # Energy in kWh per second

    def get_health_status(self):
        threshold = self.base_energy * 1.5  # 2x base energy limit

        if self.energy_consumption <= threshold:
            return "Healthy"
        elif threshold < self.energy_consumption <= threshold * 2:  
            return "Sick"
        else:
            return "Faulty"

class SmartLock(Device):
    locked = models.BooleanField(default=True)
    access_code = models.IntegerField(default=1234)
    base_energy = models.FloatField(default=18)  # Energy in kWh per second

    def get_health_status(self):
        threshold = self.base_energy * 1.5  # 2x base energy limit

        if self.energy_consumption <= threshold:
            return "Healthy"
        elif threshold < self.energy_consumption <= threshold * 2:  
            return "Sick"
        else:
            return "Faulty"

class Fridge(Device):
    temperature = models.IntegerField(default=3)
    inventory_capacity = models.CharField(max_length=10, choices=[('Spacious', 'Spacious'), ('Half Full', 'Half Full'), ('Full', 'Full')], default='Half Full')
    base_energy = models.FloatField(default=540)  # Energy in kWh per second

    def get_health_status(self):
        threshold = self.base_energy * 1.5  # 2x base energy limit

        if self.energy_consumption <= threshold:
            return "Healthy"
        elif threshold < self.energy_consumption <= threshold * 2:  
            return "Sick"
        else:
            return "Faulty"

class WashingMachine(Device):
    wash_status = models.CharField(max_length=10, choices=[('Washing', 'Washing'), ('Paused', 'Paused')], default='Washing')
    wash_cycle = models.CharField(max_length=10, choices=[('Normal', 'Normal'), ('Delicate', 'Delicate'), ('Heavy', 'Heavy'), ('Quick', 'Quick')], default='Normal')
    washing_progress = models.IntegerField(default=37)
    base_energy = models.FloatField(default=360)  # Energy in kWh per second

    def get_health_status(self):
        threshold = self.base_energy * 1.5  # 2x base energy limit

        if self.energy_consumption <= threshold:
            return "Healthy"
        elif threshold < self.energy_consumption <= threshold * 2:  
            return "Sick"
        else:
            return "Faulty"

class Oven(Device):
    timer_minutes = models.IntegerField(default=0)
    timer_seconds = models.IntegerField(default=0)
    temperature = models.IntegerField(default=140)
    mode = models.CharField(max_length=10, choices=[('Bake', 'Bake'), ('Roast', 'Roast'), ('Broil', 'Broil'), ('Preheat', 'Preheat')], default='Preheat')
    oven_status = models.CharField(max_length=10, choices=[('Active', 'Active'), ('Idle', 'Idle')], default='Idle')
    base_energy = models.FloatField(default=72)  # Energy in kWh per second

    def get_health_status(self):
        threshold = self.base_energy * 1.5  # 2x base energy limit

        if self.energy_consumption <= threshold:
            return "Healthy"
        elif threshold < self.energy_consumption <= threshold * 2:  
            return "Sick"
        else:
            return "Faulty"

class Roomba(Device):
    activity_status = models.CharField(max_length=10, choices=[('Cleaning', 'Cleaning'), ('Idle', 'Idle'), ('At Station', 'At Station')], default='Cleaning')
    mode = models.CharField(max_length=15, choices=[('Normal', 'Normal'), ('Low-Efficiency', 'Low-Efficiency'), ('Spotless', 'Spotless'), ('Station', 'Station')], default='Normal')
    cleaning_progress = models.IntegerField(default=37)
    base_energy = models.FloatField(default=35)  # Energy in kWh per second

    def get_health_status(self):
        threshold = self.base_energy * 1.5  # 2x base energy limit

        if self.energy_consumption <= threshold:
            return "Healthy"
        elif threshold < self.energy_consumption <= threshold * 2:  
            return "Sick"
        else:
            return "Faulty"

class CoffeeMaker(Device):
    brew_strength = models.CharField(max_length=50, default=1)
    brew_size = models.CharField(max_length=50, default=5)
    brew_temp = models.FloatField(default=90)
    coffee_powder_level = models.IntegerField(default=84)
    water_level = models.IntegerField(default=37)
    coffee_status = models.CharField(max_length=10, choices=[('Active', 'Active'), ('Idle', 'Idle')], default='Idle')
    base_energy = models.FloatField(default=20)  # Energy in kWh per second

    def get_health_status(self):
        threshold = self.base_energy * 1.5  # 2x base energy limit

        if self.energy_consumption <= threshold:
            return "Healthy"
        elif threshold < self.energy_consumption <= threshold * 2:  
            return "Sick"
        else:
            return "Faulty"



