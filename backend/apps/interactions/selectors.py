from .models import Comment, Like

def get_user_comments(user, post_id=None):
    """Returns comments made by a specific user, optionally filtered by post."""
    qs = Comment.objects.filter(user=user).order_by("-created_at")
    if post_id:
        qs = qs.filter(post_id=post_id)
    return qs

def get_user_likes(user):
    """Returns likes made by a specific user."""
    return Like.objects.filter(user=user).select_related("post").order_by("-created_at")

def get_post_comments(post):
    """Returns all comments for a specific post."""
    return Comment.objects.filter(post=post).select_related("user").order_by("-created_at")
