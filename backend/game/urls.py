from django.urls import path
from .views import GameRecordAPI, LeaderboardAPI, RegisterView, LoginUserView, TestingAuthenticatedReq, LogoutApiView
from rest_framework_simplejwt.views import (TokenRefreshView,)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', LoginUserView.as_view(), name='login-user'),
    path('get-something/', TestingAuthenticatedReq.as_view(), name='just-for-testing'),
    path('logout/', LogoutApiView.as_view(), name='logout'),
    
    path('game/records/', GameRecordAPI.as_view(), name='game-records'),
    path('leaderboard/<int:level>/', LeaderboardAPI.as_view(), name='leaderboard'),
]