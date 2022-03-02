from rest_framework.filters import OrderingFilter
from .models import Check_Result
class ProductResultOrdering(OrderingFilter):

    allowed_custom_filters = ["id","small_genre__name", "small_genre__genre__name", "latest_check_datetime"]

    def get_ordering(self, request, queryset, view):
        """
        Ordering is set by a comma delimited ?ordering=... query parameter.

        The `ordering` query parameter can be overridden by setting
        the `ordering_param` value on the OrderingFilter or by
        specifying an `ORDERING_PARAM` value in the API settings.
        """
        params = request.query_params.get(self.ordering_param)
        print(params)

        if params:
            fields = [param.strip() for param in params.split(',')]
            # care with that - this will alow only custom ordering!
            ordering = [f for f in fields if f in self.allowed_custom_filters]
            if ordering:
                return ordering

        # No ordering was included, or all the ordering fields were invalid
        return self.get_default_ordering(view)

    def filter_queryset(self, request, queryset, view):

        ordering = self.get_ordering(request, queryset, view)
        print(ordering)
        if ordering:
            # implement a custom ordering here
            ordering = ['-id']

        if ordering:
            if "latest_check_datetime" in ordering or "-latest_check_datetime" in ordering:
                check_result = Check_Result.objects.all().values(
                    "url__domain__trademark__product__id").order_by('latest_check_datetime').distinct()
                print("check_result::",check_result)
                return queryset
            else:
                return queryset.order_by(*ordering)

        return queryset