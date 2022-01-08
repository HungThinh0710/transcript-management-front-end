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
  CInputGroup, CCallout, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from "@coreui/react";
import { Table, Pagination, SelectPicker, TagPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import axios from "axios";
import * as API from "../../api";
import { Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { FetchAPI } from "../../api/FetchAPI";

const Users = () => {
  const [loading, setLoading] = React.useState(false);
  const [perpage, setPerpage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [roles, setRoles] = useState([]);
  const [rolePicked, setRolePicked] = useState(null);
  const [userInformation, setUserInformation] = useState({});
  const [isCreateSuccess, setIsCreateSuccess] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [payloadModal, setPayloadModal] = useState({
    user_id: 0,
    role_id: 0,
    full_name: "",
    // email: ""
  });
  const history = useHistory();

  const onCloseModal = () => {
    setPayloadModal({
      user_id: 0,
      role_id: 0,
      full_name: "",
      // email: ""
    });
    setVisibleModal(false);
  };
  const ActionCell = ({ rowData, dataKey, onChange, ...props }) => {
    return (
      <Table.Cell {...props} style={{ padding: "6px" }}>
        <CButton
          variant="outline"
          color="info"
          style={{ marginLeft: "2px" }}
          onClick={() => {
            handleEdit(rowData);
          }}>
          Edit
        </CButton>
      </Table.Cell>
    );
  };

  const handleEdit = rowData => {
    setPayloadModal({
      user_id: rowData.id,
      role_id: typeof rowData.roles[0] === "undefined" ? 0 : rowData.roles[0].id,
      full_name: rowData.full_name,
      // email: rowData.email
    });
    setVisibleModal(!visibleModal);
  };

  const handleChangePerpage = dataKey => {
    setPerpage(dataKey);
    fetchUsers(page, dataKey);
  };

  const onChangePage = page => {
    setPage(page);
    fetchUsers(page, perpage);
  };

  const downloadSecretKey = () => {
    const element = document.createElement("a");
    if (secretKey.length <= 0)
      return toast.error("Please create an educational organization first.");
    const secretKeyFile = new Blob([secretKey], { type: "text/plain" });
    element.href = URL.createObjectURL(secretKeyFile);
    element.download = `${userInformation.email}.key`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const handleChangeTextModal = (e) => {
    const value = e.target.value;
    setPayloadModal({
      ...payloadModal,
      [e.target.name]: value
    });
  };

  const fetchUsers = (page = 1, perpage = 10) => {
    setUsers([]);
    setLoading(true);
    // addToast(showToast("Login failed", "Email or Password and Secret Key is required.", "red"))
    axios.get(`${API.CLIENT_GET_ORG_USER}?page=${page}&perpage=${perpage}`, {
      withCredentials: true
    })
      .then(function(response) {
        if (response.status == 200 && response.data.success == true) {
          const payload = response.data.users;
          setLoading(false);
          setUsers(payload.data);
          setPagination(payload);
        }
      })
      .catch(function(error) {
        setLoading(false);
        console.log(error);
        switch (error.response.status) {
          case 401:
            console.log("NOT LOGIN YET");
            toast.error("You are not logged in.", {
              theme: "colored"
            });
            history.push("/login");
            break;
          case 403:
            console.log("You do not have permission to do this action");
            toast.error(error.response.data.message, {
              theme: "colored"
            });
            history.push("/dashboard");
            break;
        }
      });

  };

  const fetchRoles = () => {
    FetchAPI("GET", API.CLIENT_GET_ORGANIZATION_ROLE, {}, 1, 1000000000)
      .then(payload => {
        setRoles(payload.roles.data);
      })
      .catch(error => {
        toast.error(error.message);
      });
  };

  const onChangeUserInformation = (e) => {
    const value = e.target.value;
    setUserInformation({
      ...userInformation,
      [e.target.name]: value
    });
  };

  const handleCreateUser = () => {
    const data = {
      ...userInformation,
      role_id: rolePicked
    };
    console.log(data);
    setIsCreateSuccess(false);
    toast.promise(
      FetchAPI("POST", API.CLIENT_ENROLL_USER, data),
      {
        pending: "Please waiting...",
        success: {
          render({ data }) {
            setIsCreateSuccess(true);
            setSecretKey(data.walletEncrypted);
            fetchUsers();
            return data.message;
          }
        },
        error: {
          render({ data }) {
            console.log("ERROR IN FETCH NEW PAYLOAD API");
            console.log(data);
            setIsCreateSuccess(false);
            return data.data.message;
          }
        }
      }
    );
  };

  const onChangeRole = (e) => {
    setRolePicked(e);
  };

  const updateUser = () => {
    toast.promise(
      FetchAPI("POST", API.CLIENT_CHANGE_USER_INFORMATION, payloadModal),
      {
        pending: "Please waiting...",
        success: {
          render({ data }) {
            setPayloadModal({
              user_id: 0,
              role_id: 0,
              full_name: "",
              // email: ""
            });
            setVisibleModal(!visibleModal);
            fetchUsers(page, perpage);
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
    )
  }

  useEffect(() => {
    fetchUsers(page, perpage);
    fetchRoles();
  }, []);

  return (
    <CRow>
      <CModal alignment="center" visible={visibleModal} onClose={onCloseModal} style={{zIndex: '0!important'}}>
        <CModalHeader>
          <CModalTitle>Edit user</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Full name</CFormLabel>
              <CFormInput
                value={payloadModal.full_name}
                onChange={handleChangeTextModal}
                type="text"
                name="full_name"
                placeholder="Full Name" />
            </div>
            {/*<div className="mb-3">*/}
            {/*  <CFormLabel>Email</CFormLabel>*/}
            {/*  <CFormInput*/}
            {/*    value={payloadModal.email}*/}
            {/*    onChange={handleChangeTextModal}*/}
            {/*    type="text"*/}
            {/*    name="email"*/}
            {/*    placeholder="Email" />*/}
            {/*</div>*/}
            <div className="mb-3">
              <CFormLabel>Role</CFormLabel>
              <div>
                <SelectPicker
                  menuStyle={{zIndex: 9999}}
                  block={true}
                  data={roles}
                  value={payloadModal.role_id}
                  onChange={(e)=> {
                    setPayloadModal({
                      ...payloadModal,
                      role_id: e
                    })
                  }}
                  labelKey="name"
                  valueKey="id"
                />
              </div>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onCloseModal}>
            Close
          </CButton>
          <CButton
            onClick={() => updateUser()}
            color="primary">Submit</CButton>
        </CModalFooter>
      </CModal>
      <CCol xs={7}>
        <CCard className="mb-4">
          <CCardHeader>Users in organization</CCardHeader>
          <CCardBody>
            <Table
              loading={loading}
              height={400}
              data={users}
              id="table"
            >
              <Table.Column width={50} align="center">
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.Cell dataKey="id" />
              </Table.Column>
              <Table.Column width={200}>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.Cell dataKey="email" />
              </Table.Column>
              <Table.Column width={200}>
                <Table.HeaderCell>Full Name</Table.HeaderCell>
                <Table.Cell dataKey="full_name" />
              </Table.Column>
              <Table.Column width={100}>
                <Table.HeaderCell>Owner</Table.HeaderCell>
                <Table.Cell>
                  {
                    rowData => {
                      return rowData.is_owner === 1 ? (<CBadge color="info">Organizer</CBadge>) : (
                        <CBadge color="success">User</CBadge>);
                    }
                  }
                </Table.Cell>
              </Table.Column>
              <Table.Column width={100}>
                <Table.HeaderCell>Roles</Table.HeaderCell>
                <Table.Cell dataKey="roles">
                  {
                    rowData => {
                      let roleName = "No role";
                      if (rowData.roles.length > 0) {
                        const roles = rowData.roles;
                        roles.map(role => (roleName = role.name));
                      }
                      if (roleName === "No role")
                        return <CBadge color="danger">No role</CBadge>;
                      return <CBadge color="primary">{roleName}</CBadge>;
                    }
                  }
                </Table.Cell>
              </Table.Column>
              <Table.Column width={100}>
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
      <CCol xs={5}>
        <CCard className="mb-4">
          <CCardHeader>Create membership</CCardHeader>
          <CCardBody>
            {
              isCreateSuccess ? (<CCallout color="success">
                <p>[NOTE] The secret key will be sent to the registered email by default.</p>
                <p><CButton
                  variant={"outline"}
                  color="success"
                  onClick={downloadSecretKey}
                >Download (Dev)</CButton></p>
              </CCallout>) : null
            }
            <CForm>
              <CRow>
                <CCol xs={6}>
                  <div className="mb-3">
                    <CFormLabel>Full Name</CFormLabel>
                    <CFormInput
                      onChange={onChangeUserInformation}
                      name="full_name"
                      type="text" />
                  </div>
                </CCol>
                <CCol xs={6}>
                  <CFormLabel>Role</CFormLabel>
                  <SelectPicker
                    style={{ width: "100%" }}
                    menuStyle={{ width: 300 }}
                    data={roles}
                    labelKey="name"
                    valueKey="id"
                    placeholder="Select role"
                    onChange={onChangeRole}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={6}>
                  <div className="mb-3">
                    <CFormLabel>Email</CFormLabel>
                    <CFormInput
                      onChange={onChangeUserInformation}
                      name="email"
                      type="text" />
                  </div>
                </CCol>
                <CCol xs={6}>
                  <div className="mb-3">
                    <CFormLabel>Password</CFormLabel>
                    <CFormInput
                      onChange={onChangeUserInformation}
                      name="password"
                      type="password" />
                  </div>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12}>
                  <CButton
                    onClick={handleCreateUser}
                  >
                    Submit
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Users;
