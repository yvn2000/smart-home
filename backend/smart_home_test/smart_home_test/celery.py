from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_home_test.settings')

app = Celery('smart_home_test')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related config keys should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# This is where you load your task modules
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

# Beat schedule for periodic tasks
app.conf.beat_schedule = {
    'update-device-energy-every-5-seconds': {
        'task': 'devices.tasks.update_device_energy',  # Correct task path
        'schedule': 5.0,  # Run every 5 seconds
    },
}

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))