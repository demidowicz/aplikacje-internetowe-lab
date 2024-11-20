drop table if exists post;
create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);
drop table if exists game;
create table game
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    title text not null,
    developer text not null,
    created_at timestamp not null
);
