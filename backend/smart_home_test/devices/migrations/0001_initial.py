# Generated by Django 5.1.3 on 2025-01-18 15:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('room_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('temperature', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Device',
            fields=[
                ('device_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('logo', models.CharField(max_length=100)),
                ('status', models.CharField(choices=[('on', 'On'), ('off', 'Off')], max_length=10)),
                ('temperature', models.FloatField()),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='devices', to='devices.room')),
            ],
        ),
    ]
