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
  CFormTextarea
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowThickToBottom, cilArrowThickFromBottom } from "@coreui/icons";
import { Table, Pagination, TagPicker, SelectPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { MajorAPI } from "../../api/major";
import * as API from "../../api";
import { CLIENT_GET_ORGANIZATION_ROLE, CLIENT_MAJOR_ASSIGN_SUBJECT } from "../../api";
import { FetchAPI } from "../../api/FetchAPI";

const rowKey = "id";
const ExpandCell = ({ rowData, dataKey, expandedRowKeys, onChange, ...props }) => (
  <Table.Cell {...props}>
    <CIcon
      icon={
        expandedRowKeys.some((key) => key === rowData[rowKey]) ? cilArrowThickFromBottom : cilArrowThickToBottom
      }
      size="sm"
      appearance="subtle"
      onClick={() => {
        onChange(rowData);
      }}
    />
  </Table.Cell>
);

const renderRowExpanded = (rowData) => {
  const permissionParser = rowData.permissions.map((e) => (
    `Permission: ${e.name}.\n`)
  );
  const permissions = permissionParser.toString().replaceAll(",", "");
  return (
    <CFormTextarea rows={4} defaultValue={permissions} readOnly />
  );
};

const RoleAndPermissionManagement = () => {
  // Common & table states
  const [loadingTable, setLoadingTable] = React.useState(false);
  const [perpage, setPerpage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [pagination, setPagination] = useState(null);
  const [payloadTable, setPayloadTable] = useState([]);
  const [payloadSubjects, setPayloadSubject] = useState([]);
  const [roleIdPickerSelected, setRoleIdPickerSelected] = useState(null);
  const [valuePermissionPicker, setValuePermissionPicker] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [roleSelected, setRoleSelected] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [permissionList, setPermissionList] = useState([]);
  // BETA SORT
  const [sortColumn, setSortColumn] = React.useState();
  const [sortType, setSortType] = React.useState();

  // Modal states
  const [visibleModal, setVisibleModal] = useState(false);

  // Create & update modal states
  const [payloadModal, setPayloadModal] = useState({
    major_id: 0,
    major_name: "",
    major_code: ""
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
            fetchDeletePayloadAPI({ major_id: rowData.id });
          }
        },
        {
          label: "No"
        }
      ]
    });
  };

  const onSelectRoleRow = (e) => {
    setRoleSelected(e.id);
    setValuePermissionPicker([]);
    setRoleIdPickerSelected(e.id);
    setRoleName(e.name);
    const selectedRoleId = e.id;
    let permissionAlreadyExistInRoleTmp = [];

    payloadTable.map(e => {
      if (e.id === selectedRoleId) {
        permissionAlreadyExistInRoleTmp.push(...e.permissions);
      }
    });

    const permissionAlreadyExistInRole = [];
    permissionAlreadyExistInRoleTmp.map(e => {
      permissionAlreadyExistInRole.push(e.id)
    });
    setValuePermissionPicker(permissionAlreadyExistInRole);
  };

  const onChangePage = page => {
    setPage(page);
    fetchTableAPI(page, perpage);
  };

  const onCloseModal = () => {
    setPayloadModal({
      major_id: "",
      major_name: "",
      major_code: ""
    });
    setVisibleModal(false);
  };

  const handleChangePerpage = dataKey => {
    setPerpage(dataKey);
    fetchTableAPI(page, dataKey);
  };

  const handleEdit = rowData => {
    setPayloadModal({
      major_id: rowData.id,
      major_name: rowData.major_name,
      major_code: rowData.major_code
    });
    setVisibleModal(!visibleModal);
  };

  const handleExpanded = (rowData, dataKey) => {
    let open = false;
    const nextExpandedRowKeys = [];

    expandedRowKeys.forEach((key) => {
      if (key === rowData[rowKey]) {
        open = true;
      } else {
        nextExpandedRowKeys.push(key);
      }
    });
    if (!open) {
      nextExpandedRowKeys.push(rowData[rowKey]);
    }
    setExpandedRowKeys(nextExpandedRowKeys);
  };

  const handleChangeTextModal = (e) => {
    const value = e.target.value;
    setPayloadModal({
      ...payloadModal,
      [e.target.name]: value
    });
  };

  const handleUpdatePermission = () => {
    if (roleIdPickerSelected === null) return toast.warning("You must select at least one permission");
    const data = {
      role_id: roleIdPickerSelected,
      permission: valuePermissionPicker == null ? [] : valuePermissionPicker
    };
    fetchUpdatePermissionToRole(data);
  };

  const validateNewPayloadAPI = (isUpdate = false) => {
    if (isUpdate)
      return payloadModal.major_code.length > 0 && payloadModal.major_name.length > 0 && parseInt(payloadModal.major_id) > 0;
    return payloadModal.major_code.length > 0 && payloadModal.major_name.length > 0;
  };

  const fetchTableAPI = (page, perpage) => {
    setLoadingTable(true);
    FetchAPI("GET", API.CLIENT_GET_ORGANIZATION_ROLE, {}, page, perpage)
      .then(payload => {
        console.log("SUCCESS");
        console.log(payload.roles.data);
        setPayloadTable(payload.roles.data);
        setPagination(payload.roles);
        setPermissionList(payload.permissions);
        setLoadingTable(false);
      })
      .catch(error => {
        setLoadingTable(false);
        console.log("Error in here");
        console.log(error);
        switch (error.status) {
          case 401:
            history.push("/login");
            break;
          case 403:
            history.push("/dashboard");
            toast.error(error.data.message);
            break;
          default:
            toast.error(error.data.message);
            break;
        }
      });
    // Sample
  };

  const fetchNewOrUpdatePayloadAPI = () => {
    let method;
    let isPassedValidate = false;

    if (parseInt(payloadModal.major_id) > 0) {
      method = "PATCH";
      isPassedValidate = validateNewPayloadAPI(true);
    } else {
      isPassedValidate = validateNewPayloadAPI();
      method = "POST";
    }

    if (!isPassedValidate) {
      return toast.warning("You must fill in the form.");
    }

    toast.promise(

    );
    setVisibleModal(!visibleModal);
  };

  const fetchDeletePayloadAPI = (data) => {
    toast.promise(

    );
  };

  const fetchAllSubject = (page = 1, perpage = 100000000) => {

  };

  const fetchUpdatePermissionToRole = (data) => {
    toast.promise(

    );
  };


  useEffect(() => {
    fetchTableAPI(page, perpage);
    // fetchAllPermission();
  }, []);

  return (
    <CRow>
      <CModal alignment="center" visible={visibleModal} onClose={onCloseModal}>
        <CModalHeader>
          <CModalTitle>Major Form</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Major name</CFormLabel>
              <CFormInput
                value={payloadModal.major_name}
                onChange={handleChangeTextModal}
                type="text"
                name="major_name"
                placeholder="Major" />
            </div>
            <div className="mb-3">
              <CFormLabel>Major Code</CFormLabel>
              <CFormInput
                value={payloadModal.major_code}
                onChange={handleChangeTextModal}
                type="text"
                name="major_code"
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
      <CCol xs={7}>
        <CCard className="mb-4">
          <div className="p-3 d-flex flex-row">
            <CButton
              variant="outline"
              onClick={() => setVisibleModal(!visibleModal)}
              color="success">New Role</CButton>
          </div>
          <CCardHeader>List Role</CCardHeader>
          <CCardBody>
            <Table
              virtualized
              loading={loadingTable}
              height={400}
              autoHeight={true}
              data={payloadTable}
              rowKey={rowKey}
              expandedRowKeys={expandedRowKeys}
              renderRowExpanded={renderRowExpanded}
              rowExpandedHeight={150}
              onRowClick={onSelectRoleRow}
            >
              <Table.Column width={70} align="center">
                <Table.HeaderCell>#</Table.HeaderCell>
                <ExpandCell dataKey="id" expandedRowKeys={expandedRowKeys} onChange={handleExpanded} />
              </Table.Column>
              <Table.Column width={50} align="center">
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.Cell dataKey="id" />
              </Table.Column>
              <Table.Column width={200}>
                <Table.HeaderCell>Role name</Table.HeaderCell>
                <Table.Cell dataKey="name" />
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
      * Assign Subjects
      */}
      <CCol xs={5}>
        <CCard className="mb-4">
          <CCardHeader>Assign Permissions for Role</CCardHeader>
          <CCardBody>
            <div className="p-2">
              <CFormLabel>Your selected role</CFormLabel>
              <CFormInput
                block
                style={{ width: "100%" }}
                menuStyle={{ width: 300 }}
                value={roleName}
                readOnly
              />
            </div>
            <div className="p-2" style={{ width: "100%" }}>
              <CFormLabel>Assign Permissions</CFormLabel>
              <TagPicker
                block
                data={permissionList}
                labelKey="name"
                valueKey="id"
                style={{ width: "100%" }}
                menuStyle={{ width: 300 }}
                placeholder="Select permissions"
                value={valuePermissionPicker}
                onChange={(evt) => {
                  setValuePermissionPicker(evt);
                }}
              />
            </div>
            <div className="p-3 d-flex flex-row">
              <CButton
                className="m-lg-1"
                variant="outline"
                onClick={handleUpdatePermission}
                color="info">Update</CButton>
              <CButton
                className="m-lg-1"
                variant="outline"
                onClick={handleUpdatePermission}
                color="danger">Assign Full Permission</CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default RoleAndPermissionManagement;
