from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import RegisterView, LoginView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", RegisterView.as_view(), name="register"),  # User registration endpoint
    path("api/user/login/", LoginView.as_view(), name="login"),  # User registration endpoint
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),  # Token obtain (JWT)
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),  # Token refresh
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),  # Include user routes for registration and login
    
]
