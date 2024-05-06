from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken

from game.managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key=True, editable=False) 
    email = models.EmailField(
        max_length=255, verbose_name=_("email address"), unique=True
    )
    username = models.CharField(max_length=100, verbose_name=_("username"), unique=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "username"

    objects = UserManager()

    def tokens(self):    
        refresh = RefreshToken.for_user(self)
        return {
            "refresh":str(refresh),
            "access":str(refresh.access_token)
        }

    def __str__(self):
        return self.username

class GameRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    level = models.IntegerField()
    time_taken = models.IntegerField()
    date_played = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Level {self.level} - Time: {self.time_taken}"

class Leaderboard(models.Model):
    level = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    best_time = models.IntegerField()

    def __str__(self):
        return f"Level {self.level}: {self.user.username} - Best Time: {self.best_time}"
