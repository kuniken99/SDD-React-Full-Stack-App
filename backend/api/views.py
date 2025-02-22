from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from .serializers import RegisterSerializer, LoginSerializer, CaptchaSerializer

class RegisterView(APIView):
    def post(self, request):
        print("Request data:", request.data)  # Log incoming request data

        full_name = request.data.get('full_name')
        email = request.data.get('email')
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
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)

        # Initialize the serializer with the incoming data
        serializer = RegisterSerializer(data=request.data)

        # Validate the serializer
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)  # Log validation errors for debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)


        return Response({
            "message": "User registered successfully.",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Ensure both fields are provided
        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        print(f"Attempting login with email: {email} and password: {password}")  # Debugging

        # Attempt to authenticate the user using email and password
        user = authenticate(request, username=email, password=password)
        
        print(f"Authentication result: {user}")  # Debugging

        if user is not None:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
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