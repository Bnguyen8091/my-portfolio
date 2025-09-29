import { useMemo, useState, useEffect } from "react";

export default function Portfolio() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATA.projects.filter((p) => {
      const matchesQuery = !q
        ? true
        : [p.title, p.summary, ...(p.tags || [])]
            .join(" ")
            .toLowerCase()
            .includes(q);
      const matchesTag = activeTag === "All" || (p.tags || []).includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [query, activeTag]);

  return (
     <main className="min-h-screen bg-white text-brand-dark antialiased dark:bg-neutral-950 dark:text-neutral-100">
      <SkipLink />
      <Header />
      <section id="top" className="relative overflow-hidden">
        <Hero />
      </section>

      <div id="content" className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <About />
        <Skills />
        <Projects
          query={query}
          setQuery={setQuery}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          projects={filteredProjects}
          allTags={["All", ...uniqueTags(DATA.projects)]}
        />
        <Experience />
        <Hobbies />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}

// --- Sections ----------------------------------------------------------------
function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg focus:outline-none dark:focus:bg-neutral-800"
    >
      Skip to content
    </a>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="text-lg font-semibold tracking-tight">
          {DATA.meta.shortName}
        </a>
        <nav className="hidden gap-6 text-sm sm:flex">
          {[
            ["About", "#about"],
            ["Skills", "#skills"],
            ["Projects", "#projects"],
            ["Experience", "#experience"],
            ["Hobbies", "#hobbies"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="hover:opacity-80">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={DATA.meta.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-brand px-3 py-1.5 text-sm text-white shadow-sm transition hover:bg-brand-dark dark:bg-brand dark:hover:bg-brand-dark"
          >
            Resume
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    // Derive initial state from <html> (set by preload script)
    return document.documentElement.classList.contains("dark");
  });

  function applyTheme(nextIsDark) {
    setIsDark(nextIsDark);
    const root = document.documentElement;
    if (nextIsDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => applyTheme(!isDark)}
      className={
        "rounded-xl px-3 py-1.5 text-sm shadow-sm transition " +
        (isDark
          ? "bg-white text-neutral-900 hover:shadow border border-neutral-700"
          : "bg-neutral-900 text-white hover:opacity-95 border border-neutral-200")
      }
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

function Hero() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-2 lg:gap-10 lg:px-8">
      <div className="order-2 lg:order-1">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {DATA.meta.name}
        </h1>
        <p className="mt-3 max-w-prose text-base text-neutral-600 dark:text-neutral-300">
          {DATA.meta.tagline}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {DATA.meta.ctas.map((c) => (
            <a
              key={c.label}
              href={c.href}
              onClick={(e) => {
                if (c.href && c.href.startsWith("#")) {
                  e.preventDefault();
                  const el = document.querySelector(c.href);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className="rounded-2xl bg-brand px-4 py-2 text-sm text-white shadow-sm transition hover:bg-brand-dark dark:bg-brand dark:hover:bg-brand-dark"
            >
              {c.label}
            </a>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-neutral-300">
          {DATA.meta.socials.map((s) => (
            <a key={s.label} href={s.href} className="hover:opacity-80">
              {s.label} ↗
            </a>
          ))}
        </div>
      </div>
      <div className="order-1 lg:order-2">
        <div className="relative mx-auto aspect-square w-56 overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-100 to-neutral-50 shadow-sm dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950 sm:w-64 md:w-72">
          <img
            src="/profile.jpg"
            alt="Brian Nguyen"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-24">
      <SectionHeader title="About" subtitle="Who I am & what I do" />
      <div className="prose max-w-none dark:prose-invert">
        {DATA.about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {DATA.about.highlights?.length ? (
        <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {DATA.about.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1">✅</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="scroll-mt-24">
      <SectionHeader title="Skills" subtitle="Tools & technologies I use" />
      <div className="flex flex-wrap gap-2">
        {DATA.skills.map((s) => (
          <span
            key={s}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm shadow-sm dark:border-neutral-700 dark:bg-brand dark:hover:bg-brand-dark"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}

function Projects({ query, setQuery, activeTag, setActiveTag, projects, allTags }) {
  const [index, setIndex] = useState(0);

  // Keep index valid if filter changes the list size
  useEffect(() => {
    if (projects.length === 0) return;
    if (index >= projects.length) setIndex(0);
  }, [projects.length, index]);

  const len = projects.length;
  const visibleIdxs =
    len === 0 ? [] : len === 1 ? [0] : [index % len, (index + 1) % len];

  function prev() {
    if (len === 0) return;
    setIndex((i) => (i - 2 + len) % len);
  }

  function next() {
    if (len === 0) return;
    setIndex((i) => (i + 2) % len);
  }

  return (
    <section id="projects" className="scroll-mt-24">
      <SectionHeader title="Projects" subtitle="Selected work & case studies" />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-900"
        />
        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveTag(t);
                setIndex(0);
              }}
              className={
                "rounded-full border px-3 py-1 text-sm shadow-sm transition " +
                (activeTag === t
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                  : "border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800")
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel frame */}
      {len === 0 ? (
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          No projects found.
        </p>
      ) : (
        <div className="relative mx-auto max-w-6xl px-8 sm:px-12 md:px-20 overflow-hidden">
          {/* Left arrow */}
          <button
            onClick={prev}
            aria-label="Previous projects"
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2
                      z-20 flex items-center justify-center rounded-full
                      bg-brand text-white w-10 h-10 sm:w-12 sm:h-12
                      shadow-lg transition hover:bg-brand-dark
                      focus:outline-none focus:ring-2 focus:ring-brand"
          >
            ◀
          </button>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
            {visibleIdxs.map((vi) => {
              const p = projects[vi];
              const hasRepo =
                p.repo && p.repo.trim() !== "#" && p.repo.trim() !== "";

              const CardTag = hasRepo ? "a" : "div";
              const cardProps = hasRepo
                ? { href: p.repo, target: "_blank", rel: "noopener noreferrer" }
                : {};

              return (
                <CardTag
                  key={p.title}
                  {...cardProps}
                  className="group flex flex-col overflow-hidden rounded-2xl 
                             border border-neutral-200 bg-white shadow-sm transition 
                             hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="aspect-video w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight group-hover:opacity-80">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                        {p.summary}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2">
                      {(p.tags || []).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Only show "Code" when repo exists */}
                    {hasRepo && (
                      <div className="flex items-center justify-end pt-2 text-sm">
                        <span className="hover:opacity-80">Code ↗</span>
                      </div>
                    )}
                  </div>
                </CardTag>
              );
            })}
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            aria-label="Next projects"
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2
                      z-20 flex items-center justify-center rounded-full
                      bg-brand text-white w-10 h-10 sm:w-12 sm:h-12
                      shadow-lg transition hover:bg-brand-dark
                      focus:outline-none focus:ring-2 focus:ring-brand"
          >
            ▶
          </button>
        </div>
      )}
    </section>
  );
}


function Experience() {
  return (
    <section id="experience" className="scroll-mt-24">
      <SectionHeader title="Experience" subtitle="Roles, internships & impact" />
      <ol className="relative border-l border-neutral-200 dark:border-neutral-800">
        {DATA.experience.map((e, i) => (
          <li key={i} className="ml-6 pb-8 last:pb-0">
            <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-neutral-900 dark:border-neutral-900 dark:bg-white" />
            <div className="flex flex-wrap items-center gap-x-2 text-sm text-neutral-600 dark:text-neutral-300">
              <span className="font-medium text-neutral-900 dark:text-neutral-100">{e.role}</span>
              <span>·</span>
              <span>{e.company}</span>
              <span>·</span>
              <span>{e.date}</span>
            </div>
            <p className="mt-1 font-medium">{e.title}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              {e.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Hobbies() {
  return (
    <section id="hobbies" className="scroll-mt-24">
      <SectionHeader title="Hobbies" subtitle="What I do for fun & balance" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DATA.hobbies.map((h) => (
          <div
            key={h.title}
            className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <h4 className="font-semibold">{h.title}</h4>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{h.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mrbawrpj", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset(); // clear form
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  // Fade out success message after 3 seconds
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        setStatus("idle");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <section id="contact" className="scroll-mt-24">
      <SectionHeader title="Contact" subtitle="Let’s build something great" />
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {status === "success" ? (
          <p className="text-green-600 dark:text-green-400 transition-opacity duration-500">
            ✅ Thanks! Your message has been sent.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <input
              required
              name="name"
              placeholder="Name"
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
            />
            <input
              required
              name="email"
              type="email"
              placeholder="Email"
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
            />
            <textarea
              required
              name="message"
              placeholder="Your message"
              className="sm:col-span-2 min-h-[120px] rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
            />
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-95 disabled:opacity-50 dark:border-neutral-700 dark:bg-white dark:text-neutral-900"
              >
                {status === "submitting" ? "Sending..." : "Send"}
              </button>
            </div>
            {status === "error" && (
              <p className="sm:col-span-2 text-red-600 dark:text-red-400">
                ❌ Oops! Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-8 border-t border-neutral-200 pt-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} {DATA.meta.name}. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          {DATA.meta.footerLinks.map((l) => (
            <a key={l.label} href={l.href} className="hover:opacity-80">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{subtitle}</p>
      )}
    </div>
  );
}

// --- Helpers -----------------------------------------------------------------
function uniqueTags(projects) {
  const set = new Set();
  projects.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
  return Array.from(set);
}

// --- Data (Edit if need any changes!) ---------------------------------------------------------
const DATA = {
  meta: {
    name: "Brian Nguyen",
    shortName: "BN",
    tagline:
      "Aspiring software engineer passionate about building secure, user-friendly web experiences.",
    resumeUrl: "/Brian-Nguyen-Resume.pdf", 
    ctas: [
      { label: "View Resume", href: "/Brian-Nguyen-Resume.pdf" },
      { label: "Email Me", href: "#contact" },
      { label: "GitHub", href: "https://github.com/Bnguyen8091" },
    ],
    socials: [
      { label: "GitHub", href: "https://github.com/Bnguyen8091" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/briannguyenlinked/" },
      { label: "Email", href: "mailto:nguyenbrian562@gmail.com" },
    ],
    footerLinks: [
      { label: "GitHub", href: "https://github.com/Bnguyen8091" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/briannguyenlinked/" },
    ],
  },
  about: {
    paragraphs: [
      "I’m a developer who enjoys turning ideas into polished, performant products. I love the mix of system design, clean UI, and pragmatic engineering.",
      "Recently, I’ve been focused on React, TypeScript, Node.js, and design systems. I care about accessibility, maintainability, and thoughtful details.",
    ],
    highlights: [
      "Proficient in Java, PHP, Python, and SQL",
      "Strong web development skills with HTML, CSS, JavaScript, and JSON",
      "Experienced with databases: MySQL and MongoDB",
      "Hands-on with Git, Docker, AWS, Kubernetes, and Visual Studio Code for version control and cloud development",
    ],
  },
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "HTML",
    "CSS / Tailwind",
    "SQL / MySQL",
    "MongoDB",
    "Java",
    "PHP",
    "Python",
    "Git / GitHub",
    "VS Code",
    "Docker",
    "React",
    "CSS/Tailwind",
  ],
  projects: [
    {
      title: "Helping Hand (Ticketing System)",
      summary:
        "A role-based helpdesk app with metrics dashboards, FAQ publishing, and secure flows (CSRF/XSS/SQLi mitigations).",
      tags: ["Full-stack", "MySQL", "Security", "PHP"],
      link: "#",
      repo: "https://github.com/Bnguyen8091/Helping-Hand.git",
      image: "/projects/helpinghand.png"
    },
    {
      title: "Personal Budget App",
      summary:
        "A budgeting tool with categories, charts, and expense insights. Built with Node/Angular/Express.",
      tags: ["Web App", "Node", "Charts","Angular"],
      link: "#",
      repo: "https://github.com/Bnguyen8091/personal-budget-angular.git",
      image: "/projects/personalbudget.png"
    },
    {
      title: "Hospital Database Management System",
      summary: "Designed and normalized a hospital database schema with entities for patients, physicians, nurses, rooms, and payments...",
      tags: ["MySQL", "Database Design", "SQL"],
      link: "#",  
      repo: "#",
      image: "/projects/hostpital.png"
    },
    {
      title: "UNCC Student Dashboard",
      summary:
        "A centralized portal for UNCC students to view schedules, grades, announcements, and manage tasks with role-based access and JWT authentication.",
      tags: ["React", "Node", "Express", "MySQL", "Auth"],
      link: "#",  
      repo: "https://github.com/Bnguyen8091/UNCC-Student-Dashboard.git",  
      image: "/projects/dashboard.jpg"
    }
  ],
  experience: [
    {
      role: "Software Developer (Academic Projects)",
      company: "UNC Charlotte",
      date: "2022 – Present",
      title: "Full-stack Coursework & Team Projects",
      bullets: [
        "Collaborated on secure helpdesk ticketing system (PHP/MySQL) with metrics and role-based access.",
        "Developed budgeting web app with charts and data insights using Node.js and Angular.",
        "Built portfolio and interactive visualizers with React, Tailwind, and modern JavaScript.",
      ],
    },
    {
      role: "Undergrad/Grad-Student, UNC Charlotte",
      company: "UNC Charlotte",
      date: "2021 – Present",
      title: "CS/IT Coursework",
      bullets: [
        "Security & Privacy, OS/Networking, Algorithm Design.",
        "Team projects: ticketing system, budget app, security labs.",
      ],
    },
    {
      role: "Frontend Developer (Projects)",
      company: "UNC Charlotte",
      date: "2023 – Present",
      title: "UI Development & React Projects",
      bullets: [
        "Designed and implemented responsive UIs with React, Tailwind CSS, and modern JavaScript.",
        "Integrated components with APIs and improved accessibility across projects.",
        "Collaborated with teammates to translate design concepts into functional interfaces.",
      ],
    },
  ],

  hobbies: [
    {
      title: "Pickleball",
      desc: "A fun, fast-paced game that keeps me active and competitive while enjoying with friends.",
    },
    {
      title: "Streaming & Games",
      desc: "Twitch planning, fun rage-moments, and community building.",
    },
    {
      title: "Watching Anime",
      desc: "Exploring different stories and art styles that inspire creativity and relaxation.",
    },
    {
      title: "Hanging Out with Family",
      desc: "Spending quality time with loved ones for fun, support, and balance.",
    },
  ],
};
