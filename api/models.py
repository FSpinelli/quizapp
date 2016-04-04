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