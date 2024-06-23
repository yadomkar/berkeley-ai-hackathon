from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from .models import TrashPost
from .serializers import TrashPostPublicSerializer, PostCreationResponseSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from datetime import datetime
from .gemini import GeminiAPI
from .claude import ClaudeAPI
from propelauth_django_rest_framework import init_auth
import os

import logging

logger = logging.getLogger(__name__)

auth_url, api_key = os.getenv("PROPEL_AUTH_URL"), os.getenv("PROPEL_API_KEY")
auth = init_auth(auth_url, api_key)


@api_view(['POST'])
@permission_classes([auth.IsUserAuthenticated])
def create_trash_post(request):
    parser_classes = (MultiPartParser, FormParser)
    image = request.FILES.get('image')
    latitude = float(request.data.get('latitude'))
    longitude = float(request.data.get('longitude'))

    if not image or not latitude or not longitude:
        return JsonResponse({'error': 'Missing data'}, status=status.HTTP_400_BAD_REQUEST)

    file_directory = 'public'
    fs = FileSystemStorage(location=file_directory)
    filename = f"{datetime.utcnow().isoformat()}_{image.name}"
    filename = fs.save(filename, image)

    file_path = fs.url(filename)
    # gemini_api = GeminiAPI(file_path, latitude, longitude)
    claude_api = ClaudeAPI(file_path, latitude, longitude)
    # gemini_response = gemini_api.generate_content()
    claude_response = claude_api.generate_content()
    logger.error(claude_response)
    trash_post = TrashPost.objects.create(
        user_id=request.propelauth_user.user_id,
        image_before_url=file_path,
        # details=gemini_response,
        details=claude_response,
        latitude=latitude,
        longitude=longitude,
        # reward_points=gemini_response.get('reward', 0)
        reward_points=claude_response.get('reward', 0)
    )

    serializer = PostCreationResponseSerializer({'post_id': trash_post.id,
                                                 # 'gemini_response': gemini_response,
                                                 'claude_response': claude_response
                                                 })
    return JsonResponse(serializer.data, safe=False, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([auth.IsUserAuthenticated])
def update_trash_post(request, post_id):
    logger.error("Updating trash post")
    logger.error(post_id)
    logger.error(request.propelauth_user)
    try:
        trash_post = TrashPost.objects.get(pk=post_id, user_id=request.propelauth_user.user_id)
    except TrashPost.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

    trash_post.is_cleaned = True
    trash_post.save()
    return JsonResponse({'success': True})


@api_view(['GET'])
@permission_classes([auth.IsUserAuthenticated])
def read_trash_posts(request):
    print('we in here')
    is_cleaned = request.query_params.get('is_cleaned')
    if is_cleaned is not None:
        is_cleaned = is_cleaned.lower() in ['true', '1']
        trash_posts = TrashPost.objects.filter(is_cleaned=is_cleaned, user_id=request.propelauth_user.user_id)
    else:
        trash_posts = TrashPost.objects.filter(user_id=request.propelauth_user.user_id)
    print('serializing')
    serializer = TrashPostPublicSerializer(trash_posts, many=True)
    print('returning')
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
@permission_classes([auth.IsUserAuthenticated])
def get_trash_post(request, post_id):
    try:
        trash_post = TrashPost.objects.get(pk=post_id, user_id=request.propelauth_user.user_id)
        serializer = TrashPostPublicSerializer(trash_post)
        return JsonResponse(serializer.data, safe=False)
    except TrashPost.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
