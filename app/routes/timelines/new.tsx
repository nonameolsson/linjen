import { ExclamationCircleIcon } from "@heroicons/react/outline";
import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import { createTimeline } from "~/models/timeline.server";
import { requireUserId } from "~/session.server";

type ActionData = {
  errors?: {
    title?: string;
    description?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof description !== "string" || description.length === 0) {
    return json<ActionData>(
      { errors: { description: "Description is required" } },
      { status: 400 }
    );
  }

  const timeline = await createTimeline({ title, description, userId });

  return redirect(`/timelines/${timeline.id}`);
};

export default function NewTimelinePage() {
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div>
      <h2 className="text-3xl font-bold">New timelne</h2>
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
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title:
          </label>
          <div className="mt-1">
            <input
              id="title"
              ref={titleRef}
              name="title"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

              aria-invalid={actionData?.errors?.title ? true : undefined}
              aria-errormessage={
                actionData?.errors?.title ? "title-error" : undefined
              }
              placeholder="My awesome timeline"
              defaultValue=""
              aria-describedby="email-error"
            />
            {actionData?.errors?.title && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
            {actionData?.errors?.title && (
              <p className="mt-2 text-sm text-red-600" id="title-error">
                {actionData.errors.title}
              </p>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <div className="mt-1">
            <textarea
              rows={4}
              name="description"
              ref={descriptionRef}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              defaultValue={""}
              aria-invalid={actionData?.errors?.description ? true : undefined}
              aria-errormessage={
                actionData?.errors?.description ? "body-error" : undefined
              }
            />
          </div>
          {actionData?.errors?.description && (
            <div className="pt-1 text-red-700" id="body-error">
              {actionData.errors.description}
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Save
          </button>
        </div>
      </Form>
    </div>
  );
}
