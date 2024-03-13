"""Helper tool to combine several ontology files into one."""
import argparse
from rdflib import Graph, OWL

def combine_graph(onto_file_paths):
    """
    Generate a combined RDF graph from a list of ontology file paths.

    :param onto_file_paths: List of file paths to ontology files.
    :return: A combined RDF graph.
    """
    graph_list = []
    namespace_list = []
    for onto_file_path in onto_file_paths:
        subg = Graph()
        subg.parse(onto_file_path)
        o_namespace = subg.query(
            "SELECT ?ont WHERE { ?ont rdf:type owl:Ontology . }"
        ).bindings[0]['ont']
        graph_list.append(subg)
        namespace_list.append(o_namespace)
    combinedg = Graph()
    for subg in graph_list:
        combinedg = combinedg + subg
    for o_namespace in namespace_list:
        combinedg.remove((None, OWL.imports, o_namespace))
    return combinedg

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '-o', '--out', type=str, default='combined.ttl', help='Output file path'
    )
    parser.add_argument(
        '--rdfout', type=str, default='combined.rdf', help='Output RDF file path'
    )
    parser.add_argument(
        'file', type=str, nargs='*', help='Ontology files to combine'
    )
    args = parser.parse_args()

    g = combine_graph(args.file)
    with open(args.out, 'w', encoding='utf-8') as f:
        f.write(g.serialize(format='turtle'))
    with open(args.rdfout, 'w', encoding='utf-8') as f:
        f.write(g.serialize(format='xml'))
