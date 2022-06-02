import { Navbar } from "./navbar";

export function Content({
  children,
  setMobileMenuOpen,
}: {
  children?: React.ReactNode;
  setMobileMenuOpen: (open: boolean) => void;
}): JSX.Element {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Navbar setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main content */}
      <div className="flex flex-1 items-stretch overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4">
          {/* Primary column */}
          <section
            aria-labelledby="primary-heading"
            className="flex h-full min-w-0 flex-1 flex-col lg:order-last"
          >
            <h1 id="primary-heading" className="sr-only">
              Photos
            </h1>
            {/* Your content */}
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
