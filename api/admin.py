from django.contrib import admin

from .models import *

admin.site.register(Category)
admin.site.register(UserCategory)
admin.site.register(Question)
admin.site.register(GameQuestion)
admin.site.register(GameSession)
