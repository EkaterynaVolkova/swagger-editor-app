import { getTranslations } from 'next-intl/server';

const teamMembers = [
  {
    name: 'Ekaterina Volkova',
    roleKey: 'team.ekaterina.role',
    github: 'https://github.com/EkaterynaVolkova',
  },
  {
    name: 'Yuri Skrypal',
    roleKey: 'team.yuri.role',
    github: 'https://github.com/Sepulator',
  },
  {
    name: ' Andrei Tishchenko',
    roleKey: 'team.andrei.role',
    github: 'https://github.com/AndreyTishchenko',
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
    labelKey: 'resources.rsSchool',
    href: 'https://rs.school/',
  },
  {
    labelKey: 'resources.rsSchoolReact',
    href: 'https://rs.school/courses/reactjs',
  },
  {
    labelKey: 'resources.repository',
    href: 'https://github.com/EkaterynaVolkova/swagger-editor-app',
  },
  {
    labelKey: 'resources.openapi',
    href: 'https://spec.openapis.org/oas/latest.html',
  },
];

const scopeItems = ['scope.editor', 'scope.preview', 'scope.history', 'scope.i18n'];

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <section className="w-full flex-1 overflow-y-auto px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="border-base-300 bg-base-100 rounded-xl border p-6 shadow-xl md:p-8">
          <div className="max-w-3xl">
            <p className="text-swagger-green mb-3 text-sm font-semibold tracking-wide uppercase">
              {t('eyebrow')}
            </p>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">{t('title')}</h1>
            <p className="text-base-content/75 text-base leading-7">{t('description')}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="border-base-300 bg-base-100 rounded-xl border p-6 shadow-xl">
            <h2 className="mb-3 text-2xl font-semibold">{t('courseTitle')}</h2>
            <p className="text-base-content/75 leading-7">{t('courseDescription')}</p>
          </article>

          <article className="border-base-300 bg-base-100 rounded-xl border p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-semibold">{t('scopeTitle')}</h2>
            <ul className="text-base-content/75 flex flex-col gap-3">
              {scopeItems.map((item) => (
                <li key={item}>{t(item)}</li>
              ))}
            </ul>
          </article>
        </div>

        <article className="border-base-300 bg-base-100 rounded-xl border p-6 shadow-xl">
          <h2 className="mb-5 text-2xl font-semibold">{t('teamTitle')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {teamMembers.map((member) => (
              <div
                key={member.github}
                className="border-base-300 bg-base-200 rounded-lg border p-5"
              >
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-base-content/70 mt-2 min-h-12 text-sm leading-6">
                  {t(member.roleKey)}
                </p>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                  className="link link-success link-hover mt-4 inline-flex font-medium"
                >
                  {t('team.github')}
                </a>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="border-base-300 bg-base-100 rounded-xl border p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-semibold">{t('technologiesTitle')}</h2>
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
            <h2 className="mb-5 text-2xl font-semibold">{t('resourcesTitle')}</h2>
            <div className="flex flex-col gap-3">
              {resources.map((resource) => (
                <a
                  key={resource.href}
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link link-success link-hover font-medium"
                >
                  {t(resource.labelKey)}
                </a>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
