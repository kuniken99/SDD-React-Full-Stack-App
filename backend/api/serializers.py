from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from .models import User
import requests
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'email', 'role', 'dob', 'guardian_name']

class RegisterSerializer(serializers.ModelSerializer):
    confirmPassword = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'confirmPassword', 'role', 'dob', 'coach_name', 'guardian_name']

    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError({"password": "Passwords must match."})

        # Additional validation if needed (e.g., password strength, etc.)
        if len(data['password']) < 8:
            raise serializers.ValidationError({"password": "Password must be at least 8 characters."})
        
        return data

    def create(self, validated_data):
        validated_data.pop('confirmPassword')  # Remove the confirmation password from the validated data
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            role=validated_data['role'],
            dob=validated_data['dob'],
            coach_name=validated_data['coach_name'],
            guardian_name=validated_data.get('guardian_name', None)
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        # Check if email or password is missing
        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        return data
    
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