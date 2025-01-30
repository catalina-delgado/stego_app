from django.shortcuts import render

def home(request):
    return render(request, 'index.html')

    def get(self, request):
        models_dir = os.path.join(os.path.dirname(__file__), 'api_stego/models')
        if not os.path.exists(models_dir):
            return JsonResponse({"error": f"Directory '{models_dir}' does not exist"}, status=500)

        try:
            models = [name for name in os.listdir(models_dir) if name.endswith('.hdf5')]
            return JsonResponse(models, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)