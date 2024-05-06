
from .models import GameRecord, Leaderboard, User
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    password2= serializers.CharField(max_length=68, min_length=6, write_only=True)

    class Meta:
        model=User
        fields = ['email', 'username', 'password', 'password2']

    def validate(self, attrs):
        password=attrs.get('password', '')
        password2 =attrs.get('password2', '')
        if password !=password2:
            raise serializers.ValidationError("Passwords do not match")
        return attrs

    def create(self, validated_data):
        user= User.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('username'),
            password=validated_data.get('password')
        )
        return user

class LoginSerializer(serializers.ModelSerializer):
    username=serializers.CharField(max_length=255)
    email = serializers.EmailField(required=False)
    password=serializers.CharField(max_length=68, write_only=True)
    access_token=serializers.CharField(max_length=255, read_only=True)
    refresh_token=serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User
        fields = ['username','email', 'password', 'access_token', 'refresh_token']

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        request=self.context.get('request')
        user = authenticate(request, username=username, password=password)
        if not user:
            raise AuthenticationFailed("Invalid credentials, please try again")
        tokens=user.tokens()
        return {
            'email':user.email,
            'username':user.username,
            "access_token":str(tokens.get('access')),
            "refresh_token":str(tokens.get('refresh'))
        }

    
class LogoutUserSerializer(serializers.Serializer):
    refresh_token=serializers.CharField()

    default_error_message = {
        'bad_token': ('Token is expired or invalid')
    }

    def validate(self, attrs):
        self.token = attrs.get('refresh_token')

        return attrs

    def save(self, **kwargs):
        try:
            token=RefreshToken(self.token)
            token.blacklist()
        except TokenError:
            return self.fail('bad_token')


class GameRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRecord
        fields = ['id', 'level', 'time_taken', 'date_played']


class LeaderboardSerializer(serializers.ModelSerializer):
    user__username = serializers.CharField(required=False)
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'level', 'user__username', 'best_time']
    
    def to_representation(self, instance):
        data=super().to_representation(instance)
        data['user']=data['user__username']
        del data['user__username']
        return data
