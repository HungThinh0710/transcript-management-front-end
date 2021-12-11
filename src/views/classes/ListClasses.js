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
  CFormInput
} from "@coreui/react";
import { Table, Pagination } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import axios from "axios";
import * as API from "../../api";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";

const Classes = () => {
  const [loading, setLoading] = React.useState(false);
  const [perpage, setPerpage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [pagination, setPagination] = useState(null);
  const [classes, setClasses] = useState([]);
  const [visibleNewClass, setVisibleNewClass] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  // Create & Update Class
  const [creClassId, setCreClassId] = useState("");
  const [creClassName, setCreClassName] = useState("");
  const [creCode, setCreCode] = useState("");
  const [creStartYear, setCreStartYear] = useState("");

  // Confirm Dialog
  const [visibleConfirmDialog, setVisibleConfirmDialog] = useState(false);
  const [isConfirmDialog, setIsConfirmDialog] = useState(false);
  const [idRowForDelete, setIdRowForDelete] = useState(null);

  const history = useHistory();
  const cancelTokenSource = axios.CancelToken.source();

  const handleChangePerpage = dataKey => {
    setPerpage(dataKey);
    fetchClasses(page, dataKey);
  };

  const onChangePage = page => {
    setPage(page);
    fetchClasses(page, perpage);
  };

  // eslint-disable-next-line react/prop-types
  const ActionCell = ({ rowData, dataKey, onChange, ...props }) => {
    return (
      <Table.Cell {...props} style={{ padding: "6px" }}>
        <CButton
          appearance="link"
          onClick={() => {
            handleEdit(rowData);
          }}
        >
          Edit
        </CButton>
        <CButton
          color="danger"
          style={{ marginLeft: "2px" }}
          onClick={() => {
            handleDelete(rowData);
          }}
        >
          Delete
        </CButton>
      </Table.Cell>
    );
  };

  const handleEdit = rowData => {
    setCreClassId(rowData.id.toString());
    setCreClassName(rowData.class_name);
    setCreCode(rowData.code);
    setCreStartYear((rowData.start_year.toString()));
    setIsUpdate(true);
    setVisibleNewClass(!visibleNewClass);
  };

  const handleDelete = rowData => {
    setIdRowForDelete(rowData.id);
    setVisibleConfirmDialog(!visibleConfirmDialog);
  };

  const deleteRow = (id) => new Promise((resolve, reject) => {
      axios({
        method: "DELETE",
        url: API.CLIENT_UPDATE_CLASSES, // TODO: Change to Delete
        data: {
          // class_id: null // TODO: Insert class Id here
        },
        withCredentials: true
      })
        .then(function(response) {
          console.log(response.data.success);
          if (response.data.success === true) {
            resolve(response.data.message);
          }
        })
        .catch((error) => {
          // setIsLoading(false);
          switch (error.response.data.code) {
            case 422:
              reject("The given data was invalid.");
            default:
              reject(error.response.data.message);
          }
        });
    }
  );

  const createAndEditClassAPI = () => new Promise((resolve, reject) => {
      const classAPI = API.CLIENT_UPDATE_CLASSES;
      const method = isUpdate === true ? "PATCH" : "POST";

      axios({
        method: method,
        url: classAPI,
        data: {
          class_id: creClassId,
          class_name: creClassName,
          code: creCode,
          start_year: creStartYear
        },
        withCredentials: true
      })
        .then(function(response) {
          console.log(response.data.success);
          if (response.data.success === true) {
            resolve(response.data.message);
          }
        })
        .catch((error) => {
          // setIsLoading(false);
          switch (error.response.data.code) {
            case 422:
              reject("The given data was invalid.");
            default:
              reject(error.response.data.message);
          }
        });
    }
  );

  const fetchClasses = (page = 1, perpage = 10) => {
    setClasses([]);
    setLoading(true);
    axios.get(`${API.CLIENT_GET_CLASSES}?page=${page}&perpage=${perpage}`, {
      withCredentials: true,
      cancelToken: cancelTokenSource.token
    })
      .then(function(response) {
        if (response.status === 200 && response.data.success === true) {
          const payload = response.data.classes;
          setLoading(false);
          setClasses(payload.data);
          setPagination(payload);
        }
      })
      .catch(function(error) {
        setLoading(false);
        console.log(error);
        if (typeof error === "TypeError") {
          console.log(error);
          return;
        }

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
          default:
            toast.error(error.response.data.message, {
              theme: "colored"
            });
            break;
        }
      });
  };

  const validateClassPayload = () => {
    const isValid = creCode.length > 0 && creClassName.length > 0 && creStartYear.length > 0;
    if (isUpdate && creClassId.length < 0)
      return false;
    return isValid === true && (parseInt(creStartYear) > 0);
  };

  const createClassSubmitted = () => {
    if (validateClassPayload()) {
      toast.promise(
        createAndEditClassAPI,
        {
          pending: "Please waiting...",
          success: {
            render({ data }) {
              fetchClasses();
              setCreClassName("");
              setCreStartYear("");
              setCreCode("");
              setIsUpdate(false);
              setVisibleNewClass(!visibleNewClass);
              return data;
            }
          },
          error: {
            render({ data }) {
              return data;
            }
          }
        }
      );
    } else
      toast.warning("You need to fill in the form!");
  };

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();
    if (classes.length <= 0) {
      fetchClasses(page, perpage);
    }
    if (isConfirmDialog && idRowForDelete != null) {
      console.log("Confirm has been clicked");
      console.log("ID WILL DEL: " + idRowForDelete);
      toast.promise(
        deleteRow(idRowForDelete),
        {
          pending: "Please waiting...",
          success: {
            render({ data }) {
              console.log("Deleted");
              setIsConfirmDialog(!isConfirmDialog);
              setIdRowForDelete(null);
              setVisibleConfirmDialog(!visibleConfirmDialog);
              return data;
            }
          },
          error: {
            render({ data }) {
              console.log("Delete failed");
              setIsConfirmDialog(!isConfirmDialog);
              setIdRowForDelete(null);
              setVisibleConfirmDialog(!visibleConfirmDialog);
              return data;
            }
          }
        }
      );
      // setIsConfirmDialog(!isConfirmDialog);
      // setIdRowForDelete(null);
      // deleteRow(idRowForDelete);
    } else {
      return;
    }

    return () => cancelTokenSource.cancel();
  }, [isConfirmDialog, idRowForDelete]);

  return (
    <CRow>
      <ConfirmDialog visible={visibleConfirmDialog} onClick={setVisibleConfirmDialog} onConfirm={setIsConfirmDialog} />
      <CModal alignment="center" visible={visibleNewClass} onClose={() => setVisibleNewClass(false)}>
        <CModalHeader>
          <CModalTitle>Class Form</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Class Name</CFormLabel>
              <CFormInput
                value={creClassName}
                onChange={(e) => setCreClassName(e.target.value)}
                type="text"
                placeholder="Class name" />
            </div>
            <div className="mb-3">
              <CFormLabel>Code</CFormLabel>
              <CFormInput
                value={creCode}
                onChange={(e) => setCreCode(e.target.value)}
                type="text"
                placeholder="Code of class" />
            </div>
            <div className="mb-3">
              <CFormLabel>Start Year</CFormLabel>
              <CFormInput
                value={creStartYear}
                onChange={(e) => setCreStartYear(e.target.value)}
                type="number"
                placeholder="Start year" />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleNewClass(false)}>
            Close
          </CButton>
          <CButton
            onClick={() => {
              createClassSubmitted();
            }}
            color="primary">Save changes</CButton>
        </CModalFooter>
      </CModal>
      <CCol xs={12}>
        <CCard className="mb-4">
          <div className="p-3">
            <CButton
              onClick={() => {
                setVisibleNewClass(!visibleNewClass);
              }}
              color="success">New</CButton>
          </div>
          <CCardHeader>List classes</CCardHeader>
          <CCardBody>
            <Table
              loading={loading}
              height={400}
              data={classes}
              id="table">
              <Table.Column width={50} align="center">
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.Cell dataKey="id" />
              </Table.Column>
              <Table.Column width={200}>
                <Table.HeaderCell>Major</Table.HeaderCell>
                <Table.Cell>
                  {
                    rowData => {
                      return rowData.major.major_name;
                    }
                  }
                </Table.Cell>
              </Table.Column>
              <Table.Column width={100}>
                <Table.HeaderCell>Major Code</Table.HeaderCell>
                <Table.Cell>
                  {
                    rowData => {
                      return rowData.major.major_code;
                    }
                  }
                </Table.Cell>
              </Table.Column>
              <Table.Column>
                <Table.HeaderCell>Class Name</Table.HeaderCell>
                <Table.Cell dataKey="class_name" />
              </Table.Column>
              <Table.Column>
                <Table.HeaderCell>Start Year</Table.HeaderCell>
                <Table.Cell dataKey="start_year" />
              </Table.Column>
              <Table.Column>
                <Table.HeaderCell>Code</Table.HeaderCell>
                <Table.Cell dataKey="code" />
              </Table.Column>
              <Table.Column width={200} fixed>
                <Table.HeaderCell>Transcript Total</Table.HeaderCell>
                <Table.Cell>
                  {
                    rowData => {
                      return rowData.transcripts.length > 0 ? `${rowData.transcripts.length} transcripts` : "0";
                    }
                  }
                </Table.Cell>
              </Table.Column>
              <Table.Column width={200} fixed>
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
    </CRow>
  );
};

export default Classes;
