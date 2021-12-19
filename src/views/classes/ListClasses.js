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

const Classes = () => {
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
    class_id: 0,
    major_id: 0,
    class_name: "",
    start_year: "",
    code: ""
  });

  // Custom State
  const [payloadMajor, setPayloadMajor] = useState([]);
  const [payloadNewClass, setPayloadNewClass] = useState({
    major_id: 0,
    class_name: "",
    start_year: "",
    code: ""
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
            fetchDeletePayloadAPI({ class_id: rowData.id });
          }
        },
        {
          label: "No"
        }
      ]
    });
  };

  const onChangeSelectMajor = (e) => {
    console.log(e);
    setMajorIdPickerSelected(e);
  };

  const onChangePage = page => {
    setPage(page);
    fetchTableAPI(page, perpage);
  };

  const onCloseModal = () => {
    setPayloadModal({
      class_id: 0,
      major_id: 0,
      class_name: "",
      start_year: "",
      code: ""
    });
    setVisibleModal(false);
  };

  const handleChangePerpage = dataKey => {
    setPerpage(dataKey);
    fetchTableAPI(page, dataKey);
  };

  const handleEdit = rowData => {
    setPayloadModal({
      class_id: rowData.class_id,
      major_id: rowData.major_id,
      class_name: rowData.class_name,
      code: rowData.code,
      start_year: rowData.start_year
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
    setPayloadNewClass({
      ...payloadNewClass,
      [e.target.name]: value
    });
  }

  const handleCreateClass = () => {
    if (majorIdPickerSelected === null) return toast.warning("You must select major");
    const data = {
      ...payloadNewClass,
      major_id: majorIdPickerSelected,
    };
    fetchNewOrUpdatePayloadAPI(data);
  };

  const validateNewPayloadAPI = (isUpdate = false, dataNew = {}) => {
    if (isUpdate){
      return parseInt(payloadModal.class_id) > 0 && parseInt(payloadModal.major_id) > 0 && payloadModal.class_name.length > 0 && payloadModal.code.length > 0 && payloadModal.start_year.length > 0;
    }
    return parseInt(dataNew.major_id) > 0 && dataNew.class_name.length > 0 && dataNew.code.length > 0 && dataNew.start_year.length > 0;
  };

  const fetchTableAPI = (page, perpage) => {
    setLoadingTable(true);
    FetchAPI("GET", API.CLIENT_GET_CLASSES, {}, page, perpage)
      .then(payload => {
        setLoadingTable(false);
        setPayloadTable(payload.classes.data);
        setPagination(payload.classes);
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

    if (parseInt(payloadModal.class_id) > 0) {
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
      FetchAPI(method, API.CLIENT_CREATE_CLASSES, data),
      {
        pending: "Please waiting...",
        success: {
          render({ data }) {
            setPayloadModal({
              class_id: 0,
              major_id: 0,
              class_name: "",
              start_year: "",
              code: ""
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
      FetchAPI("DELETE", API.CLIENT_CREATE_CLASSES, data),
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

  const fetchMajors = (page = 1, perpage = 100000000) => {
    FetchAPI("GET", API.CLIENT_MAJOR_MANAGEMENT, {}, page, perpage)
      .then(payload => {
        setPayloadMajor(payload.majors.data);
      })
      .catch(error => {
        console.log(error);
        switch (error.status) {
          default:
            toast.error(error.data.message);
            break;
        }
      });
  };

  useEffect(() => {
    fetchTableAPI(page, perpage);
    fetchMajors();
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
              <CFormLabel>Class name</CFormLabel>
              <CFormInput
                value={payloadModal.class_name}
                onChange={handleChangeTextModal}
                type="text"
                name="class_name"
                placeholder="Class" />
            </div>
            <div className="mb-3">
              <CFormLabel>Start Year</CFormLabel>
              <CFormInput
                value={payloadModal.start_year}
                onChange={handleChangeTextModal}
                type="text"
                name="start_year"
                placeholder="Start Year" />
            </div>
            <div className="mb-3">
              <CFormLabel>Code</CFormLabel>
              <CFormInput
                value={payloadModal.code}
                onChange={handleChangeTextModal}
                type="text"
                name="code"
                placeholder="Major code" />
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
          <CCardHeader>List Major</CCardHeader>
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
              <Table.Column width={110} fixed>
                <Table.HeaderCell>Class Name</Table.HeaderCell>
                <Table.Cell dataKey="class_name" />
              </Table.Column>
              <Table.Column width={250}>
                <Table.HeaderCell>Major</Table.HeaderCell>
                <Table.Cell dataKey="major">
                  {
                    rowData => `${rowData.major.major_name} (${rowData.major.major_code})`
                  }
                </Table.Cell>
              </Table.Column>
              <Table.Column width={80}>
                <Table.HeaderCell>Start Year</Table.HeaderCell>
                <Table.Cell dataKey="start_year" />
              </Table.Column>
              <Table.Column width={80}>
                <Table.HeaderCell>Code</Table.HeaderCell>
                <Table.Cell dataKey="code" />
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
      * Create class
      */}
      <CCol xs={4}>
        <CCard className="mb-4">
          <CCardHeader>Create class</CCardHeader>
          <CCardBody>
            <div className="p-2" style={{ width: "100%" }}>
              <CFormLabel>Class name</CFormLabel>
              <CFormInput
                value={payloadNewClass.class_name}
                onChange={handleChangeTextCreate}
                type="text"
                size="sm"
                name="class_name"
                placeholder="Class name" />
            </div>
            <div className="p-2">
              <CFormLabel>Select Major</CFormLabel>
              <SelectPicker
                block
                style={{ width: "100%" }}
                menuStyle={{ width: 300 }}
                data={payloadMajor}
                labelKey="major_name"
                valueKey="id"
                placeholder="Select major"
                onChange={onChangeSelectMajor}
                // onSelect={}
              />
            </div>
            <div className="p-2" style={{ width: "100%" }}>
              <CFormLabel>Code</CFormLabel>
              <CFormInput
                value={payloadNewClass.code}
                onChange={handleChangeTextCreate}
                type="text"
                size="sm"
                name="code"
                placeholder="Code" />
            </div>
            <div className="p-2" style={{ width: "100%" }}>
              <CFormLabel>Start Year</CFormLabel>
              <CFormInput
                value={payloadNewClass.start_year}
                onChange={handleChangeTextCreate}
                type="text"
                size="sm"
                name="start_year"
                placeholder="Start Year" />
            </div>
            <div className="p-3 d-flex flex-row">
              <CButton
                onClick={handleCreateClass}
                color="info">Create</CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Classes;
