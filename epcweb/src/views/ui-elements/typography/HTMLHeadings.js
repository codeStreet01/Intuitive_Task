import React from "react";
import { Card, CardHeader, CardTitle, CardBody, Table } from "reactstrap";

class HTMLHeadings extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            HTML headings <small className="text-muted">Default</small>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <p>
            All HTML headings,
            <code>&lth1&gt</code>
            through
            <code>&lth6&gt</code>, are available. <code>.h1</code> through
            <code>.h6</code> classes are also available, for when you want to
            match the font styling of a heading.
          </p>
        </CardBody>
        <Table responsive borderless className="mb-0">
          <thead>
            <tr>
              <th>Preview</th>
              <th className="text-right">Font Size</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <h1>H1 Heading</h1>
              </td>
              <td className="type-info text-right">2rem</td>
            </tr>
            <tr>
              <td>
                <h2>H2 Heading</h2>
              </td>
              <td className="type-info text-right">1.74rem</td>
            </tr>
            <tr>
              <td>
                <h3>H3 Heading</h3>
              </td>
              <td className="type-info text-right">1.51rem</td>
            </tr>
            <tr>
              <td>
                <h4>H4 Heading</h4>
              </td>
              <td className="type-info text-right">1.32rem</td>
            </tr>
            <tr>
              <td>
                <h5>H5 Heading</h5>
              </td>
              <td className="type-info text-right">1.14rem</td>
            </tr>
            <tr>
              <td>
                <h6>H6 Heading</h6>
              </td>
              <td className="type-info text-right">1rem</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    );
  }
}
export default HTMLHeadings;
