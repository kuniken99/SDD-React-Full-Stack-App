from django.urls import path
from .views import (
    RegisterView, 
    LoginView, 
    ArtistInfoView, 
    ProfilePictureUpdateView, 
    DirectorDashboardView,
    UserInfoView,
    DirectorInfoView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("artist-info/", ArtistInfoView.as_view(), name="artist-info"),
    path('update-profile-picture/', ProfilePictureUpdateView.as_view(), name='update-profile-picture'),
    path('director-dashboard/', DirectorDashboardView.as_view(), name='director-dashboard'),
    path('user-info/', UserInfoView.as_view(), name='user-info'), 
    path('director-info/', DirectorInfoView.as_view(), name='director-info'),

]