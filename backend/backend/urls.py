from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import (
    RegisterView,
    LoginView,
    ArtistInfoView,
    ArtistTrainingSessionsView,
    ArtistInjuriesView,
    ArtistClubActivitiesView,
    AllInjuriesView,
    AddInjuryView,
    AddTrainingSessionView,
    MarkAttendanceView,
    CreateClubActivityView
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", RegisterView.as_view(), name="register"),  # User registration endpoint
    path("api/user/login/", LoginView.as_view(), name="login"),  # User registration endpoint
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),  # Token obtain (JWT)
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),  # Token refresh
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),  # Include user routes for registration and login
    
    # ---------------------- Artist Views ----------------------
    path('api/artist-info/', ArtistInfoView.as_view(), name='artist-info'),
    path('api/artist/training-sessions/', ArtistTrainingSessionsView.as_view(), name='artist-training-sessions'),
    path('api/artist/injuries/', ArtistInjuriesView.as_view(), name='artist-injuries'),
    path('api/artist/club-activities/', ArtistClubActivitiesView.as_view(), name='artist-club-activities'),

    # ---------------------- Coach/Director Views ----------------------
    path('api/coach/director/injuries/', AllInjuriesView.as_view(), name='all-injuries'),  # Only for coach and director
    path('api/coach/add-injury/', AddInjuryView.as_view(), name='add-injury'),  # Only for coach
    path('api/coach/add-training-session/', AddTrainingSessionView.as_view(), name='add-training-session'),  # Only for coach
    path('api/coach/mark-attendance/', MarkAttendanceView.as_view(), name='mark-attendance'),  # Only for coach
    path('api/coach/director/create-club-activity/', CreateClubActivityView.as_view(), name='create-club-activity'),  # Coach and Director
]
