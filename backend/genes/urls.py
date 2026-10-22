from django.urls import path

from . import views

urlpatterns = [
    path("", views.list_genes, name="genes-list"),
    path("by-keyword/", views.genes_by_keyword, name="genes-by-keyword"),
    path("encoding-protein/", views.genes_encoding_protein, name="genes-encoding-protein"),
    path("by-locus/", views.genes_by_locus, name="genes-by-locus"),
    path("participating-in-pathway/", views.genes_participating_in_pathway, name="genes-participating-in-pathway"),
    path("number-of-cds/", views.number_of_cds, name="genes-number-of-cds"),
    path("publications/", views.publications_by_gene_id, name="genes-publications"),
    path("see-also/", views.see_also, name="genes-see-also"),
]
