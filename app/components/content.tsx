import { Navbar } from "./navbar";

export function Content({
  children,
  actions,
  description,
  setMobileMenuOpen,
  title,
}: {
  children?: React.ReactNode;
  actions?: JSX.Element;
  description?: string;
  setMobileMenuOpen: (open: boolean) => void;
  title: string;
}): JSX.Element {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Navbar setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main content */}
      <div className="flex flex-1 items-stretch overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4">
          <section
            aria-labelledby="primary-heading"
            className="flex h-full min-w-0 flex-1 flex-col lg:order-last"
          >
            <h1 id="primary-heading" className="sr-only">
              {title}
            </h1>

            <div className="flex justify-between">
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold">{title}</h1>
                <h3>{description}</h3>
              </div>
              <div className="flex items-start">{actions}</div>
            </div>
            <div className="mt-4">{children}</div>
          </section>
        </main>
      </div>
    </div>
  );
}
