from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from django.db.models import Sum, Count, Avg
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
from .models import User, Artist, Coach, Director, TrainingSession, TrainingAttendance, Injury, ClubActivity
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    CaptchaSerializer,
    UserSerializer,
    ArtistSerializer,
    CoachSerializer,
    DirectorSerializer,
    TrainingSessionSerializer,
    TrainingAttendanceSerializer,
    InjurySerializer,
    ClubActivitySerializer,
)
from django.core.mail import send_mail
from django.db import models
from django.conf import settings
import random
import time

otp_storage = {}

class RequestEmailChangeOtpAPIView(APIView):
    def post(self, request):
        user = request.user
        # Generate a 6-digit OTP using random.randint
        otp = random.randint(100000, 999999)

        # Store OTP and user ID in the in-memory dictionary (otp_storage)
        otp_storage[user.id] = otp

        # Send OTP to email
        subject = "OTP for Email Change"
        message = f"Your OTP for email change is {otp}"
        recipient_list = [user.email]
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list)

        return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)


class VerifyOtpAndChangeEmailAPIView(APIView):
    def put(self, request):
        user = request.user
        otp_input = request.data.get('otp')
        new_email = request.data.get('email')

        # Check if the OTP exists for the user
        otp_sent = otp_storage.get(user.id)

        if not otp_sent:
            return Response({"error": "OTP not found or expired."}, status=status.HTTP_400_BAD_REQUEST)

        if otp_sent != int(otp_input):  # Ensure OTP is compared as integers
            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user.email = new_email
            user.save()

            # Clear OTP after successful email change
            del otp_storage[user.id]

            return Response({"message": "Email updated successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class RequestPasswordChangeOTPView(APIView):
    def post(self, request):
        user = request.user  # Assumes the user is authenticated
        otp = random.randint(100000, 999999)  # Generate a 6-digit OTP
        otp_storage[user.email] = {"otp": otp, "timestamp": time.time()}
        
        # Send OTP to user's email
        send_mail(
            'OTP for Password Change',
            f'Your OTP for Password change is {otp}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

        return Response({"message": "OTP sent to your email."}, status=status.HTTP_200_OK)

class VerifyOTPAndChangePasswordView(APIView):
    def put(self, request):
        user = request.user  # Assumes the user is authenticated
        otp = request.data.get('otp')
        new_password = request.data.get('password')
        
        # Check if OTP is valid and not expired
        if user.email in otp_storage:
            stored_otp_data = otp_storage[user.email]
            if time.time() - stored_otp_data["timestamp"] < 300:  # OTP is valid for 5 minutes
                if int(otp) == stored_otp_data["otp"]:
                    user.set_password(new_password)
                    user.save()
                    del otp_storage[user.email]  # Delete OTP after successful use
                    return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                del otp_storage[user.email]  # Delete expired OTP
                return Response({"error": "OTP expired."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"error": "OTP not found."}, status=status.HTTP_400_BAD_REQUEST)
    
class ArtistListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        artists = Artist.objects.all()
        serializer = ArtistSerializer(artists, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# ---------------------- Get Artist Info (Protected) ----------------------
class ArtistInfoView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        user = request.user  # Authenticated user
        print("User role:", user.role)
        if user.role != 'artist':
            return Response({"detail": "User is not an artist."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            artist_profile = user.artist_profile
            return Response({
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role,
                "dob": user.dob,
                "guardian_name": user.guardian_name,
                "profile_picture": user.profile_picture.url if user.profile_picture else None,
                "attendance_rate": artist_profile.attendance_rate,
                "coach_name": user.coach_name,
                "total_sessions": artist_profile.total_sessions,
                "total_training_hours": artist_profile.total_training_hours,
                "total_performance_hours": artist_profile.total_performance_hours,
            }, status=status.HTTP_200_OK)
        except (Artist.DoesNotExist, ObjectDoesNotExist):
            print("Artist profile not found for", user.full_name)
            return Response({"detail": "Artist profile not found."}, status=status.HTTP_404_NOT_FOUND)
    
class RegisterView(APIView):
    def post(self, request):
        full_name = request.data.get('full_name')
        email = request.data.get("email", "").strip().lower()  # Convert to lowercase
        password = request.data.get('password')
        confirm_password = request.data.get('confirmPassword')  # Match the confirmPassword field name
        role = request.data.get('role')  # Artist, Coach, Director
        dob = request.data.get('dob')
        coach_name = request.data.get('coach_name')
        guardian_name = request.data.get('guardian_name', None)  # Optional field

        # Validate required fields
        if not all([full_name, email, password, confirm_password, role, dob]):
            return Response({"error": "All fields except guardian_name are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if passwords match
        if password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the custom User model
        User = get_user_model()

        # Check if email already exists
        if User.objects.filter(email__iexact=email).exists():
            return Response({"error": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        user = User.objects.create_user(
            username=email,  # Use email as the username
            email=email,
            password=password,  # Hash password
            full_name=full_name,
            role=role,
            dob=dob,
            coach_name=coach_name,
            guardian_name=guardian_name
        )

        # Generate OTP
        otp = random.randint(100000, 999999)
        otp_storage[email] = {"otp": otp, "timestamp": time.time()}

        # Send OTP to email
        subject = "OTP for Email Verification"
        message = f"Your OTP for email verification is {otp}"
        recipient_list = [email]
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list)

        return Response({"message": "User registered successfully. OTP sent to email."}, status=status.HTTP_201_CREATED)

class VerifyOtpAndActivateUserView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp_input = request.data.get('otp')

        # Check if the OTP exists for the email
        otp_data = otp_storage.get(email)

        if not otp_data:
            return Response({"error": "OTP not found or expired."}, status=status.HTTP_400_BAD_REQUEST)

        if otp_data["otp"] != int(otp_input):
            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        # Activate user
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
            user.is_active = True
            user.save()

            # Clear OTP after successful verification
            del otp_storage[email]

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "Email verified successfully. User activated.",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "role": user.role,
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email", "").strip() # Keep user's input case
        password = request.data.get('password')

        # Ensure both fields are provided
        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        print(f"Attempting login with email: {email} and password: {password}")  # Debugging

        # Attempt to authenticate the user using email and password
        # user = authenticate(request, username=email, password=password)
        User = get_user_model()
        user = User.objects.filter(email__iexact=email).first()

        print(f"Authentication result: {user}")  # Debugging

        if user and user.check_password(password):
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "role": user.role,  # Send role along with the tokens
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
    
class VerifyCaptchaView(APIView):
    def post(self, request):
        serializer = CaptchaSerializer(data=request.data)
        if serializer.is_valid():
            return Response({'message': 'Captcha verified'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # ---------------------- Get Artist Injuries ----------------------
# class ArtistInjuriesView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user  # Authenticated user

#         # Fetch artist injuries for the authenticated user
#         try:
#             artist_profile = user.artist_profile
#             injuries = artist_profile.injuries.all()
#             serializer = InjurySerializer(injuries, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except Artist.DoesNotExist:
#             return Response({"detail": "Artist profile not found."}, status=status.HTTP_404_NOT_FOUND)

class ArtistInjuriesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Authenticated user

        # Fetch artist injuries for the authenticated user
        try:
            artist_profile = user.artist_profile
            injuries = artist_profile.injuries.all()
            serializer = InjurySerializer(injuries, many=True)
            return Response({
                "artist": ArtistSerializer(artist_profile).data,
                "injuries": serializer.data
            }, status=status.HTTP_200_OK)
        except Artist.DoesNotExist:
            return Response({"detail": "Artist profile not found."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        user = request.user  # Authenticated user

        # Check if the user is an artist
        if user.role != 'artist':
            return Response({"error": "Only artists can add injuries."}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['artist'] = user.artist_profile.id  # Set the artist field to the authenticated user's artist profile

        serializer = InjurySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------------------- Get Club Activities for Artist ----------------------
class ArtistClubActivitiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Authenticated user

        # Fetch club activities for the authenticated user
        try:
            artist_profile = user.artist_profile
            activities = artist_profile.club_activities.all()
            serializer = ClubActivitySerializer(activities, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Artist.DoesNotExist:
            return Response({"detail": "Artist profile not found."}, status=status.HTTP_404_NOT_FOUND)

class UpdateFullNameView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user  # assuming you're using the logged-in user
        new_full_name = request.data.get('full_name')

        if new_full_name:
            user.full_name = new_full_name
            user.save()
            return Response({"message": "Full name updated successfully."}, status=status.HTTP_200_OK)
        return Response({"error": "Full name is required."}, status=status.HTTP_400_BAD_REQUEST)

class UpdateEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        new_email = request.data.get('email')

        if new_email:
            user.email = new_email
            user.save()
            return Response({"message": "Email updated successfully."}, status=status.HTTP_200_OK)
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        new_password = request.data.get('password')

        if new_password:
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        return Response({"error": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)
    
# ---------------------- get: Get All Injuries (For Coach and Director) ----------------------
# ---------------------- post: Create New Injury (For Coach and Artist) ----------------------
class ManageInjuriesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role not in ['coach', 'director']:
            return Response({"error": "Only coaches or directors can view injuries."}, status=status.HTTP_403_FORBIDDEN)

        injuries = Injury.objects.all().order_by('date', 'artist__user__full_name', 'injury_type')
        serializer = InjurySerializer(injuries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        if user.role != 'coach':
            return Response({"error": "Only coaches can add injuries."}, status=status.HTTP_403_FORBIDDEN)

        serializer = InjurySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        user = request.user
        if user.role != 'coach':
            return Response({"error": "Only coaches can update injuries."}, status=status.HTTP_403_FORBIDDEN)

        injury_id = request.data.get('id')
        try:
            injury = Injury.objects.get(id=injury_id)
        except Injury.DoesNotExist:
            return Response({"error": "Injury not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = InjurySerializer(injury, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = request.user
        if user.role != 'coach':
            return Response({"error": "Only coaches can delete injuries."}, status=status.HTTP_403_FORBIDDEN)

        injury_id = request.data.get('id')
        try:
            injury = Injury.objects.get(id=injury_id)
        except Injury.DoesNotExist:
            return Response({"error": "Injury not found."}, status=status.HTTP_404_NOT_FOUND)

        injury.delete()
        return Response({"message": "Injury deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


# # ---------------------- Get All Injuries (For Coach and Director) ----------------------
# class AllInjuriesView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user  # Authenticated user

#         # Check if the user is a director, since artists can't view all injuries
#         if user.role not in ['coach', 'director']:
#             return Response({"detail": "You do not have permission to view this data."}, status=status.HTTP_403_FORBIDDEN)

#         # Fetch all injuries
#         injuries = Injury.objects.all()
#         serializer = InjurySerializer(injuries, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)


# # ---------------------- Create New Injury (For Coach and Artist) ----------------------
# class AddInjuryView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         user = request.user  # Authenticated user

#         # Check if the user is a coach
#         if user.role == 'director':
#             return Response({"detail": "Director cannot add injuries."}, status=status.HTTP_403_FORBIDDEN)

#         # Deserialize data and create new injury
#         serializer = InjurySerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    
# ---------------------- Get Artist Training Sessions ----------------------
class ArtistTrainingSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Authenticated user

        # Fetch artist training sessions for the authenticated user
        try:
            artist_profile = user.artist_profile
            sessions = artist_profile.training_sessions.all()
            serializer = TrainingSessionSerializer(sessions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Artist.DoesNotExist:
            return Response({"detail": "Artist profile not found."}, status=status.HTTP_404_NOT_FOUND)



# ---------------------- Create New Training Session (For Coach) ----------------------
class AddTrainingSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user  

        # Ensure the user is a coach
        if user.role != 'coach':
            return Response({"detail": "Only coaches can add training sessions."}, status=status.HTTP_403_FORBIDDEN)

        # Get the coach profile
        coach = Coach.objects.filter(user=user).first()
        if not coach:
            return Response({"detail": "User does not have a coach profile."}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure coach is assigned before saving
        data = request.data.copy()
        data["coach"] = coach.id  # Explicitly set the coach ID

        # Validate and save
        serializer = TrainingSessionSerializer(data=data)
        if serializer.is_valid():
            serializer.save(coach=coach)  # Ensure the coach is saved
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TrainingSessionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = TrainingSession.objects.all()
        serializer = TrainingSessionSerializer(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user  # Authenticated user

        # Check if the user is a coach
        if user.role != 'coach':
            return Response({"detail": "Only coaches can add training sessions."}, status=status.HTTP_403_FORBIDDEN)

        # Check if the user has a coach profile
        if not hasattr(user, 'coach_profile'):
            return Response({"detail": "User does not have a coach profile."}, status=status.HTTP_400_BAD_REQUEST)

        # Deserialize data and create new training session
        serializer = TrainingSessionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(coach=user.coach_profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TrainingSessionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            session = TrainingSession.objects.get(pk=pk)
            serializer = TrainingSessionSerializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TrainingSession.DoesNotExist:
            return Response({"detail": "Training session not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            session = TrainingSession.objects.get(pk=pk)
            serializer = TrainingSessionSerializer(session, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TrainingSession.DoesNotExist:
            return Response({"detail": "Training session not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            session = TrainingSession.objects.get(pk=pk)
            session.delete()
            return Response({"message": "Training session deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except TrainingSession.DoesNotExist:
            return Response({"detail": "Training session not found."}, status=status.HTTP_404_NOT_FOUND)


# ---------------------- Mark Artist Attendance ----------------------
class MarkAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user  # Authenticated user

        # Check if the user is a coach
        if user.role != 'coach':
            return Response({"detail": "Only coaches can mark attendance."}, status=status.HTTP_403_FORBIDDEN)

        # Deserialize data and create or update attendance
        serializer = TrainingAttendanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(coach=user.coach_profile)  # Assume coach_profile exists
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------------- Create Club Activity (For Coach or Director) ----------------------
class CreateClubActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user  # Authenticated user

        # Check if the user is a coach or director
        if user.role not in ['coach', 'director']:
            return Response({"detail": "Only coaches or directors can create club activities."}, status=status.HTTP_403_FORBIDDEN)

        # Deserialize data and create new club activity
        serializer = ClubActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# old one using User instead of Artist object
# class DirectorDashboardView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # Ensure the user is a director
#         user = request.user
#         if user.role != 'director':
#             return Response({"detail": "User is not a director."}, status=403)
        
#         # Fetch the required data
#         total_artists = User.objects.filter(role='artist').count()
#         total_sessions = TrainingSession.objects.count()
#         total_hours_logged = sum([session.duration for session in TrainingSession.objects.all()]) / 60
#         ongoing_injuries = Injury.objects.filter(severity="Moderate").count()
#         severe_injuries = Injury.objects.filter(severity="Severe").count()
#         recovering_injuries = Injury.objects.filter(severity="Mild").count()

#         # Top 3 artists with the most training sessions
#         top_artists = (
#             Artist.objects.annotate(session_count=Count('training_attendance'))
#             .order_by('-session_count')[:3]
#         )

#         # Pie chart data for different types of training sessions
#         session_types = TrainingSession.objects.values('session_name').annotate(count=Count('id'))

#         data = {
#             'full_name': user.full_name,
#             'total_artists': total_artists,
#             'total_sessions': total_sessions,
#             'total_hours_logged': total_hours_logged,
#             'ongoing_injuries': ongoing_injuries,
#             'severe_injuries': severe_injuries,
#             'recovering_injuries': recovering_injuries,
#             'top_artists': [{'name': artist.user.full_name, 'attendance': artist.session_count} for artist in top_artists],
#             'session_types': session_types
#         }

#         return Response(data, status=200)


class DirectorDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'director':
            return Response({"detail": "User is not a director."}, status=403)
        
        total_artists = Artist.objects.count()
        total_sessions = TrainingSession.objects.count()
        total_hours_logged = TrainingSession.objects.aggregate(Sum('duration'))['duration__sum']
        severe_injuries = Injury.objects.filter(severity="Severe").count()
        recovering_injuries = Injury.objects.filter(severity="Mild").count()

        # Top 3 artists with the most training sessions
        top_artists = (
            Artist.objects.annotate(session_count=Count('training_attendance'))
            .order_by('-session_count')[:3]
        )

        # Pie chart data for different types of training sessions
        session_types = TrainingSession.objects.values('session_name').annotate(count=Count('id'))

        data = {
            'full_name': user.full_name,
            'total_artists': total_artists,
            'total_sessions': total_sessions,
            'total_hours_logged': total_hours_logged,
            'ongoing_injuries': Injury.objects.count(),
            'severe_injuries': severe_injuries,
            'recovering_injuries': recovering_injuries,
            'top_artists': [{'name': artist.user.full_name, 'attendance': artist.session_count} for artist in top_artists],
            'session_types': session_types
        }

        return Response(data, status=200)
    
class CoachDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'coach':
            return Response({"detail": "User is not a coach."}, status=403)
        
        data = {
            "full_name": user.full_name,
            "total_sessions":  TrainingSession.objects.count(),
            "total_hours_logged": sum([session.duration for session in TrainingSession.objects.all()]) / 60,
            "ongoing_injuries": Injury.objects.count(),
            "severe_injuries": Injury.objects.filter(severity="Severe").count(),
            "recovering_injuries": Injury.objects.filter(severity="Mild").count(),
        }
        return Response(data)
    

# class CoachDashboardView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         if user.role != 'coach':
#             return Response({"detail": "User is not a coach."}, status=403)
        
#         try:
#             coach = user.coach_profile
#             total_sessions = TrainingSession.objects.filter(coach=coach).count()
#             average_attendance_rate = TrainingSession.objects.filter(coach=coach).aggregate(Avg('attendance_rate'))['attendance_rate__avg']
#             total_hours_logged = TrainingSession.objects.filter(coach=coach).aggregate(Sum('duration'))['duration__sum']
#             ongoing_injuries = Injury.objects.filter(status="Ongoing").count()
#             severe_injuries = Injury.objects.filter(severity="Severe").count()
#             recovering_injuries = Injury.objects.filter(status="Recovering").count()

#             data = {
#                 "full_name": user.full_name,
#                 "total_sessions": total_sessions,
#                 "average_attendance_rate": average_attendance_rate,
#                 "total_hours_logged": total_hours_logged,
#                 "ongoing_injuries": ongoing_injuries,
#                 "severe_injuries": severe_injuries,
#                 "recovering_injuries": recovering_injuries,
#             }
#             return Response(data)
#         except Coach.DoesNotExist:
#             return Response({"detail": "Coach profile does not exist."}, status=404)


class TrainingSessionViewSet(viewsets.ModelViewSet):
    queryset = TrainingSession.objects.all()
    serializer_class = TrainingSessionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'coach':
            raise PermissionDenied("Only coaches can create training sessions.")
        serializer.save(coach=user.coach_profile)

class TrainingAttendanceViewSet(viewsets.ModelViewSet):
    queryset = TrainingAttendance.objects.all()
    serializer_class = TrainingAttendanceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'coach':
            raise PermissionDenied("Only coaches can mark attendance.")
        serializer.save()

class InjuryViewSet(viewsets.ModelViewSet):
    queryset = Injury.objects.all()
    serializer_class = InjurySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'coach':
            raise PermissionDenied("Only coaches can add injuries.")
        serializer.save()

class ClubActivityViewSet(viewsets.ModelViewSet):
    queryset = ClubActivity.objects.all()
    serializer_class = ClubActivitySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ['coach', 'director']:
            raise PermissionDenied("Only coaches or directors can create club activities.")
        serializer.save()

class ProfilePictureUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        file = request.FILES.get('profile_picture')
        if file:
            user.profile_picture = file
            user.save()
            return Response({"message": "Profile picture updated successfully."}, status=200)
        return Response({"error": "No file uploaded"}, status=400)

# ---------------------- Get User Info ----------------------
class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

# class DirectorInfoViewi(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         if user.role != 'director':
#             return Response({"detail": "User is not a director."}, status=403)
#         try:
#             serializer = DirectorSerializer(user.director_profile)
#             return Response(serializer.data)
#         except Director.DoesNotExist:
#             return Response({"detail": "Director profile does not exist."}, status=404)

class DirectorInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'director':
            return Response({"detail": "User is not a director."}, status=403)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    

class CoachInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'coach':
            return Response({"detail": "User is not a coach."}, status=403)
        serializer = UserSerializer(user)
        return Response(serializer.data)