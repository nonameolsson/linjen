import { Outlet } from "@remix-run/react";

import { Page } from "~/components/page";

export default function TimelinesPage() {
  return (
    <Page>
      <Outlet />
    </Page>
  );
}
