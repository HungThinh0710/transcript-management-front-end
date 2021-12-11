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
        to: "/organization/user"
      },
      {
        component: CNavItem,
        name: "Subject",
        to: "/organization/user"
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
  ,{
    component: CNavItem,
    name: "Transcript Management",
    to: "/transcript/management",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />
  },
  {

    component: CNavGroup,
    name: "Base",
    to: "/base",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Accordion",
        to: "/base/accordion"
      },
    ]
  },
];

export default _nav;
