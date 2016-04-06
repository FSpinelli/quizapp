from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
	category = models.CharField(max_length=255, null=True, blank=True)

	def __str__(self):
		return self.category

class UserCategory(models.Model):
	user = models.ForeignKey(User)
	category = models.ForeignKey(Category, null=True, on_delete=models.PROTECT)

	def __str__(self):
		return self.user.username

class Question(models.Model):
	category = models.ForeignKey(Category, null=True, on_delete=models.PROTECT)
	question = models.CharField(max_length=255, null=True, blank=True)
	answer = models.CharField(max_length=255, null=True, blank=True)
	option1 = models.CharField(max_length=255, null=True, blank=True)
	option2 = models.CharField(max_length=255, null=True, blank=True)
	option3 = models.CharField(max_length=255, null=True, blank=True)

	def __unicode__(self):
		return self.question

class GameSession(models.Model):
	player1 = models.ForeignKey(User, null=True, related_name='player1', editable=False)
	player2 = models.ForeignKey(User, null=True, related_name='player2', editable=False)
	category = models.ForeignKey(Category, null=True, on_delete=models.PROTECT)
	start = models.DateTimeField(null=True, auto_now_add=True, editable=False)
	end = models.DateTimeField(null=True, auto_now=True)

	def __str__(self):
		return self.pk

class GameQuestion(models.Model):
	game = models.ForeignKey(GameSession, null=True, on_delete=models.PROTECT)
	question = models.ForeignKey(Question, null=True, on_delete=models.PROTECT)
	player1_choice = models.IntegerField(null=True)
	player2_choice = models.IntegerField(null=True)
	player1_time = models.IntegerField(null=True)
	player2_time = models.IntegerField(null=True)

	def __str__(self):
		return self.pk