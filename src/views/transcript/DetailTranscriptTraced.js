import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CButton,
  CFormLabel,
  CFormInput
} from "@coreui/react";
import { Table, Pagination, TagPicker, SelectPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { toast } from "react-toastify";
import { FetchAPI } from "../../api/FetchAPI";
import * as API from "../../api";
import { useLocation, useHistory } from "react-router-dom";

import FormTranscript from "../../components/Transcript/FormTranscript";

const DetailTranscriptTraced = () => {
  const [subjects, setSubjects] = useState([]);
  const [idSubjectsSelected, setIdSubjectSelected] = useState([]);
  const [childCardDatas, setChildCardDatas] = useState([]); // Data of transcript
  const [basicInformation, setBasicInformation] = useState({
    class: "",
    student_code: "",
    student_name: ""
  });
  const location = useLocation();
  const [transcript, setTranscript] = useState([]);
  const history = useHistory();

  const passSubjectToFormTranscript = (id) => {
    for (const [i, e] of subjects.entries())
      if (e.id === id) return e;
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

  useEffect(() => {
    // fetchTableAPI(page, perpage);
    // console.log(location);
    // console.log(location.pathname); // result: '/secondpage'
    // console.log(location.search); // result: '?query=abc'
    // console.log(location.state); // result: 'some_value'
    if (typeof location.state === "undefined") {
      return history.push("/transcript/list");
    }
    fetchSubjectsAPI();

    const transcripts = location.state.transcript;
    setChildCardDatas(transcripts);
    setTranscript(transcripts);

    const student = location.state.student;
    const uniCode = location.state.student.uniCode;
    const classroom = student.class;
    setBasicInformation({
      student_name: student.studentName,
      student_code: student.studentID.replace(uniCode + "_", ""),
      classroom: classroom
    });
    //
    const subjectsId = [];
    transcripts.map((e) => {
      subjectsId.push(e.id);
    });
    setIdSubjectSelected(subjectsId);


  }, [location]);
  return (
    <CRow>
      <CCol xs={3}>
        <CCard className="mb-4">
          <CCardHeader>BASIC INFORMATION</CCardHeader>
          <CCardBody>
            <div className="p-2" style={{ width: "100%" }}>
              <CFormLabel>Student ID</CFormLabel>
              <CFormInput
                readOnly={true}
                value={basicInformation.student_code}
                type="text"
                size="sm"
                name="student_code"
                placeholder="Student ID" />
            </div>
            <div className="p-2" style={{ width: "100%" }}>
              <CFormLabel>Student Name</CFormLabel>
              <CFormInput
                readOnly={true}
                value={basicInformation.student_name}
                type="text"
                size="sm"
                name="student_name"
                placeholder="Student Name" />
            </div>
            <div className="p-2">
              <CFormLabel>Class</CFormLabel>
              <CFormInput
                readOnly={true}
                value={basicInformation.classroom}
                type="text"
                size="sm"
                name="class"
                placeholder="Class" />
            </div>
            <div className="p-3 d-flex flex-row">
              <CButton
                onClick={history.goBack}
                variant="outline"
                color="success">Back</CButton>
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
                    readOnly={true}
                    style={{ width: "100%", marginRight: "5px" }}
                  />
                </div>
              </CCol>
            </CRow>
            <CRow>
              {idSubjectsSelected.map((e) => (
                <FormTranscript
                  key={e}
                  id={e}
                  subject={passSubjectToFormTranscript(e)}
                  transcript={transcript}
                  readonly={true}
                  // handleChildCardSave={handleChildCardSave}
                  // handleChildCardRemove={handleChildCardRemove}
                />
              ))}
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DetailTranscriptTraced;
