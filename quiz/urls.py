from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api-token-auth/', 'rest_framework_jwt.views.obtain_jwt_token'),
    url(r'^admin/', admin.site.urls),
    url(r'^categories/$', views.categories),
    url(r'^user-categories/(?P<category_id>\d+)/$', views.user_categories),
    url(r'^game-start/(?P<category_id>\d+)/$', views.game_start),
]