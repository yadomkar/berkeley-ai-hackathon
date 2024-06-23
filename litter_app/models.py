from django.db import models
from django.contrib.auth.models import User
from django.db.models import JSONField
# from django.contrib.postgres.fields import JSONField


class TrashPost(models.Model):
    user_id = models.CharField(null=False)
    image_before_url = models.URLField()
    is_cleaned = models.BooleanField(default=False)
    details = JSONField()
    reward_points = models.IntegerField(default=0)
    latitude = models.FloatField()
    longitude = models.FloatField()


class Rewards(models.Model):
    user_id = models.CharField(null=False)
    username = models.CharField(max_length=255)
    points = models.IntegerField(default=0)
