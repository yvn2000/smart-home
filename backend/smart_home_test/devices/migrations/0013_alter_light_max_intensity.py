# Generated by Django 5.1.3 on 2025-02-18 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0012_alter_airconditioner_base_energy_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='light',
            name='max_intensity',
            field=models.IntegerField(default=100),
        ),
    ]
