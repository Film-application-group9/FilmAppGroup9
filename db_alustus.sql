-- This script was generated by the ERD tool in pgAdmin 4.
-- Please log an issue at https://github.com/pgadmin-org/pgadmin4/issues/new/choose if you find any bugs, including reproduction steps.
BEGIN;

drop table if exists public.accounts cascade;
drop table if exists public.favorites cascade;
drop table if exists public.group_comments cascade;
drop table if exists public.group_movies cascade;
drop table if exists public.group_requests cascade;
drop table if exists public.group_showtimes cascade;
drop table if exists public.groups cascade;
drop table if exists public.reviews cascade;
drop table if exists public.users_in_groups cascade;

SET TIME ZONE 'EET';

CREATE TABLE IF NOT EXISTS public.accounts
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    username character varying(50) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT "Accounts_pkey" PRIMARY KEY (id),
    CONSTRAINT accounts_username_key UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS public.favorites
(
    id_user integer,
    id_movie integer,
    moviename character varying(255) COLLATE pg_catalog."default",
	img_path character varying(255),
    CONSTRAINT favorites_id_user_id_movie_key UNIQUE (id_user, id_movie)
);

CREATE TABLE IF NOT EXISTS public.group_comments
(
    id_group integer NOT NULL,
    id_user integer,
    comment_time timestamp without time zone,
    comment_text character varying(280) COLLATE pg_catalog."default",
    username character varying(50)
);

CREATE TABLE IF NOT EXISTS public.group_movies
(
    id_group integer,
    id_movie integer,
    moviename character varying(255) COLLATE pg_catalog."default",
	moviename_original character varying(255), 
	img_path character varying(255),
    CONSTRAINT group_movies_id_movie_id_group_key UNIQUE (id_movie, id_group)
);

CREATE TABLE IF NOT EXISTS public.group_requests
(
    id_group integer,
    id_user integer,
    UNIQUE (id_group, id_user)
);

CREATE TABLE IF NOT EXISTS public.group_showtimes
(
    id_showtime integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    id_group integer,
    showtime timestamp without time zone,
    place character varying(255),
    moviename_original character varying(255) COLLATE pg_catalog."default",
    moviename_finnish character varying(255),
    CONSTRAINT "groupShowtimes_pkey" PRIMARY KEY (id_showtime),
	UNIQUE (showtime, place, moviename_original)
);

CREATE TABLE IF NOT EXISTS public.groups
(
    id_group integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    groupname character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT "Groups_pkey" PRIMARY KEY (id_group),
    CONSTRAINT groups_groupname_key UNIQUE (groupname)
);

CREATE TABLE IF NOT EXISTS public.reviews
(
    id_review integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    id_user integer,
    id_movie integer,
    date timestamp with TIME ZONE,
    moviename character varying(255) COLLATE pg_catalog."default",
    stars integer,
    comment text COLLATE pg_catalog."default",
    CONSTRAINT "Reviews_pkey" PRIMARY KEY (id_review)
);

CREATE TABLE IF NOT EXISTS public.users_in_groups
(
    users_id_user integer NOT NULL,
    groups_id_group integer NOT NULL,
    is_owner boolean
);

ALTER TABLE IF EXISTS public.favorites
    ADD CONSTRAINT "idUser" FOREIGN KEY (id_user)
    REFERENCES public.accounts (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.group_comments
    ADD CONSTRAINT group_comments_id_group_fkey FOREIGN KEY (id_group)
    REFERENCES public.groups (id_group) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.group_movies
    ADD CONSTRAINT "idGroup" FOREIGN KEY (id_group)
    REFERENCES public.groups (id_group) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.group_requests
    ADD CONSTRAINT group_requests_id_group_fkey FOREIGN KEY (id_group)
    REFERENCES public.groups (id_group) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.group_showtimes
    ADD CONSTRAINT "idGroup" FOREIGN KEY (id_group)
    REFERENCES public.groups (id_group) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.reviews
    ADD CONSTRAINT "idUser" FOREIGN KEY (id_user)
    REFERENCES public.accounts (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.users_in_groups
    ADD CONSTRAINT "idGroup" FOREIGN KEY (groups_id_group)
    REFERENCES public.groups (id_group) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.users_in_groups
    ADD CONSTRAINT "idUser" FOREIGN KEY (users_id_user)
    REFERENCES public.accounts (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;