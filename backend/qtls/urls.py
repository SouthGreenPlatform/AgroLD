from django.urls import path

from . import views

urlpatterns = [
    path("", views.list_qtls, name="qtls-list"),
    path("by-keyword/", views.qtls_by_keyword, name="qtls-by-keyword"),
    path("id-associated-with-onto-id/", views.qtl_ids_associated_with_onto_id, name="qtls-id-associated-with-onto-id"),
    path("associated-with-protein-id/", views.qtls_associated_with_protein_id, name="qtls-associated-with-protein-id"),
]
