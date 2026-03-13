from django.db.models import Count, Exists, OuterRef, Case, When, Value, BooleanField
from .models import Post
from apps.interactions.models import Like

def get_post_queryset(user):
    qs = Post.objects.all().order_by("-created_at")
    # Count likes 
    qs = qs.annotate(like_count=Count("likes", distinct=True))

    # Count comments
    qs = qs.annotate(comment_count=Count("comments", distinct=True))

    if user.is_authenticated:
        qs = qs.annotate(
            liked_by_me=Exists(
                Like.objects.filter(user=user, post_id=OuterRef('pk'))
            ),
            is_mine = Case(
                When(user=user, then=Value(True)),
                default=Value(False),
                output_field=BooleanField(),
            ),
        )
    else:
        qs = qs.annotate(
            liked_by_me=Value(False, output_field=BooleanField()),
            is_mine=Value(False, output_field=BooleanField()),
        )

    return qs
