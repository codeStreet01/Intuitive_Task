import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import moment from "moment";

import "../../style.css";
import { getStateData } from "../../../../redux/actions/Administration/state";
import { getDistrict } from "../../../../redux/actions/Administration/district";
import { getCity } from "../../../../redux/actions/Administration/city";
import {
  getUser,
  addUser,
  getUserMetaData,
} from "../../../../redux/actions/Administration/user";
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Col,
  InputGroup,
  InputGroupText,
  Button,
  Input,
  Label,
  CardTitle,
  CustomInput,
} from "reactstrap";
import "../../../../assets/scss/plugins/extensions/toastr.scss";

import { EyeOff, Eye } from "react-feather";
import "../../../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../../../assets/scss/pages/data-list.scss";
import { history } from "../../../../history";
import "flatpickr/dist/themes/material_green.css";
import ErrorText from "../../../ui-elements/text-utilities/ErrorText";

import Flatpickr from "react-flatpickr";

class UserNewView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: [],
      CountryID: "",
      successMsg: "",
      deleteAlert: false,
      CountryName: "",
      ItemCode: "",
      ItemName: "",
      GroupID: "",
      HSNCode: "",
      BaseunitID: "",
      ConvFactor: "",
      TransUnt: "",
      MinLevel: "",
      MaxLevel: "",
      ISBaseUpperUnit: false,
      ISTranUpperUnit: false,
      itemData: null,
      ItemGroupList: [],
      ItemUnitList: [],
      EmpCode: "",
      EmpName: "",
      MobileNo: "",
      gender: null,
      ResignDate: null,
      MaritalStatus: null,
      BankAcNo: "",
      BankName: "",
      BranchName: "",
      IFSCCode: "",
      EmpType: 0,
      editData: null,
      filteredcityList: [],
      filtereddistrictList: [],
      filteredstateList: [],
    };
  }

  componentDidMount() {
    var postData = {
      SearchText: "",
      PageNo: 1,
    };
    this.props.getUser(postData);
    this.props.getUserMetaData(postData);
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.designation.error && props.designation.error !== state.error) {
  //     toast.error(props.designation.error);
  //     return {
  //       error: props.designation.error,
  //     };
  //   }
  //   if (props.designation && props.designation.designationList) {
  //     let successMsg = "";
  //     if (
  //       Object.keys(props.designation.designationList).every(
  //         (p) => props.designation.designationList[p] !== state.response[p]
  //       )
  //     ) {
  //       if (
  //         props.designation.random !== state.random &&
  //         props.designation.successMsg
  //       ) {
  //         successMsg = props.designation.successMsg;
  //         toast.success(successMsg);
  //       }

  //       return {
  //         response:
  //           props.designation.designationList &&
  //           props.designation.designationList.length
  //             ? props.designation.designationList
  //             : [],
  //         successMsg: successMsg,
  //         random: props.designation.random,
  //       };
  //     }
  //   }

  //   // Return null if the state hasn't changed
  //   return null;
  // }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.user.error !== this.props.user.error &&
      this.props.user.error
    ) {
      toast.error(this.props.user.error);
    }
    if (
      prevProps.user.successMsg !== this.props.user.successMsg &&
      this.props.user.successMsg
    ) {
      toast.success(this.props.user.successMsg);
    }
    if (prevProps.user.userList !== this.props.user.userList) {
      this.setState({
        response:
          this.props.user.userList && this.props.user.userList.length
            ? this.props.user.userList
            : [],
        random: this.props.user.random,
      });
    }
    if (
      prevProps.user.ItemGroupList !== this.props.user.ItemGroupList &&
      this.props.user.ItemGroupList.ItemGroups
    ) {
      let ItemData = [];
      this.props.user.ItemGroupList.ItemGroups &&
        this.props.user.ItemGroupList.ItemGroups.forEach((item) => {
          ItemData.push({ value: item.IDNumber, label: item.GroupName });
        });
      let UnitData = [];
      this.props.user.ItemGroupList.Units &&
        this.props.user.ItemGroupList.Units.forEach((item) => {
          UnitData.push({ value: item.IDNumber, label: item.UnitName });
        });
      this.setState({
        ItemGroupList:
          this.props.user.ItemGroupList &&
          this.props.user.ItemGroupList.ItemGroups &&
          this.props.user.ItemGroupList.ItemGroups.length
            ? ItemData
            : [],
        ItemUnitList:
          this.props.user.ItemGroupList &&
          this.props.user.ItemGroupList.Units &&
          this.props.user.ItemGroupList.Units.length
            ? UnitData
            : [],
      });
    }

    if (
      prevProps.user.userMetaData.Countries !==
      this.props.user.userMetaData.Countries
    ) {
      let countryData = [];
      this.props.user.userMetaData.Countries.forEach((item) => {
        countryData.push({ value: item.IDNumber, label: item.CountryName });
      });
      this.setState({
        countryList:
          this.props.user.userMetaData.Countries &&
          this.props.user.userMetaData.Countries.length
            ? countryData
            : [],
      });
    }
    if (prevProps.state.stateList !== this.props.state.stateList) {
      let stateData = [];
      this.props.state.stateList.forEach((item) => {
        stateData.push({
          value: item.IDNumber,
          label: item.StateName,
          CountryID: item.CountryID,
        });
      });
      this.setState({
        stateList:
          this.props.state.stateList && this.props.state.stateList.length
            ? stateData
            : [],
      });
    }
    if (prevProps.district.districtList !== this.props.district.districtList) {
      let districtData = [];
      this.props.district.districtList.forEach((item) => {
        districtData.push({
          value: item.IDNumber,
          label: item.DistrictName,
          StateID: item.StateID,
        });
      });
      this.setState({
        districtList:
          this.props.district.districtList &&
          this.props.district.districtList.length
            ? districtData
            : [],
      });
    }
    if (prevProps.city.cityList !== this.props.city.cityList) {
      let cityData = [];
      this.props.city.cityList.forEach((item) => {
        cityData.push({
          value: item.IDNumber,
          label: item.CityName,
          DistrictID: item.DistrictID,
        });
      });
      this.setState({
        cityList:
          this.props.city.cityList && this.props.city.cityList.length
            ? cityData
            : [],
      });
    }
    if (
      prevProps.user.userMetaData.Genders !==
      this.props.user.userMetaData.Genders
    ) {
      let genderData = [];
      this.props.user.userMetaData.Genders.forEach((item) => {
        genderData.push({ value: item.IDNumber, label: item.Gender });
      });
      this.setState({
        genderList:
          this.props.user.userMetaData.Genders &&
          this.props.user.userMetaData.Genders.length
            ? genderData
            : [],
      });
    }
    if (
      prevProps.user.userMetaData.BloodGroups !==
      this.props.user.userMetaData.BloodGroups
    ) {
      let bloodGroupsData = [];
      this.props.user.userMetaData.BloodGroups.forEach((item) => {
        bloodGroupsData.push({ value: item.IDNumber, label: item.BloodGroup });
      });
      this.setState({
        bloodGroupsList:
          this.props.user.userMetaData.BloodGroups &&
          this.props.user.userMetaData.BloodGroups.length
            ? bloodGroupsData
            : [],
      });
    }
    if (
      prevProps.user.userMetaData.MaritalStatus !==
      this.props.user.userMetaData.MaritalStatus
    ) {
      let maritalStatusData = [];
      this.props.user.userMetaData.MaritalStatus.forEach((item) => {
        maritalStatusData.push({
          value: item.IDNumber,
          label: item.MaritalStatus,
        });
      });
      this.setState({
        maritalStatusList:
          this.props.user.userMetaData.MaritalStatus &&
          this.props.user.userMetaData.MaritalStatus.length
            ? maritalStatusData
            : [],
      });
    }
    if (
      prevProps.user.userMetaData.EmpTypes !==
      this.props.user.userMetaData.EmpTypes
    ) {
      let empTypesData = [];
      this.props.user.userMetaData.EmpTypes.forEach((item) => {
        empTypesData.push({ value: item.IDNumber, label: item.EmpType });
      });
      this.setState({
        empTypesList:
          this.props.user.userMetaData.EmpTypes &&
          this.props.user.userMetaData.EmpTypes.length
            ? empTypesData
            : [],
      });
    }
    if (
      prevProps.user.userMetaData.Roles !== this.props.user.userMetaData.Roles
    ) {
      let RolesData = [];
      this.props.user.userMetaData.Roles.forEach((item) => {
        RolesData.push({ value: item.IDNumber, label: item.GroupName });
      });
      this.setState({
        RolesList:
          this.props.user.userMetaData.Roles &&
          this.props.user.userMetaData.Roles.length
            ? RolesData
            : [],
      });
    }
    if (
      prevProps.user.userMetaData.Designations !==
      this.props.user.userMetaData.Designations
    ) {
      let designationData = [];
      this.props.user.userMetaData.Designations.forEach((item) => {
        designationData.push({
          value: item.IDNumber,
          label: item.Designation,
        });
      });
      this.setState({
        designationList:
          this.props.user.userMetaData.Designations &&
          this.props.user.userMetaData.Designations.length
            ? designationData
            : [],
      });
    }

    if (
      prevProps.user.userList !== this.props.user.userList &&
      history?.location?.state?.id
    ) {
      const id = history?.location?.state?.id;
      const filterData =
        this.props.user.userList &&
        this.props.user.userList.filter((data) => {
          return data.IDNumber === id;
        })?.[0];

      this.props.getStateData({ CountryID: filterData?.CountryID });
      this.props.getDistrict({ StateID: filterData?.StateID });
      this.props.getCity({ CityID: filterData?.cityID });
      this.setState({
        editData: filterData,
        EmpCode: filterData?.EmpCode,
        itemData: filterData?.itemData,
        EmpName: filterData?.EmpName,
        Address: filterData?.Address,
        city: filterData?.CityID,
        district: filterData?.DistrictID,
        state: filterData?.StateID,
        country: filterData?.CountryID,
        MobileNo: filterData?.MobileNo,
        gender: filterData?.GenderID,
        designation: filterData?.DesignationID,
        ResignDate: filterData?.ResignDate,
        bloodGroup: filterData?.BloodGroupID,
        maritalStatus: filterData?.MaritalStatus,
        BankAcNo: filterData?.BankAcNo,
        BranchName: filterData?.BranchName,
        IFSCCode: filterData?.IFSCCode,
        BankName: filterData?.BankName,
        EmpType: filterData?.EmpTypeID,
        role: filterData?.RoleID,
        startDate: filterData?.ContractStartDate,
        endDate: filterData?.ContractEndDate,
        UserID: filterData?.UserID,
        password: filterData?.Password,
      });
    }
  }

  onChange = (event, name) => {
    let pattern = /^[a-zA-Z ]*$/,
      moNo = /^[0-9]{0,10}$/;

    switch (name) {
      case "EmpName":
        if (pattern.test(event.target.value)) {
          this.setState({ [name]: event.target.value });
        }
        break;
      case "MobileNo":
        if (moNo.test(event.target.value)) {
          this.setState({ [name]: event.target.value });
        }
        break;
      case "BankName":
        if (pattern.test(event.target.value)) {
          this.setState({ [name]: event.target.value });
        }
        break;
      case "BranchName":
        if (pattern.test(event.target.value)) {
          this.setState({ [name]: event.target.value });
        }
        break;
      default:
        this.setState({ [name]: event.target.value });
        break;
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      btnFlg: true,
    });
    const {
      EmpCode,
      editData,
      EmpName,
      Address,
      city,
      district,
      state,
      country,
      MobileNo,
      gender,
      designation,
      ResignDate,
      bloodGroup,
      maritalStatus,
      BankAcNo,
      BranchName,
      IFSCCode,
      BankName,
      EmpType,
      role,
      password,
      startDate,
      endDate,
      UserID,
    } = this.state;
    if (
      EmpCode &&
      EmpName &&
      Address &&
      city &&
      state &&
      district &&
      country &&
      MobileNo &&
      gender &&
      designation &&
      maritalStatus &&
      role &&
      UserID &&
      (password || editData?.Password)
    ) {
      let postData = {
        IDNumber: editData?.IDNumber ? editData?.IDNumber : 0,
        EmpCode,
        EmpName,
        Address,
        CityID: city,
        DistrictID: district,
        StateID: state,
        CountryID: country,
        MobileNo,
        GenderID: gender,
        DesignationID: designation,
        ResignDate: typeof ResignDate == "object" ? ResignDate?.[0] : editData?.ResignDate,
        BloodGroupID: bloodGroup,
        MaritalStatus: maritalStatus,
        BankAcNo,
        BranchName,
        IFSCCode,
        BankName,
        EmpTypeID: EmpType,
        ContractStartDate:
          typeof startDate == "object"
            ? startDate?.[0]
            : editData?.startDate ?? null,
        ContractEndDate:
          typeof endDate == "object" ? endDate?.[0] : editData?.endDate ?? null,
        Password: password ?? editData?.Password,
        RoleID: role,
        UserID: UserID ?? null,
        CreatedDate: moment(),
        CreatedBy:
          localStorage.getItem("userData") &&
          JSON.parse(localStorage.getItem("userData")).IDNumber,
      };
      if (history?.location?.state?.id) {
        await this.props.addUser({
          ...editData,
          ...postData,
        });
      } else {
        await this.props.addUser(postData);
        await this.resetState();
      }
      await history.push("/data-list/user-view");
    }
  };

  resetState = () => {
    this.setState({
      btnFlg: false,
      EmpCode: "",
      EmpName: "",
      Address: "",
      city: null,
      district: null,
      state: null,
      country: null,
      MobileNo: "",
      gender: null,
      designation: null,
      ResignDate: null,
      bloodGroup: null,
      MaritalStatus: null,
      BankAcNo: "",
      BranchName: "",
      IFSCCode: "",
      BankName: "",
      EmpType: null,
      role: null,
      password: "",
      startDate: null,
      endDate: null,
      UserID: "",
    });
  };

  render() {
    const { btnFlg } = this.state;

    return (
      <Card>
        <CardHeader>
          <CardTitle>User Master</CardTitle>
          <Button
            size="sm"
            color="primary"
            onClick={() => history.push("/data-list/user-view")}
          >
            <Eye size={20} className="text-white" />
          </Button>
        </CardHeader>
        <CardBody className="p-0">
          <Form className="pr-2 pl-2">
            <FormGroup row>
              <Col>
                <Label>Code</Label>
                <Input
                  size="sm"
                  type="text"
                  value={this.state.EmpCode}
                  onChange={(e) => this.onChange(e, "EmpCode")}
                  name="userCode"
                  id="userCode"
                  placeholder="Code"
                  className={
                    btnFlg && (!this.state.EmpCode || this.state.EmpCode === "")
                      ? "invalid-input"
                      : ""
                  }
                  autoComplete="off"
                />
                {btnFlg &&
                  (!this.state.EmpCode || this.state.EmpCode === "") && (
                    <ErrorText />
                  )}
              </Col>

              <Col>
                <Label>Name</Label>
                <Input
                  size="sm"
                  type="text"
                  value={this.state.EmpName}
                  onChange={(e) => this.onChange(e, "EmpName")}
                  name="Name"
                  id="Name"
                  placeholder="Name"
                  className={
                    btnFlg &&
                    (!this.state.EmpName || this.state.EmpName === "") &&
                    "invalid-input"
                  }
                  autoComplete="off"
                />
                {btnFlg &&
                  (!this.state.EmpName || this.state.EmpName === "") && (
                    <ErrorText />
                  )}
              </Col>

              <Col>
                <Label>Mobile Number</Label>
                <Input
                  size="sm"
                  type="number"
                  value={this.state.MobileNo}
                  onChange={(e) => this.onChange(e, "MobileNo")}
                  name="Mono"
                  id="Mono"
                  placeholder="Mobile No"
                  className={
                    btnFlg &&
                    (!this.state.MobileNo || this.state.MobileNo === "") &&
                    "invalid-input"
                  }
                  autoComplete="off"
                />
                {btnFlg &&
                  (!this.state.MobileNo || this.state.MobileNo === "") && (
                    <ErrorText />
                  )}
              </Col>

              <Col>
                <Label>Address</Label>
                <Input
                  size="sm"
                  type="text"
                  value={this.state.Address}
                  onChange={(e) => this.onChange(e, "Address")}
                  name="Address"
                  id="Address"
                  placeholder="Address"
                  className={
                    btnFlg &&
                    (!this.state.Address || this.state.Address === "") &&
                    "invalid-input"
                  }
                  autoComplete="off"
                />
                {btnFlg &&
                  (!this.state.Address || this.state.Address === "") && (
                    <ErrorText />
                  )}
              </Col>
            </FormGroup>
            <FormGroup row>
              {/* <Col
                  className={` ${
                    btnFlg && !this.state?.country?.value ? "invalid-input" : ""
                  }`}
                >
                  <Label>Country</Label>
                  <Select
                    className="React-Select"
                    classNamePrefix="select"
                    onChange={(e) =>
                      this.setState({
                        country: e,
                        filteredstateList: this.state.stateList.filter(
                          (data) => data.CountryID === e.value
                        ),
                      })
                    }
                    value={this.state.country}
                    name="country"
                    options={this.state.countryList}
                    placeholder="Country"
                  />
                  {btnFlg && !this.state?.country?.value && <ErrorText />}
                </Col>
                <Col
                  className={` ${
                    btnFlg && !this.state?.state?.value && "invalid-input"
                  }`}
                >
                  <Label>State</Label>
                  <Select
                    className="React-Select"
                    classNamePrefix="select"
                    onChange={(e) =>
                      this.setState({
                        state: e,
                        filtereddistrictList: this.state.districtList.filter(
                          (data) => data.StateID === e.value
                        ),
                      })
                    }
                    value={this.state.state}
                    name="state"
                    options={this.state.filteredstateList}
                    placeholder="State"
                  />
                  {btnFlg && !this.state?.state?.value && <ErrorText />}
                </Col>
                <Col
                  className={`${
                    btnFlg && !this.state?.district?.value && "invalid-input"
                  }`}
                >
                  <Label>District</Label>
                  <Select
                    className="React-Select"
                    classNamePrefix="select"
                    onChange={(e) =>
                      this.setState({
                        district: e,
                        filteredcityList: this.state.cityList.filter(
                          (data) => data.DistrictID === e.value
                        ),
                      })
                    }
                    value={this.state.district}
                    name="district"
                    options={this.state.filtereddistrictList}
                    placeholder="District"
                  />
                  {btnFlg && !this.state?.district?.value && <ErrorText />}
                </Col>

                <Col
                  className={` ${
                    btnFlg && !this.state?.city?.value && "invalid-input"
                  }`}
                >
                  <Label>City</Label>
                  <Select
                    className="React-Select"
                    classNamePrefix="select"
                    onChange={(e) => this.setState({ city: e })}
                    value={this.state.city}
                    name="city"
                    options={this.state.filteredcityList}
                    placeholder="City"
                  />
                  {btnFlg && !this.state?.city?.value && <ErrorText />}
                </Col> */}
              <Col>
                <Label>Country</Label>
                <CustomInput
                  bsSize="sm"
                  type="select"
                  id="countrySelect"
                  name="countrySelect"
                  value={this.state?.country}
                  className={`p-0 pl-1 ${
                    btnFlg && !this.state?.country ? "invalid-input" : ""
                  }`}
                  onChange={(e) => {
                    this.props.getStateData({
                      CountryID: parseInt(e.target.value),
                    });
                    this.setState({
                      country: parseInt(e.target.value),
                      stateList: [],
                      districtList: [],
                      cityList: [],
                      state: 0,
                      district: 0,
                      city: 0,
                    });
                  }}
                >
                  <option value="0">Country</option>
                  {this.state.countryList?.length > 0 &&
                    this.state.countryList.map((d, i) => (
                      <option value={d.value} key={d.value}>
                        {d.label}
                      </option>
                    ))}
                </CustomInput>
                {btnFlg && !this.state?.country && <ErrorText />}
              </Col>
              <Col>
                <Label>State</Label>
                <CustomInput
                  bsSize="sm"
                  type="select"
                  id="stateSelect"
                  name="stateSelect"
                  value={this.state?.state}
                  className={`p-0 pl-1 ${
                    btnFlg && !this.state?.state ? "invalid-input" : ""
                  }`}
                  onChange={(e) => {
                    this.props.getDistrict({
                      StateID: parseInt(e.target.value),
                    });
                    this.setState({
                      state: parseInt(e.target.value),
                      districtList: [],
                      cityList: [],
                      district: 0,
                      city: 0,
                    });
                  }}
                >
                  <option value="0">State</option>
                  {this.state.stateList &&
                    this.state.stateList?.length > 0 &&
                    this.state?.stateList.map((d, i) => {
                      return (
                        <option value={d.value} key={d.value}>
                          {d.label}
                        </option>
                      );
                    })}
                </CustomInput>
                {btnFlg && !this.state?.state && <ErrorText />}
              </Col>
              <Col>
                <Label>District</Label>
                <CustomInput
                  bsSize="sm"
                  type="select"
                  id="dsistrictSelect"
                  name="districtSelect"
                  value={this.state?.district}
                  className={`p-0 pl-1 ${
                    btnFlg && !this.state?.district ? "invalid-input" : ""
                  }`}
                  onChange={(e) => {
                    this.props.getCity({
                      DistrictID: parseInt(e.target.value),
                    });
                    this.setState({
                      district: parseInt(e.target.value),
                      cityList: [],
                      city: 0,
                    });
                  }}
                >
                  <option value="0">District</option>
                  {this.state.districtList &&
                    this.state.districtList?.length > 0 &&
                    this.state.districtList.map((d, i) => (
                      <option value={d.value} key={d.value}>
                        {d.label}
                      </option>
                    ))}
                </CustomInput>
                {btnFlg && !this.state?.district && <ErrorText />}
              </Col>
              <Col>
                <Label>City</Label>
                <CustomInput
                  bsSize="sm"
                  type="select"
                  id="citySelect"
                  name="citySelect"
                  value={this.state?.city}
                  className={`p-0 pl-1 ${
                    btnFlg && !this.state?.city ? "invalid-input" : ""
                  }`}
                  onChange={(e) => {
                    this.setState({
                      city: parseInt(e.target.value),
                    });
                  }}
                >
                  <option value="0">City</option>
                  {this.state.cityList &&
                    this.state.cityList?.length > 0 &&
                    this.state.cityList.map((d, i) => (
                      <option value={d.value} key={d.value}>
                        {d.label}
                      </option>
                    ))}
                </CustomInput>
                {btnFlg && !this.state?.city && <ErrorText />}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Label>Gender</Label>
                {/* <Select
                    className="React-Select"
                    classNamePrefix="select"
                    onChange={(e) => this.setState({ gender: e })}
                    value={this.state.gender}
                    name="gender"
                    options={this.state.genderList}
                    placeholder="Select Gender"
                  /> */}
                <CustomInput
                  bsSize="sm"
                  type="select"
                  id="genderSelect"
                  name="genderSelect"
                  value={this.state?.gender}
                  className={`p-0 pl-1 ${
                    btnFlg && !this.state?.gender ? "invalid-input" : ""
                  }`}
                  onChange={(e) => {
                    this.setState({
                      gender: parseInt(e.target.value),
                    });
                  }}
                >
                  <option value="0">Gender</option>
                  {this.state.genderList &&
                    this.state.genderList?.length > 0 &&
                    this.state.genderList.map((d, i) => (
                      <option value={d.value} key={d.value}>
                        {d.label}
                      </option>
                    ))}
                </CustomInput>
                {btnFlg && !this.state?.gender && <ErrorText />}
              </Col>
              <Col>
                <Label>Marital Status</Label>
                {/* <Select
                    className="React-Select"
                    classNamePrefix="select"
                    onChange={(e) => this.setState({ MaritalStatus: e })}
                    value={this.state.MaritalStatus}
                    name="maritalStatus"
                    options={this.state.maritalStatusList}
                    placeholder="Select Marital Status"
                  /> */}
                <CustomInput
                  bsSize="sm"
                  type="select"
                  id="maritalStatusSelect"
                  name="maritalStatusSelect"
                  value={this.state?.maritalStatus}
                  className={`p-0 pl-1 ${
                    btnFlg && !this.state?.maritalStatus ? "invalid-input" : ""
                  }`}
                  onChange={(e) => {
                    this.setState({
                      maritalStatus: parseInt(e.target.value),
                    });
                  }}
                >
                  <option value="0">Marital Status</option>
                  {this.state.maritalStatusList &&
                    this.state.maritalStatusList?.length > 0 &&
                    this.state.maritalStatusList.map((d, i) => (
                      <option value={d.value} key={d.value}>
                        {d.label}
                      </option>
                    ))}
                </CustomInput>
                {btnFlg && !this.state?.maritalStatus && <ErrorText />}
              </Col>

              <Col>
                <Label>Blood Group</Label>
                {/* <Select
                    className="React-Select"
                    classNamePrefix="select"
                    onChange={(e) => this.setState({ bloodGroup: e })}
                    value={this.state.bloodGroup}
                    name="bloodGroup"
                    options={this.state.bloodGroupsList}
                    placeholder="Select Blood Group"
                  /> */}
                <CustomInput
                  bsSize="sm"
                  type="select"
                  id="bloodGroupSelect"
                  name="bloodGroupSelect"
                  value={this.state?.bloodGroup}
                  className="p-0 pl-1"
                  onChange={(e) => {
                    this.setState({
                      bloodGroup: parseInt(e.target.value),
                    });
                  }}
                >
                  <option value="0">Blood Group</option>
                  {this.state.bloodGroupsList &&
                    this.state.bloodGroupsList?.length > 0 &&
                    this.state.bloodGroupsList.map((d, i) => (
                      <option value={d.value} key={d.value}>
                        {d.label}
                      </option>
                    ))}
                </CustomInput>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col>
                <Label>Bank Account No</Label>
                <Input
                  size="sm"
                  type="number"
                  value={this.state.BankAcNo}
                  onChange={(e) => this.onChange(e, "BankAcNo")}
                  name="bankAcNo"
                  id="bankAcNo"
                  placeholder="Bank Account No"
                  autoComplete="off"
                />
              </Col>

              <Col>
                <Label>Bank Name</Label>
                <Input
                  size="sm"
                  type="text"
                  value={this.state.BankName}
                  onChange={(e) => this.onChange(e, "BankName")}
                  name="bankName"
                  id="bankName"
                  placeholder="Bank Name"
                  autoComplete="off"
                />
              </Col>

              <Col>
                <Label>Branch Name</Label>
                <Input
                  size="sm"
                  type="text"
                  value={this.state.BranchName}
                  onChange={(e) => this.onChange(e, "BranchName")}
                  name="branchName"
                  id="branchName"
                  placeholder="Branch Name"
                  autoComplete="off"
                />
              </Col>
              <Col>
                <Label>IFSC Code</Label>
                <Input
                  size="sm"
                  type="text"
                  value={this.state.IFSCCode}
                  onChange={(e) => this.onChange(e, "IFSCCode")}
                  name="ifscCode"
                  id="ifscCode"
                  placeholder="IFSC Code"
                  autoComplete="off"
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col>
                <Label>Designation</Label>
                {/* <Select
                    className="React-Select"
                    classNamePrefix="select"
                    onChange={(e) => this.setState({ designation: e })}
                    value={this.state.designation}
                    name="designation"
                    options={this.state.designationList}
                    placeholder="Select Designation"
                  /> */}
                <CustomInput
                  bsSize="sm"
                  type="select"
                  id="designationSelect"
                  name="designationSelect"
                  value={this.state?.designation ? this.state?.designation : 0}
                  className={`p-0 pl-1 ${
                    btnFlg && !this.state?.designation ? "invalid-input" : ""
                  }`}
                  onChange={(e) => {
                    this.setState({
                      designation: parseInt(e.target.value),
                    });
                  }}
                >
                  <option value="0">Designation</option>
                  {this.state.designationList &&
                    this.state.designationList?.length > 0 &&
                    this.state.designationList.map((d, i) => (
                      <option value={d.value} key={d.value}>
                        {d.label}
                      </option>
                    ))}
                </CustomInput>
                {btnFlg && !this.state?.designation && <ErrorText />}
              </Col>
              <Col>
                <Label>Role</Label>
                {/* <Select
                    className="React-Select"
                    classNamePrefix="select"
                    onChange={(e) => this.setState({ role: e })}
                    value={this.state.role}
                    name="role"
                    options={this.state.RolesList}
                    placeholder="Select Role"
                  /> */}
                <CustomInput
                  bsSize="sm"
                  type="select"
                  id="roleSelect"
                  name="roleSelect"
                  value={this.state?.role ? this.state?.role : 0}
                  className={`p-0 pl-1 ${
                    btnFlg && !this.state?.role ? "invalid-input" : ""
                  }`}
                  onChange={(e) => {
                    this.setState({
                      role: parseInt(e.target.value),
                    });
                  }}
                >
                  <option value="0">Role</option>
                  {this.state.RolesList &&
                    this.state.RolesList?.length > 0 &&
                    this.state.RolesList.map((d, i) => (
                      <option value={d.value} key={d.value}>
                        {d.label}
                      </option>
                    ))}
                </CustomInput>
                {btnFlg && !this.state?.role && <ErrorText />}
              </Col>

              <Col>
                <Label>Username</Label>
                <Input
                  size="sm"
                  type="text"
                  value={this.state.UserID ? this.state.UserID : ""}
                  onChange={(e) => this.onChange(e, "UserID")}
                  name="userName"
                  id="userName"
                  placeholder="Username"
                  className={
                    btnFlg &&
                    (!this.state.UserID || this.state.UserID === "") &&
                    "invalid-input"
                  }
                  autoComplete="userName"
                />
                {btnFlg && (!this.state.UserID || this.state.UserID === "") && (
                  <ErrorText />
                )}
              </Col>

              <Col>
                <Label>Password</Label>
                <InputGroup size="sm">
                  <Input
                    type={this.state.passwordVisibility ? "text" : "password"}
                    value={this.state.password ? this.state.password : ""}
                    onChange={(e) => this.onChange(e, "password")}
                    name="password"
                    id="password"
                    autoComplete="new-password"
                    placeholder="Password"
                    className={
                      btnFlg &&
                      (!this.state.password || this.state.password === "")
                        ? "invalid-input"
                        : ""
                    }
                  />
                  <InputGroupText
                    style={{ padding: "0.4rem 0.4rem" }}
                    onClick={() =>
                      this.setState({
                        passwordVisibility: !this.state.passwordVisibility,
                      })
                    }
                  >
                    {this.state.passwordVisibility ? (
                      <EyeOff size={12} />
                    ) : (
                      <Eye size={12} />
                    )}
                  </InputGroupText>
                </InputGroup>
                {btnFlg &&
                  (!this.state.password || this.state.password === "") &&
                  !this.state.editData?.Password && <ErrorText />}
              </Col>
              <Col>
                <Label>ResignDate Date</Label>
                <Flatpickr
                  value={this.state.ResignDate ? this.state.ResignDate : ""}
                  onChange={(date) => {
                    this.setState({ ResignDate: date });
                  }}
                  placeholder="ResignDate Date"
                  className="form-control form-control-sm "
                />
              </Col>
            </FormGroup>
            {/*<FormGroup row>
                
                {this.state.EmpType?.label == "Contract" && (
                  <>
                    <div
                      className={`${
                        btnFlg && !this.state.startDate && "invalid-input"
                      }`}
                    >
                      <Col>
                        <Label>Start Date</Label>
                        <Flatpickr
                          value={this.state.startDate}
                          onChange={(date) => {
                            this.setState({ startDate: date });
                          }}
                          placeholder="Start Date"
                          className="form-control"
                        />
                        {btnFlg && !this.state.startDate && <ErrorText />}
                      </Col>
                    </div>
                    <div
                      className={`${
                        btnFlg && !this.state.endDate && "invalid-input"
                      }`}
                    >
                      <Col>
                        <Label>End Date</Label>
                        <Flatpickr
                          value={this.state.endDate}
                          onChange={(date) => {
                            this.setState({ endDate: date });
                          }}
                          placeholder="End Date"
                          className="form-control"
                        />
                        {btnFlg && !this.state.endDate && <ErrorText />}
                      </Col>
                    </div>
                  </>
                )}
                <div className="addCountry m-t-5">
                  <Col></Col>
                </div>
                        </FormGroup>*/}

            <FormGroup row>
              <Col sm="12">
                <Button.Ripple
                  size="sm"
                  color="primary"
                  type="submit"
                  className="mr-1 "
                  onClick={this.handleSubmit}
                >
                  Save
                </Button.Ripple>
                {!history?.location?.state?.id && (
                  <Button.Ripple
                    size="sm"
                    outline
                    color="warning"
                    type="reset"
                    onClick={this.resetState}
                  >
                    Reset
                  </Button.Ripple>
                )}
              </Col>
            </FormGroup>
          </Form>
          <ToastContainer />
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    state: state.state,
    district: state.district,
    city: state.city,
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  getStateData,
  getDistrict,
  getCity,
  getUser,
  addUser,
  getUserMetaData,
})(UserNewView);
