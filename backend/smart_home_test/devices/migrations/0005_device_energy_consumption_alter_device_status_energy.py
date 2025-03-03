# Generated by Django 5.1.3 on 2025-02-16 12:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0004_airconditioner_airpurifier_blinds_coffeemaker_fridge_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='energy_consumption',
            field=models.FloatField(default=100),
        ),
        migrations.AlterField(
            model_name='device',
            name='status',
            field=models.CharField(choices=[('on', 'On'), ('off', 'Off')], default='Off', max_length=10),
        ),
        migrations.CreateModel(
            name='Energy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('energy1', models.FloatField(default=100)),
                ('energy2', models.FloatField(default=100)),
                ('energy3', models.FloatField(default=100)),
                ('energy4', models.FloatField(default=100)),
                ('energy5', models.FloatField(default=100)),
                ('average', models.FloatField(default=100)),
                ('device', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='energy', to='devices.device')),
            ],
        ),
    ]
