# Generated by Django 5.1.3 on 2025-03-08 09:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0030_remove_thermostat_base_energy_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='thermostat',
            name='code',
            field=models.CharField(default=0, max_length=10),
        ),
    ]
