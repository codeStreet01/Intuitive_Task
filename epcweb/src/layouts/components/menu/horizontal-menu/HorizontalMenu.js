import React from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as Icon from "react-feather";
import classnames from "classnames";
import { ChevronDown, ChevronRight } from "react-feather";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { history } from "../../../../history";
import navigationConfig from "../../../../configs/horizontalMenuConfig";
//import NavbarUser from "../../navbar/NavbarUser"

class HorizontalSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeParents: [],
      openDropdown: [],
      dropdownHeight: "auto",
      itemHover: null,
      parentHover: null,
      activeChildUrl: null,
    };
    this.activeFlag = false;
    this.parentItems = [];
    this.activeParentItems = [];

    this.redirectUnauthorized = () => {
      history.push("misc/not-authorized");
    };
  }

  openDropdown = (id) => {
    let arr = this.state.openDropdown;
    if (!arr.includes(id)) arr.push(id);
    return this.setState({
      openDropdown: arr,
    });
  };

  closeDropdown = (id) => {
    let arr = this.state.openDropdown;
    arr.splice(arr.indexOf(id), 1);
    return this.setState({
      openDropdown: arr,
    });
  };

  handleItemHover = (id) => {
    this.setState({
      itemHover: id,
    });
  };

  handleParentHover = (id) => {
    this.setState({
      parentHover: id,
    });
  };

  componentDidMount() {
    this.handleActiveParent(this.activeParentItems);
  }

  componentDidUpdate(prevProps) {
    if (this.props.activePath !== prevProps.activePath) {
      this.setState({ openDropdown: [], parentHover: null });
      this.handleActiveParent(this.activeParentItems);
    }
  }

  updateParentItems = (id, mainParent = false) => {
    if (mainParent === true) {
      this.parentItems = [];
    }
    if (!this.parentItems.includes(id)) {
      this.parentItems.push(id);
    }
    if (this.activeFlag === true) {
      this.activeParentItems = this.parentItems;
      this.parentItems = [];
      this.activeFlag = false;
    }
  };

  handleActiveParent = (arr) => {
    this.setState({
      activeParents: arr,
    });
    this.activeFlag = false;
  };

  renderSubMenu = (submenu, id) => {
    return (
      <DropdownMenu
        tag="ul"
        className="mt-50"
        onMouseEnter={(e) => e.preventDefault()}
        modifiers={{
          setMaxHeight: {
            enabled: true,
            fn: (data) => {
              let pageHeight = window.innerHeight,
                ddTop = data.instance.reference.getBoundingClientRect().top,
                ddHeight = data.popper.height,
                maxHeight,
                stylesObj;

              if (pageHeight - ddTop - ddHeight - 28 < 1) {
                maxHeight = pageHeight - ddTop - 25;
                stylesObj = {
                  maxHeight: maxHeight,
                  overflowY: "auto",
                };
              }

              return {
                ...data,

                styles: {
                  ...stylesObj,
                },
              };
            },
          },
        }}
      >
        {submenu.map((child) => {
          const CustomAnchorTag = child.type === "external-link" ? `a` : Link;
          if (child.navLink && child.navLink === this.props.activePath) {
            this.activeFlag = true;
            this.updateParentItems(id);
          }

          let renderChildItems = (
            <React.Fragment key={child.id}>
              <li
                className={classnames({
                  active: this.state.activeParents.includes(child.id),
                })}
              >
                <DropdownItem
                  className={classnames("w-100", {
                    hover: this.state.itemHover === child.id,
                    "has-sub": child.children,
                    active:
                      (child.parentOf &&
                        child.parentOf.includes(this.props.activePath)) ||
                      (child.navLink &&
                        child.navLink === this.props.activePath),
                    "has-active-child": this.state.openDropdown.includes(
                      child.id
                    ),
                    disabled: child.disabled,
                  })}
                  tag={child.navLink ? CustomAnchorTag : "div"}
                  to={
                    child.filterBase
                      ? child.filterBase
                      : child.navLink && child.type === "item"
                      ? child.navLink
                      : "#"
                  }
                  href={
                    child.type === "external-link" ? child.navLink : undefined
                  }
                  target={child.newTab ? "_blank" : undefined}
                  onMouseEnter={() => this.handleItemHover(child.id)}
                  onMouseLeave={() => this.handleItemHover(null)}
                >
                  {child.children ? (
                    <Dropdown
                      className={classnames("sub-menu w-100", {})}
                      isOpen={this.state.openDropdown.includes(child.id)}
                      direction={this.state.openLeft ? "left" : "right"}
                      toggle={() => true}
                      onMouseEnter={() => this.openDropdown(child.id)}
                      onMouseLeave={() => this.closeDropdown(child.id)}
                    >
                      <DropdownToggle
                        className="d-flex justify-content-between align-items-center item-content"
                        tag={"div"}
                        onClick={() => this.closeDropdown(child.id)}
                      >
                        <div className="dropdown-toggle-sub text-truncate">
                          {/* <span className="menu-icon align-bottom mr-1">
                            {child.icon}
                          </span> */}
                          <FormattedMessage
                            className="menu-title align-middle text-white"
                            id={child.title}
                          />
                        </div>
                        <ChevronRight
                          className="has-sub-arrow align-middle ml-50"
                          size={15}
                        />
                      </DropdownToggle>
                      {child.children
                        ? this.renderSubMenu(child.children, child.id)
                        : null}
                    </Dropdown>
                  ) : (
                    <div className="item-content">
                      {/* <span className="menu-icon align-top mr-1">
                        {child.icon}
                      </span> */}
                      <span className="menu-title align-middle">
                        <FormattedMessage id={child.title} />
                      </span>
                    </div>
                  )}
                </DropdownItem>
              </li>
            </React.Fragment>
          );

          if (
            child.type === "external-link" ||
            (child.type === "item" &&
              child.permissions &&
              child.permissions.includes(this.props.currentUser)) ||
            child.type === "dropdown" ||
            child.permissions === undefined
          ) {
            return renderChildItems;
          } else if (
            child.navLink === this.props.activePath &&
            !child.permissions.includes(this.props.currentUser)
          ) {
            //VD COMMENTED
            return null; //this.redirectUnauthorized()
          } else {
            return null;
          }
        })}
      </DropdownMenu>
    );
  };

  renderDropdown = (arr) => {
    arr = [];
    if (localStorage.getItem("userRole")) {
      let navigationItems = JSON.parse(localStorage.getItem("userRole"));
      navigationItems.forEach((data, index) => {
        if (data.SubMenus && data.SubMenus) {
          arr.push({
            id: index,
            title: data.SubMenus[0].GroupCode,
            type: "collapse",
            icon: <Icon.Database size={20} className="text-light" />,
            children: [],
          });
          data.SubMenus.forEach((subData) => {
            // let index = arr.findIndex((x) => x.title === subData.GroupCode);
            let link = "/" + subData.FunName.replace(" ", "");
            if (subData.FunName.toLowerCase().indexOf("city") !== -1) {
              link = "/data-list/city-view";
            }
            if (subData.FunName.toLowerCase().indexOf("state") !== -1) {
              link = "/data-list/state-view";
            }
            if (subData.FunName.toLowerCase().indexOf("country") !== -1) {
              link = "/data-list/country-view";
            }
            if (subData.FunName.toLowerCase().indexOf("role") !== -1) {
              link = "/data-list/role-view";
            }
            if (subData.FunName.toLowerCase().indexOf("supplier") !== -1) {
              link = "/data-list/supplier-view";
            }
            if (subData.FunName.toLowerCase().indexOf("card") !== -1) {
              link = "/data-list/card-view";
            }
            if (subData.FunName.toLowerCase().indexOf("district") !== -1) {
              link = "/data-list/district-view";
            }
            if (subData.FunName.toLowerCase().indexOf("item") !== -1) {
              link = "/data-list/item-view";
            }
            if (subData.FunName.toLowerCase().indexOf("location") !== -1) {
              link = "/data-list/location-view";
            }
            if (subData.FunName.toLowerCase().indexOf("project") !== -1) {
              link = "/data-list/project-view";
            }
            if (subData.FunName.toLowerCase().indexOf("vehicle") !== -1) {
              link = "/data-list/vehicle-view";
            }
            if (subData.FunName.toLowerCase().indexOf("employee") !== -1) {
              link = "/data-list/employee-view";
            }
            if (subData.FunName.toLowerCase().indexOf("room") !== -1) {
              link = "/data-list/room-view";
            }
            if (subData.FunName.toLowerCase().indexOf("designation") !== -1) {
              link = "/data-list/designation-view";
            }
            if (subData.FunName.toLowerCase().indexOf("user") !== -1) {
              link = "/data-list/user-view";
            }
            arr[index].children.push({
              id: subData.FuncIDNumber,
              title: subData.FunName,
              type: "item",
              navLink: link,
              icon: <Icon.List size={20} />,
            });
          });
        }
      });
    }

    return arr.map((item) => {
      if (
        item.type === "item" &&
        item.navLink &&
        item.navLink === this.props.activePath
      ) {
        this.activeFlag = true;
        this.updateParentItems(item.id, true);
      }
      const CustomAnchorTag = item.type === "external-link" ? `a` : Link;
      return (
        <li
          className={classnames("nav-item", {
            active: this.state.activeParents.includes(item.id),
            hover: this.state.parentHover === item.id,
          })}
          key={item.id}
          ref={(el) => (this.menuDrodpown = el)}
        >
          <div
            className={classnames("nav-item-wrapper cursor-pointer", {
              "single-item": item.type === "item",
            })}
            onMouseEnter={() => {
              this.openDropdown(item.id);
              this.handleParentHover(item.id);
            }}
            onMouseLeave={() => {
              this.closeDropdown(item.id);
              this.handleParentHover(null);
            }}
          >
            {item.children ? (
              <Dropdown
                isOpen={this.state.openDropdown.includes(item.id)}
                className="nav-link"
                toggle={() => this.openDropdown(item.id)}
              >
                <DropdownToggle className="d-flex align-items-center" tag="div">
                  <div className="dropdown-text">
                    {/* <span className="menu-icon align-middle mr-75">
                      {item.icon}
                    </span> */}
                    <span className="menu-title align-middle">
                      <FormattedMessage
                        className="menu-title align-middle"
                        id={item.title}
                        defaultMessage={item.title}
                      />
                    </span>
                  </div>
                  <ChevronDown className="ml-50 align-bottom" size={15} />
                </DropdownToggle>

                {this.updateParentItems(item.id, true)}
                {item.children
                  ? this.renderSubMenu(item.children, item.id)
                  : null}
              </Dropdown>
            ) : (
              <CustomAnchorTag
                className={classnames({
                  "nav-link": item.type === "item",
                  hover: this.state.parentHover === item.id,
                })}
                to={
                  item.filterBase
                    ? item.filterBase
                    : item.navLink && item.type === "item"
                    ? item.navLink
                    : "#"
                }
                href={item.type === "external-link" ? item.navLink : undefined}
                target={item.newTab ? "_blank" : undefined}
              >
                {/* <span className="menu-icon align-middle mr-75">
                  {item.icon}
                </span> */}
                <span className="menu-title align-middle">
                  <FormattedMessage
                    className="menu-title align-middle"
                    id={item.title}
                  />
                </span>
              </CustomAnchorTag>
            )}
          </div>
        </li>
      );
    });
  };

  render() {
    return (
      <div className="horizontal-menu-wrapper">
        <div
          className={classnames(
            "header-navbar navbar-expand-sm navbar navbar-horizontal navbar-shadow",
            {
              "navbar-static": this.props.navbarType === "static",
              "fixed-top": this.props.navbarType === "sticky",
              "floating-nav":
                this.props.navbarType === "floating" ||
                !["static", "sticky", "floating"].includes(
                  this.props.navbarType
                ),
            }
          )}
        >
          <div className="navbar-container main-menu-content">
            <ul className="nav navbar-nav" id="main-menu-navigation">
              {this.renderDropdown(navigationConfig)}
            </ul>
            {/* <NavbarUser
                handleAppOverlay={this.handleAppOverlay}
                changeCurrentLang={this.state.currentLang}
                userName={"vandan"}
                userImg={
                  null
                }
                loggedInWith={
                  null
                }
                logoutWithJWT={null}
                logoutWithFirebase={null}
              /> */}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.login.userRole,
  };
};
export default connect(mapStateToProps)(HorizontalSidebar);

// import React from "react";
// import {
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
// } from "reactstrap";
// import classnames from "classnames";
// import { ChevronDown, ChevronRight } from "react-feather";
// import { Link } from "react-router-dom";
// import { connect } from "react-redux";
// import { FormattedMessage } from "react-intl";
// import { history } from "../../../../history";
// import navigationConfig from "../../../../configs/horizontalMenuConfig";
// class HorizontalSidebar extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       activeParents: [],
//       openDropdown: [],
//       dropdownHeight: "auto",
//       itemHover: null,
//       parentHover: null,
//       activeChildUrl: null,
//     };
//     this.activeFlag = false;
//     this.parentItems = [];
//     this.activeParentItems = [];

//     this.redirectUnauthorized = () => {
//       history.push("misc/not-authorized");
//     };
//   }

//   openDropdown = (id) => {
//     let arr = this.state.openDropdown;
//     if (!arr.includes(id)) arr.push(id);
//     return this.setState({
//       openDropdown: arr,
//     });
//   };

//   closeDropdown = (id) => {
//     let arr = this.state.openDropdown;
//     arr.splice(arr.indexOf(id), 1);
//     return this.setState({
//       openDropdown: arr,
//     });
//   };

//   handleItemHover = (id) => {
//     this.setState({
//       itemHover: id,
//     });
//   };

//   handleParentHover = (id) => {
//     this.setState({
//       parentHover: id,
//     });
//   };

//   componentDidMount() {
//     this.handleActiveParent(this.activeParentItems);
//   }

//   componentDidUpdate(prevProps) {
//     if (this.props.activePath !== prevProps.activePath) {
//       this.setState({ openDropdown: [], parentHover: null });
//       this.handleActiveParent(this.activeParentItems);
//     }
//   }

//   updateParentItems = (id, mainParent = false) => {
//     if (mainParent === true) {
//       this.parentItems = [];
//     }
//     if (!this.parentItems.includes(id)) {
//       this.parentItems.push(id);
//     }
//     if (this.activeFlag === true) {
//       this.activeParentItems = this.parentItems;
//       this.parentItems = [];
//       this.activeFlag = false;
//     }
//   };

//   handleActiveParent = (arr) => {
//     this.setState({
//       activeParents: arr,
//     });
//     this.activeFlag = false;
//   };

//   renderSubMenu = (submenu, id) => {
//     return (
//       <DropdownMenu
//         tag="ul"
//         className="mt-50"
//         onMouseEnter={(e) => e.preventDefault()}
//         modifiers={{
//           setMaxHeight: {
//             enabled: true,
//             fn: (data) => {
//               let pageHeight = window.innerHeight,
//                 ddTop = data.instance.reference.getBoundingClientRect().top,
//                 ddHeight = data.popper.height,
//                 maxHeight,
//                 stylesObj;

//               if (pageHeight - ddTop - ddHeight - 28 < 1) {
//                 maxHeight = pageHeight - ddTop - 25;
//                 stylesObj = {
//                   maxHeight: maxHeight,
//                   overflowY: "auto",
//                 };
//               }

//               return {
//                 ...data,

//                 styles: {
//                   ...stylesObj,
//                 },
//               };
//             },
//           },
//         }}
//       >
//         {submenu.map((child) => {
//           const CustomAnchorTag = child.type === "external-link" ? `a` : Link;
//           if (child.navLink && child.navLink === this.props.activePath) {
//             this.activeFlag = true;
//             this.updateParentItems(id);
//           }

//           let renderChildItems = (
//             <React.Fragment key={child.id}>
//               <li
//                 className={classnames({
//                   active: this.state.activeParents.includes(child.id),
//                 })}
//               >
//                 <DropdownItem
//                   className={classnames("w-100", {
//                     hover: this.state.itemHover === child.id,
//                     "has-sub": child.children,
//                     active:
//                       (child.parentOf &&
//                         child.parentOf.includes(this.props.activePath)) ||
//                       (child.navLink &&
//                         child.navLink === this.props.activePath),
//                     "has-active-child": this.state.openDropdown.includes(
//                       child.id
//                     ),
//                     disabled: child.disabled,
//                   })}
//                   tag={child.navLink ? CustomAnchorTag : "div"}
//                   to={
//                     child.filterBase
//                       ? child.filterBase
//                       : child.navLink && child.type === "item"
//                       ? child.navLink
//                       : "#"
//                   }
//                   href={
//                     child.type === "external-link" ? child.navLink : undefined
//                   }
//                   target={child.newTab ? "_blank" : undefined}
//                   onMouseEnter={() => this.handleItemHover(child.id)}
//                   onMouseLeave={() => this.handleItemHover(null)}
//                 >
//                   {child.children ? (
//                     <Dropdown
//                       className={classnames("sub-menu w-100", {})}
//                       isOpen={this.state.openDropdown.includes(child.id)}
//                       direction={this.state.openLeft ? "left" : "right"}
//                       toggle={() => true}
//                       onMouseEnter={() => this.openDropdown(child.id)}
//                       onMouseLeave={() => this.closeDropdown(child.id)}
//                     >
//                       <DropdownToggle
//                         className="d-flex justify-content-between align-items-center item-content"
//                         tag={"div"}
//                         onClick={() => this.closeDropdown(child.id)}
//                       >
//                         <div className="dropdown-toggle-sub text-truncate">
//                           <span className="menu-icon align-bottom mr-1">
//                             {child.icon}
//                           </span>
//                           <FormattedMessage
//                             className="menu-title align-middle"
//                             id={child.title}
//                           />
//                         </div>
//                         <ChevronRight
//                           className="has-sub-arrow align-middle ml-50"
//                           size={15}
//                         />
//                       </DropdownToggle>
//                       {child.children
//                         ? this.renderSubMenu(child.children, child.id)
//                         : null}
//                     </Dropdown>
//                   ) : (
//                     <div className="item-content">
//                       <span className="menu-icon align-top mr-1">
//                         {child.icon}
//                       </span>
//                       <span className="menu-title align-middle">
//                         <FormattedMessage id={child.title} />
//                       </span>
//                     </div>
//                   )}
//                 </DropdownItem>
//               </li>
//             </React.Fragment>
//           );

//           if (
//             child.type === "external-link" ||
//             (child.type === "item" &&
//               child.permissions &&
//               child.permissions.includes(this.props.currentUser)) ||
//             child.type === "dropdown" ||
//             child.permissions === undefined
//           ) {
//             return renderChildItems;
//           } else if (
//             child.navLink === this.props.activePath &&
//             !child.permissions.includes(this.props.currentUser)
//           ) {
//             return this.redirectUnauthorized();
//           } else {
//             return null;
//           }
//         })}
//       </DropdownMenu>
//     );
//   };

//   renderDropdown = (arr) => {
//     return arr.map((item) => {
//       if (
//         item.type === "item" &&
//         item.navLink &&
//         item.navLink === this.props.activePath
//       ) {
//         this.activeFlag = true;
//         this.updateParentItems(item.id, true);
//       }
//       const CustomAnchorTag = item.type === "external-link" ? `a` : Link;
//       return (
//         <li
//           className={classnames("nav-item", {
//             active: this.state.activeParents.includes(item.id),
//             hover: this.state.parentHover === item.id,
//           })}
//           key={item.id}
//           ref={(el) => (this.menuDrodpown = el)}
//         >
//           <div
//             className={classnames("nav-item-wrapper cursor-pointer", {
//               "single-item": item.type === "item",
//             })}
//             onMouseEnter={() => {
//               this.openDropdown(item.id);
//               this.handleParentHover(item.id);
//             }}
//             onMouseLeave={() => {
//               this.closeDropdown(item.id);
//               this.handleParentHover(null);
//             }}
//           >
//             {item.children ? (
//               <Dropdown
//                 isOpen={this.state.openDropdown.includes(item.id)}
//                 className="nav-link"
//                 toggle={() => this.openDropdown(item.id)}
//               >
//                 <DropdownToggle className="d-flex align-items-center" tag="div">
//                   <div className="dropdown-text">
//                     <span className="menu-icon align-middle mr-75">
//                       {item.icon}
//                     </span>
//                     <span className="menu-title align-middle">
//                       <FormattedMessage
//                         className="menu-title align-middle"
//                         id={item.title}
//                       />
//                     </span>
//                   </div>
//                   <ChevronDown className="ml-50 align-bottom" size={15} />
//                 </DropdownToggle>

//                 {this.updateParentItems(item.id, true)}
//                 {item.children
//                   ? this.renderSubMenu(item.children, item.id)
//                   : null}
//               </Dropdown>
//             ) : (
//               <CustomAnchorTag
//                 className={classnames({
//                   "nav-link": item.type === "item",
//                   hover: this.state.parentHover === item.id,
//                 })}
//                 to={
//                   item.filterBase
//                     ? item.filterBase
//                     : item.navLink && item.type === "item"
//                     ? item.navLink
//                     : "#"
//                 }
//                 href={item.type === "external-link" ? item.navLink : undefined}
//                 target={item.newTab ? "_blank" : undefined}
//               >
//                 <span className="menu-icon align-middle mr-75">
//                   {item.icon}
//                 </span>
//                 <span className="menu-title align-middle">
//                   <FormattedMessage
//                     className="menu-title align-middle"
//                     id={item.title}
//                   />
//                 </span>
//               </CustomAnchorTag>
//             )}
//           </div>
//         </li>
//       );
//     });
//   };

//   render() {
//     return (
//       <div className="horizontal-menu-wrapper">
//         <div
//           className={classnames(
//             "header-navbar navbar-expand-sm navbar navbar-horizontal navbar-shadow",
//             {
//               "navbar-static": this.props.navbarType === "static",
//               "fixed-top": this.props.navbarType === "sticky",
//               "floating-nav":
//                 this.props.navbarType === "floating" ||
//                 !["static", "sticky", "floating"].includes(
//                   this.props.navbarType
//                 ),
//             }
//           )}
//         >
//           <div className="navbar-container main-menu-content">
//             <ul className="nav navbar-nav" id="main-menu-navigation">
//               {/* {this.renderDropdown(navigationConfig)} */}
//               {this.renderDropdown(
//                 JSON.parse(localStorage.getItem("userRole"))
//               )}
//             </ul>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
// const mapStateToProps = (state) => {
//   return {
//     currentUser: state.auth.login.userRole,
//   };
// };
// export default connect(mapStateToProps)(HorizontalSidebar);
