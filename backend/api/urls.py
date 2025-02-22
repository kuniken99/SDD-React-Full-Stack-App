from django.urls import path
from .views import RegisterView, LoginView, ArtistInfoView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("artist-info/", ArtistInfoView.as_view(), name="artist-info"),
]
