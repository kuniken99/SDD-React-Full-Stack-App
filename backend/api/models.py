from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    ROLE_CHOICES = [
        ('artist', 'Artist'),
        ('coach', 'Coach'),
        ('director', 'Director'),
    ]
    
    email = models.EmailField(unique=True)  # Ensures email uniqueness
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='artist')
    dob = models.DateField()  # Date of birth
    guardian_name = models.CharField(max_length=255, blank=True, null=True)  # Optional field
    coach_name = models.CharField(max_length=255, null=True, blank=True)

    # Required field and unique identifier for the user
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'role', 'dob']  # Removed 'username' since email is used

    class Meta:
        ordering = ['full_name']  # Optional: You can set an order here if needed (e.g., order by full_name)

    def __str__(self):
        return self.full_name  # Display full_name for clarity in admin and elsewhere

    def save(self, *args, **kwargs):
        # Ensure the email is lowercase before saving
        self.email = self.email.lower()
        super(User, self).save(*args, **kwargs)  # Ensure the original save logic is preserved

class CaptchaVerification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    captcha_response = models.TextField()
    verified = models.BooleanField(default=False)