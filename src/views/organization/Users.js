import React, { useEffect, useRef, useState } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CBadge
} from "@coreui/react";
import { Table, Pagination } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import axios from 'axios';
import * as API from '../../api';
import { Redirect, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify';

const Users = () => {
  const [loading, setLoading] = React.useState(false);
  const [perpage, setPerpage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const history = useHistory();

  const cancelTokenSource = axios.CancelToken.source();

  const handleChangePerpage = dataKey => {
    setPerpage(dataKey);
    fetchUsers(page, dataKey);
  };

  const onChangePage = page => {
    setPage(page);
    fetchUsers(page, perpage);
  }

  const fetchUsers = (page = 1, perpage = 10) => {
    setUsers([]);
    setLoading(true);
    // addToast(showToast("Login failed", "Email or Password and Secret Key is required.", "red"))
    axios.get(`${API.CLIENT_GET_ORG_USER}?page=${page}&perpage=${perpage}`, {
      withCredentials: true,
      cancelToken: cancelTokenSource.token
    })
      .then(function (response) {
        if (response.status == 200 && response.data.success == true) {
          const payload = response.data.users;
          setLoading(false);
          setUsers(payload.data);
          setPagination(payload);
        }
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
        switch (error.response.status) {
          case 401:
            console.log("NOT LOGIN YET");
            toast.error('You are not logged in.', {
              theme: "colored"
            });
            history.push('/login');
            break;
          case 403:
            console.log("You do not have permission to do this action");
            toast.error(error.response.data.message, {
              theme: "colored"
            });
            history.push('/dashboard');
            break;
        }
      });

  }

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();
    fetchUsers(page, perpage)
    return () => cancelTokenSource.cancel();
  }, []);

  return (
    <CRow>
      {/*<CToaster ref={toaster} push={toast} placement="top-end" />*/}
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Users in organization</CCardHeader>
          <CCardBody>
            <Table
              loading={loading}
              height={400}
              data={users}
              id="table"
            >
              <Table.Column width={50} align="center" fixed>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.Cell dataKey="id" />
              </Table.Column>
              <Table.Column width={200} fixed>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.Cell dataKey="email" />
              </Table.Column>
              <Table.Column width={200} fixed>
                <Table.HeaderCell>Full Name</Table.HeaderCell>
                <Table.Cell dataKey="full_name" />
              </Table.Column>
              <Table.Column width={200} fixed>
                <Table.HeaderCell>Owner</Table.HeaderCell>
                <Table.Cell dataKey="is_owner" />
              </Table.Column>
              <Table.Column width={200} fixed>
                <Table.HeaderCell>Roles</Table.HeaderCell>
                <Table.Cell dataKey="roles">
                  {
                    rowData => {
                      let roleName = "Unknown";
                      if (rowData.roles.length > 0) {
                        const roles = rowData.roles;
                        roles.map(role => (roleName = role.name));
                      }
                      return <CBadge color="primary">{roleName}</CBadge>;
                    }
                  }
                </Table.Cell>
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
                layout={['total', '-', 'limit', '|', 'pager', 'skip']}
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
  )
}

export default Users
