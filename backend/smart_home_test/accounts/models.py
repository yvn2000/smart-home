from django.db import models

# Create your models here.


class Accounts(models.Model):
    acc_id = models.AutoField(primary_key=True)
    f_name = models.CharField(max_length=20)
    l_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=254)



    def __str__(self):
        return self.name

