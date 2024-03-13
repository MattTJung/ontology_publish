"""Helper tool to generate a valid oops request xml file."""
import argparse

def generate_request_content(input_path):
    """
    A function to generate the content for a request using the input path and return the XML string.
    """
    with open(input_path, 'r', encoding='utf-8') as f:
        rdfcontent = f.read()

    xml_str = f"""<?xml version="1.0" encoding="UTF-8"?>\n
            <OOPSRequest>\n
            <OntologyURI></OntologyURI>\n
            <OntologyContent><![CDATA[{rdfcontent}]]></OntologyContent>\n
            <Pitfalls></Pitfalls>\n
            <OutputFormat>XML</OutputFormat>\n
            </OOPSRequest>
            """
    return xml_str

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '-i', '--input', type=str, default='combined.rdf', help='Input file path'
    )
    parser.add_argument(
        '-o', '--output', type=str, default='oops_request_content.xml', help='Output file path'
    )
    args = parser.parse_args()
    with open(args.output, 'w', encoding='utf-8') as fo:
        fo.write(generate_request_content(args.input))
