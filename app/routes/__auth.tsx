import { Outlet } from "@remix-run/react";

export default function Auth() {
  return (
    <>
      <div>Auth</div>
      <Outlet />
    </>
  );
}
