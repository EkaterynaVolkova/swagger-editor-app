const teamMembers = [
  {
    name: 'Ekaterina Volkova',
    role: 'Frontend developer, project setup and Swagger editor experience',
    github: 'https://github.com/EkaterynaVolkova',
  },
  {
    name: 'Yuri Skrypal',
    role: 'Frontend developer, authentication, routing and testing',
    github: 'https://github.com/Sepulator',
  },
];

const technologies = [
  'Next.js',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'DaisyUI',
  'next-intl',
  'Firebase',
  'Swagger Parser',
  'Stoplight Elements',
  'CodeMirror',
  'Vitest',
];

const resources = [
  {
    label: 'RS School',
    href: 'https://rs.school/',
  },
  {
    label: 'RS School React course',
    href: 'https://rs.school/courses/reactjs',
  },
  {
    label: 'Project repository',
    href: 'https://github.com/EkaterynaVolkova/swagger-editor-app',
  },
  {
    label: 'OpenAPI Specification',
    href: 'https://spec.openapis.org/oas/latest.html',
  },
];

export default function AboutPage() {
  return (
    <section className="w-full flex-1 overflow-y-auto px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="border-base-300 bg-base-100 rounded-xl border p-6 shadow-xl md:p-8">
          <div className="max-w-3xl">
            <p className="text-swagger-green mb-3 text-sm font-semibold tracking-wide uppercase">
              About the project
            </p>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">Swagger Editor App</h1>
            <p className="text-base-content/75 text-base leading-7">
              Swagger Editor App is a learning project created as part of the RS School React
              course. It helps users edit, validate, preview and save OpenAPI schemas in a focused
              workspace with authentication, localization and a responsive split-view interface.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="border-base-300 bg-base-100 rounded-xl border p-6 shadow-xl">
            <h2 className="mb-3 text-2xl font-semibold">RS School course</h2>
            <p className="text-base-content/75 leading-7">
              RS School is a free, community-driven education program from The Rolling Scopes
              community. The React course focuses on modern frontend engineering practices:
              component architecture, routing, state management, testing, authentication, API
              integration and production-ready user interfaces.
            </p>
          </article>

          <article className="border-base-300 bg-base-100 rounded-xl border p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-semibold">Project scope</h2>
            <ul className="text-base-content/75 flex flex-col gap-3">
              <li>OpenAPI schema editing with JSON and YAML support.</li>
              <li>Live Swagger UI preview for quick feedback.</li>
              <li>Firebase-backed sign in, sign up and schema history.</li>
              <li>Internationalized navigation for English and Russian routes.</li>
            </ul>
          </article>
        </div>

        <article className="border-base-300 bg-base-100 rounded-xl border p-6 shadow-xl">
          <h2 className="mb-5 text-2xl font-semibold">Development team</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {teamMembers.map((member) => (
              <div
                key={member.github}
                className="border-base-300 bg-base-200 rounded-lg border p-5"
              >
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-base-content/70 mt-2 min-h-12 text-sm leading-6">
                  {member.role}
                </p>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                  className="link link-success link-hover mt-4 inline-flex font-medium"
                >
                  GitHub profile
                </a>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="border-base-300 bg-base-100 rounded-xl border p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-semibold">Technologies used</h2>
            <div className="flex flex-wrap gap-2">
              {technologies.map((technology) => (
                <span
                  key={technology}
                  className="badge badge-outline border-swagger-green/60 text-base-content px-3 py-3"
                >
                  {technology}
                </span>
              ))}
            </div>
          </article>

          <article className="border-base-300 bg-base-100 rounded-xl border p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-semibold">Useful resources</h2>
            <div className="flex flex-col gap-3">
              {resources.map((resource) => (
                <a
                  key={resource.href}
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link link-success link-hover font-medium"
                >
                  {resource.label}
                </a>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
