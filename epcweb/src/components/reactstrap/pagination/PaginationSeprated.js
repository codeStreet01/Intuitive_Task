import React from "react";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import classnames from "classnames";
import { Eye, Code, ChevronLeft, ChevronRight } from "react-feather";
import { paginationSeprated } from "./PaginationSourceCode";

class PaginationSeprated extends React.Component {
  state = {
    activeTab: "1",
  };

  toggleTab = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Card>
          <CardHeader>
            <CardTitle>Seprated Pagination</CardTitle>
            <div className="views">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "1",
                    })}
                    onClick={() => {
                      this.toggleTab("1");
                    }}
                  >
                    <Eye size={15} />
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "2",
                    })}
                    onClick={() => {
                      this.toggleTab("2");
                    }}
                  >
                    <Code size={15} />
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
          </CardHeader>
          <CardBody>
            <p>
              To create separated pagination use <code>.prev-item</code> class
              for the first item and <code>.next-item</code> for the last item.
            </p>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Pagination className="d-flex justify-content-center mt-3">
                  <PaginationItem href="#" className="prev-item">
                    <PaginationLink href="#" first>
                      <ChevronLeft />
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem active>
                    <PaginationLink href="#">4</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">5</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">6</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">7</PaginationLink>
                  </PaginationItem>
                  <PaginationItem href="#" className="next-item">
                    <PaginationLink href="#" last>
                      <ChevronRight />
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </TabPane>
              <TabPane className="component-code" tabId="2">
                {paginationSeprated}
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}
export default PaginationSeprated;
