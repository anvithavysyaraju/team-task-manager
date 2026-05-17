from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager


class UserRole(models.TextChoices):
    ADMIN = 'admin', 'Admin'
    MEMBER = 'member', 'Member'


class User(AbstractUser):
    objects = UserManager()

    role = models.CharField(
        max_length=10,
        choices=UserRole.choices,
        default=UserRole.MEMBER,
    )

    class Meta:
        ordering = ['username']

    @property
    def is_admin(self):
        return self.role == UserRole.ADMIN

    @property
    def is_member(self):
        return self.role == UserRole.MEMBER
