from django.urls import path

from . import views

urlpatterns = [
    path("graphs/", views.list_graphs, name="graphs-list"),
    path("describe/", views.describe, name="graphs-describe"),
    path("describe4visualization/", views.describe4visualization, name="graphs-describe4visualization"),
    path("predicates/", views.predicates, name="graphs-predicates"),
    path("sparql/", views.sparql_proxy, name="graphs-sparql-proxy"),
]
