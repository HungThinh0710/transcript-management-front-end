import React, { Suspense, useEffect, useState } from "react";
import { AppContent, AppSidebar, AppFooter, AppHeader } from "../components/index";
import { FetchAPI } from "../api/FetchAPI";
import * as API from "../api";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";

const DefaultLayout = () => {
  const history = useHistory();
  const [isFetched, setIsFetched] = useState(false);
  useEffect(() => {
    FetchAPI("GET", API.CLIENT_GET_USER)
      .then(user => {
        setIsFetched(true);
      })
      .catch(error => {
        if (error.status === 401) {
          setIsFetched(true);
          history.replace("/login");
        }
      });
  }, []);
  if (isFetched)
    return (<div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>);
  else
    return (<div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          {/*<AppContent />*/}
          <CContainer lg>
            <div className="text-center">
              <CSpinner color="warning" />
              <p style={{fontSize: '25px'}}>Checking Authentication...</p>
            </div>
          </CContainer>
        </div>
        <AppFooter />
      </div>
    </div>);
  // return (
  //
  // );
};

export default DefaultLayout;
