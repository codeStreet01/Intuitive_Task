import React from "react";
import {
  Button,
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
import { Eye, Code } from "react-feather";
import { squareButtons } from "./ButtonsSourceCode";

class SquareButtons extends React.Component {
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
            <CardTitle>Square</CardTitle>
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
              Use <code>.square</code> with attribute outline to create a square
              button.
            </p>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <div className="d-inline-block mr-1 mb-1">
                  <Button.Ripple className="square" color="primary" outline>
                    Primary
                  </Button.Ripple>
                </div>
                <div className="d-inline-block mr-1 mb-1">
                  <Button.Ripple className="square" color="success" outline>
                    Success
                  </Button.Ripple>
                </div>
                <div className="d-inline-block mr-1 mb-1">
                  <Button.Ripple className="square" color="info" outline>
                    Info
                  </Button.Ripple>
                </div>
                <div className="d-inline-block mr-1 mb-1">
                  <Button.Ripple className="square" color="warning" outline>
                    Warning
                  </Button.Ripple>
                </div>
                <div className="d-inline-block mr-1 mb-1">
                  <Button.Ripple className="square" color="danger" outline>
                    Danger
                  </Button.Ripple>
                </div>
                <div className="d-inline-block mr-1 mb-1">
                  <Button.Ripple className="square" color="light" outline>
                    Light
                  </Button.Ripple>
                </div>
                <div className="d-inline-block mr-1 mb-1">
                  <Button.Ripple className="square" color="dark" outline>
                    Dark
                  </Button.Ripple>
                </div>
              </TabPane>
              <TabPane className="component-code" tabId="2">
                {squareButtons}
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}
export default SquareButtons;
