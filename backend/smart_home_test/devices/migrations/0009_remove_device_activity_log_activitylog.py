# Generated by Django 5.1.3 on 2025-02-16 18:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0008_alter_television_input_source'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='device',
            name='activity_log',
        ),
        migrations.CreateModel(
            name='ActivityLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(max_length=255)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='activity_logs', to='devices.device')),
            ],
            options={
                'ordering': ['-timestamp'],
            },
        ),
    ]
