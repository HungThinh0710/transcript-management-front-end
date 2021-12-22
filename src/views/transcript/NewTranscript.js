import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CButton,
  CFormLabel,
  CFormInput,
  CCallout,
  CCollapse,
  CCardTitle,
  CCardSubtitle,
  CCardText,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider, CDropdown
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowThickToBottom, cilArrowThickFromBottom } from "@coreui/icons";
import { Table, Pagination, TagPicker, SelectPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { FetchAPI } from "../../api/FetchAPI";
import * as API from "../../api";

import FormTranscript from "../../components/Transcript/FormTranscript";

const NewTranscript = () => {
  const [visibleCallout, setVisibleCallout] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [idSubjectsSelected, setIdSubjectSelected] = useState([]);
  // const [formSubject, setFormSubject] = useState([]);
  const [childCardDatas, setChildCardDatas] = useState([]); // Data of transcript
  const [basicInformation, setBasicInformation] = useState({
    class_id: "",
    student_code: "",
    student_name: ""
  });

  const passSubjectToFormTranscript = (id) => {
    for (const [i, e] of subjects.entries())
      if (e.id === id) return e;
  };

  const removeChildCardElement = (id) => {
    for (let i = 0; i < childCardDatas.length; i++) {
      if (childCardDatas[i].id === id) childCardDatas.splice(i, 1);
    }
    return childCardDatas;
  }

  const removeAnIdSubjectSelected = (id) => {
    for (let i = 0; i < idSubjectsSelected.length; i++){
      if (idSubjectsSelected[i] === id) idSubjectsSelected.splice(i, 1);
    }
    return idSubjectsSelected;
  }

  const onChangeBasicInformation = (e) => {
    const value = e.target.value;
    setBasicInformation({
      ...basicInformation,
      [e.target.name]: value
    });
  };

  const onChangeSelectSubject = (value, event) => {
    if(event.type === "click" && event.currentTarget.getAttribute("class" === "rs-tag-icon-close rs-btn-close")){
      const idNeedToRemove = idSubjectsSelected.filter(x => value.indexOf(x) === -1);
      removeChildCardElement(...idNeedToRemove);
      const idSelectedArr = removeAnIdSubjectSelected(...idNeedToRemove);
      setIdSubjectSelected([...idSelectedArr])
    }
    else{
      setIdSubjectSelected(value);
    }
  };

  const handleClearAll = () => {
    setIdSubjectSelected([]);
    setChildCardDatas([]);
    setBasicInformation({
      class_id: "",
      student_code: "",
      student_name: ""
    });
  };

  const handleClearSubjects = () => {
    setIdSubjectSelected([]);
    setChildCardDatas([]);
  };

  const handleChildCardSave = (data) => {
    const childCardDatas = removeChildCardElement(data.id);
    const newData = [...childCardDatas, data];
    console.log(newData);
    setChildCardDatas(newData);
    toast.success(`Saved ${data.sbjName} subject.`);
  };

  const handleChildCardRemove = (data) => {
    removeChildCardElement(data.id);
    const idSubjectsSelected = removeAnIdSubjectSelected(data.id);
    setIdSubjectSelected([...idSubjectsSelected]);
    toast.success(`Removed ${data.sbjName} subject.`);
  };

  const handleSubmitToTranscript = () => {
    if (childCardDatas.length <= 0)
      return toast.warning("You must initialize transcript.");
    if (basicInformation.class_id.length <= 0
      || basicInformation.student_code.length <= 0
      || basicInformation.student_name.length <= 0)
      return toast.warning("You must fill basic information.");
    const data = {
      ...basicInformation,
      transcript: childCardDatas
    };
    fetchSubmitTranscript(data);
  };

  // Submit to blockchain
  const fetchSubmitTranscript = (data) => {
    toast.promise(
      FetchAPI("POST", API.CLIENT_SUBMIT_TRANSCRIPT, data),
      {
        pending: "Submitting to blockchain...",
        success: {
          render({ data }) {
            handleClearAll();
            return data.message;
          }
        },
        error: {
          render({ data }) {
            console.log("ERROR IN FETCH NEW PAYLOAD API");
            console.log(data);
            return data.data.message;
          }
        }
      }
    );
  };

  // Subjects
  const fetchSubjectsAPI = () => {
    FetchAPI("GET", API.CLIENT_SUBJECT_MANAGEMENT, {}, 1, 1000)
      .then(payload => {
        setSubjects(payload.subjects.data);
      })
      .catch(error => {
        console.log("ỐI GIỜI ƠIII");
        console.log(error);
        toast.error("Subject API: " + error.data.message);
      });
  };

  // Classes
  const fetchClassesAPI = () => {
    FetchAPI("GET", API.CLIENT_GET_CLASSES, {}, 1, 1000)
      .then(payload => {
        setClassrooms(payload.classes.data);
      })
      .catch(error => {
        toast.error("Classes API: " + error.data.message);
      });
  };

  useEffect(() => {
    // fetchTableAPI(page, perpage);
    fetchClassesAPI();
    fetchSubjectsAPI();
  }, []);

  return (
    <CRow>
      <CCol xs={3}>
        <CCard className="mb-4">
          <CCardHeader>Basic</CCardHeader>
          <CCardBody>
            <div className="p-2" style={{ width: "100%" }}>
              <CFormLabel>Student ID</CFormLabel>
              <CFormInput
                value={basicInformation.student_code}
                onChange={onChangeBasicInformation}
                type="text"
                size="sm"
                name="student_code"
                placeholder="Student ID" />
            </div>
            <div className="p-2" style={{ width: "100%" }}>
              <CFormLabel>Student Name</CFormLabel>
              <CFormInput
                value={basicInformation.student_name}
                onChange={onChangeBasicInformation}
                type="text"
                size="sm"
                name="student_name"
                placeholder="Student Name" />
            </div>
            <div className="p-2">
              <CFormLabel>Class</CFormLabel>
              <SelectPicker
                value={basicInformation.class_id}
                block
                style={{ width: "100%" }}
                menuStyle={{ width: 300 }}
                data={classrooms}
                labelKey="class_name"
                valueKey="id"
                name="class_id"
                placeholder="Select class"
                onChange={(e) => {
                  setBasicInformation({ ...basicInformation, class_id: e });
                }}
              />
            </div>
            <div className="p-3 d-flex flex-row">
              <CButton
                onClick={handleSubmitToTranscript}
                variant="outline"
                color="success">Submit to blockchain</CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={9}>
        <CCard className="mb-4">
          <CCardHeader>Transcript</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12}>
                <div>
                  <TagPicker
                    block
                    data={subjects}
                    labelKey="subject_name"
                    valueKey="id"
                    placeholder="Select subject"
                    value={idSubjectsSelected}
                    onChange={onChangeSelectSubject}
                    onClean={()=>{
                      console.log("CLEANED");
                      setIdSubjectSelected([])
                    }}
                    style={{ width: "100%", marginRight: "5px" }}
                  />
                </div>
                <div className="d-flex flex-row pt-3">
                  <CButton
                    variant="outline"
                    style={{ marginRight: "5px" }}
                    onClick={handleClearSubjects}
                    color="danger"
                  >Clear</CButton>
                  <CDropdown variant="btn-group">
                    <CDropdownToggle
                      variant="outline"
                      color="primary">
                      Other
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setVisibleCallout(!visibleCallout);
                        }}
                      >Preview</CDropdownItem>
                      <CDropdownItem href="#">Something else here</CDropdownItem>
                      <CDropdownDivider />
                      <CDropdownItem href="#">Separated link</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </div>
              </CCol>
              <CCol xs={12}>
                <CCollapse visible={visibleCallout}>
                  <CCallout color="info">

                  </CCallout>
                </CCollapse>
              </CCol>

            </CRow>
            <CRow>
              {idSubjectsSelected.map((e) => (
                <FormTranscript
                  key={e}
                  id={e}
                  subject={passSubjectToFormTranscript(e)}
                  handleChildCardSave={handleChildCardSave}
                  handleChildCardRemove={handleChildCardRemove} />
              ))}
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default NewTranscript;
