# coding=utf8
# -*- coding: utf8 -*-
# vim: set fileencoding=utf8 

from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from serializers import *
from django.http import HttpResponse
from django.core import serializers
from api.models import *
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404

from rest_framework.permissions import AllowAny

from permissions import IsStaffOrTargetUser


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    model = User

    def get_permissions(self):
        # allow non-authenticated user to create via POST
        return (AllowAny() if self.request.method == 'POST'
                else IsStaffOrTargetUser()),

@api_view(['GET'])
def categories(request):
    if request.method == 'GET':
        category = Category.objects.all()
        category_serializer = serializers.serialize("json", category)
        user_category = UserCategory.objects.all()
        user_category_serializer = serializers.serialize("json", user_category)
        return HttpResponse('[{"categories":'+category_serializer+', "userCategory":'+user_category_serializer+'}]')

@api_view(['POST','DELETE'])
def user_categories(request, category_id):
    user = User.objects.get(pk=request.user.pk)
    category = Category.objects.get(pk=category_id)

    if request.method == 'POST':
        UserCategory.objects.get_or_create(user=user, category=category)
        return HttpResponse(200)

    elif request.method == 'DELETE':
        get_object_or_404(UserCategory, user=user, category=category).delete()
        return HttpResponse(200)

@api_view(['POST'])   
def game_start(request, category_id):
    user = User.objects.get(pk=request.user.pk)
    category = Category.objects.filter(pk=category_id)[0];
    game_session = GameSession.objects.filter(category=category, player2=None)

    if len(game_session) > 0:
        game_session.update(player2=user)
        return HttpResponse(serializers.serialize("json", game_session))
    else:
        new_game_session = GameSession()
        new_game_session.player1 = user
        new_game_session.category = category
        new_game_session.save()
        return HttpResponse(serializers.serialize("json", new_game_session))