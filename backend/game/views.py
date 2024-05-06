from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from .serializers import GameRecordSerializer, LeaderboardSerializer, LogoutUserSerializer, UserRegisterSerializer, LoginSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Leaderboard, GameRecord


class RegisterView(GenericAPIView):
    serializer_class = UserRegisterSerializer

    def post(self, request):
        user = request.data
        serializer=self.serializer_class(data=user)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user_data=serializer.data
            return Response({
                'data':user_data,
                'message':'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class LoginUserView(GenericAPIView):
    serializer_class=LoginSerializer
    
    def post(self, request):
        serializer= self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TestingAuthenticatedReq(GenericAPIView):
    permission_classes=[IsAuthenticated]

    def get(self, request):
        data={'message':'User authenticated'}
        return Response(data, status=status.HTTP_200_OK)


class LogoutApiView(GenericAPIView):
    serializer_class = LogoutUserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GameRecordAPI(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        game_records = GameRecord.objects.filter(user=request.user)
        serializer = GameRecordSerializer(game_records, many=True)
        return Response({'data': serializer.data, 'message': 'Fetched game data successfully'}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = GameRecordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            level = serializer.validated_data['level']
            user = request.user
            time_taken = serializer.validated_data['time_taken']
            update_leaderboard(level, user, time_taken)
            return Response({'data': serializer.data, 'message': 'Saved game data successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def update_leaderboard(level, user, time_taken):
    try:
        leaderboard_entry = Leaderboard.objects.get(level=level, user=user)
        if time_taken < leaderboard_entry.best_time:
            leaderboard_entry.best_time = time_taken
            leaderboard_entry.save()
    except Leaderboard.DoesNotExist:
        Leaderboard.objects.create(level=level, user=user, best_time=time_taken)


class LeaderboardAPI(GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, level):
        leaderboard = Leaderboard.objects.filter(level=level).order_by('best_time').values('id','level','user__username','best_time')[:10]
        serializer = LeaderboardSerializer(leaderboard, many=True)
        return Response(serializer.data)
