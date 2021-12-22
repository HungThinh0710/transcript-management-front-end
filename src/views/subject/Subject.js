import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CFormLabel,
  CForm,
  CFormInput,
  CFormTextarea, CBadge
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

const Subject = () => {
  // Common & table states
  const [loadingTable, setLoadingTable] = React.useState(false);
  const [perpage, setPerpage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [pagination, setPagination] = useState(null);
  const [payloadTable, setPayloadTable] = useState([]);
  const [majorIdPickerSelected, setMajorIdPickerSelected] = useState(null);
  // Modal states
  const [visibleModal, setVisibleModal] = useState(false);

  // Create & update modal states
  const [payloadModal, setPayloadModal] = useState({
    subject_id: 0,
    subject_name: "",
    subject_code: "",
    credit: 0
  });

  // Custom State
  const [payloadMajor, setPayloadMajor] = useState([]);
  const [newPayload, setNewPayload] = useState({
    subject_name: "",
    subject_code: "",
    credit: 0
  });

  const history = useHistory();

  const ActionCell = ({ rowData, dataKey, onChange, ...props }) => {
    return (
      <Table.Cell {...props} style={{ padding: "6px" }}>
        <CButton
          appearance="link"
          onClick={() => {
            handleEdit(rowData);
          }}>
          Edit
        </CButton>
        <CButton
          color="danger"
          style={{ marginLeft: "2px" }}
          onClick={() => {
            deleteRowConfirm(rowData);
          }}>
          Delete
        </CButton>
      </Table.Cell>
    );
  };

  const deleteRowConfirm = (rowData) => {
    confirmAlert({
      title: "Are you sure?",
      message: "Do you want to delete this row?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            fetchDeletePayloadAPI({ subject_id: rowData.id });
          }
        },
        {
          label: "No"
        }
      ]
    });
  };

  const onChangePage = page => {
    setPage(page);
    fetchTableAPI(page, perpage);
  };

  const onCloseModal = () => {
    setPayloadModal({
      subject_id: 0,
      subject_name: "",
      subject_code: "",
      credit: 0
    });
    setVisibleModal(false);
  };

  const handleChangePerpage = dataKey => {
    setPerpage(dataKey);
    fetchTableAPI(page, dataKey);
  };

  const handleEdit = rowData => {
    setPayloadModal({
      subject_id: rowData.id,
      subject_name: rowData.subject_name,
      subject_code: rowData.subject_code,
      credit: rowData.credit
    });
    setVisibleModal(!visibleModal);
  };

  const handleChangeTextModal = (e) => {
    const value = e.target.value;
    setPayloadModal({
      ...payloadModal,
      [e.target.name]: value
    });
  };

  const handleChangeTextCreate = (e) => {
    const value = e.target.value;
    setNewPayload({
      ...newPayload,
      [e.target.name]: value
    });
  }

  const handleCreate = () => {
    const data = {
      ...newPayload,
    };
    data.credit = parseInt(data.credit);
    fetchNewOrUpdatePayloadAPI(data);
  };

  const validateNewPayloadAPI = (isUpdate = false, dataNew = {}) => {
    if (isUpdate){
      const credit = payloadModal.credit;
      console.log(payloadModal);
      return parseInt(payloadModal.subject_id) > 0 && payloadModal.subject_name.length > 0 && payloadModal.subject_code.length > 0 && credit > 0;
    }
    const credit = dataNew.credit;
    return dataNew.subject_name.length > 0 && dataNew.subject_code.length > 0 && credit > 0;
  };

  const fetchTableAPI = (page, perpage) => {
    setLoadingTable(true);
    FetchAPI("GET", API.CLIENT_SUBJECT_MANAGEMENT, {}, page, perpage)
      .then(payload => {
        setLoadingTable(false);
        setPayloadTable(payload.subjects.data);
        setPagination(payload.subjects);
      })
      .catch(error => {
        setLoadingTable(false);
        console.log("Error in here");
        console.log(error);
        switch (error.status) {
          case 401:
            history.push("login");
            break;
          case 403:
            history.push("dashboard");
            toast.error(error.data.message);
            break;
          default:
            toast.error(error.data.message);
            break;
        }
      });
  };

  const fetchNewOrUpdatePayloadAPI = (payload = {}) => {
    let method, data;
    let isPassedValidate;


    if (parseInt(payloadModal.subject_id) > 0 || isNaN(payloadModal.subject_id)) {
      console.log("GOING TO UPDATE");
      method = "PATCH";
      isPassedValidate = validateNewPayloadAPI(true);
      data = payloadModal;
    } else {
      isPassedValidate = validateNewPayloadAPI(false, payload);
      method = "POST";
      data = payload;
    }

    if (!isPassedValidate) {
      return toast.warning("You must fill in the form.");
    }
    toast.promise(
      FetchAPI(method, API.CLIENT_SUBJECT_MANAGEMENT, data),
      {
        pending: "Please waiting...",
        success: {
          render({ data }) {
            setPayloadModal({
              subject_id: 0,
              subject_name: "",
              subject_code: "",
              credit: 0,
            })
            setNewPayload({
              subject_name: "",
              subject_code: "",
              credit: 0,
            })
            fetchTableAPI();
            return data.message;
          }
        },
        error: {
          render({ data }) {
            console.log(data);
            return data.data.message;
          }
        }
      }
    );
    if(method === "PATCH")
      setVisibleModal(!visibleModal);
  };

  const fetchDeletePayloadAPI = (data) => {
    toast.promise(
      FetchAPI("DELETE", API.CLIENT_SUBJECT_MANAGEMENT, data),
      {
        pending: "Please waiting...",
        success: {
          render({ data }) {
            fetchTableAPI();
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
    fetchTableAPI(page, perpage);
  }, []);

  return (
    <CRow>
      <CModal alignment="center" visible={visibleModal} onClose={onCloseModal}>
        <CModalHeader>
          <CModalTitle>Update Class</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Subject name</CFormLabel>
              <CFormInput
                value={payloadModal.subject_name}
                onChange={handleChangeTextModal}
                type="text"
                name="subject_name"
                placeholder="Subject Name" />
            </div>
            <div className="mb-3">
              <CFormLabel>Code</CFormLabel>
              <CFormInput
                value={payloadModal.subject_code}
                onChange={handleChangeTextModal}
                type="text"
                name="subject_code"
                placeholder="Subject code" />
            </div>
            <div className="mb-3">
              <CFormLabel>Credit</CFormLabel>
              <CFormInput
                value={payloadModal.credit}
                onChange={handleChangeTextModal}
                type="text"
                name="credit"
                placeholder="Credit" />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onCloseModal}>
            Close
          </CButton>
          <CButton
            onClick={() => fetchNewOrUpdatePayloadAPI()}
            color="primary">Save changes</CButton>
        </CModalFooter>
      </CModal>
      <CCol xs={8}>
        <CCard className="mb-4">
          <CCardHeader>List Subject</CCardHeader>
          <CCardBody>
            <Table
              virtualized
              loading={loadingTable}
              height={400}
              autoHeight={true}
              data={payloadTable}
            >
              <Table.Column width={50} align="center">
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.Cell dataKey="id" />
              </Table.Column>
              <Table.Column width={250} fixed>
                <Table.HeaderCell>Subject Name</Table.HeaderCell>
                <Table.Cell dataKey="subject_name" />
              </Table.Column>
              <Table.Column width={150}>
                <Table.HeaderCell>Subject Code</Table.HeaderCell>
                <Table.Cell dataKey="subject_subject_code" />
              </Table.Column>
              <Table.Column width={80}>
                <Table.HeaderCell>Credit</Table.HeaderCell>
                <Table.Cell dataKey="credit" />
              </Table.Column>
              <Table.Column width={200}>
                <Table.HeaderCell>Action</Table.HeaderCell>
                <ActionCell dataKey="id" />
              </Table.Column>
            </Table>
            <div style={{ padding: 20 }}>
              {pagination != null ? (<Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={5}
                size="xs"
                layout={["total", "-", "limit", "|", "pager", "skip"]}
                total={pagination.total}
                limitOptions={[1, 10, 25, 50, 100]}
                limit={perpage}
                activePage={pagination.current_page}
                onChangePage={onChangePage}
                onChangeLimit={handleChangePerpage}
              />) : null}

            </div>
          </CCardBody>
        </CCard>
      </CCol>
      {/*
      * Create subject
      */}
      <CCol xs={4}>
        <CCard className="mb-4">
          <CCardHeader>Create Subject</CCardHeader>
          <CCardBody>
            <div className="p-2" style={{ width: "100%" }}>
              <CFormLabel>Subject name</CFormLabel>
              <CFormInput
                value={newPayload.subject_name}
                onChange={handleChangeTextCreate}
                type="text"
                size="sm"
                name="subject_name"
                placeholder="Class name" />
            </div>
            <div className="p-2" style={{ width: "100%" }}>
              <CFormLabel>Subject code</CFormLabel>
              <CFormInput
                value={newPayload.subject_code}
                onChange={handleChangeTextCreate}
                type="text"
                size="sm"
                name="subject_code"
                placeholder="Code" />
            </div>
            <div className="p-2" style={{ width: "100%" }}>
              <CFormLabel>Credit</CFormLabel>
              <CFormInput
                value={newPayload.credit}
                onChange={handleChangeTextCreate}
                type="number"
                min={0}
                max={100}
                size="sm"
                name="credit"
                placeholder="Credit" />
            </div>
            <div className="p-3 d-flex flex-row">
              <CButton
                onClick={handleCreate}
                color="info">Create</CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Subject;
