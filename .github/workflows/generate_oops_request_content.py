"""Helper tool to generate a valid oops request xml file."""
import xml.etree.ElementTree as ET
import argparse

def generate_request_content(input_path):
    """
    Generate the request content by reading the input file at the
    specified path and creating an XML data structure from the content. 

    Parameters:
    input_path (str): The path to the input file.

    Returns:
    xml.etree.ElementTree.ElementTree: The XML data structure representing the request content.
    """
    with open(input_path, 'r', encoding='utf-8') as f:
        rdfcontent = f.read()

    xmldata = ET.fromstring("""<?xml version="1.0" encoding="UTF-8"?>
        <OOPSRequest>
        <OntologyURI></OntologyURI>
        <OntologyContent><![CDATA[ 
         """ + rdfcontent + """
         ]]></OntologyContent>
        <Pitfalls></Pitfalls>
        <OutputFormat>XML</OutputFormat>
        </OOPSRequest>
    """)
    return xmldata

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '-i', '--input', type=str, default='combined.rdf', help='Input file path'
    )
    parser.add_argument(
        '-o', '--output', type=str, default='oops_request_content.xml', help='Output file path'
    )
    args = parser.parse_args()
    generate_request_content(args.input).write(args.output)
