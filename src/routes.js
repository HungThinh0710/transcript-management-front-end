import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));

// Organization
// const OrganizationInformation = React.lazy(() => import('./views/organization/information'))
const OrganizationUsers = React.lazy(() => import("./views/organization/Users"));

// Classes
const Classes = React.lazy(() => import("./views/classes/ListClasses"));

// Transcript
const ListTranscript = React.lazy(() => import("./views/transcript/ListTranscript"));
const NewTranscript = React.lazy(() => import('./views/transcript/NewTranscript'));
const DetailTranscript = React.lazy(() => import('./views/transcript/DetailTranscript'));

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
  { path: "/transcript", name: "Transcript", component: ListTranscript, exact: true },
  { path: "/transcript/list", name: "List Transcript", component: ListTranscript, exact: true },
  { path: "/transcript/new", name: "New Transcript", component: NewTranscript, exact: true },
  { path: "/transcript/detail", name: "Detail Transcript", component: DetailTranscript, exact: true },
  { path: "/major", name: "Major", component: Dashboard, exact: true },
  { path: "/major/management", name: "Major Management", component: MajorManagement, exact: true },

];

export default routes;
