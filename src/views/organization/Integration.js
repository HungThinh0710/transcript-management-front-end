import React, { useEffect, useRef, useState } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CBadge,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroupText,
  CButton,
  CInputGroup, CCallout
} from "@coreui/react";
import { Table, Pagination, SelectPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import axios from "axios";
import * as API from "../../api";
import { Link, Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { FetchAPI } from "../../api/FetchAPI";

const Integration = () => {

  useEffect(() => {
    window.open("https://docs.hungthinhit.com", "_blank");
  }, []);

  return (
    <>
      <div className="text-center"><a target={"_blank"} href="https://docs.hungthinhit.com">API Documentations</a></div>
    </>
  );
};

export default Integration;
