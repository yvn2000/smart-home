# Generated by Django 5.1.3 on 2025-02-16 12:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0002_remove_device_temperature_airconditioner_airpurifier_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='airpurifier',
            name='device',
        ),
        migrations.RemoveField(
            model_name='blinds',
            name='device',
        ),
        migrations.RemoveField(
            model_name='coffeemaker',
            name='device',
        ),
        migrations.RemoveField(
            model_name='fridge',
            name='device',
        ),
        migrations.RemoveField(
            model_name='light',
            name='device',
        ),
        migrations.RemoveField(
            model_name='oven',
            name='device',
        ),
        migrations.RemoveField(
            model_name='roomba',
            name='device',
        ),
        migrations.RemoveField(
            model_name='smartlock',
            name='device',
        ),
        migrations.RemoveField(
            model_name='speaker',
            name='device',
        ),
        migrations.RemoveField(
            model_name='television',
            name='device',
        ),
        migrations.RemoveField(
            model_name='thermostat',
            name='device',
        ),
        migrations.RemoveField(
            model_name='washingmachine',
            name='device',
        ),
        migrations.DeleteModel(
            name='AirConditioner',
        ),
        migrations.DeleteModel(
            name='AirPurifier',
        ),
        migrations.DeleteModel(
            name='Blinds',
        ),
        migrations.DeleteModel(
            name='CoffeeMaker',
        ),
        migrations.DeleteModel(
            name='Fridge',
        ),
        migrations.DeleteModel(
            name='Light',
        ),
        migrations.DeleteModel(
            name='Oven',
        ),
        migrations.DeleteModel(
            name='Roomba',
        ),
        migrations.DeleteModel(
            name='SmartLock',
        ),
        migrations.DeleteModel(
            name='Speaker',
        ),
        migrations.DeleteModel(
            name='Television',
        ),
        migrations.DeleteModel(
            name='Thermostat',
        ),
        migrations.DeleteModel(
            name='WashingMachine',
        ),
    ]
