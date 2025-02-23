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
    guardian_name = models.CharField(max_length=255, blank=True, null=True, default="N/A")
    coach_name = models.CharField(max_length=255, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'role', 'dob']

    class Meta:
        ordering = ['full_name']

    def __str__(self):
        return self.full_name

    def save(self, *args, **kwargs):
        self.email = self.email.lower() # Force lowercase before saving
        is_new = self.pk is None  # Check if user is new
        super().save(*args, **kwargs)

        if is_new and self.role == "artist":
            from .models import Artist  # Avoid circular import
            if not hasattr(self, 'artist_profile'):  # Ensure artist profile does not already exist
                Artist.objects.create(user=self)

class CaptchaVerification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    captcha_response = models.TextField()
    verified = models.BooleanField(default=False)


# ---------------------- Artist Model ----------------------
class Artist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='artist_profile')
    total_sessions = models.PositiveIntegerField(default=0)  # Total number of sessions attended
    total_training_hours = models.PositiveIntegerField(default=0)  # Total hours spent in training
    total_performance_hours = models.PositiveIntegerField(default=0)  # Total hours spent on performance
    attendance_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)  # Attendance rate in percentage
    
    def __str__(self):
        return self.user.full_name

    def update_attendance_rate(self):
        # Calculate attendance rate based on attendance records (attendance rate = present / total * 100)
        total_sessions = self.total_sessions
        if total_sessions > 0:
            present_sessions = self.trainingattendance_set.filter(status="Present").count()
            self.attendance_rate = (present_sessions / total_sessions) * 100
            self.save()

    def update_performance_hours(self, hours):
        """Updates the total performance hours for the artist."""
        self.total_performance_hours += hours
        self.save()
        
    def update_training_hours(self, hours):
        """Updates the total training hours for the artist."""
        self.total_training_hours += hours
        self.save()

# ---------------------- Coach Model (For Training Sessions) ----------------------
class Coach(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='coach_profile')

    def __str__(self):
        return self.user.full_name

# ---------------------- Director Model ----------------------
class Director(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="director_profile")
    managed_artists = models.ManyToManyField(Artist, related_name="directors_managed", blank=True)
    # Any other director-specific fields you want to add

    def __str__(self):
        return self.user.full_name
    
# ---------------------- Training Session Model ----------------------
class TrainingSession(models.Model):
    name = models.CharField(max_length=255)
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name="sessions")
    date = models.DateField()
    artists = models.ManyToManyField(Artist, through='TrainingAttendance', related_name="training_sessions")
    duration = models.IntegerField(default=0)  # Duration in minutes
    location = models.CharField(max_length=255, default="unknown")

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
    STATUS_CHOICES = [
        ('Upcoming', 'Upcoming'),
        ('Ongoing', 'Ongoing'),
        ('Full', 'Full'),
        ('Completed', 'Completed'),
    ]

    name = models.CharField(max_length=255)
    date = models.DateField()
    location = models.CharField(max_length=255)
    max_participants = models.IntegerField()
    registered_participants = models.ManyToManyField(Artist, related_name="club_activities", blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Upcoming')

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f"{self.name} - {self.status} ({self.registered_participants.count()}/{self.max_participants})"
