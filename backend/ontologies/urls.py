from django.urls import path

from . import views

urlpatterns = [
    path("terms/by-keyword/", views.ontology_terms_by_keyword, name="ontologies-terms-by-keyword"),
    path("terms/ancestors/", views.ancestors_by_id, name="ontologies-terms-ancestors"),
    path("terms/parents/", views.parent_by_id, name="ontologies-terms-parents"),
    path("terms/descendants/", views.descendants_by_id, name="ontologies-terms-descendants"),
    path("terms/children/", views.children_by_id, name="ontologies-terms-children"),
    path("ids/by-term/", views.id_by_term, name="ontologies-ids-by-term"),
    path("terms/by-id/", views.term_by_id, name="ontologies-terms-by-id"),
    path("terms/associated-with-qtl/", views.terms_associated_with_qtl, name="ontologies-terms-associated-with-qtl"),
    path("terms/associated-with-protein/", views.terms_associated_with_protein, name="ontologies-terms-associated-with-protein"),
    path("terms/associated-with-gene/", views.terms_associated_with_gene, name="ontologies-terms-associated-with-gene"),
]
