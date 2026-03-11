from .models import Like

def add_like(user, post):
    Like.objects.get_or_create(user=user, post=post)
    return _get_like_status(user, post)

def remove_like(user, post):
    Like.objects.filter(user=user, post=post).delete()
    return _get_like_status(user, post)

def _get_like_status(user, post):
    like_count = Like.objects.filter(post=post).count()
    liked_by_me = Like.objects.filter(user=user, post=post).exists()
    return {
        "post_id": post.id,
        "like_count": like_count,
        "liked_by_me": liked_by_me
    }
