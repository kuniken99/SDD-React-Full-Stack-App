from django.core.management.base import BaseCommand
from django.utils.crypto import get_random_string
from api.models import UniqueCode

class Command(BaseCommand):
    help = 'Generate unique codes for coach and director roles'

    def handle(self, *args, **kwargs):
        roles = ['coach', 'director']
        for role in roles:
            for _ in range(5):
                code = get_random_string(length=10)
                UniqueCode.objects.create(code=code, role=role)
                self.stdout.write(self.style.SUCCESS(f'Successfully created code {code} for role {role}'))