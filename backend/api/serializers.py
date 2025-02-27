from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
import requests
from django.conf import settings
from .models import User, Artist, Coach, Director, TrainingSession, TrainingAttendance, Injury, ClubActivity, UniqueCode

# ---------------------- User Serializer ----------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'role', 'dob', 'coach_name', 'guardian_name', 'profile_picture']

# ---------------------- Register Serializer ----------------------
class RegisterSerializer(serializers.ModelSerializer):
    confirmPassword = serializers.CharField(write_only=True)
    unique_code = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'confirmPassword', 'role', 'dob', 'coach_name', 'guardian_name', 'profile_picture', 'unique_code']

    def validate(self, data):
        # Check if passwords match
        if (data['password'] != data['confirmPassword']):
            raise serializers.ValidationError({"password": "Passwords must match."})

        # Password strength validation
        if len(data['password']) < 8:
            raise serializers.ValidationError({"password": "Password must be at least 8 characters."})

        # Validate unique code for coach and director roles
        if data['role'] in ['coach', 'director']:
            if 'unique_code' not in data or not data['unique_code']:
                raise serializers.ValidationError({"unique_code": "Unique code is required for coach and director roles."})
            if not UniqueCode.objects.filter(code=data['unique_code'], role=data['role']).exists():
                raise serializers.ValidationError({"unique_code": "Invalid unique code."})

        return data

    def create(self, validated_data):
        validated_data.pop('confirmPassword')  # Remove confirmPassword field before saving
        validated_data.pop('unique_code', None)  # Remove unique_code field before saving

        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            role=validated_data['role'],
            dob=validated_data['dob'],
            coach_name=validated_data.get('coach_name', None),
            profile_picture=validated_data.get('profile_picture', None),
            guardian_name=validated_data.get('guardian_name', None)
        )

        # If role is artist, create an Artist profile
        if user.role == 'artist':
            Artist.objects.create(user=user)

        return user

# ---------------------- Login Serializer ----------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        user = authenticate(username=email, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid credentials.")

        return {"user": user}

# ---------------------- Captcha Serializer ----------------------
class CaptchaSerializer(serializers.Serializer):
    captcha_token = serializers.CharField()

    def validate_captcha_token(self, value):
        response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data={
                'secret': settings.RECAPTCHA_PRIVATE_KEY,
                'response': value
            }
        ).json()

        if not response.get('success'):
            raise serializers.ValidationError('Invalid reCAPTCHA')
        return value
    
# ---------------------- Artist Serializer ----------------------
class ArtistSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    total_sessions = serializers.IntegerField(read_only=True)
    total_training_hours = serializers.IntegerField(read_only=True)
    total_performance_hours = serializers.IntegerField(read_only=True)
    attendance_rate = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    total_activities_joined = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Artist
        fields = ['id', 'user', 'total_sessions', 'total_training_hours', 'total_performance_hours', 'attendance_rate', 'total_activities_joined']

# Coach Serializer
class CoachSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Coach
        fields = ['id', 'user']

# Director Serializer
class DirectorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Director
        fields = ['id', 'user']

# Training Session Serializer
class TrainingSessionSerializer(serializers.ModelSerializer):
    coach_name = serializers.CharField(source='coach.user.full_name', read_only=True)
    artist_names = serializers.SerializerMethodField()
    artists = ArtistSerializer(many=True, read_only=True)
    coach = serializers.PrimaryKeyRelatedField(queryset=Coach.objects.all(), write_only=True)

    # duration = serializers.IntegerField()
    skills_improved = serializers.CharField(max_length=255, required=False)
    performance_rating = serializers.IntegerField(required=False)
    coach_notes = serializers.CharField(required=False)
    date = serializers.DateField()
    session_name = serializers.CharField(max_length=255)

    class Meta:
        model = TrainingSession
        fields = ['id', 'artists', 'coach', 'date', 'session_name', 'skills_improved', 'performance_rating', 'artist_names', 'duration', 'coach_notes', 'coach_name']
        # fields = ['id', 'name', 'coach', 'date', 'artists', 'duration', 'location', 'skills_improved', 'performance_rating', 'coach_notes']

    def get_artist_names(self, obj):
        return [artist.user.full_name for artist in obj.artists.all()]
    
# Training Attendance Serializer
class TrainingAttendanceSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer()
    session_name = serializers.CharField(source='session.session_name', read_only=True)
    date = serializers.DateField(source='session.date', read_only=True)
    coach_remarks = serializers.CharField(required=False)
    artistName = serializers.CharField(source='artist.user.full_name', read_only=True)
    coachName = serializers.CharField(source='session.coach.user.full_name', read_only=True)

    class Meta:
        model = TrainingAttendance
        fields = ['id', 'artist', 'session_name', 'date', 'status', 'coach_remarks', 'artistName', 'coachName']

# Injury Serializer
class InjurySerializer(serializers.ModelSerializer):
    artist = serializers.PrimaryKeyRelatedField(queryset=Artist.objects.all())
    artist_name = serializers.CharField(source='artist.user.full_name', read_only=True)
    date = serializers.DateField()
    injury_type = serializers.CharField(max_length=255)
    severity = serializers.ChoiceField(choices=[('Mild', 'Mild'), ('Moderate', 'Moderate'), ('Severe', 'Severe')])
    coach_remarks = serializers.CharField(required=False)

    class Meta:
        model = Injury
        fields = ['id', 'artist', 'artist_name', 'date', 'injury_type', 'severity', 'coach_remarks']

# Club Activity Serializer
class ClubActivitySerializer(serializers.ModelSerializer):
    registered_participants = ArtistSerializer(many=True, read_only=True)
    status = serializers.ChoiceField(choices=ClubActivity.STATUS_CHOICES)
    participants_joined = serializers.IntegerField(read_only=True)
    joined = serializers.SerializerMethodField()

    class Meta:
        model = ClubActivity
        fields = ['id', 'name', 'date', 'location', 'max_participants', 'registered_participants', 'status', 'description', 'participants_joined', 'joined']

    def get_joined(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            artist_profile = request.user.artist_profile
            return artist_profile in obj.registered_participants.all()
        return False