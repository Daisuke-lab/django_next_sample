from django.http import Http404


def get_object_or_404(model, _name, *args, **kwargs):
    try:
        _object = model.objects.get(**kwargs)
        return _object
    except model.DoesNotExist:
        raise Http404(f"{_name} where {kwargs} does not exist")
