import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { CITY, DISTRICTS } from "../constants/constants";
import "../styles/material.css";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { sendNoti, signUp } from "../redux/actions/userAction";
import { AlertModal, IndicatorModal, MyModal } from "../components";
import socket from "../untils/socket";
import moment from "moment";
import { useHelmetMeta } from "../untils/useHelmet";
const SignUp = () => {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pass: "",
    confirmPass: "",
    address: "",
    phoneNumber: "",
    gender: "0",
  });
  const [test, setTest] = useState("");

  const history = useHistory();
  const _handleChange = (e) => {
    e.persist();
    console.log(e.target.name, e.target.value);
    setState({ ...state, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      // console.log('value ne', value, 'state ne', state);
      if (value !== state?.pass) {
        return false;
      }
      return true;
    });
    // return ValidatorForm.removeValidationRule('isPasswordMatch');
  });

  console.log("state pass", state);
  const _handleSubmit = async () => {
    try {
      MyModal.show(() => {}, <IndicatorModal title="SignUp..." />);
      const data = JSON.stringify({
        UserName: state.email,
        Email: state.email,
        Firstname: state.firstName,
        Lastname: state.lastName,
        Address: state.address,
        Phone: state.phoneNumber,
        Gender: state.gender * 1,
        Role: 1,
        Password: state.pass,
      });
      console.log(data);
      const res = await signUp(data);
      console.log("Signup thanh cong ne");
      const noti = {
        Type: 1,
        Email: `${state.firstName} ${state.lastName}`,
        Date: moment().format("YYYY-MM-DD HH:mm:SS"),
      };

      socket.emit("new-user");
      const res1 = await sendNoti(JSON.stringify(noti));
      console.log("send notie", res1);
      console.log("????ng k?? th??nh c??ng", res);

      MyModal.hide(() => {});

      MyModal.show(() => {},
      <AlertModal title="Ki???m tra email ????? x??c th???c t??i kho???n !" color="#458AFF" />);

      setTimeout(() => MyModal.hide(() => history.goBack()), 1000);
    } catch (err) {
      MyModal.hide(() => {});
      MyModal.show(() => {},
      <AlertModal title="T???o t??i kho???n th???t b???i !" color="#458AFF" />);
      setTimeout(() => MyModal.hide(() => history.goBack()), 1000);
      console.log("Create account error", err);
    }
  };
  return (
    <Container className="py-5 w-50">
      {useHelmetMeta("sign up page")}
      <Container className="w-75">
        <Row className="my-5" />
        <p>{test}</p>
        <Row classNam="bg-danger w-50 py-5 mt-5 pb-5 mb-5">
          <Col className="mt-5 z-depth3">
            <ValidatorForm
              className="w-100 h-100 p-5"
              onSubmit={() => _handleSubmit()}
            >
              <Row className="justify-content-center p-0 m-0">
                <h3 style={{ color: "#4F4F4F" }}>????ng k??</h3>
              </Row>

              <Row className="px-3  justify-content-between">
                <Col lg="6" md="6" className=" p-0 pr-1">
                  <TextValidator
                    label="H???"
                    name="firstName"
                    value={state.firstName}
                    variant="outlined"
                    className="w-100"
                    validators={[
                      "required",
                      "minStringLength: 4",
                      "maxStringLength: 20",
                    ]}
                    errorMessages={["kh??ng ???????c ph??p tr???ng"]}
                    onChange={_handleChange}
                  />
                </Col>
                <Col lg="6" md="6" className=" p-0 pl-1">
                  <TextValidator
                    label="T??n"
                    variant="outlined"
                    className="w-100"
                    name="lastName"
                    value={state.lastName}
                    validators={[
                      "required",
                      "minStringLength: 4",
                      "maxStringLength: 20",
                    ]}
                    errorMessages={["kh??ng ???????c ph??p tr???ng"]}
                    onChange={_handleChange}
                  />
                </Col>
              </Row>

              <TextValidator
                label="Email"
                className="w-100"
                variant="outlined"
                validators={["required", "isEmail"]}
                errorMessages={[
                  "kh??ng ???????c ph??p tr???ng",
                  "This is not an email",
                ]}
                name="email"
                value={state.email}
                onChange={_handleChange}
              />

              <TextValidator
                label="M???t kh???u"
                className="w-100"
                variant="outlined"
                type="password"
                validators={["required", "minStringLength: 6"]}
                errorMessages={[
                  "kh??ng ???????c ph??p tr???ng",
                  "m???t kh???u t???i thi???u 6 k?? t???",
                ]}
                name="pass"
                value={state.pass}
                onChange={_handleChange}
              />

              <TextValidator
                label="X??c nh???n m???t kh???u"
                className="w-100"
                variant="outlined"
                type="password"
                validators={["required", "isPasswordMatch"]}
                errorMessages={[
                  "kh??ng ???????c ph??p tr???ng",
                  "m???t kh???u kh??ng tr??ng",
                ]}
                name="confirmPass"
                value={state.confirmPass}
                onChange={_handleChange}
              />

              <TextValidator
                label="S??? ??i???n tho???i"
                className="w-100"
                variant="outlined"
                validators={[
                  "required",
                  "minStringLength: 10",
                  "maxStringLength: 10",
                ]}
                errorMessages={["kh??ng ???????c ph??p tr???ng", "kh??ng ph???i s??t"]}
                name="phoneNumber"
                value={state.phoneNumber}
                onChange={_handleChange}
              />
              <TextValidator
                label="?????a ch???"
                className="w-100"
                variant="outlined"
                validators={["required", "minStringLength: 16"]}
                errorMessages={[
                  "kh??ng ???????c ph??p tr???ng",
                  "?????a ch??? t???i thi???u 16 k?? t???",
                ]}
                name="address"
                value={state.address}
                onChange={_handleChange}
              />
              <FormLabel component="legend">Gi???i t??nh</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender"
                value={state.gender}
                onChange={_handleChange}
              >
                <FormControlLabel value="1" control={<Radio />} label="N???" />
                <FormControlLabel value="0" control={<Radio />} label="Nam" />
              </RadioGroup>

              {/* <Row className="mt-5">
								<MyDropdownPicker title="City" items={CITY} />
								<MyDropdownPicker
									items={DISTRICTS[0]}
									title="District"
								/>
							</Row> */}

              {/* <Row className="my-3">
								<Divider className="w-100" />
							</Row> */}

              <Row className="justify-content-around align-items-center">
                <Col lg="5" md="5">
                  <Button
                    type="submit"
                    className="button-container-box-shadow"
                    style={{
                      marginTop: 10,
                      color: "white",
                      backgroundColor: "#4285f4",
                      color: "white",
                      borderWidth: 0,
                      borderRadius: 25,
                      width: "100%",
                      height: 50,
                    }}
                  >
                    ????ng k??
                  </Button>
                </Col>
              </Row>
            </ValidatorForm>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};
const MyDropdownPicker = ({ items, title }) => {
  const [value, setValue] = useState(0);
  return (
    <Col
      md="6"
      className=" d-flex flex-column justify-content-center align-items-start p-0"
    >
      <InputLabel id="label">{title}</InputLabel>
      <FormControl variant="outlined" className="w-75">
        <Select labelId="label" id="select" value={value}>
          {items?.map((v, i) => (
            <MenuItem key={`${v}-${i}`} value={i} onClick={() => setValue(i)}>
              {v}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Col>
  );
};
export default SignUp;
