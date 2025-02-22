from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    ROLE_CHOICES = [
        ('artist', 'Artist'),
        ('coach', 'Coach'),
        ('director', 'Director'),
    ]
    
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='artist')
    dob = models.DateField()
    guardian_name = models.CharField(max_length=255, blank=True, null=True)
    coach_name = models.CharField(max_length=255, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'role', 'dob']

    class Meta:
        ordering = ['full_name']

    def __str__(self):
        return self.full_name

    def save(self, *args, **kwargs):
        self.email = self.email.lower()
        super(User, self).save(*args, **kwargs)

class CaptchaVerification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    captcha_response = models.TextField()
    verified = models.BooleanField(default=False)

# ---------------------- Artist Model ----------------------
class Artist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='artist_profile')
    attendance_rate = models.FloatField(default=0.0)

    def __str__(self):
        return self.user.full_name

# ---------------------- Coach Model (For Training Sessions) ----------------------
class Coach(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='coach_profile')

    def __str__(self):
        return self.user.full_name

# ---------------------- Training Session Model ----------------------
class TrainingSession(models.Model):
    name = models.CharField(max_length=255)
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name="sessions")
    date = models.DateField()
    artists = models.ManyToManyField(Artist, through='TrainingAttendance', related_name="training_sessions")

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.name} ({self.date}) - {self.coach.user.full_name}"

# ---------------------- Training Attendance Model ----------------------
class TrainingAttendance(models.Model):
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
    ]

    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="training_attendance")
    session = models.ForeignKey(TrainingSession, on_delete=models.CASCADE, related_name="attendance")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Absent')
    coach_remarks = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('artist', 'session')  # Prevent duplicate attendance entries

    def __str__(self):
        return f"{self.artist.user.full_name} - {self.session.name} ({self.status})"

# ---------------------- Injury Model ----------------------
class Injury(models.Model):
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="injuries")
    date = models.DateField(auto_now_add=True)
    injury_type = models.CharField(max_length=255)
    severity = models.CharField(max_length=10, choices=[('Mild', 'Mild'), ('Moderate', 'Moderate'), ('Severe', 'Severe')])
    coach_remarks = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.artist.user.full_name} - {self.injury_type} ({self.severity})"

# ---------------------- Club Activity Model ----------------------
class ClubActivity(models.Model):
    name = models.CharField(max_length=255)
    date = models.DateField()
    location = models.CharField(max_length=255)
    max_participants = models.IntegerField()
    participants = models.ManyToManyField(Artist, related_name="club_activities", blank=True)

    STATUS_CHOICES = [
        ('Upcoming', 'Upcoming'),
        ('Ongoing', 'Ongoing'),
        ('Full', 'Full'),
        ('Completed', 'Completed'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Upcoming')

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f"{self.name} - {self.status} ({self.participants.count()}/{self.max_participants})"
