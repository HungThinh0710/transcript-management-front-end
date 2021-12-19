import { CButton, CCard, CCardBody, CCardText, CCardTitle, CCol, CFormInput, CFormLabel, CRow } from "@coreui/react";
import React, { useEffect } from "react";

export default function FormTranscript(props) {
  const [inputData, setInputData] = React.useState({
    attendanceScore: "",
    exerciseScore: "",
    middleExamScore: "",
    FinalExamSCore: ""
  });

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setInputData({
        ...inputData,
        [e.target.name]: ""
      });
    }
    if (value >= 0 && value <= 100)
      setInputData({
        ...inputData,
        [e.target.name]: value
      });
    else {

    }
  };

  const handleClickSave = () => {
    props.handleChildCardSave({
      id: props.id,
      sbjName: props.subject.subject_name,
      sbjCode: props.subject.subject_code,
      // data: inputData
      ...inputData
    });
  };

  const handleClickRemove = () => {
    props.handleChildCardRemove({
      id: props.id,
      sbjName: props.subject.subject_name
    });
  };

  const handleClickClear = () => {
    setInputData({
      attendanceScore: "",
      exerciseScore: "",
      middleExamScore: "",
      FinalExamSCore: ""
    });
  };

  useEffect(() => {
    if(typeof props.transcript != "undefined"){
      const transcripts = props.transcript;
      if(transcripts.length > 0){
        for (const [i, e] of transcripts.entries())
          if (e.id === props.id){
            setInputData({
              attendanceScore: parseInt(e.attendanceScore),
              exerciseScore: parseInt(e.exerciseScore),
              middleExamScore: parseInt(e.middleExamScore),
              FinalExamSCore: parseInt(e.FinalExamSCore)
            });
          }
      }
    }
  }, [props.transcript]);

  return (
    <CCol xs={4} className="pt-3">
      <CCard style={{ width: "18rem", height: "250px" }}>
        <CCardBody>
          <CCardTitle>{typeof props.subject != "undefined" ? props.subject.subject_name : 'Unknown' }</CCardTitle>
          <div className="pb-2">
            <CRow>
              <CCol xs={6}>
                <CFormLabel>Điểm danh</CFormLabel>
                <CFormInput
                  value={inputData.attendanceScore}
                  onChange={handleChange}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  type="number"
                  size="sm"
                  name="attendanceScore"
                  placeholder="Điểm danh" />
              </CCol>
              <CCol xs={6}>
                <CFormLabel>Bài tập</CFormLabel>
                <CFormInput
                  value={inputData.exerciseScore}
                  onChange={handleChange}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  type="number"
                  size="sm"
                  name="exerciseScore"
                  placeholder="Bài Tập" />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={6}>
                <CFormLabel>Giữa kỳ</CFormLabel>
                <CFormInput
                  value={inputData.middleExamScore}
                  onChange={handleChange}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  type="number"
                  size="sm"
                  name="middleExamScore"
                  placeholder="Giữa kỳ" />
              </CCol>
              <CCol xs={6}>
                <CFormLabel>Cuối kì</CFormLabel>
                <CFormInput
                  value={inputData.FinalExamSCore}
                  onChange={handleChange}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  type="number"
                  size="sm"
                  name="FinalExamSCore"
                  placeholder="Cuối ki" />
              </CCol>
            </CRow>
          </div>
          <CButton
            onClick={handleClickSave}
            variant="outline"
            size="sm"
            style={{ marginRight: "5px" }}>
            Save
          </CButton>
          <CButton
            onClick={handleClickClear}
            variant="outline"
            size="sm"
            style={{ marginRight: "5px" }}
            color="dark">
            Reset
          </CButton>
          <CButton
            onClick={handleClickRemove}
            variant="outline"
            size="sm"
            style={{ marginRight: "5px" }}
            color="danger">
            Remove
          </CButton>
        </CCardBody>
      </CCard>
    </CCol>
  );

}
