var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  entry: () => entry,
  routes: () => routes
});

// node_modules/@remix-run/dev/compiler/shims/react.ts
var React = __toESM(require("react"));

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_react = require("@remix-run/react");
var import_server = require("react-dom/server");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  const markup = (0, import_server.renderToString)(/* @__PURE__ */ React.createElement(import_react.RemixServer, {
    context: remixContext,
    url: request.url
  }));
  responseHeaders.set("Content-Type", "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// route:/Users/andreas/Development/linje/app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
var import_node2 = require("@remix-run/node");
var import_react2 = require("@remix-run/react");

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-GMDEFBOK.css";

// app/session.server.ts
var import_node = require("@remix-run/node");
var import_tiny_invariant = __toESM(require("tiny-invariant"));

// app/models/user.server.ts
var import_bcryptjs = __toESM(require("bcryptjs"));

// app/db.server.ts
var import_client = require("@prisma/client");
var prisma;
if (false) {
  prisma = new import_client.PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new import_client.PrismaClient();
  }
  prisma = global.__prisma;
}

// app/models/user.server.ts
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
async function createUser(email, password) {
  const hashedPassword = await import_bcryptjs.default.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });
}
async function verifyLogin(email, password) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true
    }
  });
  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }
  const isValid = await import_bcryptjs.default.compare(password, userWithPassword.password.hash);
  if (!isValid) {
    return null;
  }
  const _a = userWithPassword, { password: _password } = _a, userWithoutPassword = __objRest(_a, ["password"]);
  return userWithoutPassword;
}

// app/session.server.ts
(0, import_tiny_invariant.default)(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
var sessionStorage = (0, import_node.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: false
  }
});
var USER_SESSION_KEY = "userId";
async function getSession(request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
async function getUserId(request) {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}
async function getUser(request) {
  const userId = await getUserId(request);
  if (userId === void 0)
    return null;
  const user = await getUserById(userId);
  if (user)
    return user;
  throw await logout(request);
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw (0, import_node.redirect)(`/login?${searchParams}`);
  }
  return userId;
}
async function createUserSession({
  request,
  userId,
  remember,
  redirectTo
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return (0, import_node.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : void 0
      })
    }
  });
}
async function logout(request) {
  const session = await getSession(request);
  return (0, import_node.redirect)("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

// route:/Users/andreas/Development/linje/app/root.tsx
var links = () => {
  return [{ rel: "stylesheet", href: tailwind_default }];
};
var meta = () => ({
  charset: "utf-8",
  title: "Linje",
  viewport: "width=device-width,initial-scale=1"
});
var loader = async ({ request }) => {
  return (0, import_node2.json)({
    user: await getUser(request)
  });
};
function App() {
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en",
    className: "h-full bg-gray-100"
  }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement(import_react2.Meta, null), /* @__PURE__ */ React.createElement(import_react2.Links, null)), /* @__PURE__ */ React.createElement("body", {
    className: "h-full"
  }, /* @__PURE__ */ React.createElement(import_react2.Outlet, null), /* @__PURE__ */ React.createElement(import_react2.ScrollRestoration, null), /* @__PURE__ */ React.createElement(import_react2.Scripts, null), /* @__PURE__ */ React.createElement(import_react2.LiveReload, null)));
}

// route:/Users/andreas/Development/linje/app/routes/timeline.$timelineId.edit.tsx
var timeline_timelineId_edit_exports = {};
__export(timeline_timelineId_edit_exports, {
  action: () => action,
  default: () => EditTimelinePage,
  loader: () => loader2
});
var import_outline4 = require("@heroicons/react/outline");
var import_node3 = require("@remix-run/node");
var import_react10 = require("@remix-run/react");
var React2 = __toESM(require("react"));
var import_tiny_invariant2 = __toESM(require("tiny-invariant"));

// app/components/page.tsx
var import_react9 = require("react");
var import_outline3 = require("@heroicons/react/outline");

// app/components/navbar.tsx
var import_react3 = require("@headlessui/react");
var import_outline = require("@heroicons/react/outline");
var import_solid = require("@heroicons/react/solid");
var import_react4 = require("@remix-run/react");
var import_react5 = require("react");
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function Navbar({
  setMobileMenuOpen
}) {
  return /* @__PURE__ */ React.createElement("header", {
    className: "w-full"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex relative z-10 shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: "px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden",
    onClick: () => setMobileMenuOpen(true)
  }, /* @__PURE__ */ React.createElement("span", {
    className: "sr-only"
  }, "Open sidebar"), /* @__PURE__ */ React.createElement(import_outline.MenuAlt2Icon, {
    className: "w-6 h-6",
    "aria-hidden": "true"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-1 justify-between px-4 sm:px-6"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-1"
  }, /* @__PURE__ */ React.createElement("form", {
    className: "flex w-full md:ml-0",
    action: "#",
    method: "GET"
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "search-field",
    className: "sr-only"
  }, "Search all files"), /* @__PURE__ */ React.createElement("div", {
    className: "relative w-full text-gray-400 focus-within:text-gray-600"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex absolute inset-y-0 left-0 items-center pointer-events-none"
  }, /* @__PURE__ */ React.createElement(import_solid.SearchIcon, {
    className: "shrink-0 w-5 h-5",
    "aria-hidden": "true"
  })), /* @__PURE__ */ React.createElement("input", {
    name: "search-field",
    id: "search-field",
    className: "py-2 pr-3 pl-8 w-full h-full text-base text-gray-900 placeholder:text-gray-500 focus:placeholder:text-gray-400 border-transparent focus:border-transparent focus:outline-none focus:ring-0",
    placeholder: "Search",
    type: "search"
  })))), /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center ml-2 space-x-4 sm:ml-6 sm:space-x-6"
  }, /* @__PURE__ */ React.createElement(import_react3.Menu, {
    as: "div",
    className: "relative shrink-0"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(import_react3.Menu.Button, {
    className: "flex text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "sr-only"
  }, "Open user menu"), /* @__PURE__ */ React.createElement("img", {
    className: "w-8 h-8 rounded-full",
    src: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    alt: ""
  }))), /* @__PURE__ */ React.createElement(import_react3.Transition, {
    as: import_react5.Fragment,
    enter: "transition ease-out duration-100",
    enterFrom: "transform opacity-0 scale-95",
    enterTo: "transform opacity-100 scale-100",
    leave: "transition ease-in duration-75",
    leaveFrom: "transform opacity-100 scale-100",
    leaveTo: "transform opacity-0 scale-95"
  }, /* @__PURE__ */ React.createElement(import_react3.Menu.Items, {
    className: "absolute right-0 py-1 mt-2 w-48 bg-white rounded-md focus:outline-none ring-1 ring-black/5 shadow-lg origin-top-right"
  }, /* @__PURE__ */ React.createElement(import_react3.Menu.Item, null, ({ active }) => /* @__PURE__ */ React.createElement(import_react4.NavLink, {
    className: classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700"),
    to: "/profile"
  }, "Profile")), /* @__PURE__ */ React.createElement(import_react3.Menu.Item, null, ({ active }) => /* @__PURE__ */ React.createElement(import_react4.Form, {
    action: "/logout",
    method: "post"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: classNames(active ? "bg-gray-100" : "", "flex w-full px-4 py-2 text-sm text-gray-700")
  }, "Logout"))))))))));
}

// app/components/content.tsx
function Content({
  children,
  actions,
  description,
  setMobileMenuOpen,
  title
}) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex overflow-hidden flex-col flex-1"
  }, /* @__PURE__ */ React.createElement(Navbar, {
    setMobileMenuOpen
  }), /* @__PURE__ */ React.createElement("div", {
    className: "flex overflow-hidden flex-1 items-stretch"
  }, /* @__PURE__ */ React.createElement("main", {
    className: "overflow-y-auto flex-1 p-4"
  }, /* @__PURE__ */ React.createElement("section", {
    "aria-labelledby": "primary-heading",
    className: "flex flex-col flex-1 min-w-0 h-full lg:order-last"
  }, /* @__PURE__ */ React.createElement("h1", {
    id: "primary-heading",
    className: "sr-only"
  }, title), /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-between"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-3xl font-bold"
  }, title), /* @__PURE__ */ React.createElement("h3", null, description)), /* @__PURE__ */ React.createElement("div", {
    className: "flex items-start"
  }, actions)), /* @__PURE__ */ React.createElement("div", {
    className: "mt-4"
  }, children)))));
}

// app/components/mobile-menu.tsx
var import_react6 = require("@headlessui/react");
var import_outline2 = require("@heroicons/react/outline");
var import_react7 = require("react");
function classNames2(...classes) {
  return classes.filter(Boolean).join(" ");
}
function MobileMenu({
  sidebarNavigation: sidebarNavigation2,
  mobileMenuOpen,
  setMobileMenuOpen
}) {
  return /* @__PURE__ */ React.createElement(import_react6.Transition.Root, {
    show: mobileMenuOpen,
    as: import_react7.Fragment
  }, /* @__PURE__ */ React.createElement(import_react6.Dialog, {
    as: "div",
    className: "relative z-20 md:hidden",
    onClose: setMobileMenuOpen
  }, /* @__PURE__ */ React.createElement(import_react6.Transition.Child, {
    as: import_react7.Fragment,
    enter: "transition-opacity ease-linear duration-300",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "transition-opacity ease-linear duration-300",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "fixed inset-0 bg-gray-600/75"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "flex fixed inset-0 z-40"
  }, /* @__PURE__ */ React.createElement(import_react6.Transition.Child, {
    as: import_react7.Fragment,
    enter: "transition ease-in-out duration-300 transform",
    enterFrom: "-translate-x-full",
    enterTo: "translate-x-0",
    leave: "transition ease-in-out duration-300 transform",
    leaveFrom: "translate-x-0",
    leaveTo: "-translate-x-full"
  }, /* @__PURE__ */ React.createElement(import_react6.Dialog.Panel, {
    className: "flex relative flex-col flex-1 pt-5 pb-4 w-full max-w-xs bg-indigo-700"
  }, /* @__PURE__ */ React.createElement(import_react6.Transition.Child, {
    as: import_react7.Fragment,
    enter: "ease-in-out duration-300",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "ease-in-out duration-300",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "absolute top-1 right-0 p-1 -mr-14"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: "flex justify-center items-center w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-white",
    onClick: () => setMobileMenuOpen(false)
  }, /* @__PURE__ */ React.createElement(import_outline2.XIcon, {
    className: "w-6 h-6 text-white",
    "aria-hidden": "true"
  }), /* @__PURE__ */ React.createElement("span", {
    className: "sr-only"
  }, "Close sidebar")))), /* @__PURE__ */ React.createElement("div", {
    className: "flex shrink-0 items-center px-4"
  }, /* @__PURE__ */ React.createElement("img", {
    className: "w-auto h-8",
    src: "https://tailwindui.com/img/logos/workflow-mark.svg?color=white",
    alt: "Workflow"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "overflow-y-auto flex-1 px-2 mt-5 h-0"
  }, /* @__PURE__ */ React.createElement("nav", {
    className: "flex flex-col h-full"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "space-y-1"
  }, sidebarNavigation2.map((item) => /* @__PURE__ */ React.createElement("a", {
    key: item.name,
    href: item.to,
    className: classNames2(item.current ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-800 hover:text-white", "group flex items-center rounded-md py-2 px-3 text-sm font-medium"),
    "aria-current": item.current ? "page" : void 0
  }, /* @__PURE__ */ React.createElement(item.icon, {
    className: classNames2(item.current ? "text-white" : "text-indigo-300 group-hover:text-white", "mr-3 h-6 w-6"),
    "aria-hidden": "true"
  }), /* @__PURE__ */ React.createElement("span", null, item.name)))))))), /* @__PURE__ */ React.createElement("div", {
    className: "shrink-0 w-14",
    "aria-hidden": "true"
  }))));
}

// app/components/sidebar.tsx
var import_react8 = require("@remix-run/react");
function classNames3(...classes) {
  return classes.filter(Boolean).join(" ");
}
function Sidebar({
  sidebarNavigation: sidebarNavigation2
}) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "hidden overflow-y-auto w-28 bg-indigo-700 md:block"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col items-center py-6 w-full"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex shrink-0 items-center"
  }, /* @__PURE__ */ React.createElement(import_react8.Link, {
    to: "/"
  }, /* @__PURE__ */ React.createElement("img", {
    className: "w-auto h-8",
    src: "https://tailwindui.com/img/logos/workflow-mark.svg?color=white",
    alt: "Workflow"
  }))), /* @__PURE__ */ React.createElement("div", {
    className: "flex-1 px-2 mt-6 space-y-1 w-full"
  }, sidebarNavigation2.map((item) => /* @__PURE__ */ React.createElement(import_react8.NavLink, {
    key: item.name,
    to: item.to,
    className: ({ isActive }) => `group flex w-full flex-col items-center rounded-md p-3 text-xs font-medium ${isActive ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-800 hover:text-white"}`
  }, /* @__PURE__ */ React.createElement(item.icon, {
    className: classNames3(item.current ? "text-white" : "text-indigo-300 group-hover:text-white", "h-6 w-6"),
    "aria-hidden": "true"
  }), /* @__PURE__ */ React.createElement("span", {
    className: "mt-2"
  }, item.name))))));
}

// app/components/page.tsx
var sidebarNavigation = [
  { name: "Timelines", to: "/timelines", icon: import_outline3.HomeIcon, current: false },
  { name: "Events", to: "/events", icon: import_outline3.ViewGridIcon, current: false },
  { name: "People", to: "/people", icon: import_outline3.PhotographIcon, current: true }
];
function Page({
  children,
  actions,
  description,
  title
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react9.useState)(false);
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex h-full"
  }, /* @__PURE__ */ React.createElement(Sidebar, {
    sidebarNavigation
  }), /* @__PURE__ */ React.createElement(MobileMenu, {
    setMobileMenuOpen,
    mobileMenuOpen,
    sidebarNavigation
  }), /* @__PURE__ */ React.createElement(Content, {
    description,
    title,
    actions,
    setMobileMenuOpen
  }, children));
}

// app/models/timeline.server.ts
function getTimeline({
  createdById,
  id
}) {
  return prisma.timeline.findFirst({
    where: {
      id,
      createdById
    }
  });
}
async function getTimelineListItems({ userId }) {
  const timelines = await prisma.timeline.findMany({
    where: { createdById: userId },
    include: {
      _count: {
        select: { event: true }
      }
    },
    orderBy: { updatedAt: "desc" }
  });
  return timelines;
}
function createTimeline({
  description,
  title,
  userId
}) {
  return prisma.timeline.create({
    data: {
      title,
      description,
      createdById: userId
    }
  });
}
function updateTimeline({
  id,
  description,
  title
}) {
  return prisma.timeline.update({
    where: {
      id
    },
    data: {
      description,
      title
    }
  });
}
function deleteTimeline({
  id,
  userId
}) {
  return prisma.timeline.deleteMany({
    where: { id, createdById: userId }
  });
}

// route:/Users/andreas/Development/linje/app/routes/timeline.$timelineId.edit.tsx
var loader2 = async ({ request, params }) => {
  const userId = await requireUserId(request);
  (0, import_tiny_invariant2.default)(params.timelineId, "timelineId not found");
  const timeline = await getTimeline({
    createdById: userId,
    id: params.timelineId
  });
  if (!timeline) {
    throw new Response("Not Found", { status: 404 });
  }
  return (0, import_node3.json)({ timeline });
};
var action = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const id = formData.get("timelineId");
  if (typeof title !== "string" || title.length === 0) {
    return (0, import_node3.json)({ errors: { title: "Title is required" } }, { status: 400 });
  }
  if (typeof description !== "string" || description.length === 0) {
    return (0, import_node3.json)({ errors: { description: "Description is required" } }, { status: 400 });
  }
  if (typeof id !== "string" || id.length === 0) {
    return (0, import_node3.json)({ errors: { description: "id is required" } }, { status: 400 });
  }
  const timeline = await updateTimeline({ title, description, userId, id });
  return (0, import_node3.redirect)(`/timeline/${timeline.id}/events`);
};
function EditTimelinePage() {
  var _a, _b, _c, _d, _e, _f, _g;
  const data = (0, import_react10.useLoaderData)();
  const actionData = (0, import_react10.useActionData)();
  const titleRef = React2.useRef(null);
  const descriptionRef = React2.useRef(null);
  React2.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    if ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.title) {
      (_b2 = titleRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.description) {
      (_d2 = descriptionRef.current) == null ? void 0 : _d2.focus();
    }
  }, [actionData]);
  return /* @__PURE__ */ React2.createElement(Page, {
    title: "Edit Timeline"
  }, /* @__PURE__ */ React2.createElement(import_react10.Form, {
    method: "post",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%"
    }
  }, /* @__PURE__ */ React2.createElement("input", {
    type: "hidden",
    name: "timelineId",
    value: data.timeline.id
  }), /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("label", {
    htmlFor: "title",
    className: "block text-sm font-medium text-gray-700"
  }, "Title:"), /* @__PURE__ */ React2.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React2.createElement("input", {
    id: "title",
    ref: titleRef,
    name: "title",
    className: "flex-1 px-3 text-lg leading-loose rounded-md border-2 border-blue-500",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.title) ? true : void 0,
    "aria-errormessage": ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.title) ? "title-error" : void 0,
    defaultValue: data.timeline.title,
    "aria-describedby": "email-error"
  }), ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.title) && /* @__PURE__ */ React2.createElement("div", {
    className: "flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none"
  }, /* @__PURE__ */ React2.createElement(import_outline4.ExclamationCircleIcon, {
    className: "w-5 h-5 text-red-500",
    "aria-hidden": "true"
  })), ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.title) && /* @__PURE__ */ React2.createElement("p", {
    className: "mt-2 text-sm text-red-600",
    id: "title-error"
  }, actionData.errors.title))), /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("label", {
    htmlFor: "comment",
    className: "block text-sm font-medium text-gray-700"
  }, "Description"), /* @__PURE__ */ React2.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React2.createElement("textarea", {
    rows: 4,
    name: "description",
    ref: descriptionRef,
    className: "block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm sm:text-sm",
    defaultValue: data.timeline.description,
    "aria-invalid": ((_e = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _e.description) ? true : void 0,
    "aria-errormessage": ((_f = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _f.description) ? "body-error" : void 0
  })), ((_g = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _g.description) && /* @__PURE__ */ React2.createElement("div", {
    className: "pt-1 text-red-700",
    id: "body-error"
  }, actionData.errors.description)), /* @__PURE__ */ React2.createElement("div", {
    className: "text-right"
  }, /* @__PURE__ */ React2.createElement("button", {
    type: "submit",
    className: "py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-400 rounded"
  }, "Save"))));
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId.tsx
var timelineId_exports = {};
__export(timelineId_exports, {
  CatchBoundary: () => CatchBoundary,
  ErrorBoundary: () => ErrorBoundary,
  action: () => action2,
  default: () => TimelineDetailsPage,
  loader: () => loader3
});
var import_outline5 = require("@heroicons/react/outline");
var import_node4 = require("@remix-run/node");
var import_react11 = require("@remix-run/react");
var import_tiny_invariant3 = __toESM(require("tiny-invariant"));
var loader3 = async ({ request, params }) => {
  const userId = await requireUserId(request);
  (0, import_tiny_invariant3.default)(params.timelineId, "timelineId not found");
  const timeline = await getTimeline({
    createdById: userId,
    id: params.timelineId
  });
  if (!timeline) {
    throw new Response("Not Found", { status: 404 });
  }
  return (0, import_node4.json)({ timeline });
};
var action2 = async ({ request, params }) => {
  const userId = await requireUserId(request);
  (0, import_tiny_invariant3.default)(params.timelineId, "timelineId not found");
  await deleteTimeline({ userId, id: params.timelineId });
  return (0, import_node4.redirect)("/timelines");
};
function TimelineDetailsPage() {
  const data = (0, import_react11.useLoaderData)();
  return /* @__PURE__ */ React.createElement(Page, {
    description: data.timeline.description,
    title: data.timeline.title,
    actions: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(import_react11.Link, {
      to: "/timelines",
      className: "inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-sm"
    }, /* @__PURE__ */ React.createElement(import_outline5.XIcon, {
      className: "mr-2 -ml-0.5 w-4 h-4",
      "aria-hidden": "true"
    }), "Close"), /* @__PURE__ */ React.createElement(import_react11.Form, {
      method: "post"
    }, /* @__PURE__ */ React.createElement("button", {
      type: "submit",
      className: "inline-flex items-center py-2 px-4 ml-3 text-sm font-medium text-white bg-red-600 hover:bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-sm"
    }, /* @__PURE__ */ React.createElement(import_outline5.TrashIcon, {
      className: "mr-2 -ml-0.5 w-4 h-4",
      "aria-hidden": "true"
    }), "Delete")), /* @__PURE__ */ React.createElement(import_react11.Link, {
      to: "edit",
      className: "inline-flex items-center py-2 px-4 ml-3 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-orange-800 shadow-sm"
    }, /* @__PURE__ */ React.createElement(import_outline5.PencilIcon, {
      className: "mr-2 -ml-0.5 w-4 h-4",
      "aria-hidden": "true"
    }), "Edit"))
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    className: "sm:hidden"
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "tabs",
    className: "sr-only"
  }, "Select a tab"), /* @__PURE__ */ React.createElement("select", {
    id: "tabs",
    name: "tabs",
    className: "block py-2 pr-10 pl-3 w-full text-base rounded-md border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm",
    defaultValue: "events"
  }, /* @__PURE__ */ React.createElement("option", null, "Events"), /* @__PURE__ */ React.createElement("option", null, "People"), /* @__PURE__ */ React.createElement("option", null, "Places"))), /* @__PURE__ */ React.createElement("div", {
    className: "hidden sm:block"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "border-b border-gray-200"
  }, /* @__PURE__ */ React.createElement("nav", {
    className: "flex -mb-px space-x-8",
    "aria-label": "Tabs"
  }, /* @__PURE__ */ React.createElement(import_react11.NavLink, {
    to: "events",
    className: ({ isActive }) => `flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${isActive ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"}`
  }, "Events"), /* @__PURE__ */ React.createElement(import_react11.NavLink, {
    to: "places",
    className: ({ isActive }) => `flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${isActive ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"}`
  }, "Places"), /* @__PURE__ */ React.createElement(import_react11.NavLink, {
    to: "people",
    className: ({ isActive }) => `flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${isActive ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"}`
  }, "People"))))), /* @__PURE__ */ React.createElement(import_react11.Outlet, null));
}
function ErrorBoundary({ error }) {
  console.error(error);
  return /* @__PURE__ */ React.createElement("div", null, "An unexpected error occurred: ", error.message);
}
function CatchBoundary() {
  const caught = (0, import_react11.useCatch)();
  if (caught.status === 404) {
    return /* @__PURE__ */ React.createElement("div", null, "Timeline not found");
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events.tsx
var events_exports = {};
__export(events_exports, {
  default: () => EventsTab,
  loader: () => loader4
});
var import_outline6 = require("@heroicons/react/outline");
var import_react12 = require("@remix-run/react");
var import_server_runtime = require("@remix-run/server-runtime");
var import_tiny_invariant4 = __toESM(require("tiny-invariant"));

// app/models/event.server.ts
function getEventsList(timelineId) {
  return prisma.event.findMany({
    where: { timelineId },
    orderBy: { title: "desc" },
    include: {
      _count: true,
      location: {
        select: {
          title: true
        }
      }
    }
  });
}
function getEvent(id) {
  return prisma.event.findFirst({
    where: { id },
    include: {
      location: true
    }
  });
}
function getEventListItems({
  timelineId
}) {
  return prisma.event.findMany({
    where: { timelineId },
    orderBy: { startDate: "desc" },
    include: {
      location: true
    }
  });
}
async function createEvent({
  data,
  eventId,
  timelineId
}) {
  return await prisma.event.create({
    data: {
      startDate: data.startDate,
      title: data.title,
      content: data.content,
      location: {
        connect: {
          id: eventId
        }
      },
      timeline: {
        connect: {
          id: timelineId
        }
      }
    }
  });
}
function updateEvent(data, id) {
  return prisma.event.update({
    where: { id },
    data: {
      content: data.content,
      startDate: data.startDate,
      title: data.title
    }
  });
}
function deleteEvent(id) {
  return prisma.event.delete({
    where: {
      id
    }
  });
}

// app/models/location.server.ts
async function getLocationsForEvent(id) {
  return await prisma.location.findMany({
    where: {
      events: {
        some: {
          id
        }
      }
    }
  });
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events.tsx
var loader4 = async ({ request, params }) => {
  await requireUserId(request);
  (0, import_tiny_invariant4.default)(params.timelineId, "timelineId not found");
  const events = await getEventListItems({ timelineId: params.timelineId });
  const locations = await getLocationsForEvent(events[0].id);
  return (0, import_server_runtime.json)({
    events,
    locations
  });
};
function EventsTab() {
  const data = (0, import_react12.useLoaderData)();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: "flex overflow-hidden flex-1 items-stretch"
  }, /* @__PURE__ */ React.createElement("main", {
    className: "overflow-y-auto flex-1 p-4"
  }, /* @__PURE__ */ React.createElement("section", {
    className: "flex flex-col flex-1 min-w-0 h-full lg:order-last"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-between"
  }, /* @__PURE__ */ React.createElement(import_react12.Link, {
    to: "new",
    className: "flex items-center py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-sm"
  }, /* @__PURE__ */ React.createElement(import_outline6.PlusIcon, {
    className: "mr-3 -ml-1 w-5 h-5",
    "aria-hidden": "true"
  }), "Add Event")), data.events.length > 0 ? /* @__PURE__ */ React.createElement("div", {
    className: "overflow-hidden mt-4 bg-white shadow sm:rounded-md"
  }, /* @__PURE__ */ React.createElement("ul", {
    className: "divide-y divide-gray-200"
  }, data.events.map((event) => /* @__PURE__ */ React.createElement("li", {
    key: event.title
  }, /* @__PURE__ */ React.createElement(import_react12.Link, {
    to: event.id,
    className: "block hover:bg-gray-50"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center p-4 sm:px-6"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-1 items-center min-w-0"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex-1 px-4 min-w-0 md:grid md:grid-cols-2 md:gap-4"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", {
    className: "text-sm font-medium text-indigo-600 truncate"
  }, event.title), /* @__PURE__ */ React.createElement("p", {
    className: "flex items-center mt-2 text-sm text-gray-500"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "truncate"
  }, new Intl.DateTimeFormat("sv-SE").format(new Date(event.startDate)))), /* @__PURE__ */ React.createElement("p", null, data.locations.map((l) => l.title))), /* @__PURE__ */ React.createElement("div", {
    className: "hidden md:block"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", {
    className: "text-sm text-gray-900"
  }, event.content))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(import_outline6.ChevronRightIcon, {
    className: "w-5 h-5 text-gray-400",
    "aria-hidden": "true"
  })))))))) : /* @__PURE__ */ React.createElement("p", null, "No events"))), /* @__PURE__ */ React.createElement("aside", {
    className: "hidden overflow-y-auto p-4 w-96 border-l border-gray-200 lg:block"
  }, /* @__PURE__ */ React.createElement(import_react12.Outlet, null))));
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events/$eventId.edit.tsx
var eventId_edit_exports = {};
__export(eventId_edit_exports, {
  action: () => action3,
  default: () => EditEvent,
  loader: () => loader5
});
var import_node5 = require("@remix-run/node");
var import_react14 = require("@remix-run/react");
var React3 = __toESM(require("react"));
var import_tiny_invariant5 = __toESM(require("tiny-invariant"));

// app/components/event-card.tsx
var import_react13 = require("@remix-run/react");
function EventCard({
  content,
  onDeleteClick,
  startDate,
  title
}) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: "p-4 bg-white"
  }, /* @__PURE__ */ React.createElement("h3", {
    className: "mb-4 text-2xl font-bold"
  }, "Title: ", title), /* @__PURE__ */ React.createElement("p", null, "Content: ", content), /* @__PURE__ */ React.createElement("p", null, "Start Date:", " ", new Intl.DateTimeFormat("sv-SE").format(new Date(startDate))), /* @__PURE__ */ React.createElement("hr", {
    className: "my-4"
  }), /* @__PURE__ */ React.createElement(import_react13.Link, {
    to: "edit",
    className: "py-2 px-4 text-white bg-orange-500 hover:bg-orange-600 focus:bg-orange-400 rounded"
  }, "Edit"), onDeleteClick && /* @__PURE__ */ React.createElement("button", {
    disabled: !onDeleteClick,
    onClick: () => onDeleteClick(),
    type: "button",
    className: "py-2 px-4 text-white bg-red-500 hover:bg-red-600 focus:bg-red-400 rounded"
  }, "Delete")));
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events/$eventId.edit.tsx
function validateEventTitle(title) {
  if (title.length === 0) {
    return "You must add a title";
  }
}
function validateEventContent(content) {
  if (typeof content !== "string") {
    return "Content must be a string";
  }
}
function validateEventStartDate(startDate) {
  if (startDate.length === 0) {
    return "You must select a start date";
  }
}
var loader5 = async ({ request, params }) => {
  await requireUserId(request);
  (0, import_tiny_invariant5.default)(params.eventId, "eventId not found");
  const event = await getEvent(params.eventId);
  const availableEvents = await getEventsList(params.eventId);
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return (0, import_node5.json)({ event, availableEvents });
};
var badRequest = (data) => (0, import_node5.json)(data, { status: 400 });
var action3 = async ({ request, params }) => {
  await requireUserId(request);
  const formData = await request.formData();
  const timelineId = params.timelineId;
  (0, import_tiny_invariant5.default)(timelineId, "Timeline ID is required");
  const eventId = params.eventId;
  (0, import_tiny_invariant5.default)(eventId, "Event ID is required");
  const title = formData.get("title");
  const content = formData.get("content");
  const startDate = formData.get("startDate");
  if (typeof title !== "string" || typeof content !== "string" || typeof startDate !== "string") {
    return badRequest({
      formError: `Form not submitted correctly.`
    });
  }
  const fieldErrors = {
    title: validateEventTitle(title),
    content: validateEventContent(content),
    startDate: validateEventStartDate(startDate)
  };
  const fields = { title, content, startDate, timelineId };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }
  await updateEvent({ content, startDate: new Date(startDate), title }, eventId);
  return (0, import_node5.redirect)(`/timeline/${params.timelineId}/events/${params.eventId}`);
};
function EditEvent() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const data = (0, import_react14.useLoaderData)();
  const transition = (0, import_react14.useTransition)();
  const actionData = (0, import_react14.useActionData)();
  const titleRef = React3.useRef(null);
  const contentRef = React3.useRef(null);
  const startDateRef = React3.useRef(null);
  React3.useEffect(() => {
    var _a2, _b2, _c2, _d2, _e2, _f2;
    if ((_a2 = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _a2.title) {
      (_b2 = titleRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c2 = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c2.content) {
      (_d2 = contentRef.current) == null ? void 0 : _d2.focus();
    } else if ((_e2 = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _e2.startDate) {
      (_f2 = startDateRef.current) == null ? void 0 : _f2.focus();
    }
  }, [actionData]);
  if (transition.submission) {
    const title = transition.submission.formData.get("title");
    const content = transition.submission.formData.get("content");
    const startDate = transition.submission.formData.get("startDate");
    if (typeof title === "string" && typeof content === "string" && typeof startDate === "string" && !validateEventTitle(title) && !validateEventContent(content) && !validateEventStartDate(startDate)) {
      return /* @__PURE__ */ React3.createElement(EventCard, {
        content,
        startDate: new Date(startDate),
        title
      });
    }
  }
  return /* @__PURE__ */ React3.createElement(import_react14.Form, {
    method: "post",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%"
    }
  }, /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("label", {
    className: "flex flex-col gap-1 w-full"
  }, /* @__PURE__ */ React3.createElement("span", null, "Title: "), /* @__PURE__ */ React3.createElement("input", {
    defaultValue: data.event.title,
    ref: titleRef,
    name: "title",
    className: "flex-1 px-3 text-lg leading-loose rounded-md border-2 border-blue-500",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _a.title) ? true : void 0,
    "aria-errormessage": ((_b = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _b.title) ? "title-error" : void 0
  })), ((_c = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c.title) && /* @__PURE__ */ React3.createElement("div", {
    className: "pt-1 text-red-700",
    id: "title-error"
  }, (_d = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _d.title)), /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("label", {
    className: "flex flex-col gap-1 w-full"
  }, /* @__PURE__ */ React3.createElement("span", null, "Content: "), /* @__PURE__ */ React3.createElement("textarea", {
    defaultValue: data.event.content || "",
    ref: contentRef,
    name: "content",
    rows: 4,
    className: "flex-1 py-2 px-3 w-full text-lg leading-6 rounded-md border-2 border-blue-500",
    "aria-invalid": ((_e = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _e.content) ? true : void 0,
    "aria-errormessage": ((_f = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _f.content) ? "body-error" : void 0
  })), ((_g = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _g.content) && /* @__PURE__ */ React3.createElement("div", {
    className: "pt-1 text-red-700",
    id: "body-error"
  }, (_h = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _h.content)), /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("label", {
    className: "flex flex-col gap-1 w-full"
  }, /* @__PURE__ */ React3.createElement("span", null, "Start Date: "), /* @__PURE__ */ React3.createElement("input", {
    ref: startDateRef,
    type: "date",
    defaultValue: new Intl.DateTimeFormat("sv-SV").format(new Date(data.event.startDate)),
    name: "startDate",
    className: "flex-1 px-3 text-lg leading-loose rounded-md border-2 border-blue-500",
    "aria-invalid": ((_i = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _i.startDate) ? true : void 0,
    "aria-errormessage": ((_j = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _j.startDate) ? "body-error" : void 0
  })), ((_k = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _k.startDate) && /* @__PURE__ */ React3.createElement("div", {
    className: "pt-1 text-red-700",
    id: "body-error"
  }, (_l = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _l.startDate)), /* @__PURE__ */ React3.createElement("div", {
    className: "text-right"
  }, /* @__PURE__ */ React3.createElement("button", {
    type: "submit",
    className: "py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-400 rounded"
  }, "Saves")));
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events/$eventId.tsx
var eventId_exports = {};
__export(eventId_exports, {
  CatchBoundary: () => CatchBoundary2,
  ErrorBoundary: () => ErrorBoundary2,
  action: () => action4,
  default: () => EventDetailsPage,
  loader: () => loader6
});
var import_solid2 = require("@heroicons/react/solid");
var import_node6 = require("@remix-run/node");
var import_react17 = require("@remix-run/react");
var import_react18 = require("react");
var import_tiny_invariant6 = __toESM(require("tiny-invariant"));

// app/components/delete-event-dialog.tsx
var import_react15 = require("@headlessui/react");
var import_react16 = require("react");
function DeleteEventDialog({
  isOpen,
  onCloseClick,
  description,
  deleteButton,
  leftButton,
  rightButton,
  icon,
  title
}) {
  const cancelButtonRef = (0, import_react16.useRef)(null);
  function handleClick() {
    onCloseClick();
  }
  return /* @__PURE__ */ React.createElement(import_react15.Transition.Root, {
    show: isOpen,
    as: import_react16.Fragment
  }, /* @__PURE__ */ React.createElement(import_react15.Dialog, {
    as: "div",
    className: "relative z-10",
    initialFocus: cancelButtonRef,
    onClose: handleClick
  }, /* @__PURE__ */ React.createElement(import_react15.Transition.Child, {
    as: import_react16.Fragment,
    enter: "ease-out duration-300",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "fixed inset-0 bg-gray-500/75 transition-opacity"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "overflow-y-auto fixed inset-0 z-10"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex justify-center items-end p-4 min-h-full text-center sm:items-center sm:p-0"
  }, /* @__PURE__ */ React.createElement(import_react15.Transition.Child, {
    as: import_react16.Fragment,
    enter: "ease-out duration-300",
    enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
    enterTo: "opacity-100 translate-y-0 sm:scale-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
    leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  }, /* @__PURE__ */ React.createElement(import_react15.Dialog.Panel, {
    className: "overflow-hidden relative text-left bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "sm:flex sm:items-start"
  }, icon && /* @__PURE__ */ React.createElement("div", {
    className: "flex shrink-0 justify-center items-center mx-auto w-12 h-12 bg-red-100 rounded-full sm:mx-0 sm:mr-4 sm:w-10 sm:h-10"
  }, icon), /* @__PURE__ */ React.createElement("div", {
    className: "mt-3 text-center sm:mt-0  sm:text-left"
  }, title && /* @__PURE__ */ React.createElement(import_react15.Dialog.Title, {
    as: "h3",
    className: "text-lg font-medium leading-6 text-gray-900"
  }, title), description && /* @__PURE__ */ React.createElement("div", {
    className: "mt-2"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "text-sm text-gray-500"
  }, description))))), /* @__PURE__ */ React.createElement("div", {
    className: "py-3 px-4 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6"
  }, /* @__PURE__ */ React.createElement("button", {
    form: "delete-event",
    type: "submit",
    className: "inline-flex justify-center py-2 px-4 w-full text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm sm:ml-3 sm:w-auto sm:text-sm",
    onClick: handleClick
  }, "Delete"), /* @__PURE__ */ React.createElement("button", {
    type: "button",
    className: "inline-flex justify-center py-2 px-4 mt-3 w-full text-base font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",
    onClick: onCloseClick,
    ref: cancelButtonRef
  }, "Cancel"))))))));
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events/$eventId.tsx
var loader6 = async ({ request, params }) => {
  await requireUserId(request);
  (0, import_tiny_invariant6.default)(params.eventId, "eventId not found");
  const event = await getEvent(params.eventId);
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return (0, import_node6.json)({ event });
};
var action4 = async ({ request, params }) => {
  await requireUserId(request);
  (0, import_tiny_invariant6.default)(params.eventId, "eventId not found");
  await deleteEvent(params.eventId);
  return (0, import_node6.redirect)(`/timeline/${params.timelineId}/events`);
};
function EventDetailsPage() {
  const data = (0, import_react17.useLoaderData)();
  const [isOpen, setIsOpen] = (0, import_react18.useState)(false);
  console.log("HERP", data);
  return /* @__PURE__ */ React.createElement(import_react17.Form, {
    method: "post",
    id: "delete-event"
  }, /* @__PURE__ */ React.createElement(DeleteEventDialog, {
    title: "Delete event",
    description: "Are you sure you want to delete this event?",
    isOpen,
    icon: /* @__PURE__ */ React.createElement(import_solid2.ExclamationIcon, {
      className: "w-6 h-6 text-red-600",
      "aria-hidden": "true"
    }),
    onCloseClick: () => setIsOpen(false),
    leftButton: /* @__PURE__ */ React.createElement("button", {
      form: "delete-event",
      type: "submit",
      className: "inline-flex justify-center py-2 px-4 w-full text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm sm:ml-3 sm:w-auto sm:text-sm"
    }, "Delete"),
    rightButton: /* @__PURE__ */ React.createElement("button", {
      form: "delete-event",
      type: "submit"
    }, "delete")
  }), /* @__PURE__ */ React.createElement(EventCard, {
    onDeleteClick: () => setIsOpen(true),
    title: data.event.title,
    content: data.event.content,
    startDate: data.event.startDate
  }));
}
function ErrorBoundary2({ error }) {
  console.error(error);
  return /* @__PURE__ */ React.createElement("div", null, "An unexpected error occurred: ", error.message);
}
function CatchBoundary2() {
  const caught = (0, import_react17.useCatch)();
  if (caught.status === 404) {
    return /* @__PURE__ */ React.createElement("div", null, "Event not found");
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events/index.tsx
var events_exports2 = {};
__export(events_exports2, {
  default: () => EventIndex
});
function EventIndex() {
  return /* @__PURE__ */ React.createElement("div", null, "Select or create an event");
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events/new.tsx
var new_exports = {};
__export(new_exports, {
  action: () => action5,
  default: () => NewEventPage,
  loader: () => loader7
});
var import_node7 = require("@remix-run/node");
var import_react19 = require("@remix-run/react");
var import_react20 = __toESM(require("react"));
var import_tiny_invariant7 = __toESM(require("tiny-invariant"));
function validateEventTitle2(title) {
  if (title.length === 0) {
    return "You must add a title";
  }
}
function validateEventContent2(content) {
  if (typeof content !== "string") {
    return "Content must be a string";
  }
}
function validateEventStartDate2(startDate) {
  if (startDate.length === 0) {
    return "You must select a start date";
  }
}
var badRequest2 = (data) => (0, import_node7.json)(data, { status: 400 });
var loader7 = async ({ request, params }) => {
  await requireUserId(request);
  (0, import_tiny_invariant7.default)(params.timelineId, "timelineId not found");
  const events = await getEventsList(params.timelineId);
  if (!events) {
    throw new Response("Not Found", { status: 404 });
  }
  return (0, import_node7.json)({ events });
};
var action5 = async ({ request, params }) => {
  await requireUserId(request);
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const startDate = formData.get("startDate");
  const timelineId = params.timelineId;
  (0, import_tiny_invariant7.default)(timelineId, "Timeline ID is required");
  const eventId = params.eventId;
  (0, import_tiny_invariant7.default)(eventId, "eventId is required");
  console.log(formData);
  if (typeof title !== "string" || typeof content !== "string" || typeof startDate !== "string") {
    return badRequest2({
      formError: `Form not submitted correctly.`
    });
  }
  const fieldErrors = {
    title: validateEventTitle2(title),
    content: validateEventContent2(content),
    startDate: validateEventStartDate2(startDate)
  };
  const fields = { title, content, startDate, timelineId };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest2({ fieldErrors, fields });
  }
  console.log(1);
  const event = await createEvent({
    data: {
      title,
      content,
      startDate: new Date(startDate)
    },
    eventId,
    timelineId
  });
  console.log(2);
  console.log("event created", event);
  return (0, import_node7.redirect)(`/timeline/${timelineId}/events/${event.id}`);
};
function NewEventPage() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const data = (0, import_react19.useLoaderData)();
  console.log(data);
  const actionData = (0, import_react19.useActionData)();
  const transition = (0, import_react19.useTransition)();
  const titleRef = import_react20.default.useRef(null);
  const contentRef = import_react20.default.useRef(null);
  const startDateRef = import_react20.default.useRef(null);
  import_react20.default.useEffect(() => {
    var _a2, _b2, _c2, _d2, _e2, _f2;
    if ((_a2 = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _a2.title) {
      (_b2 = titleRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c2 = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c2.content) {
      (_d2 = contentRef.current) == null ? void 0 : _d2.focus();
    } else if ((_e2 = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _e2.startDate) {
      (_f2 = startDateRef.current) == null ? void 0 : _f2.focus();
    }
  }, [actionData]);
  if (transition.submission) {
    const title = transition.submission.formData.get("title");
    const content = transition.submission.formData.get("content");
    const startDate = transition.submission.formData.get("startDate");
    if (typeof title === "string" && typeof content === "string" && typeof startDate === "string" && !validateEventTitle2(title) && !validateEventContent2(content) && !validateEventStartDate2(startDate)) {
      return /* @__PURE__ */ import_react20.default.createElement(EventCard, {
        content,
        startDate: new Date(startDate),
        title
      });
    }
  }
  return /* @__PURE__ */ import_react20.default.createElement(import_react19.Form, {
    method: "post",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%"
    }
  }, /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", {
    className: "flex flex-col gap-1 w-full"
  }, /* @__PURE__ */ import_react20.default.createElement("span", null, "Title: "), /* @__PURE__ */ import_react20.default.createElement("input", {
    autoFocus: true,
    ref: titleRef,
    defaultValue: (_a = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _a.title,
    name: "title",
    className: "flex-1 px-3 text-lg leading-loose rounded-md border-2 border-blue-500",
    "aria-invalid": Boolean((_b = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _b.title) || void 0,
    "aria-errormessage": ((_c = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c.title) ? "title-error" : void 0
  })), ((_d = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _d.title) && /* @__PURE__ */ import_react20.default.createElement("div", {
    className: "pt-1 text-red-700",
    id: "title-error"
  }, actionData.fieldErrors.title)), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", {
    className: "flex flex-col gap-1 w-full"
  }, /* @__PURE__ */ import_react20.default.createElement("span", null, "Content: "), /* @__PURE__ */ import_react20.default.createElement("textarea", {
    ref: contentRef,
    defaultValue: (_e = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _e.content,
    name: "content",
    rows: 4,
    className: "flex-1 py-2 px-3 w-full text-lg leading-6 rounded-md border-2 border-blue-500",
    "aria-invalid": Boolean((_f = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _f.content) || void 0,
    "aria-errormessage": ((_g = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _g.content) ? "content-error" : void 0
  })), ((_h = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _h.content) && /* @__PURE__ */ import_react20.default.createElement("div", {
    className: "pt-1 text-red-700",
    id: "content-error"
  }, actionData.fieldErrors.content)), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", {
    className: "flex flex-col gap-1 w-full"
  }, /* @__PURE__ */ import_react20.default.createElement("span", null, "Start Date: "), /* @__PURE__ */ import_react20.default.createElement("input", {
    ref: startDateRef,
    type: "date",
    defaultValue: new Intl.DateTimeFormat("sv-SE").format(new Date()),
    name: "startDate",
    className: "flex-1 px-3 text-lg leading-loose rounded-md border-2 border-blue-500",
    "aria-invalid": Boolean((_i = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _i.startDate) || void 0,
    "aria-errormessage": ((_j = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _j.startDate) ? "startdate-error" : void 0
  })), ((_k = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _k.startDate) && /* @__PURE__ */ import_react20.default.createElement("div", {
    className: "pt-1 text-red-700",
    id: "startdate-error"
  }, actionData.fieldErrors.startDate)), /* @__PURE__ */ import_react20.default.createElement("div", {
    className: "text-right"
  }, /* @__PURE__ */ import_react20.default.createElement("button", {
    type: "submit",
    className: "py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-400 rounded"
  }, "Save")));
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/people.tsx
var people_exports = {};
__export(people_exports, {
  default: () => PeopleTab
});
function PeopleTab() {
  return /* @__PURE__ */ React.createElement("div", null, "People");
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/places.tsx
var places_exports = {};
__export(places_exports, {
  default: () => PlacesTab
});
function PlacesTab() {
  return /* @__PURE__ */ React.createElement("div", null, "Places");
}

// route:/Users/andreas/Development/linje/app/routes/timelines.new.tsx
var timelines_new_exports = {};
__export(timelines_new_exports, {
  action: () => action6,
  default: () => NewTimelinePage
});
var import_outline7 = require("@heroicons/react/outline");
var import_node8 = require("@remix-run/node");
var import_react21 = require("@remix-run/react");
var React5 = __toESM(require("react"));
var action6 = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  if (typeof title !== "string" || title.length === 0) {
    return (0, import_node8.json)({ errors: { title: "Title is required" } }, { status: 400 });
  }
  if (typeof description !== "string" || description.length === 0) {
    return (0, import_node8.json)({ errors: { description: "Description is required" } }, { status: 400 });
  }
  const timeline = await createTimeline({ title, description, userId });
  return (0, import_node8.redirect)(`/timeline/${timeline.id}/events`);
};
function NewTimelinePage() {
  var _a, _b, _c, _d, _e, _f, _g;
  const actionData = (0, import_react21.useActionData)();
  const titleRef = React5.useRef(null);
  const descriptionRef = React5.useRef(null);
  React5.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    if ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.title) {
      (_b2 = titleRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.description) {
      (_d2 = descriptionRef.current) == null ? void 0 : _d2.focus();
    }
  }, [actionData]);
  return /* @__PURE__ */ React5.createElement(Page, {
    title: "New Timeline"
  }, /* @__PURE__ */ React5.createElement(import_react21.Form, {
    method: "post",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%"
    }
  }, /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("label", {
    htmlFor: "title",
    className: "block text-sm font-medium text-gray-700"
  }, "Title:"), /* @__PURE__ */ React5.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React5.createElement("input", {
    id: "title",
    ref: titleRef,
    name: "title",
    className: "flex-1 px-3 text-lg leading-loose rounded-md border-2 border-blue-500 focus:border-indigo-500 focus:ring-indigo-500",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.title) ? true : void 0,
    "aria-errormessage": ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.title) ? "title-error" : void 0,
    placeholder: "My awesome timeline",
    defaultValue: "",
    "aria-describedby": "email-error"
  }), ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.title) && /* @__PURE__ */ React5.createElement("div", {
    className: "flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none"
  }, /* @__PURE__ */ React5.createElement(import_outline7.ExclamationCircleIcon, {
    className: "w-5 h-5 text-red-500",
    "aria-hidden": "true"
  })), ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.title) && /* @__PURE__ */ React5.createElement("p", {
    className: "mt-2 text-sm text-red-600",
    id: "title-error"
  }, actionData.errors.title))), /* @__PURE__ */ React5.createElement("div", null, /* @__PURE__ */ React5.createElement("label", {
    htmlFor: "comment",
    className: "block text-sm font-medium text-gray-700"
  }, "Description"), /* @__PURE__ */ React5.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React5.createElement("textarea", {
    rows: 4,
    name: "description",
    ref: descriptionRef,
    className: "rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm sm:text-sm",
    defaultValue: "",
    "aria-invalid": ((_e = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _e.description) ? true : void 0,
    "aria-errormessage": ((_f = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _f.description) ? "body-error" : void 0
  })), ((_g = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _g.description) && /* @__PURE__ */ React5.createElement("div", {
    className: "pt-1 text-red-700",
    id: "body-error"
  }, actionData.errors.description)), /* @__PURE__ */ React5.createElement("div", {
    className: "text-right"
  }, /* @__PURE__ */ React5.createElement("button", {
    type: "submit",
    className: "py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-400 rounded"
  }, "Save"))));
}

// route:/Users/andreas/Development/linje/app/routes/healthcheck.tsx
var healthcheck_exports = {};
__export(healthcheck_exports, {
  loader: () => loader8
});
var loader8 = async ({ request }) => {
  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  try {
    const url = new URL("/", `http://${host}`);
    await Promise.all([
      prisma.user.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok)
          return Promise.reject(r);
      })
    ]);
    return new Response("OK");
  } catch (error) {
    console.log("healthcheck \u274C", { error });
    return new Response("ERROR", { status: 500 });
  }
};

// route:/Users/andreas/Development/linje/app/routes/timelines.tsx
var timelines_exports = {};
__export(timelines_exports, {
  default: () => TimelinesPage,
  loader: () => loader9
});
var import_outline8 = require("@heroicons/react/outline");
var import_node9 = require("@remix-run/node");
var import_react22 = require("@remix-run/react");
function classNames4(...classes) {
  return classes.filter(Boolean).join(" ");
}
var loader9 = async ({ request }) => {
  const userId = await requireUserId(request);
  const timelineListItems = await getTimelineListItems({ userId });
  return (0, import_node9.json)({ timelineListItems });
};
function TimelinesPage() {
  const data = (0, import_react22.useLoaderData)();
  return /* @__PURE__ */ React.createElement(Page, {
    title: "Your Timelines"
  }, /* @__PURE__ */ React.createElement(import_react22.Link, {
    to: "/timelines/new",
    className: "inline-flex items-center py-2 px-4 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
  }, /* @__PURE__ */ React.createElement(import_outline8.PlusIcon, {
    className: "mr-2 -ml-1 w-5 h-5",
    "aria-hidden": "true"
  }), "New Timeline"), data.timelineListItems.length === 0 ? /* @__PURE__ */ React.createElement("p", {
    className: "p-4"
  }, "No timelines yet") : /* @__PURE__ */ React.createElement("ul", {
    className: "grid grid-cols-1 gap-5 mt-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
  }, data.timelineListItems.map((timeline) => /* @__PURE__ */ React.createElement(import_react22.Link, {
    key: timeline.title,
    to: `/timeline/${timeline.id}/events`,
    className: "font-medium text-gray-900 hover:text-gray-600"
  }, /* @__PURE__ */ React.createElement("li", {
    className: "flex col-span-1 rounded-md shadow-sm"
  }, /* @__PURE__ */ React.createElement("div", {
    className: classNames4("bg-pink-600", "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white")
  }, timeline.title.slice(0, 2)), /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-1 justify-between items-center truncate bg-white rounded-r-md border-y border-r border-gray-200"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex-1 py-2 px-4 text-sm truncate"
  }, timeline.title, /* @__PURE__ */ React.createElement("p", {
    className: "text-gray-500"
  }, timeline._count.event, " events"))))))));
}

// route:/Users/andreas/Development/linje/app/routes/profile.tsx
var profile_exports = {};
__export(profile_exports, {
  default: () => NotesPage
});

// app/utils.ts
var import_react23 = require("@remix-run/react");
var import_react24 = require("react");
var DEFAULT_REDIRECT = "/";
function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }
  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }
  return to;
}
function useMatchesData(id) {
  const matchingRoutes = (0, import_react23.useMatches)();
  const route = (0, import_react24.useMemo)(() => matchingRoutes.find((route2) => route2.id === id), [matchingRoutes, id]);
  return route == null ? void 0 : route.data;
}
function isUser(user) {
  return user && typeof user === "object" && typeof user.email === "string";
}
function useOptionalUser() {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return void 0;
  }
  return data.user;
}
function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error("No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.");
  }
  return maybeUser;
}
function validateEmail(email) {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

// route:/Users/andreas/Development/linje/app/routes/profile.tsx
function NotesPage() {
  const user = useUser();
  return /* @__PURE__ */ React.createElement(Page, {
    title: "Profile"
  }, user.email);
}

// route:/Users/andreas/Development/linje/app/routes/__auth.tsx
var auth_exports = {};
__export(auth_exports, {
  default: () => AuthPage
});
var import_react25 = require("@remix-run/react");
function AuthPage() {
  return /* @__PURE__ */ React.createElement(import_react25.Outlet, null);
}

// route:/Users/andreas/Development/linje/app/routes/__auth/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action7,
  loader: () => loader10
});
var import_node10 = require("@remix-run/node");
var action7 = async ({ request }) => {
  return logout(request);
};
var loader10 = async () => {
  return (0, import_node10.redirect)("/");
};

// route:/Users/andreas/Development/linje/app/routes/__auth/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action8,
  default: () => LoginPage,
  loader: () => loader11,
  meta: () => meta2
});
var import_node11 = require("@remix-run/node");
var import_react26 = require("@remix-run/react");
var React6 = __toESM(require("react"));
var loader11 = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId)
    return (0, import_node11.redirect)("/");
  return (0, import_node11.json)({});
};
var action8 = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/timelines");
  const remember = formData.get("remember");
  if (!validateEmail(email)) {
    return (0, import_node11.json)({ errors: { email: "Email is invalid" } }, { status: 400 });
  }
  if (typeof password !== "string" || password.length === 0) {
    return (0, import_node11.json)({ errors: { password: "Password is required" } }, { status: 400 });
  }
  if (password.length < 8) {
    return (0, import_node11.json)({ errors: { password: "Password is too short" } }, { status: 400 });
  }
  const user = await verifyLogin(email, password);
  if (!user) {
    return (0, import_node11.json)({ errors: { email: "Invalid email or password" } }, { status: 400 });
  }
  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo
  });
};
var meta2 = () => {
  return {
    title: "Login"
  };
};
function LoginPage() {
  var _a, _b, _c, _d;
  const [searchParams] = (0, import_react26.useSearchParams)();
  const redirectTo = searchParams.get("redirectTo") || "/timelines";
  const actionData = (0, import_react26.useActionData)();
  const emailRef = React6.useRef(null);
  const passwordRef = React6.useRef(null);
  React6.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    if ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.email) {
      (_b2 = emailRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.password) {
      (_d2 = passwordRef.current) == null ? void 0 : _d2.focus();
    }
  }, [actionData]);
  return /* @__PURE__ */ React6.createElement("div", {
    className: "flex flex-col justify-center min-h-full"
  }, /* @__PURE__ */ React6.createElement("div", {
    className: "px-8 mx-auto w-full max-w-md"
  }, /* @__PURE__ */ React6.createElement(import_react26.Form, {
    method: "post",
    className: "space-y-6"
  }, /* @__PURE__ */ React6.createElement("div", null, /* @__PURE__ */ React6.createElement("label", {
    htmlFor: "email",
    className: "block text-sm font-medium text-gray-700"
  }, "Email address"), /* @__PURE__ */ React6.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React6.createElement("input", {
    ref: emailRef,
    id: "email",
    required: true,
    autoFocus: true,
    name: "email",
    type: "email",
    autoComplete: "email",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) ? true : void 0,
    "aria-describedby": "email-error",
    className: "py-1 px-2 w-full text-lg rounded border border-gray-500"
  }), ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ React6.createElement("div", {
    className: "pt-1 text-red-700",
    id: "email-error"
  }, actionData.errors.email))), /* @__PURE__ */ React6.createElement("div", null, /* @__PURE__ */ React6.createElement("label", {
    htmlFor: "password",
    className: "block text-sm font-medium text-gray-700"
  }, "Password"), /* @__PURE__ */ React6.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React6.createElement("input", {
    id: "password",
    ref: passwordRef,
    name: "password",
    type: "password",
    autoComplete: "current-password",
    "aria-invalid": ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.password) ? true : void 0,
    "aria-describedby": "password-error",
    className: "py-1 px-2 w-full text-lg rounded border border-gray-500"
  }), ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ React6.createElement("div", {
    className: "pt-1 text-red-700",
    id: "password-error"
  }, actionData.errors.password))), /* @__PURE__ */ React6.createElement("input", {
    type: "hidden",
    name: "redirectTo",
    value: redirectTo
  }), /* @__PURE__ */ React6.createElement("button", {
    type: "submit",
    className: "py-2 px-4 w-full  text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-400 rounded"
  }, "Log in"), /* @__PURE__ */ React6.createElement("div", {
    className: "flex justify-between items-center"
  }, /* @__PURE__ */ React6.createElement("div", {
    className: "flex items-center"
  }, /* @__PURE__ */ React6.createElement("input", {
    id: "remember",
    name: "remember",
    type: "checkbox",
    className: "w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
  }), /* @__PURE__ */ React6.createElement("label", {
    htmlFor: "remember",
    className: "block ml-2 text-sm text-gray-900"
  }, "Remember me")), /* @__PURE__ */ React6.createElement("div", {
    className: "text-sm text-center text-gray-500"
  }, "Don't have an account yet?", " ", /* @__PURE__ */ React6.createElement(import_react26.Link, {
    className: "text-blue-500 underline",
    to: {
      pathname: "/join",
      search: searchParams.toString()
    }
  }, "Sign up"))))));
}

// route:/Users/andreas/Development/linje/app/routes/__auth/join.tsx
var join_exports = {};
__export(join_exports, {
  action: () => action9,
  default: () => Join,
  loader: () => loader12,
  meta: () => meta3
});
var import_node12 = require("@remix-run/node");
var import_react27 = require("@remix-run/react");
var React7 = __toESM(require("react"));
var loader12 = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId)
    return (0, import_node12.redirect)("/");
  return (0, import_node12.json)({});
};
var action9 = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  if (!validateEmail(email)) {
    return (0, import_node12.json)({ errors: { email: "Email is invalid" } }, { status: 400 });
  }
  if (typeof password !== "string" || password.length === 0) {
    return (0, import_node12.json)({ errors: { password: "Password is required" } }, { status: 400 });
  }
  if (password.length < 8) {
    return (0, import_node12.json)({ errors: { password: "Password is too short" } }, { status: 400 });
  }
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return (0, import_node12.json)({ errors: { email: "A user already exists with this email" } }, { status: 400 });
  }
  const user = await createUser(email, password);
  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo
  });
};
var meta3 = () => {
  return {
    title: "Sign Up"
  };
};
function Join() {
  var _a, _b, _c, _d;
  const [searchParams] = (0, import_react27.useSearchParams)();
  const redirectTo = searchParams.get("redirectTo") ?? void 0;
  const actionData = (0, import_react27.useActionData)();
  const emailRef = React7.useRef(null);
  const passwordRef = React7.useRef(null);
  React7.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    if ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.email) {
      (_b2 = emailRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.password) {
      (_d2 = passwordRef.current) == null ? void 0 : _d2.focus();
    }
  }, [actionData]);
  return /* @__PURE__ */ React7.createElement("div", {
    className: "flex flex-col justify-center min-h-full"
  }, /* @__PURE__ */ React7.createElement("div", {
    className: "px-8 mx-auto w-full max-w-md"
  }, /* @__PURE__ */ React7.createElement(import_react27.Form, {
    method: "post",
    className: "space-y-6"
  }, /* @__PURE__ */ React7.createElement("div", null, /* @__PURE__ */ React7.createElement("label", {
    htmlFor: "email",
    className: "block text-sm font-medium text-gray-700"
  }, "Email address"), /* @__PURE__ */ React7.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React7.createElement("input", {
    ref: emailRef,
    id: "email",
    required: true,
    autoFocus: true,
    name: "email",
    type: "email",
    autoComplete: "email",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) ? true : void 0,
    "aria-describedby": "email-error",
    className: "py-1 px-2 w-full text-lg rounded border border-gray-500"
  }), ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ React7.createElement("div", {
    className: "pt-1 text-red-700",
    id: "email-error"
  }, actionData.errors.email))), /* @__PURE__ */ React7.createElement("div", null, /* @__PURE__ */ React7.createElement("label", {
    htmlFor: "password",
    className: "block text-sm font-medium text-gray-700"
  }, "Password"), /* @__PURE__ */ React7.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React7.createElement("input", {
    id: "password",
    ref: passwordRef,
    name: "password",
    type: "password",
    autoComplete: "new-password",
    "aria-invalid": ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.password) ? true : void 0,
    "aria-describedby": "password-error",
    className: "py-1 px-2 w-full text-lg rounded border border-gray-500"
  }), ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ React7.createElement("div", {
    className: "pt-1 text-red-700",
    id: "password-error"
  }, actionData.errors.password))), /* @__PURE__ */ React7.createElement("input", {
    type: "hidden",
    name: "redirectTo",
    value: redirectTo
  }), /* @__PURE__ */ React7.createElement("button", {
    type: "submit",
    className: "py-2 px-4 w-full  text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-400 rounded"
  }, "Create Account"), /* @__PURE__ */ React7.createElement("div", {
    className: "flex justify-center items-center"
  }, /* @__PURE__ */ React7.createElement("div", {
    className: "text-sm text-center text-gray-500"
  }, "Already have an account?", " ", /* @__PURE__ */ React7.createElement(import_react27.Link, {
    className: "text-blue-500 underline",
    to: {
      pathname: "/login",
      search: searchParams.toString()
    }
  }, "Log in"))))));
}

// route:/Users/andreas/Development/linje/app/routes/events.tsx
var events_exports3 = {};
__export(events_exports3, {
  default: () => EventsPage
});
function EventsPage() {
  return /* @__PURE__ */ React.createElement(Page, {
    title: "Event"
  }, "Content");
}

// route:/Users/andreas/Development/linje/app/routes/people.tsx
var people_exports2 = {};
__export(people_exports2, {
  default: () => PeoplePage
});
function PeoplePage() {
  return /* @__PURE__ */ React.createElement(Page, {
    title: "Persons"
  }, "Content");
}

// route:/Users/andreas/Development/linje/app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index
});
var import_react28 = require("@remix-run/react");
function Index() {
  const user = useOptionalUser();
  return /* @__PURE__ */ React.createElement("main", {
    className: "relative min-h-screen bg-white sm:flex sm:justify-center sm:items-center"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "relative sm:pt-8 sm:pb-16"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mx-auto max-w-7xl sm:px-6 lg:px-8"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "relative shadow-xl sm:overflow-hidden sm:rounded-2xl"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "absolute inset-0"
  }, /* @__PURE__ */ React.createElement("img", {
    className: "object-cover w-full h-full",
    src: "https://user-images.githubusercontent.com/1500684/157774694-99820c51-8165-4908-a031-34fc371ac0d6.jpg",
    alt: "Sonic Youth On Stage"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-multiply"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-32 lg:pb-20"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-6xl font-extrabold tracking-tight text-center sm:text-8xl lg:text-9xl"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "block text-yellow-500 uppercase drop-shadow-md"
  }, "Linjen")), /* @__PURE__ */ React.createElement("p", {
    className: "mx-auto mt-6 max-w-lg text-xl text-center text-white sm:max-w-3xl"
  }, "Create and visualize your own timelines."), /* @__PURE__ */ React.createElement("div", {
    className: "mx-auto mt-10 max-w-sm sm:flex sm:justify-center sm:max-w-none"
  }, user ? /* @__PURE__ */ React.createElement(import_react28.Link, {
    to: "/timelines",
    className: "flex justify-center items-center py-3 px-4 text-base font-medium text-yellow-700 bg-white hover:bg-yellow-50 rounded-md border border-transparent shadow-sm sm:px-8"
  }, "View Timelines for ", user.email) : /* @__PURE__ */ React.createElement("div", {
    className: "space-y-4 sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:mx-auto sm:space-y-0"
  }, /* @__PURE__ */ React.createElement(import_react28.Link, {
    to: "/join",
    className: "flex justify-center items-center py-3 px-4 text-base font-medium text-yellow-700 bg-white hover:bg-yellow-50 rounded-md border border-transparent shadow-sm sm:px-8"
  }, "Sign up"), /* @__PURE__ */ React.createElement(import_react28.Link, {
    to: "/login",
    className: "flex justify-center items-center py-3 px-4 font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-md  "
  }, "Log In"))))))));
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { "version": "5f2f939c", "entry": { "module": "/build/entry.client-X3NRBBAF.js", "imports": ["/build/_shared/chunk-SXNYENQH.js", "/build/_shared/chunk-R6YY4TUI.js", "/build/_shared/chunk-6BO74FWO.js"] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "module": "/build/root-TL6GWCOF.js", "imports": void 0, "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/__auth": { "id": "routes/__auth", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "module": "/build/routes/__auth-MXFLRBWU.js", "imports": void 0, "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/__auth/join": { "id": "routes/__auth/join", "parentId": "routes/__auth", "path": "join", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/__auth/join-II4XF7VJ.js", "imports": ["/build/_shared/chunk-DFG4XZEI.js", "/build/_shared/chunk-XYHQIUW2.js", "/build/_shared/chunk-ME5PAYV3.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/__auth/login": { "id": "routes/__auth/login", "parentId": "routes/__auth", "path": "login", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/__auth/login-DHHNGETD.js", "imports": ["/build/_shared/chunk-DFG4XZEI.js", "/build/_shared/chunk-XYHQIUW2.js", "/build/_shared/chunk-ME5PAYV3.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/__auth/logout": { "id": "routes/__auth/logout", "parentId": "routes/__auth", "path": "logout", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/__auth/logout-IDL4DQS7.js", "imports": void 0, "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/events": { "id": "routes/events", "parentId": "root", "path": "events", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/events-TBCS6YXN.js", "imports": ["/build/_shared/chunk-DA4BU24L.js", "/build/_shared/chunk-W53SQCXG.js", "/build/_shared/chunk-HBMZFJ4U.js"], "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/healthcheck": { "id": "routes/healthcheck", "parentId": "root", "path": "healthcheck", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/healthcheck-UW4G2OK6.js", "imports": void 0, "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/index": { "id": "routes/index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "module": "/build/routes/index-3V6OAEHS.js", "imports": ["/build/_shared/chunk-XYHQIUW2.js"], "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/people": { "id": "routes/people", "parentId": "root", "path": "people", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/people-2BWTKN4M.js", "imports": ["/build/_shared/chunk-DA4BU24L.js", "/build/_shared/chunk-W53SQCXG.js", "/build/_shared/chunk-HBMZFJ4U.js"], "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/profile": { "id": "routes/profile", "parentId": "root", "path": "profile", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/profile-R4HVKBN4.js", "imports": ["/build/_shared/chunk-XYHQIUW2.js", "/build/_shared/chunk-DA4BU24L.js", "/build/_shared/chunk-W53SQCXG.js", "/build/_shared/chunk-HBMZFJ4U.js"], "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/timeline.$timelineId.edit": { "id": "routes/timeline.$timelineId.edit", "parentId": "root", "path": "timeline/:timelineId/edit", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/timeline.$timelineId.edit-XU6LSYJY.js", "imports": ["/build/_shared/chunk-T572OESQ.js", "/build/_shared/chunk-DA4BU24L.js", "/build/_shared/chunk-W53SQCXG.js", "/build/_shared/chunk-HBMZFJ4U.js", "/build/_shared/chunk-ME5PAYV3.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/timeline/$timelineId": { "id": "routes/timeline/$timelineId", "parentId": "root", "path": "timeline/:timelineId", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/timeline/$timelineId-SYP32ILR.js", "imports": ["/build/_shared/chunk-T572OESQ.js", "/build/_shared/chunk-DA4BU24L.js", "/build/_shared/chunk-W53SQCXG.js", "/build/_shared/chunk-HBMZFJ4U.js", "/build/_shared/chunk-ME5PAYV3.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": true, "hasErrorBoundary": true }, "routes/timeline/$timelineId/events": { "id": "routes/timeline/$timelineId/events", "parentId": "routes/timeline/$timelineId", "path": "events", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/timeline/$timelineId/events-XDVILVKS.js", "imports": ["/build/_shared/chunk-XDE3UXV6.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/timeline/$timelineId/events/$eventId": { "id": "routes/timeline/$timelineId/events/$eventId", "parentId": "routes/timeline/$timelineId/events", "path": ":eventId", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/timeline/$timelineId/events/$eventId-BJUR22VH.js", "imports": ["/build/_shared/chunk-HBMZFJ4U.js", "/build/_shared/chunk-MSMQ7YEE.js", "/build/_shared/chunk-ME5PAYV3.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": true, "hasErrorBoundary": true }, "routes/timeline/$timelineId/events/$eventId.edit": { "id": "routes/timeline/$timelineId/events/$eventId.edit", "parentId": "routes/timeline/$timelineId/events", "path": ":eventId/edit", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/timeline/$timelineId/events/$eventId.edit-E2RDWOML.js", "imports": ["/build/_shared/chunk-MSMQ7YEE.js", "/build/_shared/chunk-ME5PAYV3.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/timeline/$timelineId/events/index": { "id": "routes/timeline/$timelineId/events/index", "parentId": "routes/timeline/$timelineId/events", "path": void 0, "index": true, "caseSensitive": void 0, "module": "/build/routes/timeline/$timelineId/events/index-7N6A5OI4.js", "imports": void 0, "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/timeline/$timelineId/events/new": { "id": "routes/timeline/$timelineId/events/new", "parentId": "routes/timeline/$timelineId/events", "path": "new", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/timeline/$timelineId/events/new-YRD5BJMR.js", "imports": ["/build/_shared/chunk-MSMQ7YEE.js", "/build/_shared/chunk-ME5PAYV3.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/timeline/$timelineId/people": { "id": "routes/timeline/$timelineId/people", "parentId": "routes/timeline/$timelineId", "path": "people", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/timeline/$timelineId/people-YKHY24TX.js", "imports": void 0, "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/timeline/$timelineId/places": { "id": "routes/timeline/$timelineId/places", "parentId": "routes/timeline/$timelineId", "path": "places", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/timeline/$timelineId/places-54GJYJXW.js", "imports": void 0, "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/timelines": { "id": "routes/timelines", "parentId": "root", "path": "timelines", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/timelines-QU4MTVQA.js", "imports": ["/build/_shared/chunk-T572OESQ.js", "/build/_shared/chunk-DA4BU24L.js", "/build/_shared/chunk-W53SQCXG.js", "/build/_shared/chunk-HBMZFJ4U.js", "/build/_shared/chunk-ME5PAYV3.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/timelines.new": { "id": "routes/timelines.new", "parentId": "root", "path": "timelines/new", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/timelines.new-FGLDZFUB.js", "imports": ["/build/_shared/chunk-T572OESQ.js", "/build/_shared/chunk-DA4BU24L.js", "/build/_shared/chunk-W53SQCXG.js", "/build/_shared/chunk-HBMZFJ4U.js", "/build/_shared/chunk-ME5PAYV3.js"], "hasAction": true, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false } }, "url": "/build/manifest-5F2F939C.js" };

// server-entry-module:@remix-run/dev/server-build
var entry = { module: entry_server_exports };
var routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/timeline.$timelineId.edit": {
    id: "routes/timeline.$timelineId.edit",
    parentId: "root",
    path: "timeline/:timelineId/edit",
    index: void 0,
    caseSensitive: void 0,
    module: timeline_timelineId_edit_exports
  },
  "routes/timeline/$timelineId": {
    id: "routes/timeline/$timelineId",
    parentId: "root",
    path: "timeline/:timelineId",
    index: void 0,
    caseSensitive: void 0,
    module: timelineId_exports
  },
  "routes/timeline/$timelineId/events": {
    id: "routes/timeline/$timelineId/events",
    parentId: "routes/timeline/$timelineId",
    path: "events",
    index: void 0,
    caseSensitive: void 0,
    module: events_exports
  },
  "routes/timeline/$timelineId/events/$eventId.edit": {
    id: "routes/timeline/$timelineId/events/$eventId.edit",
    parentId: "routes/timeline/$timelineId/events",
    path: ":eventId/edit",
    index: void 0,
    caseSensitive: void 0,
    module: eventId_edit_exports
  },
  "routes/timeline/$timelineId/events/$eventId": {
    id: "routes/timeline/$timelineId/events/$eventId",
    parentId: "routes/timeline/$timelineId/events",
    path: ":eventId",
    index: void 0,
    caseSensitive: void 0,
    module: eventId_exports
  },
  "routes/timeline/$timelineId/events/index": {
    id: "routes/timeline/$timelineId/events/index",
    parentId: "routes/timeline/$timelineId/events",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: events_exports2
  },
  "routes/timeline/$timelineId/events/new": {
    id: "routes/timeline/$timelineId/events/new",
    parentId: "routes/timeline/$timelineId/events",
    path: "new",
    index: void 0,
    caseSensitive: void 0,
    module: new_exports
  },
  "routes/timeline/$timelineId/people": {
    id: "routes/timeline/$timelineId/people",
    parentId: "routes/timeline/$timelineId",
    path: "people",
    index: void 0,
    caseSensitive: void 0,
    module: people_exports
  },
  "routes/timeline/$timelineId/places": {
    id: "routes/timeline/$timelineId/places",
    parentId: "routes/timeline/$timelineId",
    path: "places",
    index: void 0,
    caseSensitive: void 0,
    module: places_exports
  },
  "routes/timelines.new": {
    id: "routes/timelines.new",
    parentId: "root",
    path: "timelines/new",
    index: void 0,
    caseSensitive: void 0,
    module: timelines_new_exports
  },
  "routes/healthcheck": {
    id: "routes/healthcheck",
    parentId: "root",
    path: "healthcheck",
    index: void 0,
    caseSensitive: void 0,
    module: healthcheck_exports
  },
  "routes/timelines": {
    id: "routes/timelines",
    parentId: "root",
    path: "timelines",
    index: void 0,
    caseSensitive: void 0,
    module: timelines_exports
  },
  "routes/profile": {
    id: "routes/profile",
    parentId: "root",
    path: "profile",
    index: void 0,
    caseSensitive: void 0,
    module: profile_exports
  },
  "routes/__auth": {
    id: "routes/__auth",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: auth_exports
  },
  "routes/__auth/logout": {
    id: "routes/__auth/logout",
    parentId: "routes/__auth",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/__auth/login": {
    id: "routes/__auth/login",
    parentId: "routes/__auth",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/__auth/join": {
    id: "routes/__auth/join",
    parentId: "routes/__auth",
    path: "join",
    index: void 0,
    caseSensitive: void 0,
    module: join_exports
  },
  "routes/events": {
    id: "routes/events",
    parentId: "root",
    path: "events",
    index: void 0,
    caseSensitive: void 0,
    module: events_exports3
  },
  "routes/people": {
    id: "routes/people",
    parentId: "root",
    path: "people",
    index: void 0,
    caseSensitive: void 0,
    module: people_exports2
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: routes_exports
  }
};
module.exports = __toCommonJS(stdin_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  entry,
  routes
});
//# sourceMappingURL=index.js.map
