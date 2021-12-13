import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));

// Organization
// const OrganizationInformation = React.lazy(() => import('./views/organization/information'))
const OrganizationUsers = React.lazy(() => import("./views/organization/Users"));

// Classes
const Classes = React.lazy(() => import("./views/classes/ListClasses"));

// Transcript
const TranscriptManagement = React.lazy(() => import("./views/transcript/TranscriptManagement"));

// Major
const MajorManagement = React.lazy(() => import("./views/major/MajorManagement"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/organization", name: "Organization", component: Dashboard, exact: true },
  { path: "/organization/information", name: "Organization Information", component: Dashboard, exact: true },
  { path: "/organization/user", name: "Organization Users", component: OrganizationUsers, exact: true },
  { path: "/classes", name: "Classes", component: Dashboard, exact: true },
  { path: "/classes/list", name: "List Classes", component: Classes, exact: true },
  { path: "/transcript", name: "Transcript", component: Dashboard, exact: true },
  { path: "/transcript/management", name: "Transcript Management", component: TranscriptManagement, exact: true },
  { path: "/major", name: "Major", component: Dashboard, exact: true },
  { path: "/major/management", name: "Major Management", component: MajorManagement, exact: true },

];

export default routes;
