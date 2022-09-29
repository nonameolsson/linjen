import { Dialog, Transition } from '@headlessui/react'
import { Box, Grid, Menu, SimpleGrid, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { ExternalLink, Location, Timeline } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Link,
  useActionData,
  useCatch,
  useFetcher,
  useLoaderData,
  useTransition
} from '@remix-run/react'
import { IconEdit, IconTrash } from '@tabler/icons'
import { Fragment, useEffect, useRef, useState } from 'react'
import invariant from 'tiny-invariant'
import { z } from 'zod'

import {
  ContentModule,
  LinkList,
  List,
  OverflowButton,
  Page,
  TextField
} from '~/components'
import { SidebarWidget } from '~/components/sidebar-widget'
import type { Event } from '~/models/event.server'
import { deleteEvent, getEvent } from '~/models/event.server'
import { createLink } from '~/models/externalLink'
import { requireUserId } from '~/session.server'
import { badRequestWithError } from '~/utils/index'

const linkFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters long' }), // TODO: Add translation
  url: z.string().url()
})
type LinkFormSchema = z.infer<typeof linkFormSchema> // Infer the schema from Zod

type ActionData = {
  formPayload?: LinkFormSchema
  error?: any
}

type LoaderData = {
  redirectTo?: string
  event: Event & {
    referencedBy: Event[]
    referencing: Event[]
    location: Location[]
    externalLinks: ExternalLink[]
    timelines: {
      id: Timeline['id']
      title: Timeline['title']
    }[]
  }
}

const DEFAULT_REDIRECT = 'timelines'

// TODO: Add Zod valiation on params
export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request)

  invariant(params.eventId, 'eventId not found')

  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('from') || undefined

  const event = await getEvent(params.eventId)
  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ event, redirectTo })
}

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.eventId, 'eventId not found')
  await requireUserId(request)

  const formData = await request.formData()
  let action = formData.get('action')

  switch (action) {
    case 'add-link': {
      try {
        const result = linkFormSchema.parse(Object.fromEntries(formData))
        const { title, url } = result

        await createLink({ data: { title, url }, eventId: params.eventId })
        return json({ ok: true })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return badRequestWithError({
            error,
            formPayload: Object.fromEntries(formData),
            status: 400
          })
        }
        throw json(error, { status: 400 }) // Unknown error, should not happen
      }
    }

    case 'delete-event': {
      try {
        await deleteEvent(params.eventId)

        let redirectTo: string | undefined = DEFAULT_REDIRECT
        const optionalRedirect: string | undefined = formData
          .get('redirectTo')
          ?.toString()

        if (
          typeof optionalRedirect === 'string' &&
          optionalRedirect.length > 0
        ) {
          redirectTo = optionalRedirect
        }

        return redirect(redirectTo)
      } catch (error) {
        throw json(error, { status: 400 }) // Unknown error, should not happen
      }
    }
    default: {
      throw new Error('Unexpected action')
    }
  }
}

function NewLinkDialog({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}): JSX.Element {
  const transition = useTransition()
  const fetcher = useFetcher()
  const actionData = useActionData<ActionData>()
  const titleRef = useRef<HTMLInputElement>(null)
  const urlRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (fetcher.type === 'done' && fetcher.data.ok) {
      onClose()
    }
  }, [fetcher, onClose])

  useEffect(() => {
    if (actionData?.error?.title) {
      titleRef.current?.focus()
    } else if (actionData?.error?.content) {
      urlRef.current?.focus()
    }
  }, [actionData])

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={onClose}
        >
          <div className='modal-open modal modal-bottom sm:modal-middle'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0' />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='modal-box'>
                <fetcher.Form id='new-link' method='post'>
                  <div className='sm:flex sm:items-start'>
                    <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                      <Dialog.Title as='h3' className='text-lg font-bold'>
                        Add link
                      </Dialog.Title>
                      <div className='mt-2'>
                        <TextField
                          name='title'
                          label='Title'
                          ref={titleRef}
                          errorMessage={actionData?.error?.title?._errors[0]}
                        />
                        <TextField
                          name='url'
                          type='url'
                          label='URL'
                          ref={urlRef}
                          errorMessage={actionData?.error?.url?._errors[0]}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='modal-action'>
                    <button
                      disabled={transition.state === 'submitting'}
                      name='action'
                      value='add-link'
                      type='submit'
                      className='btn primary'
                    >
                      Save
                    </button>
                  </div>
                </fetcher.Form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default function EventDetailsPage() {
  const data = useLoaderData<LoaderData>()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)

  const [isOpenLinkDialog, setIsOpenLinkDialog] = useState<boolean>(false)

  function closeDeleteModal(): void {
    setIsOpen(false)
  }

  function openDeleteModal(): void {
    setIsOpen(true)
  }

  function openLinkDialog(): void {
    setIsOpenLinkDialog(true)
  }

  function closeLinkDialog(): void {
    setIsOpenLinkDialog(false)
  }

  const referencedEvents = [
    ...data.event.referencedBy,
    ...data.event.referencing
  ]

  return (
    <Page
      title={data.event.title}
      showBackButton
      toolbarButtons={
        <Menu shadow='md' width={200} position='bottom-end'>
          <Menu.Target>
            <OverflowButton />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<IconEdit size={14} />} component={Link} to='edit'>
              Edit
            </Menu.Item>
            <Menu.Item
              onClick={openDeleteModal}
              color='red'
              icon={<IconTrash size={14} />}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      }
      aside={
        <>
          <SidebarWidget>
            <List
              title='Timelines'
              items={data.event.timelines.map(timeline => {
                return {
                  linkTo: timeline.id,
                  title: timeline.title,
                  id: timeline.id
                }
              })}
            />
          </SidebarWidget>

          <SidebarWidget>
            <List
              title='Events'
              items={referencedEvents.map(event => {
                return {
                  title: event.title,
                  linkTo: event.id,
                  description: event.content || undefined,
                  id: event.id
                }
              })}
            />
          </SidebarWidget>

          <SidebarWidget>
            <List
              title='Locations'
              items={data.event.location.map(location => {
                return {
                  linkTo: `location/${location.id}`,
                  title: location.title,
                  id: location.id
                }
              })}
            />
          </SidebarWidget>
        </>
      }
    >
      <Box px='xl' py='md'>
        <Grid>
          <Grid.Col span={12} lg={12}>
            <ContentModule title='Event Information'>
              <SimpleGrid cols={2}>
                <div>
                  Start Date
                  {new Intl.DateTimeFormat('sv-SE').format(
                    new Date(data.event.startDate)
                  )}
                </div>
                <div>
                  Content
                  {data.event.content}
                </div>
              </SimpleGrid>
              <LinkList
                onNewClick={openLinkDialog}
                title='Links'
                items={data.event.externalLinks.map(link => ({
                  title: link.title,
                  url: link.url,
                  id: link.id
                }))}
              />
            </ContentModule>
          </Grid.Col>
        </Grid>
      </Box>
      <NewLinkDialog isOpen={isOpenLinkDialog} onClose={closeLinkDialog} />
      {/* <Content
        desktopNavbar={
          <PageHeader
            title={data.event.title}
            description='Last updated'
            descriptionExtra={new Intl.DateTimeFormat('sv-SE').format(
              new Date()
            )}
            actions={
              <>
                <button
                  onClick={openDeleteModal}
                  className='btn btn-error btn-outline'
                >
                  Delete
                </button>
                <Link to='edit' className='btn btn-primary'>
                  Edit
                </Link>
              </>
            }
          />
        }
      >
        {/* <ContentModule title='Event Information'>
          <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Start Date</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {new Intl.DateTimeFormat('sv-SE').format(
                  new Date(data.event.startDate)
                )}
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>End Date</dt>
              <dd className='mt-1 text-sm text-gray-900'>END DATE HERE</dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>
                Salary expectation
              </dt>
              <dd className='mt-1 text-sm text-gray-900'>$120,000</dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>End Date</dt>
              <dd className='mt-1 text-sm text-gray-900'>END DATE HERE</dd>
            </div>
            <div className='sm:col-span-2'>
              <dt className='text-sm font-medium text-gray-500'>Description</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {data.event.content}
              </dd>
            </div>
            <div className='sm:col-span-2'>
              <LinkList
                onNewClick={openLinkDialog}
                title='Links'
                items={data.event.externalLinks.map(link => ({
                  title: link.title,
                  url: link.url,
                  id: link.id
                }))}
              />
            </div>
          </dl>
        </ContentModule> */}

      {/* <Modal
          icon={
            <ExclamationIcon
              className='h-6 w-6 text-red-600'
              aria-hidden='true'
            />
          }
          isOpen={isOpen}
          description='Do you really want to delete this event?'
          closeModal={closeDeleteModal}
          title='Delete event'
          buttons={
            <>
              <button
                type='button'
                className='btn btn-outline'
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <Form replace method='post'>
                <input
                  type='hidden'
                  defaultValue={data.redirectTo}
                  name='redirectTo'
                />
                <button
                  name='action'
                  value='delete-event'
                  type='submit'
                  className='btn btn-error'
                >
                  Delete
                </button>
              </Form>
            </>
          }
        /> *
      </Content> */}
    </Page>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Event not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
