from django.db import models
from django.contrib.auth.models import User
from django.db.models import JSONField
# from django.contrib.postgres.fields import JSONField


class TrashPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image_before_url = models.URLField()
    is_cleaned = models.BooleanField(default=False)
    details = JSONField()
    reward_points = models.IntegerField(default=0)
    latitude = models.FloatField()
    longitude = models.FloatField()


class Rewards(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=255)
    points = models.IntegerField(default=0)
