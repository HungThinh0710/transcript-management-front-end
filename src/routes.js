import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));

// Organization
// const OrganizationInformation = React.lazy(() => import('./views/organization/information'))
const OrganizationUsers = React.lazy(() => import("./views/organization/Users"));
const OrganizationSetting = React.lazy(() => import('./views/organization/Setting'));
// Classes
const Classes = React.lazy(() => import("./views/classes/ListClasses"));

// Transcript
const ListTranscript = React.lazy(() => import("./views/transcript/ListTranscript"));
const NewTranscript = React.lazy(() => import("./views/transcript/NewTranscript"));
const DetailTranscript = React.lazy(() => import("./views/transcript/DetailTranscript"));
const DetailTranscriptTraced = React.lazy(() => import("./views/transcript/DetailTranscriptTraced"));
const TraceTranscript = React.lazy(() => import("./views/transcript/TraceTranscript"));

// Major
const MajorManagement = React.lazy(() => import("./views/major/MajorManagement"));

// Subject
const SubjectManagement = React.lazy(() => import("./views/subject/Subject"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },

  { path: "/organization", name: "Organization", component: Dashboard, exact: true },
  { path: "/organization/information", name: "Organization Information", component: Dashboard, exact: true },
  { path: "/organization/user", name: "Organization Users", component: OrganizationUsers, exact: true },
  { path: "/organization/setting", name: "Organization Setting", component: OrganizationSetting, exact: true },

  { path: "/classes", name: "Classes", component: Dashboard, exact: true },
  { path: "/classes/list", name: "List Classes", component: Classes, exact: true },

  { path: "/transcript", name: "Transcript", component: ListTranscript, exact: true },
  { path: "/transcript/list", name: "List Transcript", component: ListTranscript, exact: true },
  { path: "/transcript/new", name: "New Transcript", component: NewTranscript, exact: true },
  { path: "/transcript/detail", name: "Detail Transcript", component: DetailTranscript, exact: true },
  { path: "/transcript/trace", name: "Trace Transcript", component: TraceTranscript, exact: true },
  { path: "/transcript/detail-traced", name: "Detail Transcript", component: DetailTranscriptTraced, exact: true },

  { path: "/major", name: "Major", component: Dashboard, exact: true },
  { path: "/major/management", name: "Major Management", component: MajorManagement, exact: true },

  { path: "/subject", name: "Subject", component: SubjectManagement, exact: true },
  { path: "/subject/management", name: "Subject", component: SubjectManagement, exact: true }
];

export default routes;
