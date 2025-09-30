"""
URL configuration for stock_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('stocks.urls')),
    # # Favicon redirects to serve from static files
    # path('favicon.ico', RedirectView.as_view(url=settings.STATIC_URL + 'favicon.ico', permanent=True)),
    # path('favicon-16x16.png', RedirectView.as_view(url=settings.STATIC_URL + 'favicon-16x16.png', permanent=True)),
    # path('favicon-32x32.png', RedirectView.as_view(url=settings.STATIC_URL + 'favicon-32x32.png', permanent=True)),
    # path('apple-touch-icon.png', RedirectView.as_view(url=settings.STATIC_URL + 'apple-touch-icon.png', permanent=True)),
    # path('android-chrome-192x192.png', RedirectView.as_view(url=settings.STATIC_URL + 'android-chrome-192x192.png', permanent=True)),
    # path('android-chrome-512x512.png', RedirectView.as_view(url=settings.STATIC_URL + 'android-chrome-512x512.png', permanent=True)),
    # path('site.webmanifest', RedirectView.as_view(url=settings.STATIC_URL + 'site.webmanifest', permanent=True)),
]

# # Serve static files in development
# if settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
