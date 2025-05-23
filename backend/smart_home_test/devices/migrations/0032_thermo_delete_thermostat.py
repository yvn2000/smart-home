# Generated by Django 5.1.3 on 2025-03-08 10:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0031_thermostat_code'),
    ]

    operations = [
        migrations.CreateModel(
            name='Thermo',
            fields=[
                ('thermo_id', models.AutoField(primary_key=True, serialize=False)),
                ('temperature', models.FloatField(default=22.0)),
                ('mode', models.CharField(choices=[('Cool', 'Cool'), ('Dry', 'Dry'), ('Fan', 'Fan'), ('Heat', 'Heat')], default='Cool', max_length=4)),
                ('code', models.CharField(default=0, max_length=10)),
                ('house', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='thermostat', to='devices.house')),
            ],
        ),
        migrations.DeleteModel(
            name='Thermostat',
        ),
    ]
