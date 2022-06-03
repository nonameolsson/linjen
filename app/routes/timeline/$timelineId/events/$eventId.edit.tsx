import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useParams } from "@remix-run/react";
import * as React from "react";

import { createEvent, getEvent, updateEvent } from "~/models/event.server";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import type { Event } from "@prisma/client";

type LoaderData = {
  event: Event;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);

  invariant(params.eventId, "eventId not found");

  const event = await getEvent({ id: params.eventId });
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ event });
};

type ActionData = {
  errors?: {
    title?: string;
    content?: string;
    startDate?: string;
    endDate?: string;
    timelineId?: string;
  };
};

type Params = {
  timelineId: string
  eventId: string
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  invariant(params.timelineId, "timelineId not found");
  invariant(params.eventId, "eventId not found");
  

  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof content !== "string" || content.length === 0) {
    return json<ActionData>(
      { errors: { content: "Content is required" } },
      { status: 400 }
    );
  }

  if (typeof startDate !== "string" || startDate.length === 0) {
    return json<ActionData>(
      { errors: { content: "Start Date is required" } },
      { status: 400 }
    );
  }

  if (typeof endDate !== "string" || endDate.length === 0) {
    return json<ActionData>(
      { errors: { content: "End Date is required" } },
      { status: 400 }
    );
  }

  await updateEvent({
    title,
    content,
    endDate,
    startDate,
    userId,
    id: params.eventId,
  });

  return redirect(`/timeline/${params.timelineId}/events/${params.eventId}`);
};

export default function EditEvent() {
  const data = useLoaderData() as LoaderData;
  const params = useParams();

  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const contentRef = React.useRef<HTMLTextAreaElement>(null);
  const startDateRef = React.useRef<HTMLInputElement>(null);
  const endDateRef = React.useRef<HTMLInputElement>(null);
  const timelineIdRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.content) {
      contentRef.current?.focus();
    } else if (actionData?.errors?.startDate) {
      startDateRef.current?.focus();
    } else if (actionData?.errors?.endDate) {
      endDateRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            defaultValue={data.event.title}
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Content: </span>
          <textarea
          defaultValue={data.event.content}
            ref={contentRef}
            name="content"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.content ? true : undefined}
            aria-errormessage={
              actionData?.errors?.content ? "body-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.content && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.content}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Start Date: </span>
          <input
            ref={startDateRef}
            defaultValue={data.event.startDate}
            name="startDate"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.startDate ? true : undefined}
            aria-errormessage={
              actionData?.errors?.startDate ? "body-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.startDate && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.startDate}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>End Date: </span>
          <input
          defaultValue={data.event.endDate}
            ref={endDateRef}
            name="endDate"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.endDate ? true : undefined}
            aria-errormessage={
              actionData?.errors?.endDate ? "body-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.endDate && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.endDate}
          </div>
        )}
      </div>

      <input
        hidden
        ref={timelineIdRef}
        name="timelineId"
        defaultValue={params.timelineId}
        className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
        aria-invalid={actionData?.errors?.timelineId ? true : undefined}
        aria-errormessage={
          actionData?.errors?.timelineId ? "body-error" : undefined
        }
      />

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
