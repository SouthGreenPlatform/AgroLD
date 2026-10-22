from django.urls import path

from . import views

urlpatterns = [
    path("by-keyword/", views.pathways_by_keyword, name="pathways-by-keyword"),
    path("participating-gene/", views.pathways_participating_gene, name="pathways-participating-gene"),
]
