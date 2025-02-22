from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from .models import User, Artist, TrainingSession, TrainingAttendance, Injury
import requests
from django.conf import settings

# ---------------------- User Serializer ----------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'role', 'dob', 'guardian_name']

# ---------------------- Register Serializer ----------------------
class RegisterSerializer(serializers.ModelSerializer):
    confirmPassword = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'confirmPassword', 'role', 'dob', 'coach_name', 'guardian_name']

    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError({"password": "Passwords must match."})

        # Password strength validation
        if len(data['password']) < 8:
            raise serializers.ValidationError({"password": "Password must be at least 8 characters."})

        return data

    def create(self, validated_data):
        validated_data.pop('confirmPassword')  # Remove confirmPassword field before saving
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            role=validated_data['role'],
            dob=validated_data['dob'],
            coach_name=validated_data.get('coach_name', None),
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

# ---------------------- Training Session Serializer ----------------------
class TrainingSessionSerializer(serializers.ModelSerializer):
    coach_name = serializers.CharField(source='coach.user.full_name', read_only=True)

    class Meta:
        model = TrainingSession
        fields = ['id', 'name', 'date', 'coach', 'coach_name']

# ---------------------- Training Attendance Serializer ----------------------
class TrainingAttendanceSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(source='artist.user.full_name', read_only=True)
    session_name = serializers.CharField(source='session.name', read_only=True)

    class Meta:
        model = TrainingAttendance
        fields = ['id', 'artist', 'artist_name', 'session', 'session_name', 'status', 'coach_remarks']

# ---------------------- Injury Serializer ----------------------
class InjurySerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(source='artist.user.full_name', read_only=True)

    class Meta:
        model = Injury
        fields = ['id', 'artist', 'artist_name', 'date', 'injury_type', 'severity', 'coach_remarks']
