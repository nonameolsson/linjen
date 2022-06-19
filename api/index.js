var __create = Object.create
var __defProp = Object.defineProperty
var __getOwnPropDesc = Object.getOwnPropertyDescriptor
var __getOwnPropNames = Object.getOwnPropertyNames
var __getOwnPropSymbols = Object.getOwnPropertySymbols
var __getProtoOf = Object.getPrototypeOf
var __hasOwnProp = Object.prototype.hasOwnProperty
var __propIsEnum = Object.prototype.propertyIsEnumerable
var __markAsModule = target => __defProp(target, '__esModule', { value: true })
var __objRest = (source, exclude) => {
  var target = {}
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop]
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop]
    }
  return target
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true })
}
var __reExport = (target, module2, copyDefault, desc) => {
  if (
    (module2 && typeof module2 === 'object') ||
    typeof module2 === 'function'
  ) {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== 'default'))
        __defProp(target, key, {
          get: () => module2[key],
          enumerable:
            !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable
        })
  }
  return target
}
var __toESM = (module2, isNodeMode) => {
  return __reExport(
    __markAsModule(
      __defProp(
        module2 != null ? __create(__getProtoOf(module2)) : {},
        'default',
        !isNodeMode && module2 && module2.__esModule
          ? { get: () => module2.default, enumerable: true }
          : { value: module2, enumerable: true }
      )
    ),
    module2
  )
}
var __toCommonJS = /* @__PURE__ */ (cache => {
  return (module2, temp) => {
    return (
      (cache && cache.get(module2)) ||
      ((temp = __reExport(__markAsModule({}), module2, 1)),
      cache && cache.set(module2, temp),
      temp)
    )
  }
})(typeof WeakMap !== 'undefined' ? /* @__PURE__ */ new WeakMap() : 0)

// server/index.js
var server_exports = {}
__export(server_exports, {
  default: () => server_default
})

// node_modules/@remix-run/dev/compiler/shims/react.ts
var React = __toESM(require('react'))

// server/index.js
var import_vercel = require('@remix-run/vercel')

// server-entry-module:@remix-run/dev/server-build
var server_build_exports = {}
__export(server_build_exports, {
  assets: () => assets_manifest_default,
  entry: () => entry,
  routes: () => routes
})

// app/entry.server.tsx
var entry_server_exports = {}
__export(entry_server_exports, {
  default: () => handleRequest
})
var import_react = require('@remix-run/react')
var import_server = require('react-dom/server')
function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  const markup = (0, import_server.renderToString)(
    /* @__PURE__ */ React.createElement(import_react.RemixServer, {
      context: remixContext,
      url: request.url
    })
  )
  responseHeaders.set('Content-Type', 'text/html')
  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  })
}

// route:/Users/andreas/Development/linje/app/root.tsx
var root_exports = {}
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
})
var import_node2 = require('@remix-run/node')
var import_react2 = require('@remix-run/react')

// app/styles/tailwind.css
var tailwind_default = '/build/_assets/tailwind-GW7L4ZPD.css'

// app/session.server.ts
var import_node = require('@remix-run/node')
var import_tiny_invariant = __toESM(require('tiny-invariant'))

// app/models/user.server.ts
var import_bcryptjs = __toESM(require('bcryptjs'))

// app/db.server.ts
var import_client = require('@prisma/client')
var prisma
if (true) {
  prisma = new import_client.PrismaClient()
} else {
  if (!global.__prisma) {
    global.__prisma = new import_client.PrismaClient()
  }
  prisma = global.__prisma
}

// app/models/user.server.ts
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } })
}
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } })
}
async function createUser(email, password) {
  const hashedPassword = await import_bcryptjs.default.hash(password, 10)
  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  })
}
async function verifyLogin(email, password) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true
    }
  })
  if (!userWithPassword || !userWithPassword.password) {
    return null
  }
  const isValid = await import_bcryptjs.default.compare(
    password,
    userWithPassword.password.hash
  )
  if (!isValid) {
    return null
  }
  const _a = userWithPassword,
    { password: _password } = _a,
    userWithoutPassword = __objRest(_a, ['password'])
  return userWithoutPassword
}

// app/session.server.ts
;(0, import_tiny_invariant.default)(
  process.env.SESSION_SECRET,
  'SESSION_SECRET must be set'
)
var sessionStorage = (0, import_node.createCookieSessionStorage)({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: true
  }
})
var USER_SESSION_KEY = 'userId'
async function getSession(request) {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}
async function getUserId(request) {
  const session = await getSession(request)
  const userId = session.get(USER_SESSION_KEY)
  return userId
}
async function getUser(request) {
  const userId = await getUserId(request)
  if (userId === void 0) return null
  const user = await getUserById(userId)
  if (user) return user
  throw await logout(request)
}
async function requireUserId(
  request,
  redirectTo = new URL(request.url).pathname
) {
  const userId = await getUserId(request)
  if (!userId) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw (0, import_node.redirect)(`/login?${searchParams}`)
  }
  return userId
}
async function createUserSession({ request, userId, remember, redirectTo }) {
  const session = await getSession(request)
  session.set(USER_SESSION_KEY, userId)
  return (0, import_node.redirect)(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : void 0
      })
    }
  })
}
async function logout(request) {
  const session = await getSession(request)
  return (0, import_node.redirect)('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  })
}

// route:/Users/andreas/Development/linje/app/root.tsx
var links = () => {
  return [{ rel: 'stylesheet', href: tailwind_default }]
}
var meta = () => ({
  charset: 'utf-8',
  title: 'Linje',
  viewport: 'width=device-width,initial-scale=1'
})
var loader = async ({ request }) => {
  return (0, import_node2.json)({
    user: await getUser(request)
  })
}
function App() {
  return /* @__PURE__ */ React.createElement(
    'html',
    {
      lang: 'en',
      className: 'h-full bg-gray-100'
    },
    /* @__PURE__ */ React.createElement(
      'head',
      null,
      /* @__PURE__ */ React.createElement(import_react2.Meta, null),
      /* @__PURE__ */ React.createElement(import_react2.Links, null)
    ),
    /* @__PURE__ */ React.createElement(
      'body',
      {
        className: 'h-full'
      },
      /* @__PURE__ */ React.createElement(import_react2.Outlet, null),
      /* @__PURE__ */ React.createElement(
        import_react2.ScrollRestoration,
        null
      ),
      /* @__PURE__ */ React.createElement(import_react2.Scripts, null),
      /* @__PURE__ */ React.createElement(import_react2.LiveReload, null)
    )
  )
}

// route:/Users/andreas/Development/linje/app/routes/timeline.$timelineId.edit.tsx
var timeline_timelineId_edit_exports = {}
__export(timeline_timelineId_edit_exports, {
  action: () => action,
  default: () => EditTimelinePage,
  loader: () => loader2
})
var import_outline4 = require('@heroicons/react/outline')
var import_node3 = require('@remix-run/node')
var import_react10 = require('@remix-run/react')
var React2 = __toESM(require('react'))
var import_tiny_invariant2 = __toESM(require('tiny-invariant'))

// app/components/page.tsx
var import_react9 = require('react')
var import_outline3 = require('@heroicons/react/outline')

// app/components/navbar.tsx
var import_react3 = require('react')
var import_solid = require('@heroicons/react/solid')
var import_outline = require('@heroicons/react/outline')
var import_react4 = require('@headlessui/react')
var import_react5 = require('@remix-run/react')
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
function Navbar({ setMobileMenuOpen }) {
  return /* @__PURE__ */ React.createElement(
    'header',
    {
      className: 'w-full'
    },
    /* @__PURE__ */ React.createElement(
      'div',
      {
        className:
          'relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm'
      },
      /* @__PURE__ */ React.createElement(
        'button',
        {
          type: 'button',
          className:
            'border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden',
          onClick: () => setMobileMenuOpen(true)
        },
        /* @__PURE__ */ React.createElement(
          'span',
          {
            className: 'sr-only'
          },
          'Open sidebar'
        ),
        /* @__PURE__ */ React.createElement(import_outline.MenuAlt2Icon, {
          className: 'h-6 w-6',
          'aria-hidden': 'true'
        })
      ),
      /* @__PURE__ */ React.createElement(
        'div',
        {
          className: 'flex flex-1 justify-between px-4 sm:px-6'
        },
        /* @__PURE__ */ React.createElement(
          'div',
          {
            className: 'flex flex-1'
          },
          /* @__PURE__ */ React.createElement(
            'form',
            {
              className: 'flex w-full md:ml-0',
              action: '#',
              method: 'GET'
            },
            /* @__PURE__ */ React.createElement(
              'label',
              {
                htmlFor: 'search-field',
                className: 'sr-only'
              },
              'Search all files'
            ),
            /* @__PURE__ */ React.createElement(
              'div',
              {
                className:
                  'relative w-full text-gray-400 focus-within:text-gray-600'
              },
              /* @__PURE__ */ React.createElement(
                'div',
                {
                  className:
                    'pointer-events-none absolute inset-y-0 left-0 flex items-center'
                },
                /* @__PURE__ */ React.createElement(import_solid.SearchIcon, {
                  className: 'h-5 w-5 flex-shrink-0',
                  'aria-hidden': 'true'
                })
              ),
              /* @__PURE__ */ React.createElement('input', {
                name: 'search-field',
                id: 'search-field',
                className:
                  'h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0',
                placeholder: 'Search',
                type: 'search'
              })
            )
          )
        ),
        /* @__PURE__ */ React.createElement(
          'div',
          {
            className: 'ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6'
          },
          /* @__PURE__ */ React.createElement(
            import_react4.Menu,
            {
              as: 'div',
              className: 'relative flex-shrink-0'
            },
            /* @__PURE__ */ React.createElement(
              'div',
              null,
              /* @__PURE__ */ React.createElement(
                import_react4.Menu.Button,
                {
                  className:
                    'flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                },
                /* @__PURE__ */ React.createElement(
                  'span',
                  {
                    className: 'sr-only'
                  },
                  'Open user menu'
                ),
                /* @__PURE__ */ React.createElement('img', {
                  className: 'h-8 w-8 rounded-full',
                  src: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
                  alt: ''
                })
              )
            ),
            /* @__PURE__ */ React.createElement(
              import_react4.Transition,
              {
                as: import_react3.Fragment,
                enter: 'transition ease-out duration-100',
                enterFrom: 'transform opacity-0 scale-95',
                enterTo: 'transform opacity-100 scale-100',
                leave: 'transition ease-in duration-75',
                leaveFrom: 'transform opacity-100 scale-100',
                leaveTo: 'transform opacity-0 scale-95'
              },
              /* @__PURE__ */ React.createElement(
                import_react4.Menu.Items,
                {
                  className:
                    'absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                },
                /* @__PURE__ */ React.createElement(
                  import_react4.Menu.Item,
                  null,
                  ({ active }) =>
                    /* @__PURE__ */ React.createElement(
                      import_react5.NavLink,
                      {
                        className: classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700'
                        ),
                        to: '/profile'
                      },
                      'Profile'
                    )
                ),
                /* @__PURE__ */ React.createElement(
                  import_react4.Menu.Item,
                  null,
                  ({ active }) =>
                    /* @__PURE__ */ React.createElement(
                      import_react5.Form,
                      {
                        action: '/logout',
                        method: 'post'
                      },
                      /* @__PURE__ */ React.createElement(
                        'button',
                        {
                          type: 'submit',
                          className: classNames(
                            active ? 'bg-gray-100' : '',
                            'flex w-full px-4 py-2 text-sm text-gray-700'
                          )
                        },
                        'Logout'
                      )
                    )
                )
              )
            )
          )
        )
      )
    )
  )
}

// app/components/content.tsx
function Content({ children, actions, description, setMobileMenuOpen, title }) {
  return /* @__PURE__ */ React.createElement(
    'div',
    {
      className: 'flex flex-1 flex-col overflow-hidden'
    },
    /* @__PURE__ */ React.createElement(Navbar, {
      setMobileMenuOpen
    }),
    /* @__PURE__ */ React.createElement(
      'div',
      {
        className: 'flex flex-1 items-stretch overflow-hidden'
      },
      /* @__PURE__ */ React.createElement(
        'main',
        {
          className: 'flex-1 overflow-y-auto p-4'
        },
        /* @__PURE__ */ React.createElement(
          'section',
          {
            'aria-labelledby': 'primary-heading',
            className: 'flex h-full min-w-0 flex-1 flex-col lg:order-last'
          },
          /* @__PURE__ */ React.createElement(
            'h1',
            {
              id: 'primary-heading',
              className: 'sr-only'
            },
            title
          ),
          /* @__PURE__ */ React.createElement(
            'div',
            {
              className: 'flex justify-between'
            },
            /* @__PURE__ */ React.createElement(
              'div',
              {
                className: 'flex flex-col'
              },
              /* @__PURE__ */ React.createElement(
                'h1',
                {
                  className: 'text-3xl font-bold'
                },
                title
              ),
              /* @__PURE__ */ React.createElement('h3', null, description)
            ),
            /* @__PURE__ */ React.createElement(
              'div',
              {
                className: 'flex items-start'
              },
              actions
            )
          ),
          /* @__PURE__ */ React.createElement(
            'div',
            {
              className: 'mt-4'
            },
            children
          )
        )
      )
    )
  )
}

// app/components/mobile-menu.tsx
var import_react6 = require('@headlessui/react')
var import_react7 = require('react')
var import_outline2 = require('@heroicons/react/outline')
function classNames2(...classes) {
  return classes.filter(Boolean).join(' ')
}
function MobileMenu({
  sidebarNavigation: sidebarNavigation2,
  mobileMenuOpen,
  setMobileMenuOpen
}) {
  return /* @__PURE__ */ React.createElement(
    import_react6.Transition.Root,
    {
      show: mobileMenuOpen,
      as: import_react7.Fragment
    },
    /* @__PURE__ */ React.createElement(
      import_react6.Dialog,
      {
        as: 'div',
        className: 'relative z-20 md:hidden',
        onClose: setMobileMenuOpen
      },
      /* @__PURE__ */ React.createElement(
        import_react6.Transition.Child,
        {
          as: import_react7.Fragment,
          enter: 'transition-opacity ease-linear duration-300',
          enterFrom: 'opacity-0',
          enterTo: 'opacity-100',
          leave: 'transition-opacity ease-linear duration-300',
          leaveFrom: 'opacity-100',
          leaveTo: 'opacity-0'
        },
        /* @__PURE__ */ React.createElement('div', {
          className: 'fixed inset-0 bg-gray-600 bg-opacity-75'
        })
      ),
      /* @__PURE__ */ React.createElement(
        'div',
        {
          className: 'fixed inset-0 z-40 flex'
        },
        /* @__PURE__ */ React.createElement(
          import_react6.Transition.Child,
          {
            as: import_react7.Fragment,
            enter: 'transition ease-in-out duration-300 transform',
            enterFrom: '-translate-x-full',
            enterTo: 'translate-x-0',
            leave: 'transition ease-in-out duration-300 transform',
            leaveFrom: 'translate-x-0',
            leaveTo: '-translate-x-full'
          },
          /* @__PURE__ */ React.createElement(
            import_react6.Dialog.Panel,
            {
              className:
                'relative flex w-full max-w-xs flex-1 flex-col bg-indigo-700 pt-5 pb-4'
            },
            /* @__PURE__ */ React.createElement(
              import_react6.Transition.Child,
              {
                as: import_react7.Fragment,
                enter: 'ease-in-out duration-300',
                enterFrom: 'opacity-0',
                enterTo: 'opacity-100',
                leave: 'ease-in-out duration-300',
                leaveFrom: 'opacity-100',
                leaveTo: 'opacity-0'
              },
              /* @__PURE__ */ React.createElement(
                'div',
                {
                  className: 'absolute top-1 right-0 -mr-14 p-1'
                },
                /* @__PURE__ */ React.createElement(
                  'button',
                  {
                    type: 'button',
                    className:
                      'flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white',
                    onClick: () => setMobileMenuOpen(false)
                  },
                  /* @__PURE__ */ React.createElement(import_outline2.XIcon, {
                    className: 'h-6 w-6 text-white',
                    'aria-hidden': 'true'
                  }),
                  /* @__PURE__ */ React.createElement(
                    'span',
                    {
                      className: 'sr-only'
                    },
                    'Close sidebar'
                  )
                )
              )
            ),
            /* @__PURE__ */ React.createElement(
              'div',
              {
                className: 'flex flex-shrink-0 items-center px-4'
              },
              /* @__PURE__ */ React.createElement('img', {
                className: 'h-8 w-auto',
                src: 'https://tailwindui.com/img/logos/workflow-mark.svg?color=white',
                alt: 'Workflow'
              })
            ),
            /* @__PURE__ */ React.createElement(
              'div',
              {
                className: 'mt-5 h-0 flex-1 overflow-y-auto px-2'
              },
              /* @__PURE__ */ React.createElement(
                'nav',
                {
                  className: 'flex h-full flex-col'
                },
                /* @__PURE__ */ React.createElement(
                  'div',
                  {
                    className: 'space-y-1'
                  },
                  sidebarNavigation2.map(item =>
                    /* @__PURE__ */ React.createElement(
                      'a',
                      {
                        key: item.name,
                        href: item.to,
                        className: classNames2(
                          item.current
                            ? 'bg-indigo-800 text-white'
                            : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                          'group flex items-center rounded-md py-2 px-3 text-sm font-medium'
                        ),
                        'aria-current': item.current ? 'page' : void 0
                      },
                      /* @__PURE__ */ React.createElement(item.icon, {
                        className: classNames2(
                          item.current
                            ? 'text-white'
                            : 'text-indigo-300 group-hover:text-white',
                          'mr-3 h-6 w-6'
                        ),
                        'aria-hidden': 'true'
                      }),
                      /* @__PURE__ */ React.createElement(
                        'span',
                        null,
                        item.name
                      )
                    )
                  )
                )
              )
            )
          )
        ),
        /* @__PURE__ */ React.createElement('div', {
          className: 'w-14 flex-shrink-0',
          'aria-hidden': 'true'
        })
      )
    )
  )
}

// app/components/sidebar.tsx
var import_react8 = require('@remix-run/react')
function classNames3(...classes) {
  return classes.filter(Boolean).join(' ')
}
function Sidebar({ sidebarNavigation: sidebarNavigation2 }) {
  return /* @__PURE__ */ React.createElement(
    'div',
    {
      className: 'hidden w-28 overflow-y-auto bg-indigo-700 md:block'
    },
    /* @__PURE__ */ React.createElement(
      'div',
      {
        className: 'flex w-full flex-col items-center py-6'
      },
      /* @__PURE__ */ React.createElement(
        'div',
        {
          className: 'flex flex-shrink-0 items-center'
        },
        /* @__PURE__ */ React.createElement(
          import_react8.Link,
          {
            to: '/'
          },
          /* @__PURE__ */ React.createElement('img', {
            className: 'h-8 w-auto',
            src: 'https://tailwindui.com/img/logos/workflow-mark.svg?color=white',
            alt: 'Workflow'
          })
        )
      ),
      /* @__PURE__ */ React.createElement(
        'div',
        {
          className: 'mt-6 w-full flex-1 space-y-1 px-2'
        },
        sidebarNavigation2.map(item =>
          /* @__PURE__ */ React.createElement(
            import_react8.NavLink,
            {
              key: item.name,
              to: item.to,
              className: ({ isActive }) =>
                `group flex w-full flex-col items-center rounded-md p-3 text-xs font-medium ${
                  isActive
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`
            },
            /* @__PURE__ */ React.createElement(item.icon, {
              className: classNames3(
                item.current
                  ? 'text-white'
                  : 'text-indigo-300 group-hover:text-white',
                'h-6 w-6'
              ),
              'aria-hidden': 'true'
            }),
            /* @__PURE__ */ React.createElement(
              'span',
              {
                className: 'mt-2'
              },
              item.name
            )
          )
        )
      )
    )
  )
}

// app/components/page.tsx
var sidebarNavigation = [
  {
    name: 'Timelines',
    to: '/timelines',
    icon: import_outline3.HomeIcon,
    current: false
  },
  {
    name: 'Events',
    to: '/events',
    icon: import_outline3.ViewGridIcon,
    current: false
  },
  {
    name: 'People',
    to: '/people',
    icon: import_outline3.PhotographIcon,
    current: true
  }
]
function Page({ children, actions, description, title }) {
  const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react9.useState)(false)
  return /* @__PURE__ */ React.createElement(
    'div',
    {
      className: 'flex h-full'
    },
    /* @__PURE__ */ React.createElement(Sidebar, {
      sidebarNavigation
    }),
    /* @__PURE__ */ React.createElement(MobileMenu, {
      setMobileMenuOpen,
      mobileMenuOpen,
      sidebarNavigation
    }),
    /* @__PURE__ */ React.createElement(
      Content,
      {
        description,
        title,
        actions,
        setMobileMenuOpen
      },
      children
    )
  )
}

// app/models/timeline.server.ts
function getTimeline({ id, userId }) {
  return prisma.timeline.findFirst({
    where: { id, userId }
  })
}
function getTimelineListItems({ userId }) {
  const timelines = prisma.timeline.findMany({
    where: { userId },
    include: {
      _count: {
        select: { Event: true }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })
  return timelines
}
function createTimeline({ description, title, userId }) {
  return prisma.timeline.create({
    data: {
      title,
      description,
      user: {
        connect: {
          id: userId
        }
      }
    }
  })
}
function updateTimeline({ id, description, title }) {
  return prisma.timeline.update({
    where: {
      id
    },
    data: {
      description,
      title
    }
  })
}
function deleteTimeline({ id, userId }) {
  return prisma.timeline.deleteMany({
    where: { id, userId }
  })
}

// route:/Users/andreas/Development/linje/app/routes/timeline.$timelineId.edit.tsx
var loader2 = async ({ request, params }) => {
  const userId = await requireUserId(request)
  ;(0, import_tiny_invariant2.default)(
    params.timelineId,
    'timelineId not found'
  )
  const timeline = await getTimeline({ userId, id: params.timelineId })
  if (!timeline) {
    throw new Response('Not Found', { status: 404 })
  }
  return (0, import_node3.json)({ timeline })
}
var action = async ({ request }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const title = formData.get('title')
  const description = formData.get('description')
  const id = formData.get('timelineId')
  if (typeof title !== 'string' || title.length === 0) {
    return (0, import_node3.json)(
      { errors: { title: 'Title is required' } },
      { status: 400 }
    )
  }
  if (typeof description !== 'string' || description.length === 0) {
    return (0, import_node3.json)(
      { errors: { description: 'Description is required' } },
      { status: 400 }
    )
  }
  if (typeof id !== 'string' || id.length === 0) {
    return (0, import_node3.json)(
      { errors: { description: 'id is required' } },
      { status: 400 }
    )
  }
  const timeline = await updateTimeline({ title, description, userId, id })
  return (0, import_node3.redirect)(`/timeline/${timeline.id}/events`)
}
function EditTimelinePage() {
  var _a, _b, _c, _d, _e, _f, _g
  const data = (0, import_react10.useLoaderData)()
  const actionData = (0, import_react10.useActionData)()
  const titleRef = React2.useRef(null)
  const descriptionRef = React2.useRef(null)
  React2.useEffect(() => {
    var _a2, _b2, _c2, _d2
    if (
      (_a2 = actionData == null ? void 0 : actionData.errors) == null
        ? void 0
        : _a2.title
    ) {
      ;(_b2 = titleRef.current) == null ? void 0 : _b2.focus()
    } else if (
      (_c2 = actionData == null ? void 0 : actionData.errors) == null
        ? void 0
        : _c2.description
    ) {
      ;(_d2 = descriptionRef.current) == null ? void 0 : _d2.focus()
    }
  }, [actionData])
  return /* @__PURE__ */ React2.createElement(
    Page,
    {
      title: 'Edit Timeline'
    },
    /* @__PURE__ */ React2.createElement(
      import_react10.Form,
      {
        method: 'post',
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          width: '100%'
        }
      },
      /* @__PURE__ */ React2.createElement('input', {
        type: 'hidden',
        name: 'timelineId',
        value: data.timeline.id
      }),
      /* @__PURE__ */ React2.createElement(
        'div',
        null,
        /* @__PURE__ */ React2.createElement(
          'label',
          {
            htmlFor: 'title',
            className: 'block text-sm font-medium text-gray-700'
          },
          'Title:'
        ),
        /* @__PURE__ */ React2.createElement(
          'div',
          {
            className: 'mt-1'
          },
          /* @__PURE__ */ React2.createElement('input', {
            id: 'title',
            ref: titleRef,
            name: 'title',
            className:
              'flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose',
            'aria-invalid': (
              (_a = actionData == null ? void 0 : actionData.errors) == null
                ? void 0
                : _a.title
            )
              ? true
              : void 0,
            'aria-errormessage': (
              (_b = actionData == null ? void 0 : actionData.errors) == null
                ? void 0
                : _b.title
            )
              ? 'title-error'
              : void 0,
            defaultValue: data.timeline.title,
            'aria-describedby': 'email-error'
          }),
          ((_c = actionData == null ? void 0 : actionData.errors) == null
            ? void 0
            : _c.title) &&
            /* @__PURE__ */ React2.createElement(
              'div',
              {
                className:
                  'pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'
              },
              /* @__PURE__ */ React2.createElement(
                import_outline4.ExclamationCircleIcon,
                {
                  className: 'h-5 w-5 text-red-500',
                  'aria-hidden': 'true'
                }
              )
            ),
          ((_d = actionData == null ? void 0 : actionData.errors) == null
            ? void 0
            : _d.title) &&
            /* @__PURE__ */ React2.createElement(
              'p',
              {
                className: 'mt-2 text-sm text-red-600',
                id: 'title-error'
              },
              actionData.errors.title
            )
        )
      ),
      /* @__PURE__ */ React2.createElement(
        'div',
        null,
        /* @__PURE__ */ React2.createElement(
          'label',
          {
            htmlFor: 'comment',
            className: 'block text-sm font-medium text-gray-700'
          },
          'Description'
        ),
        /* @__PURE__ */ React2.createElement(
          'div',
          {
            className: 'mt-1'
          },
          /* @__PURE__ */ React2.createElement('textarea', {
            rows: 4,
            name: 'description',
            ref: descriptionRef,
            className:
              'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
            defaultValue: data.timeline.description,
            'aria-invalid': (
              (_e = actionData == null ? void 0 : actionData.errors) == null
                ? void 0
                : _e.description
            )
              ? true
              : void 0,
            'aria-errormessage': (
              (_f = actionData == null ? void 0 : actionData.errors) == null
                ? void 0
                : _f.description
            )
              ? 'body-error'
              : void 0
          })
        ),
        ((_g = actionData == null ? void 0 : actionData.errors) == null
          ? void 0
          : _g.description) &&
          /* @__PURE__ */ React2.createElement(
            'div',
            {
              className: 'pt-1 text-red-700',
              id: 'body-error'
            },
            actionData.errors.description
          )
      ),
      /* @__PURE__ */ React2.createElement(
        'div',
        {
          className: 'text-right'
        },
        /* @__PURE__ */ React2.createElement(
          'button',
          {
            type: 'submit',
            className:
              'rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400'
          },
          'Save'
        )
      )
    )
  )
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId.tsx
var timelineId_exports = {}
__export(timelineId_exports, {
  CatchBoundary: () => CatchBoundary,
  ErrorBoundary: () => ErrorBoundary,
  action: () => action2,
  default: () => TimelineDetailsPage,
  loader: () => loader3
})
var import_node4 = require('@remix-run/node')
var import_react11 = require('@remix-run/react')
var import_tiny_invariant3 = __toESM(require('tiny-invariant'))
var import_outline5 = require('@heroicons/react/outline')
var loader3 = async ({ request, params }) => {
  const userId = await requireUserId(request)
  ;(0, import_tiny_invariant3.default)(
    params.timelineId,
    'timelineId not found'
  )
  const timeline = await getTimeline({ userId, id: params.timelineId })
  if (!timeline) {
    throw new Response('Not Found', { status: 404 })
  }
  return (0, import_node4.json)({ timeline })
}
var action2 = async ({ request, params }) => {
  const userId = await requireUserId(request)
  ;(0, import_tiny_invariant3.default)(
    params.timelineId,
    'timelineId not found'
  )
  await deleteTimeline({ userId, id: params.timelineId })
  return (0, import_node4.redirect)('/timelines')
}
function TimelineDetailsPage() {
  const data = (0, import_react11.useLoaderData)()
  return /* @__PURE__ */ React.createElement(
    Page,
    {
      description: data.timeline.description,
      title: data.timeline.title,
      actions: /* @__PURE__ */ React.createElement(
        React.Fragment,
        null,
        /* @__PURE__ */ React.createElement(
          import_react11.Link,
          {
            to: '/timelines',
            className:
              'inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800'
          },
          /* @__PURE__ */ React.createElement(import_outline5.XIcon, {
            className: '-ml-0.5 mr-2 h-4 w-4',
            'aria-hidden': 'true'
          }),
          'Close'
        ),
        /* @__PURE__ */ React.createElement(
          import_react11.Form,
          {
            method: 'post'
          },
          /* @__PURE__ */ React.createElement(
            'button',
            {
              type: 'submit',
              className:
                'ml-3 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800'
            },
            /* @__PURE__ */ React.createElement(import_outline5.TrashIcon, {
              className: '-ml-0.5 mr-2 h-4 w-4',
              'aria-hidden': 'true'
            }),
            'Delete'
          )
        ),
        /* @__PURE__ */ React.createElement(
          import_react11.Link,
          {
            to: 'edit',
            className:
              'ml-3 inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-orange-800'
          },
          /* @__PURE__ */ React.createElement(import_outline5.PencilIcon, {
            className: '-ml-0.5 mr-2 h-4 w-4',
            'aria-hidden': 'true'
          }),
          'Edit'
        )
      )
    },
    /* @__PURE__ */ React.createElement(
      'div',
      null,
      /* @__PURE__ */ React.createElement(
        'div',
        {
          className: 'sm:hidden'
        },
        /* @__PURE__ */ React.createElement(
          'label',
          {
            htmlFor: 'tabs',
            className: 'sr-only'
          },
          'Select a tab'
        ),
        /* @__PURE__ */ React.createElement(
          'select',
          {
            id: 'tabs',
            name: 'tabs',
            className:
              'block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm',
            defaultValue: 'events'
          },
          /* @__PURE__ */ React.createElement('option', null, 'Events'),
          /* @__PURE__ */ React.createElement('option', null, 'People'),
          /* @__PURE__ */ React.createElement('option', null, 'Places')
        )
      ),
      /* @__PURE__ */ React.createElement(
        'div',
        {
          className: 'hidden sm:block'
        },
        /* @__PURE__ */ React.createElement(
          'div',
          {
            className: 'border-b border-gray-200'
          },
          /* @__PURE__ */ React.createElement(
            'nav',
            {
              className: '-mb-px flex space-x-8',
              'aria-label': 'Tabs'
            },
            /* @__PURE__ */ React.createElement(
              import_react11.NavLink,
              {
                to: 'events',
                className: ({ isActive }) =>
                  `flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700'
                  }`
              },
              'Events'
            ),
            /* @__PURE__ */ React.createElement(
              import_react11.NavLink,
              {
                to: 'places',
                className: ({ isActive }) =>
                  `flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700'
                  }`
              },
              'Places'
            ),
            /* @__PURE__ */ React.createElement(
              import_react11.NavLink,
              {
                to: 'people',
                className: ({ isActive }) =>
                  `flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700'
                  }`
              },
              'People'
            )
          )
        )
      )
    ),
    /* @__PURE__ */ React.createElement(import_react11.Outlet, null)
  )
}
function ErrorBoundary({ error }) {
  console.error(error)
  return /* @__PURE__ */ React.createElement(
    'div',
    null,
    'An unexpected error occurred: ',
    error.message
  )
}
function CatchBoundary() {
  const caught = (0, import_react11.useCatch)()
  if (caught.status === 404) {
    return /* @__PURE__ */ React.createElement(
      'div',
      null,
      'Timeline not found'
    )
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events.tsx
var events_exports = {}
__export(events_exports, {
  default: () => EventsTab,
  loader: () => loader4
})
var import_outline6 = require('@heroicons/react/outline')
var import_react12 = require('@remix-run/react')
var import_server_runtime = require('@remix-run/server-runtime')
var import_tiny_invariant4 = __toESM(require('tiny-invariant'))

// app/models/event.server.ts
function getEvent({ id }) {
  return prisma.event.findFirst({
    where: { id }
  })
}
function getEventListItems({ timelineId }) {
  return prisma.event.findMany({
    where: { timelineId },
    orderBy: { startDate: 'desc' }
  })
}
function createEvent({ content, startDate, timelineId, title, userId }) {
  return prisma.event.create({
    data: {
      title,
      content,
      startDate,
      timeline: {
        connect: {
          id: timelineId
        }
      },
      user: {
        connect: {
          id: userId
        }
      }
    }
  })
}
function updateEvent({ id, content, startDate, title, userId }) {
  return prisma.event.update({
    where: {
      id
    },
    data: {
      title,
      content,
      startDate
    }
  })
}
function deleteEvent({ id, userId }) {
  return prisma.event.deleteMany({
    where: { id, userId }
  })
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events.tsx
var loader4 = async ({ request, params }) => {
  await requireUserId(request)
  ;(0, import_tiny_invariant4.default)(
    params.timelineId,
    'timelineId not found'
  )
  const events = await getEventListItems({ timelineId: params.timelineId })
  return (0, import_server_runtime.json)({ events })
}
function EventsTab() {
  const data = (0, import_react12.useLoaderData)()
  return /* @__PURE__ */ React.createElement(
    React.Fragment,
    null,
    /* @__PURE__ */ React.createElement(
      'div',
      {
        className: 'flex flex-1 items-stretch overflow-hidden'
      },
      /* @__PURE__ */ React.createElement(
        'main',
        {
          className: 'flex-1 overflow-y-auto p-4'
        },
        /* @__PURE__ */ React.createElement(
          'section',
          {
            className: 'flex h-full min-w-0 flex-1 flex-col lg:order-last'
          },
          /* @__PURE__ */ React.createElement(
            'div',
            {
              className: 'flex justify-between'
            },
            /* @__PURE__ */ React.createElement(
              import_react12.Link,
              {
                to: 'new',
                className:
                  'flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800'
              },
              /* @__PURE__ */ React.createElement(import_outline6.PlusIcon, {
                className: '-ml-1 mr-3 h-5 w-5',
                'aria-hidden': 'true'
              }),
              'Add Event'
            )
          ),
          data.events.length > 0
            ? /* @__PURE__ */ React.createElement(
                'div',
                {
                  className:
                    'mt-4 overflow-hidden bg-white shadow sm:rounded-md'
                },
                /* @__PURE__ */ React.createElement(
                  'ul',
                  {
                    role: 'list',
                    className: 'divide-y divide-gray-200'
                  },
                  data.events.map(event =>
                    /* @__PURE__ */ React.createElement(
                      'li',
                      {
                        key: event.title
                      },
                      /* @__PURE__ */ React.createElement(
                        import_react12.Link,
                        {
                          to: event.id,
                          className: 'block hover:bg-gray-50'
                        },
                        /* @__PURE__ */ React.createElement(
                          'div',
                          {
                            className: 'flex items-center px-4 py-4 sm:px-6'
                          },
                          /* @__PURE__ */ React.createElement(
                            'div',
                            {
                              className: 'flex min-w-0 flex-1 items-center'
                            },
                            /* @__PURE__ */ React.createElement(
                              'div',
                              {
                                className:
                                  'min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4'
                              },
                              /* @__PURE__ */ React.createElement(
                                'div',
                                null,
                                /* @__PURE__ */ React.createElement(
                                  'p',
                                  {
                                    className:
                                      'truncate text-sm font-medium text-indigo-600'
                                  },
                                  event.title
                                ),
                                /* @__PURE__ */ React.createElement(
                                  'p',
                                  {
                                    className:
                                      'mt-2 flex items-center text-sm text-gray-500'
                                  },
                                  /* @__PURE__ */ React.createElement(
                                    'span',
                                    {
                                      className: 'truncate'
                                    },
                                    event.startDate
                                  )
                                )
                              ),
                              /* @__PURE__ */ React.createElement(
                                'div',
                                {
                                  className: 'hidden md:block'
                                },
                                /* @__PURE__ */ React.createElement(
                                  'div',
                                  null,
                                  /* @__PURE__ */ React.createElement(
                                    'p',
                                    {
                                      className: 'text-sm text-gray-900'
                                    },
                                    event.content
                                  )
                                )
                              )
                            )
                          ),
                          /* @__PURE__ */ React.createElement(
                            'div',
                            null,
                            /* @__PURE__ */ React.createElement(
                              import_outline6.ChevronRightIcon,
                              {
                                className: 'h-5 w-5 text-gray-400',
                                'aria-hidden': 'true'
                              }
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            : /* @__PURE__ */ React.createElement('p', null, 'No events')
        )
      ),
      /* @__PURE__ */ React.createElement(
        'aside',
        {
          className:
            'hidden w-96 overflow-y-auto border-l border-gray-200 p-4 lg:block'
        },
        /* @__PURE__ */ React.createElement(import_react12.Outlet, null)
      )
    )
  )
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events/$eventId.edit.tsx
var eventId_edit_exports = {}
__export(eventId_edit_exports, {
  action: () => action3,
  default: () => EditEvent,
  loader: () => loader5
})
var import_node5 = require('@remix-run/node')
var import_react14 = require('@remix-run/react')
var React3 = __toESM(require('react'))
var import_tiny_invariant5 = __toESM(require('tiny-invariant'))

// app/components/event-card.tsx
var import_react13 = require('@remix-run/react')
function EventCard({ content, startDate, title }) {
  return /* @__PURE__ */ React.createElement(
    'div',
    {
      className: 'bg-white p-4'
    },
    /* @__PURE__ */ React.createElement(
      'h3',
      {
        className: 'mb-4 text-2xl font-bold'
      },
      'Title: ',
      title
    ),
    /* @__PURE__ */ React.createElement('p', null, 'Content: ', content),
    /* @__PURE__ */ React.createElement('p', null, 'Year: ', startDate),
    /* @__PURE__ */ React.createElement('hr', {
      className: 'my-4'
    }),
    /* @__PURE__ */ React.createElement(
      import_react13.Form,
      {
        method: 'post'
      },
      /* @__PURE__ */ React.createElement('input', {
        name: 'timelineId',
        hidden: true
      }),
      /* @__PURE__ */ React.createElement(
        import_react13.Link,
        {
          to: 'edit',
          className:
            'rounded bg-orange-500 py-2 px-4 text-white hover:bg-orange-600 focus:bg-orange-400'
        },
        'Edit'
      ),
      /* @__PURE__ */ React.createElement(
        'button',
        {
          type: 'submit',
          className:
            'rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400'
        },
        'Delete'
      )
    )
  )
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events/$eventId.edit.tsx
function validateEventTitle(title) {
  if (title.length === 0) {
    return 'You must add a title'
  }
}
function validateEventContent(content) {
  if (typeof content !== 'string') {
    return 'Content must be a string'
  }
}
function validateEventStartDate(startDate) {
  if (startDate.length === 0) {
    return 'You must select a start date'
  }
}
var loader5 = async ({ request, params }) => {
  await requireUserId(request)
  ;(0, import_tiny_invariant5.default)(params.eventId, 'eventId not found')
  const event = await getEvent({ id: params.eventId })
  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }
  return (0, import_node5.json)({ event })
}
var badRequest = data => (0, import_node5.json)(data, { status: 400 })
var action3 = async ({ request, params }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const timelineId = params.timelineId
  ;(0, import_tiny_invariant5.default)(timelineId, 'Timeline ID is required')
  const eventId = params.eventId
  ;(0, import_tiny_invariant5.default)(eventId, 'Event ID is required')
  const title = formData.get('title')
  const content = formData.get('content')
  const startDate = formData.get('startDate')
  if (
    typeof title !== 'string' ||
    typeof content !== 'string' ||
    typeof startDate !== 'string'
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`
    })
  }
  const fieldErrors = {
    title: validateEventTitle(title),
    content: validateEventContent(content),
    startDate: validateEventStartDate(startDate)
  }
  const fields = { title, content, startDate, timelineId }
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }
  await updateEvent({
    title,
    content,
    startDate,
    userId,
    id: eventId
  })
  return (0, import_node5.redirect)(
    `/timeline/${params.timelineId}/events/${params.eventId}`
  )
}
function EditEvent() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l
  const data = (0, import_react14.useLoaderData)()
  const transition = (0, import_react14.useTransition)()
  const actionData = (0, import_react14.useActionData)()
  const titleRef = React3.useRef(null)
  const contentRef = React3.useRef(null)
  const startDateRef = React3.useRef(null)
  React3.useEffect(() => {
    var _a2, _b2, _c2, _d2, _e2, _f2
    if (
      (_a2 = actionData == null ? void 0 : actionData.fieldErrors) == null
        ? void 0
        : _a2.title
    ) {
      ;(_b2 = titleRef.current) == null ? void 0 : _b2.focus()
    } else if (
      (_c2 = actionData == null ? void 0 : actionData.fieldErrors) == null
        ? void 0
        : _c2.content
    ) {
      ;(_d2 = contentRef.current) == null ? void 0 : _d2.focus()
    } else if (
      (_e2 = actionData == null ? void 0 : actionData.fieldErrors) == null
        ? void 0
        : _e2.startDate
    ) {
      ;(_f2 = startDateRef.current) == null ? void 0 : _f2.focus()
    }
  }, [actionData])
  if (transition.submission) {
    const title = transition.submission.formData.get('title')
    const content = transition.submission.formData.get('content')
    const startDate = transition.submission.formData.get('startDate')
    if (
      typeof title === 'string' &&
      typeof content === 'string' &&
      typeof startDate === 'string' &&
      !validateEventTitle(title) &&
      !validateEventContent(content) &&
      !validateEventStartDate(startDate)
    ) {
      return /* @__PURE__ */ React3.createElement(EventCard, {
        content,
        startDate,
        title
      })
    }
  }
  return /* @__PURE__ */ React3.createElement(
    import_react14.Form,
    {
      method: 'post',
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%'
      }
    },
    /* @__PURE__ */ React3.createElement(
      'div',
      null,
      /* @__PURE__ */ React3.createElement(
        'label',
        {
          className: 'flex w-full flex-col gap-1'
        },
        /* @__PURE__ */ React3.createElement('span', null, 'Title: '),
        /* @__PURE__ */ React3.createElement('input', {
          defaultValue: data == null ? void 0 : data.event.title,
          ref: titleRef,
          name: 'title',
          className:
            'flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose',
          'aria-invalid': (
            (_a = actionData == null ? void 0 : actionData.fieldErrors) == null
              ? void 0
              : _a.title
          )
            ? true
            : void 0,
          'aria-errormessage': (
            (_b = actionData == null ? void 0 : actionData.fieldErrors) == null
              ? void 0
              : _b.title
          )
            ? 'title-error'
            : void 0
        })
      ),
      ((_c = actionData == null ? void 0 : actionData.fieldErrors) == null
        ? void 0
        : _c.title) &&
        /* @__PURE__ */ React3.createElement(
          'div',
          {
            className: 'pt-1 text-red-700',
            id: 'title-error'
          },
          (_d = actionData == null ? void 0 : actionData.fieldErrors) == null
            ? void 0
            : _d.title
        )
    ),
    /* @__PURE__ */ React3.createElement(
      'div',
      null,
      /* @__PURE__ */ React3.createElement(
        'label',
        {
          className: 'flex w-full flex-col gap-1'
        },
        /* @__PURE__ */ React3.createElement('span', null, 'Content: '),
        /* @__PURE__ */ React3.createElement('textarea', {
          defaultValue: (data == null ? void 0 : data.event.content) || '',
          ref: contentRef,
          name: 'content',
          rows: 4,
          className:
            'w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6',
          'aria-invalid': (
            (_e = actionData == null ? void 0 : actionData.fieldErrors) == null
              ? void 0
              : _e.content
          )
            ? true
            : void 0,
          'aria-errormessage': (
            (_f = actionData == null ? void 0 : actionData.fieldErrors) == null
              ? void 0
              : _f.content
          )
            ? 'body-error'
            : void 0
        })
      ),
      ((_g = actionData == null ? void 0 : actionData.fieldErrors) == null
        ? void 0
        : _g.content) &&
        /* @__PURE__ */ React3.createElement(
          'div',
          {
            className: 'pt-1 text-red-700',
            id: 'body-error'
          },
          (_h = actionData == null ? void 0 : actionData.fieldErrors) == null
            ? void 0
            : _h.content
        )
    ),
    /* @__PURE__ */ React3.createElement(
      'div',
      null,
      /* @__PURE__ */ React3.createElement(
        'label',
        {
          className: 'flex w-full flex-col gap-1'
        },
        /* @__PURE__ */ React3.createElement('span', null, 'Start Date: '),
        /* @__PURE__ */ React3.createElement('input', {
          ref: startDateRef,
          type: 'number',
          defaultValue: data == null ? void 0 : data.event.startDate,
          name: 'startDate',
          className:
            'flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose',
          'aria-invalid': (
            (_i = actionData == null ? void 0 : actionData.fieldErrors) == null
              ? void 0
              : _i.startDate
          )
            ? true
            : void 0,
          'aria-errormessage': (
            (_j = actionData == null ? void 0 : actionData.fieldErrors) == null
              ? void 0
              : _j.startDate
          )
            ? 'body-error'
            : void 0
        })
      ),
      ((_k = actionData == null ? void 0 : actionData.fieldErrors) == null
        ? void 0
        : _k.startDate) &&
        /* @__PURE__ */ React3.createElement(
          'div',
          {
            className: 'pt-1 text-red-700',
            id: 'body-error'
          },
          (_l = actionData == null ? void 0 : actionData.fieldErrors) == null
            ? void 0
            : _l.startDate
        )
    ),
    /* @__PURE__ */ React3.createElement(
      'div',
      {
        className: 'text-right'
      },
      /* @__PURE__ */ React3.createElement(
        'button',
        {
          type: 'submit',
          className:
            'rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400'
        },
        'Save'
      )
    )
  )
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events/$eventId.tsx
var eventId_exports = {}
__export(eventId_exports, {
  CatchBoundary: () => CatchBoundary2,
  ErrorBoundary: () => ErrorBoundary2,
  action: () => action4,
  default: () => EventDetailsPage,
  loader: () => loader6
})
var import_node6 = require('@remix-run/node')
var import_react15 = require('@remix-run/react')
var import_tiny_invariant6 = __toESM(require('tiny-invariant'))
var loader6 = async ({ request, params }) => {
  await requireUserId(request)
  ;(0, import_tiny_invariant6.default)(params.eventId, 'eventId not found')
  const event = await getEvent({ id: params.eventId })
  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }
  console.log(event)
  return (0, import_node6.json)({ event })
}
var action4 = async ({ request, params }) => {
  const userId = await requireUserId(request)
  ;(0, import_tiny_invariant6.default)(params.eventId, 'eventId not found')
  await deleteEvent({ userId, id: params.eventId })
  return (0, import_node6.redirect)(`/timeline/${params.timelineId}/events`)
}
function EventDetailsPage() {
  const data = (0, import_react15.useLoaderData)()
  return /* @__PURE__ */ React.createElement(EventCard, {
    title: data.event.title,
    content: data.event.content,
    startDate: data.event.startDate
  })
}
function ErrorBoundary2({ error }) {
  console.error(error)
  return /* @__PURE__ */ React.createElement(
    'div',
    null,
    'An unexpected error occurred: ',
    error.message
  )
}
function CatchBoundary2() {
  const caught = (0, import_react15.useCatch)()
  if (caught.status === 404) {
    return /* @__PURE__ */ React.createElement('div', null, 'Event not found')
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events/index.tsx
var events_exports2 = {}
__export(events_exports2, {
  default: () => EventIndex
})
function EventIndex() {
  return /* @__PURE__ */ React.createElement(
    'div',
    null,
    'Select or create an event'
  )
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/events/new.tsx
var new_exports = {}
__export(new_exports, {
  action: () => action5,
  default: () => NewEventPage
})
var import_node7 = require('@remix-run/node')
var import_react16 = require('@remix-run/react')
var import_react17 = __toESM(require('react'))
var import_tiny_invariant7 = __toESM(require('tiny-invariant'))
function validateEventTitle2(title) {
  if (title.length === 0) {
    return 'You must add a title'
  }
}
function validateEventContent2(content) {
  if (typeof content !== 'string') {
    return 'Content must be a string'
  }
}
function validateEventStartDate2(startDate) {
  if (startDate.length === 0) {
    return 'You must select a start date'
  }
}
var badRequest2 = data => (0, import_node7.json)(data, { status: 400 })
var action5 = async ({ request, params }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const title = formData.get('title')
  const content = formData.get('content')
  const startDate = formData.get('startDate')
  const timelineId = params.timelineId
  ;(0, import_tiny_invariant7.default)(timelineId, 'Timeline ID is required')
  if (
    typeof title !== 'string' ||
    typeof content !== 'string' ||
    typeof startDate !== 'string'
  ) {
    return badRequest2({
      formError: `Form not submitted correctly.`
    })
  }
  const fieldErrors = {
    title: validateEventTitle2(title),
    content: validateEventContent2(content),
    startDate: validateEventStartDate2(startDate)
  }
  const fields = { title, content, startDate, timelineId }
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest2({ fieldErrors, fields })
  }
  const event = await createEvent({
    title,
    content,
    startDate,
    timelineId,
    userId
  })
  return (0, import_node7.redirect)(
    `/timeline/${timelineId}/events/${event.id}`
  )
}
function NewEventPage() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k
  const actionData = (0, import_react16.useActionData)()
  const transition = (0, import_react16.useTransition)()
  const titleRef = import_react17.default.useRef(null)
  const contentRef = import_react17.default.useRef(null)
  const startDateRef = import_react17.default.useRef(null)
  import_react17.default.useEffect(() => {
    var _a2, _b2, _c2, _d2, _e2, _f2
    if (
      (_a2 = actionData == null ? void 0 : actionData.fieldErrors) == null
        ? void 0
        : _a2.title
    ) {
      ;(_b2 = titleRef.current) == null ? void 0 : _b2.focus()
    } else if (
      (_c2 = actionData == null ? void 0 : actionData.fieldErrors) == null
        ? void 0
        : _c2.content
    ) {
      ;(_d2 = contentRef.current) == null ? void 0 : _d2.focus()
    } else if (
      (_e2 = actionData == null ? void 0 : actionData.fieldErrors) == null
        ? void 0
        : _e2.startDate
    ) {
      ;(_f2 = startDateRef.current) == null ? void 0 : _f2.focus()
    }
  }, [actionData])
  if (transition.submission) {
    const title = transition.submission.formData.get('title')
    const content = transition.submission.formData.get('content')
    const startDate = transition.submission.formData.get('startDate')
    if (
      typeof title === 'string' &&
      typeof content === 'string' &&
      typeof startDate === 'string' &&
      !validateEventTitle2(title) &&
      !validateEventContent2(content) &&
      !validateEventStartDate2(startDate)
    ) {
      return /* @__PURE__ */ import_react17.default.createElement(EventCard, {
        content,
        startDate,
        title
      })
    }
  }
  return /* @__PURE__ */ import_react17.default.createElement(
    import_react16.Form,
    {
      method: 'post',
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%'
      }
    },
    /* @__PURE__ */ import_react17.default.createElement(
      'div',
      null,
      /* @__PURE__ */ import_react17.default.createElement(
        'label',
        {
          className: 'flex w-full flex-col gap-1'
        },
        /* @__PURE__ */ import_react17.default.createElement(
          'span',
          null,
          'Title: '
        ),
        /* @__PURE__ */ import_react17.default.createElement('input', {
          ref: titleRef,
          defaultValue:
            (_a = actionData == null ? void 0 : actionData.fields) == null
              ? void 0
              : _a.title,
          name: 'title',
          className:
            'flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose',
          'aria-invalid':
            Boolean(
              (_b = actionData == null ? void 0 : actionData.fieldErrors) ==
                null
                ? void 0
                : _b.title
            ) || void 0,
          'aria-errormessage': (
            (_c = actionData == null ? void 0 : actionData.fieldErrors) == null
              ? void 0
              : _c.title
          )
            ? 'title-error'
            : void 0
        })
      ),
      ((_d = actionData == null ? void 0 : actionData.fieldErrors) == null
        ? void 0
        : _d.title) &&
        /* @__PURE__ */ import_react17.default.createElement(
          'div',
          {
            className: 'pt-1 text-red-700',
            id: 'title-error'
          },
          actionData.fieldErrors.title
        )
    ),
    /* @__PURE__ */ import_react17.default.createElement(
      'div',
      null,
      /* @__PURE__ */ import_react17.default.createElement(
        'label',
        {
          className: 'flex w-full flex-col gap-1'
        },
        /* @__PURE__ */ import_react17.default.createElement(
          'span',
          null,
          'Content: '
        ),
        /* @__PURE__ */ import_react17.default.createElement('textarea', {
          ref: contentRef,
          defaultValue:
            (_e = actionData == null ? void 0 : actionData.fields) == null
              ? void 0
              : _e.content,
          name: 'content',
          rows: 4,
          className:
            'w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6',
          'aria-invalid':
            Boolean(
              (_f = actionData == null ? void 0 : actionData.fieldErrors) ==
                null
                ? void 0
                : _f.content
            ) || void 0,
          'aria-errormessage': (
            (_g = actionData == null ? void 0 : actionData.fieldErrors) == null
              ? void 0
              : _g.content
          )
            ? 'content-error'
            : void 0
        })
      ),
      ((_h = actionData == null ? void 0 : actionData.fieldErrors) == null
        ? void 0
        : _h.content) &&
        /* @__PURE__ */ import_react17.default.createElement(
          'div',
          {
            className: 'pt-1 text-red-700',
            id: 'content-error'
          },
          actionData.fieldErrors.content
        )
    ),
    /* @__PURE__ */ import_react17.default.createElement(
      'div',
      null,
      /* @__PURE__ */ import_react17.default.createElement(
        'label',
        {
          className: 'flex w-full flex-col gap-1'
        },
        /* @__PURE__ */ import_react17.default.createElement(
          'span',
          null,
          'Year: '
        ),
        /* @__PURE__ */ import_react17.default.createElement('input', {
          ref: startDateRef,
          name: 'startDate',
          className:
            'flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose',
          'aria-invalid':
            Boolean(
              (_i = actionData == null ? void 0 : actionData.fieldErrors) ==
                null
                ? void 0
                : _i.startDate
            ) || void 0,
          'aria-errormessage': (
            (_j = actionData == null ? void 0 : actionData.fieldErrors) == null
              ? void 0
              : _j.startDate
          )
            ? 'startdate-error'
            : void 0
        })
      ),
      ((_k = actionData == null ? void 0 : actionData.fieldErrors) == null
        ? void 0
        : _k.startDate) &&
        /* @__PURE__ */ import_react17.default.createElement(
          'div',
          {
            className: 'pt-1 text-red-700',
            id: 'startdate-error'
          },
          actionData.fieldErrors.startDate
        )
    ),
    /* @__PURE__ */ import_react17.default.createElement(
      'div',
      {
        className: 'text-right'
      },
      /* @__PURE__ */ import_react17.default.createElement(
        'button',
        {
          type: 'submit',
          className:
            'rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400'
        },
        'Save'
      )
    )
  )
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/people.tsx
var people_exports = {}
__export(people_exports, {
  default: () => PeopleTab
})
function PeopleTab() {
  return /* @__PURE__ */ React.createElement('div', null, 'People')
}

// route:/Users/andreas/Development/linje/app/routes/timeline/$timelineId/places.tsx
var places_exports = {}
__export(places_exports, {
  default: () => PlacesTab
})
function PlacesTab() {
  return /* @__PURE__ */ React.createElement('div', null, 'Places')
}

// route:/Users/andreas/Development/linje/app/routes/timelines.new.tsx
var timelines_new_exports = {}
__export(timelines_new_exports, {
  action: () => action6,
  default: () => NewTimelinePage
})
var import_outline7 = require('@heroicons/react/outline')
var import_node8 = require('@remix-run/node')
var import_react18 = require('@remix-run/react')
var React5 = __toESM(require('react'))
var action6 = async ({ request }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const title = formData.get('title')
  const description = formData.get('description')
  if (typeof title !== 'string' || title.length === 0) {
    return (0, import_node8.json)(
      { errors: { title: 'Title is required' } },
      { status: 400 }
    )
  }
  if (typeof description !== 'string' || description.length === 0) {
    return (0, import_node8.json)(
      { errors: { description: 'Description is required' } },
      { status: 400 }
    )
  }
  const timeline = await createTimeline({ title, description, userId })
  return (0, import_node8.redirect)(`/timeline/${timeline.id}/events`)
}
function NewTimelinePage() {
  var _a, _b, _c, _d, _e, _f, _g
  const actionData = (0, import_react18.useActionData)()
  const titleRef = React5.useRef(null)
  const descriptionRef = React5.useRef(null)
  React5.useEffect(() => {
    var _a2, _b2, _c2, _d2
    if (
      (_a2 = actionData == null ? void 0 : actionData.errors) == null
        ? void 0
        : _a2.title
    ) {
      ;(_b2 = titleRef.current) == null ? void 0 : _b2.focus()
    } else if (
      (_c2 = actionData == null ? void 0 : actionData.errors) == null
        ? void 0
        : _c2.description
    ) {
      ;(_d2 = descriptionRef.current) == null ? void 0 : _d2.focus()
    }
  }, [actionData])
  return /* @__PURE__ */ React5.createElement(
    Page,
    {
      title: 'New Timeline'
    },
    /* @__PURE__ */ React5.createElement(
      import_react18.Form,
      {
        method: 'post',
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          width: '100%'
        }
      },
      /* @__PURE__ */ React5.createElement(
        'div',
        null,
        /* @__PURE__ */ React5.createElement(
          'label',
          {
            htmlFor: 'title',
            className: 'block text-sm font-medium text-gray-700'
          },
          'Title:'
        ),
        /* @__PURE__ */ React5.createElement(
          'div',
          {
            className: 'mt-1'
          },
          /* @__PURE__ */ React5.createElement('input', {
            id: 'title',
            ref: titleRef,
            name: 'title',
            className:
              'flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose focus:border-indigo-500 focus:ring-indigo-500',
            'aria-invalid': (
              (_a = actionData == null ? void 0 : actionData.errors) == null
                ? void 0
                : _a.title
            )
              ? true
              : void 0,
            'aria-errormessage': (
              (_b = actionData == null ? void 0 : actionData.errors) == null
                ? void 0
                : _b.title
            )
              ? 'title-error'
              : void 0,
            placeholder: 'My awesome timeline',
            defaultValue: '',
            'aria-describedby': 'email-error'
          }),
          ((_c = actionData == null ? void 0 : actionData.errors) == null
            ? void 0
            : _c.title) &&
            /* @__PURE__ */ React5.createElement(
              'div',
              {
                className:
                  'pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'
              },
              /* @__PURE__ */ React5.createElement(
                import_outline7.ExclamationCircleIcon,
                {
                  className: 'h-5 w-5 text-red-500',
                  'aria-hidden': 'true'
                }
              )
            ),
          ((_d = actionData == null ? void 0 : actionData.errors) == null
            ? void 0
            : _d.title) &&
            /* @__PURE__ */ React5.createElement(
              'p',
              {
                className: 'mt-2 text-sm text-red-600',
                id: 'title-error'
              },
              actionData.errors.title
            )
        )
      ),
      /* @__PURE__ */ React5.createElement(
        'div',
        null,
        /* @__PURE__ */ React5.createElement(
          'label',
          {
            htmlFor: 'comment',
            className: 'block text-sm font-medium text-gray-700'
          },
          'Description'
        ),
        /* @__PURE__ */ React5.createElement(
          'div',
          {
            className: 'mt-1'
          },
          /* @__PURE__ */ React5.createElement('textarea', {
            rows: 4,
            name: 'description',
            ref: descriptionRef,
            className:
              'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
            defaultValue: '',
            'aria-invalid': (
              (_e = actionData == null ? void 0 : actionData.errors) == null
                ? void 0
                : _e.description
            )
              ? true
              : void 0,
            'aria-errormessage': (
              (_f = actionData == null ? void 0 : actionData.errors) == null
                ? void 0
                : _f.description
            )
              ? 'body-error'
              : void 0
          })
        ),
        ((_g = actionData == null ? void 0 : actionData.errors) == null
          ? void 0
          : _g.description) &&
          /* @__PURE__ */ React5.createElement(
            'div',
            {
              className: 'pt-1 text-red-700',
              id: 'body-error'
            },
            actionData.errors.description
          )
      ),
      /* @__PURE__ */ React5.createElement(
        'div',
        {
          className: 'text-right'
        },
        /* @__PURE__ */ React5.createElement(
          'button',
          {
            type: 'submit',
            className:
              'rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400'
          },
          'Save'
        )
      )
    )
  )
}

// route:/Users/andreas/Development/linje/app/routes/healthcheck.tsx
var healthcheck_exports = {}
__export(healthcheck_exports, {
  loader: () => loader7
})
var loader7 = async ({ request }) => {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
  try {
    const url = new URL('/', `http://${host}`)
    await Promise.all([
      prisma.user.count(),
      fetch(url.toString(), { method: 'HEAD' }).then(r => {
        if (!r.ok) return Promise.reject(r)
      })
    ])
    return new Response('OK')
  } catch (error) {
    console.log('healthcheck \u274C', { error })
    return new Response('ERROR', { status: 500 })
  }
}

// route:/Users/andreas/Development/linje/app/routes/timelines.tsx
var timelines_exports = {}
__export(timelines_exports, {
  default: () => TimelinesPage,
  loader: () => loader8
})
var import_node9 = require('@remix-run/node')
var import_react19 = require('@remix-run/react')
var import_outline8 = require('@heroicons/react/outline')
function classNames4(...classes) {
  return classes.filter(Boolean).join(' ')
}
var loader8 = async ({ request }) => {
  const userId = await requireUserId(request)
  const timelineListItems = await getTimelineListItems({ userId })
  return (0, import_node9.json)({ timelineListItems })
}
function TimelinesPage() {
  const data = (0, import_react19.useLoaderData)()
  return /* @__PURE__ */ React.createElement(
    Page,
    {
      title: 'Your Timelines'
    },
    /* @__PURE__ */ React.createElement(
      import_react19.Link,
      {
        to: '/timelines/new',
        className:
          'inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
      },
      /* @__PURE__ */ React.createElement(import_outline8.PlusIcon, {
        className: '-ml-1 mr-2 h-5 w-5',
        'aria-hidden': 'true'
      }),
      'New Timeline'
    ),
    data.timelineListItems.length === 0
      ? /* @__PURE__ */ React.createElement(
          'p',
          {
            className: 'p-4'
          },
          'No timelines yet'
        )
      : /* @__PURE__ */ React.createElement(
          'ul',
          {
            className:
              'mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4'
          },
          data.timelineListItems.map(timeline =>
            /* @__PURE__ */ React.createElement(
              import_react19.Link,
              {
                key: timeline.title,
                to: `/timeline/${timeline.id}/events`,
                className: 'font-medium text-gray-900 hover:text-gray-600'
              },
              /* @__PURE__ */ React.createElement(
                'li',
                {
                  className: 'col-span-1 flex rounded-md shadow-sm'
                },
                /* @__PURE__ */ React.createElement(
                  'div',
                  {
                    className: classNames4(
                      'bg-pink-600',
                      'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
                    )
                  },
                  timeline.title.slice(0, 2)
                ),
                /* @__PURE__ */ React.createElement(
                  'div',
                  {
                    className:
                      'flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white'
                  },
                  /* @__PURE__ */ React.createElement(
                    'div',
                    {
                      className: 'flex-1 truncate px-4 py-2 text-sm'
                    },
                    timeline.title,
                    /* @__PURE__ */ React.createElement(
                      'p',
                      {
                        className: 'text-gray-500'
                      },
                      timeline._count.Event,
                      ' events'
                    )
                  )
                )
              )
            )
          )
        )
  )
}

// route:/Users/andreas/Development/linje/app/routes/profile.tsx
var profile_exports = {}
__export(profile_exports, {
  default: () => NotesPage
})

// app/utils.ts
var import_react20 = require('@remix-run/react')
var import_react21 = require('react')
var DEFAULT_REDIRECT = '/'
function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
  if (!to || typeof to !== 'string') {
    return defaultRedirect
  }
  if (!to.startsWith('/') || to.startsWith('//')) {
    return defaultRedirect
  }
  return to
}
function useMatchesData(id) {
  const matchingRoutes = (0, import_react20.useMatches)()
  const route = (0, import_react21.useMemo)(
    () => matchingRoutes.find(route2 => route2.id === id),
    [matchingRoutes, id]
  )
  return route == null ? void 0 : route.data
}
function isUser(user) {
  return user && typeof user === 'object' && typeof user.email === 'string'
}
function useOptionalUser() {
  const data = useMatchesData('root')
  if (!data || !isUser(data.user)) {
    return void 0
  }
  return data.user
}
function useUser() {
  const maybeUser = useOptionalUser()
  if (!maybeUser) {
    throw new Error(
      'No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.'
    )
  }
  return maybeUser
}
function validateEmail(email) {
  return typeof email === 'string' && email.length > 3 && email.includes('@')
}

// route:/Users/andreas/Development/linje/app/routes/profile.tsx
function NotesPage() {
  const user = useUser()
  return /* @__PURE__ */ React.createElement(
    Page,
    {
      title: 'Profile'
    },
    user.email
  )
}

// route:/Users/andreas/Development/linje/app/routes/__auth.tsx
var auth_exports = {}
__export(auth_exports, {
  default: () => AuthPage
})
var import_react22 = require('@remix-run/react')
function AuthPage() {
  return /* @__PURE__ */ React.createElement(import_react22.Outlet, null)
}

// route:/Users/andreas/Development/linje/app/routes/__auth/logout.tsx
var logout_exports = {}
__export(logout_exports, {
  action: () => action7,
  loader: () => loader9
})
var import_node10 = require('@remix-run/node')
var action7 = async ({ request }) => {
  return logout(request)
}
var loader9 = async () => {
  return (0, import_node10.redirect)('/')
}

// route:/Users/andreas/Development/linje/app/routes/__auth/login.tsx
var login_exports = {}
__export(login_exports, {
  action: () => action8,
  default: () => LoginPage,
  loader: () => loader10,
  meta: () => meta2
})
var import_node11 = require('@remix-run/node')
var import_react23 = require('@remix-run/react')
var React6 = __toESM(require('react'))
var loader10 = async ({ request }) => {
  const userId = await getUserId(request)
  if (userId) return (0, import_node11.redirect)('/')
  return (0, import_node11.json)({})
}
var action8 = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/timelines')
  const remember = formData.get('remember')
  if (!validateEmail(email)) {
    return (0, import_node11.json)(
      { errors: { email: 'Email is invalid' } },
      { status: 400 }
    )
  }
  if (typeof password !== 'string' || password.length === 0) {
    return (0, import_node11.json)(
      { errors: { password: 'Password is required' } },
      { status: 400 }
    )
  }
  if (password.length < 8) {
    return (0, import_node11.json)(
      { errors: { password: 'Password is too short' } },
      { status: 400 }
    )
  }
  const user = await verifyLogin(email, password)
  if (!user) {
    return (0, import_node11.json)(
      { errors: { email: 'Invalid email or password' } },
      { status: 400 }
    )
  }
  return createUserSession({
    request,
    userId: user.id,
    remember: remember === 'on' ? true : false,
    redirectTo
  })
}
var meta2 = () => {
  return {
    title: 'Login'
  }
}
function LoginPage() {
  var _a, _b, _c, _d
  const [searchParams] = (0, import_react23.useSearchParams)()
  const redirectTo = searchParams.get('redirectTo') || '/timelines'
  const actionData = (0, import_react23.useActionData)()
  const emailRef = React6.useRef(null)
  const passwordRef = React6.useRef(null)
  React6.useEffect(() => {
    var _a2, _b2, _c2, _d2
    if (
      (_a2 = actionData == null ? void 0 : actionData.errors) == null
        ? void 0
        : _a2.email
    ) {
      ;(_b2 = emailRef.current) == null ? void 0 : _b2.focus()
    } else if (
      (_c2 = actionData == null ? void 0 : actionData.errors) == null
        ? void 0
        : _c2.password
    ) {
      ;(_d2 = passwordRef.current) == null ? void 0 : _d2.focus()
    }
  }, [actionData])
  return /* @__PURE__ */ React6.createElement(
    'div',
    {
      className: 'flex min-h-full flex-col justify-center'
    },
    /* @__PURE__ */ React6.createElement(
      'div',
      {
        className: 'mx-auto w-full max-w-md px-8'
      },
      /* @__PURE__ */ React6.createElement(
        import_react23.Form,
        {
          method: 'post',
          className: 'space-y-6'
        },
        /* @__PURE__ */ React6.createElement(
          'div',
          null,
          /* @__PURE__ */ React6.createElement(
            'label',
            {
              htmlFor: 'email',
              className: 'block text-sm font-medium text-gray-700'
            },
            'Email address'
          ),
          /* @__PURE__ */ React6.createElement(
            'div',
            {
              className: 'mt-1'
            },
            /* @__PURE__ */ React6.createElement('input', {
              ref: emailRef,
              id: 'email',
              required: true,
              autoFocus: true,
              name: 'email',
              type: 'email',
              autoComplete: 'email',
              'aria-invalid': (
                (_a = actionData == null ? void 0 : actionData.errors) == null
                  ? void 0
                  : _a.email
              )
                ? true
                : void 0,
              'aria-describedby': 'email-error',
              className:
                'w-full rounded border border-gray-500 px-2 py-1 text-lg'
            }),
            ((_b = actionData == null ? void 0 : actionData.errors) == null
              ? void 0
              : _b.email) &&
              /* @__PURE__ */ React6.createElement(
                'div',
                {
                  className: 'pt-1 text-red-700',
                  id: 'email-error'
                },
                actionData.errors.email
              )
          )
        ),
        /* @__PURE__ */ React6.createElement(
          'div',
          null,
          /* @__PURE__ */ React6.createElement(
            'label',
            {
              htmlFor: 'password',
              className: 'block text-sm font-medium text-gray-700'
            },
            'Password'
          ),
          /* @__PURE__ */ React6.createElement(
            'div',
            {
              className: 'mt-1'
            },
            /* @__PURE__ */ React6.createElement('input', {
              id: 'password',
              ref: passwordRef,
              name: 'password',
              type: 'password',
              autoComplete: 'current-password',
              'aria-invalid': (
                (_c = actionData == null ? void 0 : actionData.errors) == null
                  ? void 0
                  : _c.password
              )
                ? true
                : void 0,
              'aria-describedby': 'password-error',
              className:
                'w-full rounded border border-gray-500 px-2 py-1 text-lg'
            }),
            ((_d = actionData == null ? void 0 : actionData.errors) == null
              ? void 0
              : _d.password) &&
              /* @__PURE__ */ React6.createElement(
                'div',
                {
                  className: 'pt-1 text-red-700',
                  id: 'password-error'
                },
                actionData.errors.password
              )
          )
        ),
        /* @__PURE__ */ React6.createElement('input', {
          type: 'hidden',
          name: 'redirectTo',
          value: redirectTo
        }),
        /* @__PURE__ */ React6.createElement(
          'button',
          {
            type: 'submit',
            className:
              'w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400'
          },
          'Log in'
        ),
        /* @__PURE__ */ React6.createElement(
          'div',
          {
            className: 'flex items-center justify-between'
          },
          /* @__PURE__ */ React6.createElement(
            'div',
            {
              className: 'flex items-center'
            },
            /* @__PURE__ */ React6.createElement('input', {
              id: 'remember',
              name: 'remember',
              type: 'checkbox',
              className:
                'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            }),
            /* @__PURE__ */ React6.createElement(
              'label',
              {
                htmlFor: 'remember',
                className: 'ml-2 block text-sm text-gray-900'
              },
              'Remember me'
            )
          ),
          /* @__PURE__ */ React6.createElement(
            'div',
            {
              className: 'text-center text-sm text-gray-500'
            },
            "Don't have an account?",
            ' ',
            /* @__PURE__ */ React6.createElement(
              import_react23.Link,
              {
                className: 'text-blue-500 underline',
                to: {
                  pathname: '/join',
                  search: searchParams.toString()
                }
              },
              'Sign up'
            )
          )
        )
      )
    )
  )
}

// route:/Users/andreas/Development/linje/app/routes/__auth/join.tsx
var join_exports = {}
__export(join_exports, {
  action: () => action9,
  default: () => Join,
  loader: () => loader11,
  meta: () => meta3
})
var import_node12 = require('@remix-run/node')
var import_react24 = require('@remix-run/react')
var React7 = __toESM(require('react'))
var loader11 = async ({ request }) => {
  const userId = await getUserId(request)
  if (userId) return (0, import_node12.redirect)('/')
  return (0, import_node12.json)({})
}
var action9 = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')
  if (!validateEmail(email)) {
    return (0, import_node12.json)(
      { errors: { email: 'Email is invalid' } },
      { status: 400 }
    )
  }
  if (typeof password !== 'string' || password.length === 0) {
    return (0, import_node12.json)(
      { errors: { password: 'Password is required' } },
      { status: 400 }
    )
  }
  if (password.length < 8) {
    return (0, import_node12.json)(
      { errors: { password: 'Password is too short' } },
      { status: 400 }
    )
  }
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return (0, import_node12.json)(
      { errors: { email: 'A user already exists with this email' } },
      { status: 400 }
    )
  }
  const user = await createUser(email, password)
  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo
  })
}
var meta3 = () => {
  return {
    title: 'Sign Up'
  }
}
function Join() {
  var _a, _b, _c, _d
  const [searchParams] = (0, import_react24.useSearchParams)()
  const redirectTo = searchParams.get('redirectTo') ?? void 0
  const actionData = (0, import_react24.useActionData)()
  const emailRef = React7.useRef(null)
  const passwordRef = React7.useRef(null)
  React7.useEffect(() => {
    var _a2, _b2, _c2, _d2
    if (
      (_a2 = actionData == null ? void 0 : actionData.errors) == null
        ? void 0
        : _a2.email
    ) {
      ;(_b2 = emailRef.current) == null ? void 0 : _b2.focus()
    } else if (
      (_c2 = actionData == null ? void 0 : actionData.errors) == null
        ? void 0
        : _c2.password
    ) {
      ;(_d2 = passwordRef.current) == null ? void 0 : _d2.focus()
    }
  }, [actionData])
  return /* @__PURE__ */ React7.createElement(
    'div',
    {
      className: 'flex min-h-full flex-col justify-center'
    },
    /* @__PURE__ */ React7.createElement(
      'div',
      {
        className: 'mx-auto w-full max-w-md px-8'
      },
      /* @__PURE__ */ React7.createElement(
        import_react24.Form,
        {
          method: 'post',
          className: 'space-y-6'
        },
        /* @__PURE__ */ React7.createElement(
          'div',
          null,
          /* @__PURE__ */ React7.createElement(
            'label',
            {
              htmlFor: 'email',
              className: 'block text-sm font-medium text-gray-700'
            },
            'Email address'
          ),
          /* @__PURE__ */ React7.createElement(
            'div',
            {
              className: 'mt-1'
            },
            /* @__PURE__ */ React7.createElement('input', {
              ref: emailRef,
              id: 'email',
              required: true,
              autoFocus: true,
              name: 'email',
              type: 'email',
              autoComplete: 'email',
              'aria-invalid': (
                (_a = actionData == null ? void 0 : actionData.errors) == null
                  ? void 0
                  : _a.email
              )
                ? true
                : void 0,
              'aria-describedby': 'email-error',
              className:
                'w-full rounded border border-gray-500 px-2 py-1 text-lg'
            }),
            ((_b = actionData == null ? void 0 : actionData.errors) == null
              ? void 0
              : _b.email) &&
              /* @__PURE__ */ React7.createElement(
                'div',
                {
                  className: 'pt-1 text-red-700',
                  id: 'email-error'
                },
                actionData.errors.email
              )
          )
        ),
        /* @__PURE__ */ React7.createElement(
          'div',
          null,
          /* @__PURE__ */ React7.createElement(
            'label',
            {
              htmlFor: 'password',
              className: 'block text-sm font-medium text-gray-700'
            },
            'Password'
          ),
          /* @__PURE__ */ React7.createElement(
            'div',
            {
              className: 'mt-1'
            },
            /* @__PURE__ */ React7.createElement('input', {
              id: 'password',
              ref: passwordRef,
              name: 'password',
              type: 'password',
              autoComplete: 'new-password',
              'aria-invalid': (
                (_c = actionData == null ? void 0 : actionData.errors) == null
                  ? void 0
                  : _c.password
              )
                ? true
                : void 0,
              'aria-describedby': 'password-error',
              className:
                'w-full rounded border border-gray-500 px-2 py-1 text-lg'
            }),
            ((_d = actionData == null ? void 0 : actionData.errors) == null
              ? void 0
              : _d.password) &&
              /* @__PURE__ */ React7.createElement(
                'div',
                {
                  className: 'pt-1 text-red-700',
                  id: 'password-error'
                },
                actionData.errors.password
              )
          )
        ),
        /* @__PURE__ */ React7.createElement('input', {
          type: 'hidden',
          name: 'redirectTo',
          value: redirectTo
        }),
        /* @__PURE__ */ React7.createElement(
          'button',
          {
            type: 'submit',
            className:
              'w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400'
          },
          'Create Account'
        ),
        /* @__PURE__ */ React7.createElement(
          'div',
          {
            className: 'flex items-center justify-center'
          },
          /* @__PURE__ */ React7.createElement(
            'div',
            {
              className: 'text-center text-sm text-gray-500'
            },
            'Already have an account?',
            ' ',
            /* @__PURE__ */ React7.createElement(
              import_react24.Link,
              {
                className: 'text-blue-500 underline',
                to: {
                  pathname: '/login',
                  search: searchParams.toString()
                }
              },
              'Log in'
            )
          )
        )
      )
    )
  )
}

// route:/Users/andreas/Development/linje/app/routes/events.tsx
var events_exports3 = {}
__export(events_exports3, {
  default: () => EventsPage
})
function EventsPage() {
  return /* @__PURE__ */ React.createElement(
    Page,
    {
      title: 'Event'
    },
    'Content'
  )
}

// route:/Users/andreas/Development/linje/app/routes/people.tsx
var people_exports2 = {}
__export(people_exports2, {
  default: () => PeoplePage
})
function PeoplePage() {
  return /* @__PURE__ */ React.createElement(
    Page,
    {
      title: 'Persons'
    },
    'Content'
  )
}

// route:/Users/andreas/Development/linje/app/routes/index.tsx
var routes_exports = {}
__export(routes_exports, {
  default: () => Index
})
var import_react25 = require('@remix-run/react')
function Index() {
  const user = useOptionalUser()
  return /* @__PURE__ */ React.createElement(
    'main',
    {
      className:
        'relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center'
    },
    /* @__PURE__ */ React.createElement(
      'div',
      {
        className: 'relative sm:pb-16 sm:pt-8'
      },
      /* @__PURE__ */ React.createElement(
        'div',
        {
          className: 'mx-auto max-w-7xl sm:px-6 lg:px-8'
        },
        /* @__PURE__ */ React.createElement(
          'div',
          {
            className: 'relative shadow-xl sm:overflow-hidden sm:rounded-2xl'
          },
          /* @__PURE__ */ React.createElement(
            'div',
            {
              className: 'absolute inset-0'
            },
            /* @__PURE__ */ React.createElement('img', {
              className: 'h-full w-full object-cover',
              src: 'https://user-images.githubusercontent.com/1500684/157774694-99820c51-8165-4908-a031-34fc371ac0d6.jpg',
              alt: 'Sonic Youth On Stage'
            }),
            /* @__PURE__ */ React.createElement('div', {
              className:
                'absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-multiply'
            })
          ),
          /* @__PURE__ */ React.createElement(
            'div',
            {
              className:
                'lg:pb-18 relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-32'
            },
            /* @__PURE__ */ React.createElement(
              'h1',
              {
                className:
                  'text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl'
              },
              /* @__PURE__ */ React.createElement(
                'span',
                {
                  className: 'block uppercase text-yellow-500 drop-shadow-md'
                },
                'Linjen'
              )
            ),
            /* @__PURE__ */ React.createElement(
              'p',
              {
                className:
                  'mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl'
              },
              'Create and visualize your own timelines.'
            ),
            /* @__PURE__ */ React.createElement(
              'div',
              {
                className:
                  'mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center'
              },
              user
                ? /* @__PURE__ */ React.createElement(
                    import_react25.Link,
                    {
                      to: '/timelines',
                      className:
                        'flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8'
                    },
                    'View Timelines for ',
                    user.email
                  )
                : /* @__PURE__ */ React.createElement(
                    'div',
                    {
                      className:
                        'space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0'
                    },
                    /* @__PURE__ */ React.createElement(
                      import_react25.Link,
                      {
                        to: '/join',
                        className:
                          'flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8'
                      },
                      'Sign up'
                    ),
                    /* @__PURE__ */ React.createElement(
                      import_react25.Link,
                      {
                        to: '/login',
                        className:
                          'flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600  '
                      },
                      'Log In'
                    )
                  )
            )
          )
        )
      )
    )
  )
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = {
  version: 'af2be91b',
  entry: {
    module: '/build/entry.client-6HKL6OJG.js',
    imports: [
      '/build/_shared/chunk-AGZHEPHC.js',
      '/build/_shared/chunk-JHDH5TR3.js',
      '/build/_shared/chunk-TOAMQMCD.js'
    ]
  },
  routes: {
    root: {
      id: 'root',
      parentId: void 0,
      path: '',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/root-NQOYFQ3H.js',
      imports: void 0,
      hasAction: false,
      hasLoader: true,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/__auth': {
      id: 'routes/__auth',
      parentId: 'root',
      path: void 0,
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/__auth-2VJOK5S7.js',
      imports: void 0,
      hasAction: false,
      hasLoader: false,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/__auth/join': {
      id: 'routes/__auth/join',
      parentId: 'routes/__auth',
      path: 'join',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/__auth/join-O545K3VW.js',
      imports: [
        '/build/_shared/chunk-3V4ADGL7.js',
        '/build/_shared/chunk-HOUF2PTN.js',
        '/build/_shared/chunk-QZ2JY2QN.js'
      ],
      hasAction: true,
      hasLoader: true,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/__auth/login': {
      id: 'routes/__auth/login',
      parentId: 'routes/__auth',
      path: 'login',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/__auth/login-6J5L6OFC.js',
      imports: [
        '/build/_shared/chunk-3V4ADGL7.js',
        '/build/_shared/chunk-HOUF2PTN.js',
        '/build/_shared/chunk-QZ2JY2QN.js'
      ],
      hasAction: true,
      hasLoader: true,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/__auth/logout': {
      id: 'routes/__auth/logout',
      parentId: 'routes/__auth',
      path: 'logout',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/__auth/logout-VXS7MIBN.js',
      imports: void 0,
      hasAction: true,
      hasLoader: true,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/events': {
      id: 'routes/events',
      parentId: 'root',
      path: 'events',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/events-UBV6MCMR.js',
      imports: [
        '/build/_shared/chunk-WIHCV3RN.js',
        '/build/_shared/chunk-TV6QL2ME.js'
      ],
      hasAction: false,
      hasLoader: false,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/healthcheck': {
      id: 'routes/healthcheck',
      parentId: 'root',
      path: 'healthcheck',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/healthcheck-WV5R6TBM.js',
      imports: void 0,
      hasAction: false,
      hasLoader: true,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/index': {
      id: 'routes/index',
      parentId: 'root',
      path: void 0,
      index: true,
      caseSensitive: void 0,
      module: '/build/routes/index-NCLNX45W.js',
      imports: ['/build/_shared/chunk-HOUF2PTN.js'],
      hasAction: false,
      hasLoader: false,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/people': {
      id: 'routes/people',
      parentId: 'root',
      path: 'people',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/people-264FLWLE.js',
      imports: [
        '/build/_shared/chunk-WIHCV3RN.js',
        '/build/_shared/chunk-TV6QL2ME.js'
      ],
      hasAction: false,
      hasLoader: false,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/profile': {
      id: 'routes/profile',
      parentId: 'root',
      path: 'profile',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/profile-YEPT34HM.js',
      imports: [
        '/build/_shared/chunk-HOUF2PTN.js',
        '/build/_shared/chunk-WIHCV3RN.js',
        '/build/_shared/chunk-TV6QL2ME.js'
      ],
      hasAction: false,
      hasLoader: false,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/timeline.$timelineId.edit': {
      id: 'routes/timeline.$timelineId.edit',
      parentId: 'root',
      path: 'timeline/:timelineId/edit',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/timeline.$timelineId.edit-GKVPTJ2M.js',
      imports: [
        '/build/_shared/chunk-UKEWH2SY.js',
        '/build/_shared/chunk-WIHCV3RN.js',
        '/build/_shared/chunk-TV6QL2ME.js',
        '/build/_shared/chunk-QZ2JY2QN.js'
      ],
      hasAction: true,
      hasLoader: true,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/timeline/$timelineId': {
      id: 'routes/timeline/$timelineId',
      parentId: 'root',
      path: 'timeline/:timelineId',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/timeline/$timelineId-QWDROA7Q.js',
      imports: [
        '/build/_shared/chunk-UKEWH2SY.js',
        '/build/_shared/chunk-WIHCV3RN.js',
        '/build/_shared/chunk-TV6QL2ME.js',
        '/build/_shared/chunk-QZ2JY2QN.js'
      ],
      hasAction: true,
      hasLoader: true,
      hasCatchBoundary: true,
      hasErrorBoundary: true
    },
    'routes/timeline/$timelineId/events': {
      id: 'routes/timeline/$timelineId/events',
      parentId: 'routes/timeline/$timelineId',
      path: 'events',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/timeline/$timelineId/events-KLOFCUQO.js',
      imports: ['/build/_shared/chunk-CLCWU2RD.js'],
      hasAction: false,
      hasLoader: true,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/timeline/$timelineId/events/$eventId': {
      id: 'routes/timeline/$timelineId/events/$eventId',
      parentId: 'routes/timeline/$timelineId/events',
      path: ':eventId',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/timeline/$timelineId/events/$eventId-47QVKXVO.js',
      imports: [
        '/build/_shared/chunk-M546VJAT.js',
        '/build/_shared/chunk-QZ2JY2QN.js'
      ],
      hasAction: true,
      hasLoader: true,
      hasCatchBoundary: true,
      hasErrorBoundary: true
    },
    'routes/timeline/$timelineId/events/$eventId.edit': {
      id: 'routes/timeline/$timelineId/events/$eventId.edit',
      parentId: 'routes/timeline/$timelineId/events',
      path: ':eventId/edit',
      index: void 0,
      caseSensitive: void 0,
      module:
        '/build/routes/timeline/$timelineId/events/$eventId.edit-TPLCNRW5.js',
      imports: [
        '/build/_shared/chunk-M546VJAT.js',
        '/build/_shared/chunk-QZ2JY2QN.js'
      ],
      hasAction: true,
      hasLoader: true,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/timeline/$timelineId/events/index': {
      id: 'routes/timeline/$timelineId/events/index',
      parentId: 'routes/timeline/$timelineId/events',
      path: void 0,
      index: true,
      caseSensitive: void 0,
      module: '/build/routes/timeline/$timelineId/events/index-T7CS52OW.js',
      imports: void 0,
      hasAction: false,
      hasLoader: false,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/timeline/$timelineId/events/new': {
      id: 'routes/timeline/$timelineId/events/new',
      parentId: 'routes/timeline/$timelineId/events',
      path: 'new',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/timeline/$timelineId/events/new-DI2MAC5M.js',
      imports: [
        '/build/_shared/chunk-M546VJAT.js',
        '/build/_shared/chunk-QZ2JY2QN.js'
      ],
      hasAction: true,
      hasLoader: false,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/timeline/$timelineId/people': {
      id: 'routes/timeline/$timelineId/people',
      parentId: 'routes/timeline/$timelineId',
      path: 'people',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/timeline/$timelineId/people-Z3XX35YZ.js',
      imports: void 0,
      hasAction: false,
      hasLoader: false,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/timeline/$timelineId/places': {
      id: 'routes/timeline/$timelineId/places',
      parentId: 'routes/timeline/$timelineId',
      path: 'places',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/timeline/$timelineId/places-Y4RAPYKS.js',
      imports: void 0,
      hasAction: false,
      hasLoader: false,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/timelines': {
      id: 'routes/timelines',
      parentId: 'root',
      path: 'timelines',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/timelines-QGEJPGZN.js',
      imports: [
        '/build/_shared/chunk-UKEWH2SY.js',
        '/build/_shared/chunk-WIHCV3RN.js',
        '/build/_shared/chunk-TV6QL2ME.js',
        '/build/_shared/chunk-QZ2JY2QN.js'
      ],
      hasAction: false,
      hasLoader: true,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    },
    'routes/timelines.new': {
      id: 'routes/timelines.new',
      parentId: 'root',
      path: 'timelines/new',
      index: void 0,
      caseSensitive: void 0,
      module: '/build/routes/timelines.new-YKFQOHDY.js',
      imports: [
        '/build/_shared/chunk-UKEWH2SY.js',
        '/build/_shared/chunk-WIHCV3RN.js',
        '/build/_shared/chunk-TV6QL2ME.js',
        '/build/_shared/chunk-QZ2JY2QN.js'
      ],
      hasAction: true,
      hasLoader: false,
      hasCatchBoundary: false,
      hasErrorBoundary: false
    }
  },
  url: '/build/manifest-AF2BE91B.js'
}

// server-entry-module:@remix-run/dev/server-build
var entry = { module: entry_server_exports }
var routes = {
  root: {
    id: 'root',
    parentId: void 0,
    path: '',
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  'routes/timeline.$timelineId.edit': {
    id: 'routes/timeline.$timelineId.edit',
    parentId: 'root',
    path: 'timeline/:timelineId/edit',
    index: void 0,
    caseSensitive: void 0,
    module: timeline_timelineId_edit_exports
  },
  'routes/timeline/$timelineId': {
    id: 'routes/timeline/$timelineId',
    parentId: 'root',
    path: 'timeline/:timelineId',
    index: void 0,
    caseSensitive: void 0,
    module: timelineId_exports
  },
  'routes/timeline/$timelineId/events': {
    id: 'routes/timeline/$timelineId/events',
    parentId: 'routes/timeline/$timelineId',
    path: 'events',
    index: void 0,
    caseSensitive: void 0,
    module: events_exports
  },
  'routes/timeline/$timelineId/events/$eventId.edit': {
    id: 'routes/timeline/$timelineId/events/$eventId.edit',
    parentId: 'routes/timeline/$timelineId/events',
    path: ':eventId/edit',
    index: void 0,
    caseSensitive: void 0,
    module: eventId_edit_exports
  },
  'routes/timeline/$timelineId/events/$eventId': {
    id: 'routes/timeline/$timelineId/events/$eventId',
    parentId: 'routes/timeline/$timelineId/events',
    path: ':eventId',
    index: void 0,
    caseSensitive: void 0,
    module: eventId_exports
  },
  'routes/timeline/$timelineId/events/index': {
    id: 'routes/timeline/$timelineId/events/index',
    parentId: 'routes/timeline/$timelineId/events',
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: events_exports2
  },
  'routes/timeline/$timelineId/events/new': {
    id: 'routes/timeline/$timelineId/events/new',
    parentId: 'routes/timeline/$timelineId/events',
    path: 'new',
    index: void 0,
    caseSensitive: void 0,
    module: new_exports
  },
  'routes/timeline/$timelineId/people': {
    id: 'routes/timeline/$timelineId/people',
    parentId: 'routes/timeline/$timelineId',
    path: 'people',
    index: void 0,
    caseSensitive: void 0,
    module: people_exports
  },
  'routes/timeline/$timelineId/places': {
    id: 'routes/timeline/$timelineId/places',
    parentId: 'routes/timeline/$timelineId',
    path: 'places',
    index: void 0,
    caseSensitive: void 0,
    module: places_exports
  },
  'routes/timelines.new': {
    id: 'routes/timelines.new',
    parentId: 'root',
    path: 'timelines/new',
    index: void 0,
    caseSensitive: void 0,
    module: timelines_new_exports
  },
  'routes/healthcheck': {
    id: 'routes/healthcheck',
    parentId: 'root',
    path: 'healthcheck',
    index: void 0,
    caseSensitive: void 0,
    module: healthcheck_exports
  },
  'routes/timelines': {
    id: 'routes/timelines',
    parentId: 'root',
    path: 'timelines',
    index: void 0,
    caseSensitive: void 0,
    module: timelines_exports
  },
  'routes/profile': {
    id: 'routes/profile',
    parentId: 'root',
    path: 'profile',
    index: void 0,
    caseSensitive: void 0,
    module: profile_exports
  },
  'routes/__auth': {
    id: 'routes/__auth',
    parentId: 'root',
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: auth_exports
  },
  'routes/__auth/logout': {
    id: 'routes/__auth/logout',
    parentId: 'routes/__auth',
    path: 'logout',
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  'routes/__auth/login': {
    id: 'routes/__auth/login',
    parentId: 'routes/__auth',
    path: 'login',
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  'routes/__auth/join': {
    id: 'routes/__auth/join',
    parentId: 'routes/__auth',
    path: 'join',
    index: void 0,
    caseSensitive: void 0,
    module: join_exports
  },
  'routes/events': {
    id: 'routes/events',
    parentId: 'root',
    path: 'events',
    index: void 0,
    caseSensitive: void 0,
    module: events_exports3
  },
  'routes/people': {
    id: 'routes/people',
    parentId: 'root',
    path: 'people',
    index: void 0,
    caseSensitive: void 0,
    module: people_exports2
  },
  'routes/index': {
    id: 'routes/index',
    parentId: 'root',
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: routes_exports
  }
}

// server/index.js
var server_default = (0, import_vercel.createRequestHandler)({
  build: server_build_exports,
  mode: 'production'
})
module.exports = __toCommonJS(server_exports)
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {})
