from django.urls import path
from .views import home, GenerateGradCAMView, ModelsView

urlpatterns = [
    path('', home, name='home'),
    path('api/generate_gradcam/', GenerateGradCAMView.as_view(), name='generate_gradcam'),
    path('api/models/', ModelsView.as_view(), name='models'),
]
