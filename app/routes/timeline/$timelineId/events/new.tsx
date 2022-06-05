import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";

import invariant from "tiny-invariant";
import EventCard from "~/components/event-card";

import { createEvent } from "~/models/event.server";
import { requireUserId } from "~/session.server";

function validateEventTitle(title: string) {
  if (title.length === 0) {
    return "Title is required";
  }
}

function validateEventContent(content: string) {
  if (typeof content !== "string") {
    return "Content must be a string";
  }
}

function validateEventStartDate(startDate: string) {
  if (startDate.length === 0) {
    return "Start date is required";
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    title: string | undefined;
    content: string | undefined;
    startDate: string | undefined;
  };
  fields?: {
    title: string;
    content: string;
    startDate: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const title = formData.get("title");
  const content = formData.get("content");
  const startDate = formData.get("startDate");

  const timelineId = params.timelineId;
  invariant(timelineId, "Timeline ID is required");

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    typeof startDate !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
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

  const event = await createEvent({
    title,
    content,
    startDate,
    timelineId,
    userId,
  });

  return redirect(`/timeline/${timelineId}/events/${event.id}`);
};

export default function NewEventPage() {
  const actionData = useActionData<ActionData | undefined>();
  const transition = useTransition()

  if (transition.submission) {
    const title = transition.submission.formData.get("title");
    const content = transition.submission.formData.get("content");
    const startDate = transition.submission.formData.get("startDate");

    if (
      typeof title === "string" &&
      typeof content === "string" &&
      typeof startDate === "string" &&
      !validateEventTitle(title) &&
      !validateEventContent(content) &&
      !validateEventStartDate(startDate)
    ) {
      return (
        <EventCard content={content} startDate={startDate} title={title} /> 
      );
    }
  }

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
            defaultValue={actionData?.fields?.title}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={Boolean(actionData?.fieldErrors?.title) || undefined}
            aria-errormessage={
              actionData?.fieldErrors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.fieldErrors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.fieldErrors.title}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Content: </span>
          <textarea
            defaultValue={actionData?.fields?.content}
            name="content"
            rows={4}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={Boolean(actionData?.fieldErrors?.content) || undefined}
            aria-errormessage={
              actionData?.fieldErrors?.content ? "content-error" : undefined
            }
          />
        </label>
        {actionData?.fieldErrors?.content && (
          <div className="pt-1 text-red-700" id="content-error">
            {actionData.fieldErrors.content}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Year: </span>
          <input
            name="startDate"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={Boolean(actionData?.fieldErrors?.startDate) || undefined}
            aria-errormessage={
              actionData?.fieldErrors?.startDate ? "startdate-error" : undefined
            }
          />
        </label>
        {actionData?.fieldErrors?.startDate && (
          <div className="pt-1 text-red-700" id="startdate-error">
            {actionData.fieldErrors.startDate}
          </div>
        )}
      </div>

      {/* 
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
      /> */}

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
