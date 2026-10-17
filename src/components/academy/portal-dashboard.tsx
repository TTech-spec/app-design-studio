import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, Plus, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import academyLogo from "@/assets/portal/darltech-academy-logo.png";
import learningIllustration from "@/assets/portal/learning-illustration.png";
import { courseById, initialsOf } from "@/lib/academy/data";
import { firstName, useAcademy } from "@/lib/academy/store";
import { Avatar } from "./ui";

/*
 * Desktop student dashboard, built to the DarlTech "Student portal" design.
 * It replaces the portal shell on large screens; phones keep the regular dashboard.
 */

const PRIMARY_NAV = [
  { label: "My Courses", to: "/student/explore" },
  { label: "Assignments", to: "/student/quizzes" },
  { label: "Chat", to: "/student/messages" },
  { label: "Projects", to: "/student/feed" },
] as const;
const ACCOUNT_NAV = [
  { label: "Settings", to: "/student/profile" },
  { label: "Profile", to: "/student/profile" },
] as const;

const ACTIVITIES = [
  { label: "Completed “Figma components”", done: true },
  { label: "Submitted Week 5 Assignments", done: true },
  { label: "Started Prototype and interaction Design", done: false },
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function PortalDashboard() {
  const { user, enrollments, signOut } = useAcademy();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const name = user ? firstName(user) : "Guest";

  // Show the student's latest course when they have one, otherwise the design's sample course.
  const current = enrollments[enrollments.length - 1];
  const course = current ? courseById(current.courseId) : undefined;
  const continueCourse = course
    ? (() => {
        const week = Math.min(
          course.modules.length - 1,
          Math.floor((current.progress / 100) * course.modules.length),
        );
        return {
          name: course.name,
          lesson: `Week ${week + 1}: ${course.modules[week].title}.`,
          progress: current.progress,
        };
      })()
    : { name: "UI/UX Design", lesson: "Week 6: Prototype and Interactions design.", progress: 72 };
  const overall = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 53;

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/student/search", search: { q } });
  };

  return (
    <div className="portal">
      <div className="portal__canvas">
        <aside className="portal__sidebar" aria-label="Main navigation">
          <Link to="/student" aria-label="DarlTech Academy dashboard">
            <img className="portal__logo" src={academyLogo} alt="" />
          </Link>

          <nav className="portal__nav">
            <Link to="/student" className="portal__nav-heading" aria-current="page">
              Dashboard
            </Link>
            <ul className="portal__nav-list">
              {PRIMARY_NAV.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="portal__nav-item">
                    <ChevronRight className="portal__nav-chevron" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <hr className="portal__nav-divider" />

            <ul className="portal__nav-list">
              {ACCOUNT_NAV.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="portal__nav-item">
                    <ChevronRight className="portal__nav-chevron" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="portal__nav-item"
                  onClick={() => {
                    signOut();
                    navigate({ to: "/" });
                  }}
                >
                  <ChevronRight className="portal__nav-chevron" aria-hidden="true" />
                  Log out
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <form className="portal__search" role="search" onSubmit={onSearch}>
          <span className="portal__search-icon" aria-hidden="true">
            <Search />
          </span>
          <label className="sr-only" htmlFor="portal-search">
            Search
          </label>
          <input
            id="portal-search"
            className="portal__search-input"
            type="search"
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>

        <div className="portal__user">
          <Link to="/student/explore" className="portal__add" aria-label="Add a course">
            <Plus strokeWidth={4} />
          </Link>
          <Link to="/student/profile" aria-label="Your profile" className="portal__avatar">
            <Avatar initials={user ? initialsOf(user.name) : "G"} color="#EF4136" size={44} />
          </Link>
          <p className="portal__greeting">
            <span>Hello!</span>
            <strong>{name}</strong>
          </p>
        </div>

        <section className="portal__welcome">
          <h1 className="portal__welcome-title">
            Welcome back
            <br />
            {name}!
          </h1>
          <p className="portal__welcome-text">
            Here&rsquo;s what&rsquo;s
            <br />
            happening in your learning journey.
          </p>
          <img className="portal__illustration" src={learningIllustration} alt="" />
        </section>

        <section className="portal__card portal__continue" aria-labelledby="continue-title">
          <div>
            <h2 id="continue-title" className="portal__continue-title">
              Continue Learning
            </h2>
            <p className="portal__continue-course">{continueCourse.name}</p>
            <p className="portal__continue-lesson">{continueCourse.lesson}</p>
            {course ? (
              <Link
                to="/student/courses/$courseId"
                params={{ courseId: course.id }}
                className="portal__continue-button"
              >
                Continue
                <ContinueArrow />
              </Link>
            ) : (
              <Link to="/student/explore" className="portal__continue-button">
                Continue
                <ContinueArrow />
              </Link>
            )}
          </div>
          <ProgressRing value={continueCourse.progress} />
        </section>

        <section className="portal__card portal__progress" aria-labelledby="progress-title">
          <h2 id="progress-title" className="portal__card-title">
            Overall Progress
          </h2>
          <ProgressGauge value={overall} />
          <p className="portal__progress-value">{overall}%</p>
          {!enrollments.length && <p className="portal__progress-delta">+ 8% this month</p>}
        </section>

        <section className="portal__card portal__activities" aria-labelledby="activities-title">
          <h2 id="activities-title" className="portal__card-title">
            Recent activities
          </h2>
          <ul className="portal__activity-list">
            {ACTIVITIES.map((activity) => (
              <li key={activity.label} className="portal__activity">
                <span
                  className="portal__activity-status"
                  data-done={activity.done}
                  aria-label={activity.done ? "Done" : "In progress"}
                >
                  {activity.done ? <Check strokeWidth={4} /> : null}
                </span>
                {activity.label}
              </li>
            ))}
          </ul>
          <Link to="/student/quizzes" className="portal__pill-button portal__see-more">
            See more
          </Link>
        </section>

        <aside className="portal__card portal__schedule" aria-label="Calendar and upcoming events">
          <MonthCalendar />

          <hr className="portal__schedule-divider" />

          <h2 className="portal__upcoming-title">Upcoming</h2>
          <dl className="portal__upcoming">
            <div>
              <dt>Today:</dt>
              <dd>
                UI/UX Design class
                <br />
                7:30pm - 9:30pm
              </dd>
            </div>
            <div>
              <dt>Tomorrow:</dt>
              <dd>
                Assignment: Week 6 prototype
                <br />
                11:59pm
              </dd>
            </div>
          </dl>

          <button type="button" className="portal__pill-button portal__schedules">
            Schedules
          </button>
        </aside>
      </div>
    </div>
  );
}

function ContinueArrow() {
  return (
    <span className="portal__continue-arrow" aria-hidden="true">
      <ArrowRight strokeWidth={3} />
    </span>
  );
}

function ProgressRing({ value }: { value: number }) {
  const radius = 61.5;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="portal__ring" role="img" aria-label={`${value}% of the course completed`}>
      <svg viewBox="0 0 150 150" aria-hidden="true">
        <circle className="portal__ring-track" cx="75" cy="75" r={radius} />
        <circle
          className="portal__ring-value"
          cx="75"
          cy="75"
          r={radius}
          strokeDasharray={`${(value / 100) * circumference} ${circumference}`}
          transform="rotate(-90 75 75)"
        />
      </svg>
      <span className="portal__ring-label">{value}%</span>
    </div>
  );
}

function ProgressGauge({ value }: { value: number }) {
  // The needle sweeps from -90deg (0%) to 90deg (100%) around the gauge's center.
  const angle = (value / 100) * 180 - 90;

  return (
    <div className="portal__gauge" role="img" aria-label={`Overall progress ${value}%`}>
      <svg viewBox="0 0 150 75" aria-hidden="true">
        <path className="portal__gauge-arc" d="M 15 75 A 60 60 0 0 1 135 75" />
        <path
          className="portal__gauge-needle"
          d="M 71.5 75 L 74 8 Q 75 4 76 8 L 78.5 75 Z"
          transform={`rotate(${angle} 75 75)`}
        />
      </svg>
    </div>
  );
}

function MonthCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const leadingBlanks = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const monthLabel = today.toLocaleDateString("en-US", { month: "long" });

  return (
    <div className="portal__calendar">
      <p className="portal__calendar-month">
        {monthLabel}, {year}.
      </p>
      <div className="portal__calendar-grid" aria-label={`${monthLabel} ${year}`}>
        {WEEKDAYS.map((day, index) => (
          <span key={`${day}-${index}`} className="portal__calendar-weekday">
            {day}
          </span>
        ))}
        {cells.map((day, index) => (
          <span
            key={day ?? `blank-${index}`}
            className="portal__calendar-day"
            aria-current={day === today.getDate() ? "date" : undefined}
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}
