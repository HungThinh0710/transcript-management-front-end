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
} from "@coreui/react";
import { toast } from "react-toastify";
import { FetchAPI } from "../../api/FetchAPI";
import * as API from "../../api";
import { useLocation, useHistory } from "react-router-dom";
import { Chrono } from "react-chrono";

const TraceTranscript = () => {
  const location = useLocation();
  const [studentID, setStudentID] = useState("");
  const [timeline, setTimeline] = useState([]);
  const history = useHistory();

  const fetchDetailTransaction = (studentID) => {
    toast.promise(
      FetchAPI("POST", API.CLIENT_TRACE_TRANSCRIPT, {
        student_code: studentID
      }, null, null, {}),
      {
        pending: "Tracing transcript from blockchain...",
        success: {
          render({ data }) {
            console.log(data);
            const historyTransaction = data.history;
            historyTransaction.sort(function(x, y) {
              return x.timestamp.seconds.low - y.timestamp.seconds.low;
            });
            const items = [];
            historyTransaction.map((e, i) => {
              let unix_timestamp = e.timestamp.seconds.low;
              let date = new Date(unix_timestamp * 1000);
              let day = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
              let hours = date.getHours();
              let minutes = "0" + date.getMinutes();
              let seconds = "0" + date.getSeconds();
              let formattedTime = hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2) + " - " + day;

              let uniCode = e.payload.uniCode;
              let studentID = e.payload.studentID.replace(uniCode + "_", "");
              items.push({
                title: `#${(i + 1)} - ${formattedTime}`,
                cardTitle: `#${(i + 1)} - ${e.payload.studentName} (${studentID})`,
                cardSubtitle: i === 0 ? `Initialize Transcript for ${e.payload.studentName}` : `Update Transcript of ${e.payload.studentName}`,
                cardDetailedText: ["Submit or approve by: xxxx", (
                  <CButton onClick={() => {
                    history.push({
                      pathname: "/transcript/detail-traced",
                      search: null,
                      state: {
                        student: e.payload,
                        transcript: e.payload.transcript
                      }
                    });
                  }}
                           variant="outline"
                           color="primary">Detail</CButton>)]
              });
            });
            const fillHistoryTransaction = [...items];
            setTimeline(fillHistoryTransaction); // fix
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

  useEffect(() => {
    // fetchTableAPI(page, perpage);
    // console.log(location);
    // console.log(location.pathname); // result: '/secondpage'
    // console.log(location.search); // result: '?query=abc'
    // console.log(location.state); // result: 'some_value'
    const studentID = new URLSearchParams(location.search).get("studentID");
    setStudentID(studentID);
    fetchDetailTransaction(studentID);
  }, []);


  return (
    <CRow>
      <CCol xs={3}>
        <CCard className="mb-4">
          <CCardHeader>BASIC INFORMATION</CCardHeader>
          <CCardBody>
            <div className="p-2" style={{ width: "100%" }}>
              <CFormLabel>Student ID</CFormLabel>
              <CFormInput
                value={studentID}
                readOnly={true}
                type="text"
                size="sm"
                name="student_code"
                placeholder="Student ID" />
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
                {timeline.length > 0 ? (<Chrono
                  scrollable
                  enableOutline
                  cardHeight="70px"
                  useReadMore={false}
                  items={timeline}
                  mode="VERTICAL_ALTERNATING"
                />) : null
                }
              </CCol>

            </CRow>
            <CRow>

            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default TraceTranscript;
