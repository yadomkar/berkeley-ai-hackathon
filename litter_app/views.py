from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from .models import TrashPost
from .serializers import TrashPostPublicSerializer, PostCreationResponseSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from datetime import datetime
from .gemini import GeminiAPI  # Assuming GeminiAPI is adapted for Django

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_trash_post(request):
    parser_classes = (MultiPartParser, FormParser)
    image = request.FILES.get('image')
    latitude = request.data.get('latitude')
    longitude = request.data.get('longitude')

    if not image or not latitude or not longitude:
        return JsonResponse({'error': 'Missing data'}, status=status.HTTP_400_BAD_REQUEST)

    file_directory = 'public'
    fs = FileSystemStorage(location=file_directory)
    filename = f"{datetime.utcnow().isoformat()}_{image.name}"
    filename = fs.save(filename, image)

    file_path = fs.url(filename)
    gemini_api = GeminiAPI(file_path, latitude, longitude)
    gemini_response = gemini_api.generate_content()

    trash_post = TrashPost.objects.create(
        user=request.user,
        image_before_url=file_path,
        details=gemini_response,
        latitude=latitude,
        longitude=longitude,
        reward_points=gemini_response.get('reward', 0)
    )

    serializer = PostCreationResponseSerializer({'post_id': trash_post.id, 'gemini_response': gemini_response})
    return JsonResponse(serializer.data, safe=False, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_trash_post(request, post_id):
    try:
        trash_post = TrashPost.objects.get(pk=post_id, user=request.user)
    except TrashPost.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

    trash_post.is_cleaned = True
    trash_post.save()
    return JsonResponse({'success': True})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def read_trash_posts(request):
    is_cleaned = request.query_params.get('is_cleaned')
    if is_cleaned is not None:
        is_cleaned = is_cleaned.lower() in ['true', '1']
        trash_posts = TrashPost.objects.filter(is_cleaned=is_cleaned, user=request.user)
    else:
        trash_posts = TrashPost.objects.filter(user=request.user)

    serializer = TrashPostPublicSerializer(trash_posts, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_trash_post(request, post_id):
    try:
        trash_post = TrashPost.objects.get(pk=post_id, user=request.user)
        serializer = TrashPostPublicSerializer(trash_post)
        return JsonResponse(serializer.data, safe=False)
    except TrashPost.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
