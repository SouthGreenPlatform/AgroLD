from django.urls import path

from . import views

urlpatterns = [
    path("", views.list_proteins, name="proteins-list"),
    path("by-keyword/", views.proteins_by_keyword, name="proteins-by-keyword"),
    path("associated-with-onto-id/", views.proteins_associated_with_onto_id, name="proteins-associated-with-onto-id"),
    path("associated-with-qtl/", views.proteins_associated_with_qtl, name="proteins-associated-with-qtl"),
    path("encoded-by-gene/", views.proteins_encoded_by_gene, name="proteins-encoded-by-gene"),
    path("publications/", views.publications_by_protein_id, name="proteins-publications"),
]
