# Generated by Django 5.1.6 on 2025-02-27 03:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_user_failed_login_attempts_user_lockout_until'),
    ]

    operations = [
        migrations.CreateModel(
            name='UniqueCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=10, unique=True)),
                ('role', models.CharField(choices=[('artist', 'Artist'), ('coach', 'Coach'), ('director', 'Director')], max_length=50)),
            ],
        ),
    ]
