import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilBuilding,
  cilGroup,
  cilDescription,
  cilBriefcase,
  cilBook,
  cilWindow,
  cilInfo,
  cilBalanceScale,
  cilSettings,
  cilSpreadsheet,
  cilCode
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: "info",
      text: "NEW"
    }
  },
  {
    component: CNavTitle,
    name: "MY ORGANIZATION"
  },
  {
    component: CNavGroup,
    name: "Organization",
    to: "MY ORGANIZATION",
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Information",
        to: "/organization/information",
        icon: <CIcon icon={cilInfo} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: "Users",
        to: "/organization/user",
        icon: <CIcon icon={cilGroup} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: "Roles & Permission",
        to: "/organization/role-permission",
        icon: <CIcon icon={cilBalanceScale} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: "Settings",
        to: "/organization/setting",
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: "API",
        to: "/organization/setting",
        icon: <CIcon icon={cilCode} customClassName="nav-icon" />
      }
    ]
  },
  // {
  //   component: CNavItem,
  //   name: "Typography",
  //   to: "/theme/typography",
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />
  // },
  {
    component: CNavTitle,
    name: "TRANSCRIPT & RELATED"
  },
  // {
  //   component: CNavGroup,
  //   name: "Transcript Management",
  //   to: "/transcript/list",
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Transcript",
  //       to: "/transcript/list"
  //     },
  //     // {
  //     //   component: CNavItem,
  //     //   name: "New Transcript",
  //     //   to: "/transcript/new"
  //     // }
  //   ]
  // },
  {
    component: CNavItem,
    name: "Transcript Management",
    to: "/transcript/list",
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: "Major",
    to: "/major/management",
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: "Subject",
    to: "/subject/management",
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: "Classes",
    to: "/classes/list",
    icon: <CIcon icon={cilWindow} customClassName="nav-icon" />
  },
];

export default _nav;
