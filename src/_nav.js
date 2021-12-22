import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar
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
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Information",
        to: "/organization/information"
      },
      {
        component: CNavItem,
        name: "Users",
        to: "/organization/user"
      },
      {
        component: CNavItem,
        name: "Major",
        to: "/major/management"
      },
      {
        component: CNavItem,
        name: "Subject",
        to: "/subject/management"
      },
      {
        component: CNavItem,
        name: "Classes",
        to: "/classes/list",
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: "Roles",
        to: "/base/carousels"
      },
      {
        component: CNavItem,
        name: "Settings",
        to: "/base/breadcrumbs"
      }
    ]
  },
  {
    component: CNavItem,
    name: "Typography",
    to: "/theme/typography",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />
  },
  {
    component: CNavTitle,
    name: "TRANSCRIPT"
  },
  {
    component: CNavGroup,
    name: "Transcript Management",
    to: "/transcript/list",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Transcript",
        to: "/transcript/list"
      },
      // {
      //   component: CNavItem,
      //   name: "New Transcript",
      //   to: "/transcript/new"
      // }
    ]
  },
  {
    component: CNavItem,
    name: "Transcript Management",
    to: "/transcript/management",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />
  }
];

export default _nav;
