create table users (
    id uuid primary key,
    name varchar(120) not null,
    email varchar(180) not null unique,
    password_hash varchar(100) not null,
    role varchar(20) not null default 'Aluno',
    joined_at timestamptz not null default now()
);

create table user_preferences (
    user_id uuid primary key references users(id) on delete cascade,
    daily_goal_minutes integer not null default 10,
    public_profile boolean not null default true,
    email_reminders boolean not null default true,
    weekly_summary boolean not null default true,
    constraint user_preferences_goal_check check (daily_goal_minutes between 1 and 120)
);

create table courses (
    id varchar(50) primary key,
    title varchar(120) not null,
    short_title varchar(80) not null,
    description text not null,
    level varchar(40) not null,
    tone varchar(20) not null,
    duration integer not null,
    focus varchar(80) not null,
    sort_order integer not null
);

create table course_modules (
    id varchar(50) primary key,
    course_id varchar(50) not null references courses(id) on delete cascade,
    title varchar(120) not null,
    sort_order integer not null
);

create index course_modules_course_idx on course_modules(course_id);

create table lessons (
    id varchar(50) primary key,
    module_id varchar(50) not null references course_modules(id) on delete cascade,
    title varchar(160) not null,
    description text not null,
    duration integer not null,
    xp integer not null,
    focus varchar(80) not null,
    lesson_text text not null,
    sort_order integer not null
);

create index lessons_module_idx on lessons(module_id);

create table attempts (
    id uuid primary key,
    user_id uuid not null references users(id) on delete cascade,
    lesson_id varchar(50) not null references lessons(id) on delete cascade,
    wpm integer not null,
    accuracy numeric(4,1) not null,
    duration_seconds integer not null,
    characters integer not null,
    errors integer not null,
    xp integer not null,
    created_at timestamptz not null default now(),
    constraint attempts_wpm_check check (wpm between 0 and 400),
    constraint attempts_accuracy_check check (accuracy between 0 and 100),
    constraint attempts_duration_check check (duration_seconds >= 1)
);

create index attempts_user_created_idx on attempts(user_id, created_at desc);

create table completed_lessons (
    id uuid primary key,
    user_id uuid not null references users(id) on delete cascade,
    lesson_id varchar(50) not null references lessons(id) on delete cascade,
    completed_at timestamptz not null default now(),
    constraint completed_lessons_unique unique (user_id, lesson_id)
);

create index completed_lessons_user_idx on completed_lessons(user_id);

create table notifications (
    id uuid primary key,
    user_id uuid not null references users(id) on delete cascade,
    title varchar(160) not null,
    message text not null,
    kind varchar(30) not null,
    href varchar(180),
    is_read boolean not null default false,
    created_at timestamptz not null default now()
);

create index notifications_user_created_idx on notifications(user_id, created_at desc);
