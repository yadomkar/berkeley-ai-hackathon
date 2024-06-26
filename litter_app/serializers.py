from rest_framework import serializers
from .models import TrashPost, Rewards


class TrashPostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrashPost
        fields = ['image_before_url', 'details']


class TrashPostPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrashPost
        fields = ['id', 'image_before_url', 'is_cleaned', 'details', 'user_id', 'reward_points']
        depth = 1  # To include details of related objects, adjust as necessary


class TrashPostDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrashPost
        fields = ['id', 'image_before_url', 'is_cleaned', 'details']


class RewardDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rewards
        fields = ['username', 'points']


class PostCreationResponseSerializer(serializers.Serializer):
    post_id = serializers.IntegerField()
    # gemini_response = serializers.DictField()
    claude_response = serializers.DictField()

class LocationSerializer(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()