# Generated by Django 5.1.3 on 2025-02-16 11:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='device',
            name='temperature',
        ),
        migrations.CreateModel(
            name='AirConditioner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('temperature', models.FloatField(default=20)),
                ('fan_speed', models.CharField(choices=[('Auto', 'Auto'), ('High', 'High'), ('Medium', 'Medium'), ('Low', 'Low')], default='Low', max_length=10)),
                ('mode', models.CharField(choices=[('Cool', 'Cool'), ('Dry', 'Dry'), ('Fan', 'Fan'), ('Heat', 'Heat')], default='Cool', max_length=10)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.device')),
            ],
        ),
        migrations.CreateModel(
            name='AirPurifier',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fan_speed', models.CharField(choices=[('Auto', 'Auto'), ('High', 'High'), ('Medium', 'Medium'), ('Low', 'Low')], default='Low', max_length=10)),
                ('air_quality', models.CharField(choices=[('Fresh', 'Fresh'), ('Moderate', 'Moderate'), ('Dirty', 'Dirty')], default='Fresh', max_length=10)),
                ('filter_status', models.CharField(choices=[('Optimal', 'Optimal'), ('Moderate', 'Moderate'), ('Clogged', 'Clogged'), ('Blocked', 'Blocked')], default='Optimal', max_length=10)),
                ('clog_percentage', models.IntegerField(default=90)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.device')),
            ],
        ),
        migrations.CreateModel(
            name='Blinds',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Open', 'Open'), ('Close', 'Close')], default='Open', max_length=10)),
                ('openness_value', models.IntegerField(default=40)),
                ('max_openness_value', models.IntegerField(default=100)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.device')),
            ],
        ),
        migrations.CreateModel(
            name='CoffeeMaker',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('brew_strength', models.CharField(default=1, max_length=50)),
                ('brew_size', models.CharField(default=5, max_length=50)),
                ('brew_temp', models.FloatField(default=90)),
                ('coffee_powder_level', models.IntegerField(default=84)),
                ('water_level', models.IntegerField(default=37)),
                ('status', models.CharField(choices=[('Active', 'Active'), ('Idle', 'Idle')], default='Idle', max_length=10)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.device')),
            ],
        ),
        migrations.CreateModel(
            name='Fridge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('temperature', models.IntegerField(default=3)),
                ('inventory_capacity', models.CharField(choices=[('Spacious', 'Spacious'), ('Half Full', 'Half Full'), ('Full', 'Full')], default='Half Full', max_length=10)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.device')),
            ],
        ),
        migrations.CreateModel(
            name='Light',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('intensity', models.IntegerField(default=40)),
                ('max_intensity', models.IntegerField(default=200)),
                ('rgb', models.CharField(default='#FFFFFF', max_length=7)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.device')),
            ],
        ),
        migrations.CreateModel(
            name='Oven',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timer_minutes', models.IntegerField(default=0)),
                ('timer_seconds', models.IntegerField(default=0)),
                ('temperature', models.IntegerField(default=140)),
                ('mode', models.CharField(choices=[('Bake', 'Bake'), ('Roast', 'Roast'), ('Broil', 'Broil'), ('Preheat', 'Preheat')], default='Preheat', max_length=10)),
                ('status', models.CharField(choices=[('Active', 'Active'), ('Idle', 'Idle')], default='Idle', max_length=10)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.device')),
            ],
        ),
        migrations.CreateModel(
            name='Roomba',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_status', models.CharField(choices=[('Cleaning', 'Cleaning'), ('Idle', 'Idle'), ('At Station', 'At Station')], default='Cleaning', max_length=10)),
                ('mode', models.CharField(choices=[('Normal', 'Normal'), ('Low-Efficiency', 'Low-Efficiency'), ('Spotless', 'Spotless'), ('Station', 'Station')], default='Normal', max_length=15)),
                ('cleaning_progress', models.IntegerField(default=37)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.device')),
            ],
        ),
        migrations.CreateModel(
            name='SmartLock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('locked', models.BooleanField(default=True)),
                ('access_code', models.IntegerField(default=1234)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.device')),
            ],
        ),
        migrations.CreateModel(
            name='Speaker',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('song_name', models.CharField(default='Sigma Boy', max_length=100)),
                ('artist_name', models.CharField(default='Ligma James', max_length=100)),
                ('song_length', models.IntegerField(default=100)),
                ('song_progress', models.IntegerField(default=40)),
                ('music_playing', models.BooleanField(default=False)),
                ('volume', models.IntegerField(default=40)),
                ('max_volume', models.IntegerField(default=100)),
                ('audio_source', models.CharField(choices=[('Spotify', 'Spotify'), ('Apple Music', 'Apple Music')], default='Spotify', max_length=20)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.device')),
            ],
        ),
        migrations.CreateModel(
            name='Television',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('volume', models.IntegerField(default=40)),
                ('max_volume', models.IntegerField(default=100)),
                ('input_source', models.CharField(choices=[('Hdmi', 'Hdmi'), ('Cable', 'Cable'), ('Streaming', 'Streaming')], default='Hdmi', max_length=10)),
                ('hdmi_input', models.IntegerField(default=1)),
                ('cable_channel', models.IntegerField(default=50)),
                ('stream_app', models.CharField(choices=[('Youtube', 'Youtube'), ('Hulu', 'Hulu')], default='Youtube', max_length=10)),
                ('brightness', models.IntegerField(default=80)),
                ('max_brightness', models.IntegerField(default=100)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.device')),
            ],
        ),
        migrations.CreateModel(
            name='Thermostat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('temperature', models.FloatField(default=20)),
                ('fan_speed', models.CharField(choices=[('Auto', 'Auto'), ('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')], default='Low', max_length=10)),
                ('mode', models.CharField(choices=[('Cool', 'Cool'), ('Dry', 'Dry'), ('Fan', 'Fan'), ('Heat', 'Heat')], default='Cool', max_length=10)),
                ('humidity_level', models.CharField(choices=[('Low', 'Low'), ('Moderate', 'Moderate'), ('High', 'High')], default='Moderate', max_length=10)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.device')),
            ],
        ),
        migrations.CreateModel(
            name='WashingMachine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Washing', 'Washing'), ('Paused', 'Paused')], default='Washing', max_length=10)),
                ('wash_cycle', models.CharField(choices=[('Normal', 'Normal'), ('Delicate', 'Delicate'), ('Heavy', 'Heavy'), ('Quick', 'Quick')], default='Normal', max_length=10)),
                ('washing_progress', models.IntegerField(default=37)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.device')),
            ],
        ),
    ]
