from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
	category_en = models.CharField(max_length=255, null=True, blank=True)
	category_es = models.CharField(max_length=255, null=True, blank=True)
	category_pt = models.CharField(max_length=255, null=True, blank=True)

	def __str__(self):
		return self.category_pt

class UserCategory(models.Model):
	user = models.ForeignKey(User)
	category = models.ForeignKey(Category, null=True, on_delete=models.PROTECT)

	def __str__(self):
		return self.user.username

class GameSession(models.Model):
	player1 = models.ForeignKey(User, null=True, related_name='player1', editable=False)
	player2 = models.ForeignKey(User, null=True, related_name='player2', editable=False)
	category = models.ForeignKey(Category, null=True, on_delete=models.PROTECT)
	start = models.DateTimeField(null=True, auto_now_add=True, editable=False)
	end = models.DateTimeField(null=True, auto_now=True)