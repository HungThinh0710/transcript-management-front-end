import { React, useState, useEffect, useRef } from 'react'
import { Link, Redirect } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
  CToast,
  CToaster,
  CToastBody,
  CToastHeader,
  CFormLabel
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cibGmail, cibMailRu, cilLockLocked, cilUser } from '@coreui/icons'
import * as API from '../../../api';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wallet, setWallet] = useState("");
  const [msgError, setMsgError] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, addToast] = useState(0)
  const toaster = useRef()

  let fileReader;

  const showToast = (title, msg, color) => {
    return (
      <CToast title="Error Toast">
        <CToastHeader close="true">
          <svg
            className="rounded me-2"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
            role="img"
          >
            <rect width="100%" height="100%" fill={color}></rect>
          </svg>
          <strong className="me-auto">{title}</strong>
          <small>Now</small>
        </CToastHeader>
        <CToastBody>{msg}</CToastBody>
      </CToast>
    )
  }

  const validateInfo = () => {
    return email.length > 0 && password.length > 0 && wallet.length > 0;
  }

  const handleFileRead = e => {
    setWallet(fileReader.result);
  };

  const onUploadCredentials = e => {
    let file = e.target.files;
    if(file.length > 0) {
      fileReader = new FileReader();
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(file[0]);
    }
  };


  const loginSubmited = async () => {
    setIsLoading(true);
    addToast(showToast('Logging', "Logging, Please wait...", "primary"))

    const isValid = validateInfo();
    console.log(isValid);
    if (isValid) {
      console.log("OK");
      console.log(wallet);
      axios.post(API.CLIENT_LOGIN, {
        email: email,
        password: password,
        wallet: wallet,
      }, { withCredentials: true })
        .then(async function (response) {
          setIsLoading(false);
          if (response.status == 200) {
            addToast(showToast('Successfully', "Login successfully, You will be move to dashboard now.", "green"))
            // setLocalLoginStatus(true);
            setIsLogged(true);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    else {
      setIsLoading(false);
      addToast(showToast("Login failed","Email or Password is required.", "red"))
    }
  }
  if (isLogged) return <Redirect to="/" />
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CToaster ref={toaster} push={toast} placement="top-end" />
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your organization</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cibMailRu} />
                      </CInputGroupText>
                      <CFormInput
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        placeholder="Email"
                        autoComplete="email" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        value={password}
                        onChange={(pwd) => { setPassword(pwd.target.value) }}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CInputGroup>
                      <div className="mb-3">
                        <CFormLabel htmlFor="formFileSm">Your Secret key</CFormLabel>
                        <CFormInput
                          accept=".key"
                          onChange={onUploadCredentials}
                          type="file"
                          size="sm"
                          id="formFileSm"
                          required={true} />
                      </div>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          onClick={() => { loginSubmited() }}
                          color="primary"
                          disabled={isLoading}
                          className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Transcript Management</h2>
                    <p>
                      An application help us manage transcript and diploma through Blockchain system.
                    </p>
                    <p>Copyright 2021 Phoenix - VKU</p>
                    {/* <Link to="/register">
                    <CButton color="primary" className="mt-3" active tabIndex={-1}>
                      Register Now!
                    </CButton>
                  </Link> */}
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>

  )
}

export default Login
