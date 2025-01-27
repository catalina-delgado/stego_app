import json
from django.http import JsonResponse
from django.views import View
from ..api_stego.generate_map import Map
import os

from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return render(request, 'index.html')

class GenerateGradCAMView(View):
    def get(self, request):
        model_name = request.GET.get('model_name')
        if not model_name:
            return JsonResponse({"error": "model_name parameter is required"}, status=400)

        map = Map(model_name)
        gradcam_data = map.generate_gradcam()
        
        with open('api_data.json', 'w') as json_file:
            json.dump(gradcam_data, json_file)

        return JsonResponse(gradcam_data)

class ModelsView(View):
    def get(self, request):
        models_dir = '../api_stego/models'
        print(os.path.dirname(__file__))
        if not os.path.exists(models_dir):
            return JsonResponse({"error": f"Directory '{models_dir}' does not exist"}, status=500)

        try:
            models = [name for name in os.listdir(models_dir) if os.path.isdir(os.path.join(models_dir, name))]
            return JsonResponse(models, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)