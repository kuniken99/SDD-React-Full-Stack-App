from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import (
    RegisterView,
    LoginView,
    ArtistInfoView,
    UserInfoView,
    ArtistTrainingSessionsView,
    ArtistInjuriesView,
    ArtistClubActivitiesView,
    UpdateFullNameView,
    UpdateEmailView,
    UpdatePasswordView,
    RequestPasswordChangeOTPView,
    VerifyOTPAndChangePasswordView,
    RequestEmailChangeOtpAPIView,
    VerifyOtpAndChangeEmailAPIView,
    ProfilePictureUpdateView,
    DirectorDashboardView,
    AllInjuriesView,
    AddInjuryView,
    AddTrainingSessionView,
    MarkAttendanceView,
    CreateClubActivityView,
    DirectorInfoView,
    CoachInfoView,
    CoachDashboardView,
    
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", RegisterView.as_view(), name="register"),  # User registration endpoint
    path("api/user/login/", LoginView.as_view(), name="login"),  # User registration endpoint
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),  # Token obtain (JWT)
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),  # Token refresh
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),  # Include user routes for registration and login
    path('api/user-info/', UserInfoView.as_view(), name='user-info'), 

    # ---------------------- Artist Views ----------------------
    path('api/artist-info/', ArtistInfoView.as_view(), name='artist-info'),
    path('api/artist/training-sessions/', ArtistTrainingSessionsView.as_view(), name='artist-training-sessions'),
    path('api/artist/injuries/', ArtistInjuriesView.as_view(), name='artist-injuries'),
    path('api/artist/club-activities/', ArtistClubActivitiesView.as_view(), name='artist-club-activities'),
    path('api/update-full-name/', UpdateFullNameView.as_view(), name='update_full_name'),
    path('api/update-email/', UpdateEmailView.as_view(), name='update_email'),
    
    path('api/update-password/', UpdatePasswordView.as_view(), name='update_password'),
    path('api/request-password-change-otp/', RequestPasswordChangeOTPView.as_view(), name='request_password_change_otp'),
    path('api/verify-otp-and-change-password/', VerifyOTPAndChangePasswordView.as_view(), name='verify_otp_and_change_password'),
    path('api/request-email-change-otp/', RequestEmailChangeOtpAPIView.as_view(), name='request_email_change_otp'),
    path('api/verify-otp-and-change-email/', VerifyOtpAndChangeEmailAPIView.as_view(), name='verify_otp_and_change_email'),
    path('api/update-profile-picture/', ProfilePictureUpdateView.as_view(), name='update-profile-picture'),
    
    # ---------------------- Coach/Director Views ----------------------
    path('api/coach/director/injuries/', AllInjuriesView.as_view(), name='all-injuries'),  # Only for coach and director
    path('api/coach/add-injury/', AddInjuryView.as_view(), name='add-injury'),  # Only for coach
    path('api/coach/add-training-session/', AddTrainingSessionView.as_view(), name='add-training-session'),  # Only for coach
    path('api/coach/mark-attendance/', MarkAttendanceView.as_view(), name='mark-attendance'),  # Only for coach
    path('api/coach/director/create-club-activity/', CreateClubActivityView.as_view(), name='create-club-activity'),  # Coach and Director
    path('director-dashboard/', DirectorDashboardView.as_view(), name='director-dashboard'),
    path('coach-dashboard/', CoachDashboardView.as_view(), name='coach-dashboard'),
    path('api/director-info/', DirectorInfoView.as_view(), name='director-info'),
    path('api/coach-info/', CoachInfoView.as_view(), name='coach-info'),


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)