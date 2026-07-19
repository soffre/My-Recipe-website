--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:C+TOjFuOEfEyMJv1kdAPmw==$6ZN3ECWHEPNxTgBL2v2zFiCk6pJ5hUQePhCl4hYjxhc=://+mxOmdJ4LO7Ngft5cV1ELsyXhMpS+J48glPop8hvY=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_catalog;


ALTER SCHEMA hdb_catalog OWNER TO postgres;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: gen_hasura_uuid(); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.gen_hasura_uuid() RETURNS uuid
    LANGUAGE sql
    AS $$select gen_random_uuid()$$;


ALTER FUNCTION hdb_catalog.gen_hasura_uuid() OWNER TO postgres;

--
-- Name: set_current_timestamp_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;


ALTER FUNCTION public.set_current_timestamp_updated_at() OWNER TO postgres;

--
-- Name: update_recipe_avg_rating(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_recipe_avg_rating() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE "Recipes"
    SET avg_rating = (
        SELECT ROUND(AVG(rating), 2)
        FROM "Ratings"
        WHERE recipe_id = NEW.recipe_id
    )
    WHERE id = NEW.recipe_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_recipe_avg_rating() OWNER TO postgres;

--
-- Name: update_recipe_like_count(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_recipe_like_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE "Recipes"
    SET like_count = (
        SELECT COUNT(*)
        FROM "Likes"
        WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    )
    WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_recipe_like_count() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_action_log (
    id uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    action_name text,
    input_payload jsonb NOT NULL,
    request_headers jsonb NOT NULL,
    session_variables jsonb NOT NULL,
    response_payload jsonb,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    response_received_at timestamp with time zone,
    status text NOT NULL,
    CONSTRAINT hdb_action_log_status_check CHECK ((status = ANY (ARRAY['created'::text, 'processing'::text, 'completed'::text, 'error'::text])))
);


ALTER TABLE hdb_catalog.hdb_action_log OWNER TO postgres;

--
-- Name: hdb_cron_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_cron_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_cron_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name text NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_cron_events OWNER TO postgres;

--
-- Name: hdb_metadata; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_metadata (
    id integer NOT NULL,
    metadata json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL
);


ALTER TABLE hdb_catalog.hdb_metadata OWNER TO postgres;

--
-- Name: hdb_scheduled_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_scheduled_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_scheduled_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    webhook_conf json NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    retry_conf json,
    payload json,
    header_conf json,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    comment text,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_scheduled_events OWNER TO postgres;

--
-- Name: hdb_schema_notifications; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_schema_notifications (
    id integer NOT NULL,
    notification json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL,
    instance_id uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT hdb_schema_notifications_id_check CHECK ((id = 1))
);


ALTER TABLE hdb_catalog.hdb_schema_notifications OWNER TO postgres;

--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    ee_client_id text,
    ee_client_secret text
);


ALTER TABLE hdb_catalog.hdb_version OWNER TO postgres;

--
-- Name: Bookmarks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Bookmarks" (
    user_id uuid NOT NULL,
    recipe_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Bookmarks" OWNER TO postgres;

--
-- Name: TABLE "Bookmarks"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Bookmarks" IS 'users favorite recipes are store here.  ';


--
-- Name: Categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Categories" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    image_url text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public."Categories" OWNER TO postgres;

--
-- Name: TABLE "Categories"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Categories" IS 'different categories for those recipe are list here in this relation.';


--
-- Name: Comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comments" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipe_id uuid NOT NULL,
    user_id uuid NOT NULL,
    text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Comments" OWNER TO postgres;

--
-- Name: TABLE "Comments"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Comments" IS 'All users comment on a specific recipe store here.';


--
-- Name: Ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ingredient" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipe_id uuid NOT NULL,
    name text NOT NULL,
    quantity text NOT NULL
);


ALTER TABLE public."Ingredient" OWNER TO postgres;

--
-- Name: TABLE "Ingredient"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Ingredient" IS 'All ingredient for each recipe are listed here.';


--
-- Name: Likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Likes" (
    user_id uuid NOT NULL,
    recipe_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Likes" OWNER TO postgres;

--
-- Name: TABLE "Likes"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Likes" IS 'All likes for each recipe by logged in user are store here.';


--
-- Name: Ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ratings" (
    user_id uuid NOT NULL,
    recipe_id uuid NOT NULL,
    rating double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Ratings" OWNER TO postgres;

--
-- Name: TABLE "Ratings"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Ratings" IS 'All user rating for each recipe are store here.';


--
-- Name: Recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Recipes" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    created_id uuid NOT NULL,
    category_id uuid NOT NULL,
    prep_time_minutes integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    avg_rating double precision DEFAULT '0'::double precision,
    like_count integer DEFAULT 0
);


ALTER TABLE public."Recipes" OWNER TO postgres;

--
-- Name: TABLE "Recipes"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Recipes" IS 'All Recipes information of the site created by user store here.';


--
-- Name: Recipes_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Recipes_image" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipe_id uuid NOT NULL,
    image_url text NOT NULL,
    is_featured boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Recipes_image" OWNER TO postgres;

--
-- Name: TABLE "Recipes_image"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Recipes_image" IS 'All the recipes thumbnail image url store here including the featured image.';


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "avatarUrl" text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    roles text[] DEFAULT '{user}'::text[] NOT NULL,
    CONSTRAINT chk_user_roles_valid CHECK ((roles <@ ARRAY['admin'::text, 'user'::text, 'writer'::text]))
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: TABLE "Users"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Users" IS 'All website users basic information store here';


--
-- Name: VerificationData; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VerificationData" (
    email text NOT NULL,
    code text NOT NULL,
    type text NOT NULL,
    "expireAt" timestamp with time zone
);


ALTER TABLE public."VerificationData" OWNER TO postgres;

--
-- Name: TABLE "VerificationData"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."VerificationData" IS 'Used to store user email and related thing till they verify it.';


--
-- Name: VerificationLogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VerificationLogs" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    code text NOT NULL,
    type text NOT NULL,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."VerificationLogs" OWNER TO postgres;

--
-- Name: TABLE "VerificationLogs"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."VerificationLogs" IS 'Historical audit logging trails for security tracking and analytics.';


--
-- Data for Name: hdb_action_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_action_log (id, action_name, input_payload, request_headers, session_variables, response_payload, errors, created_at, response_received_at, status) FROM stdin;
\.


--
-- Data for Name: hdb_cron_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_cron_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_events (id, trigger_name, scheduled_time, status, tries, created_at, next_retry_at) FROM stdin;
\.


--
-- Data for Name: hdb_metadata; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_metadata (id, metadata, resource_version) FROM stdin;
1	{"actions":[{"comment":"This action handles the forgot password functionality by redirecting to go handler and allow user to start the forgot password function","definition":{"arguments":[{"name":"arg1","type":"Input2!"}],"handler":"{{ACTION_BASE_URL}}/forgot_password","headers":[{"name":"x-hasura-event-secret","value_from_env":"EVENT_SECRET"}],"ignored_client_headers":["Content-Length","Content-MD5","User-Agent","Host","Origin","Referer","Accept","Accept-Encoding","Accept-Language","Accept-Datetime","Cache-Control","Connection","DNT","Content-Type"],"kind":"synchronous","output_type":"Output2!","request_transform":{"method":"POST","query_params":{},"template_engine":"Kriti","version":2},"type":"mutation"},"name":"forgotPassword","permissions":[{"role":"anonymous"},{"role":"user"}]},{"comment":"This action handle a request comes from client to get the cloudinary upload signature","definition":{"arguments":[{"name":"arg1","type":"CloudinaryInput!"}],"forward_client_headers":true,"handler":"{{ACTION_BASE_URL}}/cloudinary_signature","headers":[{"name":"x-hasura-event-secret","value_from_env":"EVENT_SECRET"}],"ignored_client_headers":["Content-Length","Content-MD5","User-Agent","Host","Origin","Referer","Accept","Accept-Encoding","Accept-Language","Accept-Datetime","Cache-Control","Connection","DNT","Content-Type"],"output_type":"CloudinaryOutput!","request_transform":{"method":"GET","query_params":{},"request_headers":{"add_headers":{},"remove_headers":["content-type"]},"template_engine":"Kriti","version":2},"type":"query"},"name":"getCloudinarySignature","permissions":[{"role":"user"}]},{"definition":{"arguments":[{"name":"arg1","type":"AuthInput!"}],"forward_client_headers":true,"handler":"{{ACTION_BASE_URL}}/login","headers":[{"name":"x-hasura-event-secret","value_from_env":"EVENT_SECRET"}],"ignored_client_headers":["Content-Length","Content-MD5","User-Agent","Host","Origin","Referer","Accept","Accept-Encoding","Accept-Language","Accept-Datetime","Cache-Control","Connection","DNT","Content-Type"],"kind":"synchronous","output_type":"LoginOutput!","request_transform":{"method":"POST","query_params":{},"template_engine":"Kriti","version":2},"type":"mutation"},"name":"loginUser","permissions":[{"role":"anonymous"},{"role":"user"}]},{"comment":"Password resetting after verification done, which send new password and a secret code to the handler","definition":{"arguments":[{"name":"inputs","type":"newInputs!"}],"forward_client_headers":true,"handler":"{{ACTION_BASE_URL}}/password_reset","headers":[{"name":"x-hasura-event-secret","value_from_env":"EVENT_SECRET"}],"ignored_client_headers":["Content-Length","Content-MD5","User-Agent","Host","Origin","Referer","Accept","Accept-Encoding","Accept-Language","Accept-Datetime","Cache-Control","Connection","DNT","Content-Type"],"kind":"synchronous","output_type":"Output2","request_transform":{"method":"POST","query_params":{},"template_engine":"Kriti","version":2},"type":"mutation"},"name":"passwordReset","permissions":[{"role":"anonymous"},{"role":"user"}]},{"comment":"action for resend verification   code if expired","definition":{"arguments":[{"name":"arg1","type":"ResendCodeInput!"}],"handler":"{{ACTION_BASE_URL}}/resend_code","headers":[{"name":"x-hasura-event-secret","value_from_env":"EVENT_SECRET"}],"ignored_client_headers":["Content-Length","Content-MD5","User-Agent","Host","Origin","Referer","Accept","Accept-Encoding","Accept-Language","Accept-Datetime","Cache-Control","Connection","DNT","Content-Type"],"kind":"synchronous","output_type":"Output2!","request_transform":{"method":"POST","query_params":{},"template_engine":"Kriti","version":2},"type":"mutation"},"name":"resendCode","permissions":[{"role":"anonymous"},{"role":"user"}]},{"comment":"This action does a signup or registration functionality for new user.","definition":{"arguments":[{"name":"arg1","type":"SignInput!"}],"forward_client_headers":true,"handler":"{{ACTION_BASE_URL}}/signup","headers":[{"name":"x-hasura-event-secret","value_from_env":"EVENT_SECRET"}],"ignored_client_headers":["Content-Length","Content-MD5","User-Agent","Host","Origin","Referer","Accept","Accept-Encoding","Accept-Language","Accept-Datetime","Cache-Control","Connection","DNT","Content-Type"],"kind":"synchronous","output_type":"Output2!","request_transform":{"method":"POST","query_params":{},"template_engine":"Kriti","version":2},"type":"mutation"},"name":"signupUser","permissions":[{"role":"anonymous"},{"role":"user"}]},{"comment":"To verify a code during email verification or password reset after getting verification code by email","definition":{"arguments":[{"name":"verCode","type":"VerificationInput!"}],"forward_client_headers":true,"handler":"{{ACTION_BASE_URL}}/verify_email","headers":[{"name":"x-hasura-event-secret","value_from_env":"EVENT_SECRET"}],"ignored_client_headers":["Content-Length","Content-MD5","User-Agent","Host","Origin","Referer","Accept","Accept-Encoding","Accept-Language","Accept-Datetime","Cache-Control","Connection","DNT","Content-Type"],"kind":"synchronous","output_type":"output","request_transform":{"method":"POST","query_params":{},"template_engine":"Kriti","version":2},"type":"mutation"},"name":"verifyEmail","permissions":[{"role":"user"},{"role":"anonymous"}]},{"definition":{"arguments":[{"name":"verCode","type":"VerificationInput2!"}],"forward_client_headers":true,"handler":"{{ACTION_BASE_URL}}/verify_resetCode","headers":[{"name":"x-hasura-event-secret","value_from_env":"EVENT_SECRET"}],"ignored_client_headers":["Content-Length","Content-MD5","User-Agent","Host","Origin","Referer","Accept","Accept-Encoding","Accept-Language","Accept-Datetime","Cache-Control","Connection","DNT","Content-Type"],"kind":"synchronous","output_type":"output","request_transform":{"method":"POST","query_params":{},"template_engine":"Kriti","version":2},"type":"mutation"},"name":"verifyResetCode","permissions":[{"role":"anonymous"},{"role":"user"}]}],"backend_configs":{"dataconnector":{"athena":{"uri":"http://data-connector-agent:8081/api/v1/athena"},"mariadb":{"uri":"http://data-connector-agent:8081/api/v1/mariadb"},"mysql8":{"uri":"http://data-connector-agent:8081/api/v1/mysql"},"oracle":{"uri":"http://data-connector-agent:8081/api/v1/oracle"},"snowflake":{"uri":"http://data-connector-agent:8081/api/v1/snowflake"}}},"custom_types":{"input_objects":[{"fields":[{"name":"email","type":"String!"},{"name":"password","type":"String!"}],"name":"userCredentials"},{"fields":[{"name":"fullName","type":"String!"},{"name":"email","type":"String!"},{"name":"password","type":"String!"},{"name":"avater_url","type":"String"}],"name":"Input"},{"fields":[{"name":"email","type":"String!"},{"name":"code","type":"String!"}],"name":"VerificationData"},{"fields":[{"name":"email","type":"String!"},{"name":"code","type":"String!"}],"name":"VerificationInput"},{"fields":[{"name":"newPassword","type":"String!"},{"name":"confirmNewPassowrd","type":"String!"},{"name":"email","type":"String!"},{"name":"secretCode","type":"String!"}],"name":"newInputs"},{"fields":[{"name":"email","type":"String!"}],"name":"Input2"},{"fields":[{"name":"email","type":"String!"},{"name":"code","type":"String!"}],"name":"VerificationInput2"},{"fields":[{"name":"email","type":"String!"},{"name":"actionType","type":"String!"}],"name":"ResendCodeInput"},{"fields":[{"name":"folder","type":"String!"}],"name":"CloudinaryInput"},{"fields":[{"name":"email","type":"String!"},{"name":"password","type":"String!"}],"name":"AuthInput"},{"fields":[{"name":"email","type":"String!"},{"name":"password","type":"String!"},{"name":"name","type":"String!"},{"name":"avatarUrl","type":"String"}],"name":"SignInput"}],"objects":[{"fields":[{"name":"accessToken","type":"String!"}],"name":"Token"},{"fields":[{"name":"message","type":"String!"},{"name":"code","type":"String"}],"name":"Output"},{"fields":[{"name":"success","type":"Boolean"},{"name":"message","type":"String!"},{"name":"code","type":"String"}],"name":"output"},{"fields":[{"name":"message","type":"String!"}],"name":"Response"},{"fields":[{"name":"success","type":"Boolean"},{"name":"message","type":"String!"},{"name":"code","type":"String"}],"name":"Output2"},{"fields":[{"name":"message","type":"String!"},{"name":"data","type":"String"}],"name":"output2"},{"fields":[{"name":"timestamp","type":"String!"},{"name":"signature","type":"String!"}],"name":"response"},{"fields":[{"name":"message","type":"String"},{"name":"data","type":"String!"}],"name":"CloudinaryOutput"},{"fields":[{"name":"message","type":"String"},{"name":"code","type":"String"},{"name":"token","type":"String!"}],"name":"LoginOutput"}]},"sources":[{"configuration":{"connection_info":{"database_url":{"from_env":"PG_DATABASE_URL"},"isolation_level":"read-committed","use_prepared_statements":false}},"kind":"postgres","name":"recipes-database","tables":[{"object_relationships":[{"name":"Recipe","using":{"foreign_key_constraint_on":"recipe_id"}},{"name":"User","using":{"foreign_key_constraint_on":"user_id"}}],"table":{"name":"Bookmarks","schema":"public"}},{"array_relationships":[{"name":"Recipes","using":{"foreign_key_constraint_on":{"column":"category_id","table":{"name":"Recipes","schema":"public"}}}}],"table":{"name":"Categories","schema":"public"}},{"object_relationships":[{"name":"Recipe","using":{"foreign_key_constraint_on":"recipe_id"}},{"name":"User","using":{"foreign_key_constraint_on":"user_id"}}],"table":{"name":"Comments","schema":"public"}},{"object_relationships":[{"name":"Recipe","using":{"foreign_key_constraint_on":"recipe_id"}}],"table":{"name":"Ingredient","schema":"public"}},{"object_relationships":[{"name":"Recipe","using":{"foreign_key_constraint_on":"recipe_id"}},{"name":"User","using":{"foreign_key_constraint_on":"user_id"}}],"table":{"name":"Likes","schema":"public"}},{"object_relationships":[{"name":"Recipe","using":{"foreign_key_constraint_on":"recipe_id"}},{"name":"User","using":{"foreign_key_constraint_on":"user_id"}}],"table":{"name":"Ratings","schema":"public"}},{"array_relationships":[{"name":"Bookmarks","using":{"foreign_key_constraint_on":{"column":"recipe_id","table":{"name":"Bookmarks","schema":"public"}}}},{"name":"Comments","using":{"foreign_key_constraint_on":{"column":"recipe_id","table":{"name":"Comments","schema":"public"}}}},{"name":"Ingredients","using":{"foreign_key_constraint_on":{"column":"recipe_id","table":{"name":"Ingredient","schema":"public"}}}},{"name":"Likes","using":{"foreign_key_constraint_on":{"column":"recipe_id","table":{"name":"Likes","schema":"public"}}}},{"name":"Ratings","using":{"foreign_key_constraint_on":{"column":"recipe_id","table":{"name":"Ratings","schema":"public"}}}},{"name":"Recipes_images","using":{"foreign_key_constraint_on":{"column":"recipe_id","table":{"name":"Recipes_image","schema":"public"}}}}],"delete_permissions":[{"comment":"","permission":{"filter":{"created_id":{"_eq":"X-Hasura-User-Id"}}},"role":"user"}],"insert_permissions":[{"comment":"","permission":{"check":{},"columns":["category_id","description","prep_time_minutes","title"],"set":{"created_id":"x-hasura-User-Id"}},"role":"user"}],"object_relationships":[{"name":"Category","using":{"foreign_key_constraint_on":"category_id"}},{"name":"User","using":{"foreign_key_constraint_on":"created_id"}}],"select_permissions":[{"comment":"","permission":{"allow_aggregations":true,"columns":["avg_rating","like_count","prep_time_minutes","description","title","created_at","updated_at","category_id","created_id","id"],"filter":{}},"role":"user"}],"table":{"name":"Recipes","schema":"public"},"update_permissions":[{"comment":"","permission":{"check":{"created_id":{"_eq":"X-Hasura-User-Id"}},"columns":["category_id","description","prep_time_minutes","title"],"filter":{"created_id":{"_eq":"X-Hasura-User-Id"}}},"role":"user"}]},{"object_relationships":[{"name":"Recipe","using":{"foreign_key_constraint_on":"recipe_id"}}],"table":{"name":"Recipes_image","schema":"public"}},{"array_relationships":[{"name":"Bookmarks","using":{"foreign_key_constraint_on":{"column":"user_id","table":{"name":"Bookmarks","schema":"public"}}}},{"name":"Comments","using":{"foreign_key_constraint_on":{"column":"user_id","table":{"name":"Comments","schema":"public"}}}},{"name":"Likes","using":{"foreign_key_constraint_on":{"column":"user_id","table":{"name":"Likes","schema":"public"}}}},{"name":"Ratings","using":{"foreign_key_constraint_on":{"column":"user_id","table":{"name":"Ratings","schema":"public"}}}},{"name":"Recipes","using":{"foreign_key_constraint_on":{"column":"created_id","table":{"name":"Recipes","schema":"public"}}}},{"name":"VerificationData","using":{"foreign_key_constraint_on":{"column":"email","table":{"name":"VerificationData","schema":"public"}}}}],"delete_permissions":[{"comment":"","permission":{"filter":{"id":{"_eq":"X-Hasura-User-Id"}}},"role":"user"}],"insert_permissions":[{"comment":"","permission":{"backend_only":true,"check":{},"columns":["avatarUrl","email","name","password"]},"role":"anonymous"}],"object_relationships":[{"name":"VerificationDatum","using":{"foreign_key_constraint_on":{"column":"email","table":{"name":"VerificationData","schema":"public"}}}}],"select_permissions":[{"comment":"","permission":{"allow_aggregations":true,"columns":["avatarUrl","email","id","name","password"],"filter":{}},"role":"anonymous"},{"comment":"","permission":{"allow_aggregations":true,"columns":["avatarUrl","email","name","password","created_at","updated_at","id"],"filter":{"id":{"_eq":"X-Hasura-User-Id"}},"limit":1},"role":"user"}],"table":{"name":"Users","schema":"public"},"update_permissions":[{"comment":"","permission":{"check":{"id":{"_eq":"X-Hasura-User-Id"}},"columns":["avatarUrl","email","name","password"],"filter":{"id":{"_eq":"X-Hasura-User-Id"}}},"role":"user"}]},{"object_relationships":[{"name":"User","using":{"foreign_key_constraint_on":"email"}}],"table":{"name":"VerificationData","schema":"public"}},{"table":{"name":"VerificationLogs","schema":"public"}}]}],"version":3}	56
\.


--
-- Data for Name: hdb_scheduled_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_scheduled_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_events (id, webhook_conf, scheduled_time, retry_conf, payload, header_conf, status, tries, created_at, next_retry_at, comment) FROM stdin;
\.


--
-- Data for Name: hdb_schema_notifications; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_schema_notifications (id, notification, resource_version, instance_id, updated_at) FROM stdin;
1	{"metadata":false,"remote_schemas":[],"sources":[],"data_connectors":[]}	56	c9e06f53-20b1-4d98-a4d7-251917ef6b8f	2026-06-18 19:50:06.466428+00
\.


--
-- Data for Name: hdb_version; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_version (hasura_uuid, version, upgraded_on, cli_state, console_state, ee_client_id, ee_client_secret) FROM stdin;
7b9832bd-6577-4cc6-a844-22f903eb5704	48	2026-06-18 19:46:19.085177+00	{"settings": {"migration_mode": "true"}, "migrations": {"recipes-database": {"1762803777690": false}}, "isStateCopyCompleted": true}	{"console_notifications": {"admin": {"date": "2026-06-28T13:20:41.554Z", "read": [], "showBadge": false}}}	\N	\N
\.


--
-- Data for Name: Bookmarks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Bookmarks" (user_id, recipe_id, created_at) FROM stdin;
\.


--
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Categories" (id, name, image_url, description, created_at) FROM stdin;
\.


--
-- Data for Name: Comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comments" (id, recipe_id, user_id, text, created_at) FROM stdin;
\.


--
-- Data for Name: Ingredient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ingredient" (id, recipe_id, name, quantity) FROM stdin;
\.


--
-- Data for Name: Likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Likes" (user_id, recipe_id, created_at) FROM stdin;
\.


--
-- Data for Name: Ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ratings" (user_id, recipe_id, rating, created_at) FROM stdin;
\.


--
-- Data for Name: Recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Recipes" (id, title, description, created_id, category_id, prep_time_minutes, created_at, updated_at, avg_rating, like_count) FROM stdin;
\.


--
-- Data for Name: Recipes_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Recipes_image" (id, recipe_id, image_url, is_featured) FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, name, email, password, "avatarUrl", created_at, updated_at, "isVerified", roles) FROM stdin;
a67f977e-ad30-49b4-bec7-23dbe4365bce	amanuel fentahun	amanuel.m.fentahun@gmail.com	$2a$14$bCJsncWf1AhO4yGk0SbDEOJrbCFVXg1H4INGa3qV5pd5XC6dL6YOy	\N	2026-06-23 19:40:40.509936+00	2026-06-29 19:42:12.940916+00	t	{user}
2f5dfa98-d567-4045-89e7-db7d612357a1	Amanuel Fentahun	amanuelsof@gmail.com	$2a$14$Pp8OeRcGlksRHj9KGawHt.Ouhhpzy9pn9Trul8bYdLsZstN5wMHMu		2026-07-02 21:29:09.903591+00	2026-07-06 20:41:17.751834+00	t	{user}
887e0287-9485-416e-817d-41d55dd292a4	amanuel fentahun	6186fre@gmail.com	$2a$14$7xkeSKsFOpPFy0nfBccA8ua4aE7mYVbL2s9xAFhPqFPt1xRWq4Ene		2026-07-06 20:44:05.094428+00	2026-07-06 20:45:12.712172+00	t	{user}
d2947398-ddd7-4bbe-a50c-70db65071a77	Amanuel Fentahun	amanfent12@gmail.com	$2a$14$okKHDduZkMCy8hC1jPPMKODeo3kHqBnXQt3.o/N5VFfyoqI7Fn0GK		2026-07-08 19:44:21.644306+00	2026-07-08 19:44:21.644306+00	f	{user}
\.


--
-- Data for Name: VerificationData; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerificationData" (email, code, type, "expireAt") FROM stdin;
amanuel.m.fentahun@gmail.com	9APjID	password_reset	2026-06-29 20:11:53+00
amanuelsof@gmail.com	p95ohB	password_reset	2026-07-08 19:57:08+00
amanfent12@gmail.com	2gxgCF	password_reset	2026-07-08 20:08:54+00
\.


--
-- Data for Name: VerificationLogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerificationLogs" (id, email, code, type, status, created_at) FROM stdin;
7b74c59a-4eab-401b-95fe-6a416cf1faf9	amanuel.m.fentahun@gmail.com	f5jFRN	password_reset	SUCCESS	2026-06-25 21:20:23.910246+00
2496024b-cf33-4a5b-9cc1-7bf58509350c	amanuel.m.fentahun@gmail.com	iffeEg	password_reset	EXPIRED	2026-06-29 19:56:53.137743+00
ac4e5bd0-835c-4bdd-ac22-775d801b67dd	amanuelsof@gmail.com	9fkpsG	password_reset	SUCCESS	2026-07-02 21:30:59.873686+00
ea86fe16-ff7b-4ad3-91ff-558e0f6fa16c	amanuelsof@gmail.com	grFYaP	password_reset	SUCCESS	2026-07-06 20:41:17.797842+00
ba2bdad6-de27-46c3-ad10-a0349b0ae268	6186fre@gmail.com	MbR8Rq	email_verification	SUCCESS	2026-07-06 20:45:12.695868+00
f4e81032-6172-4428-aa6f-c53232e6973f	amanuelsof@gmail.com	0sdpdM	password_reset	EXPIRED	2026-07-08 19:42:08.403813+00
\.


--
-- Name: hdb_action_log hdb_action_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action_log
    ADD CONSTRAINT hdb_action_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_events hdb_cron_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_events
    ADD CONSTRAINT hdb_cron_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_resource_version_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_resource_version_key UNIQUE (resource_version);


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_scheduled_events hdb_scheduled_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_events
    ADD CONSTRAINT hdb_scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_schema_notifications hdb_schema_notifications_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_schema_notifications
    ADD CONSTRAINT hdb_schema_notifications_pkey PRIMARY KEY (id);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: Bookmarks Bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bookmarks"
    ADD CONSTRAINT "Bookmarks_pkey" PRIMARY KEY (user_id, recipe_id);


--
-- Name: Categories Categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY (id);


--
-- Name: Comments Comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_pkey" PRIMARY KEY (id);


--
-- Name: Ingredient Ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ingredient"
    ADD CONSTRAINT "Ingredient_pkey" PRIMARY KEY (id);


--
-- Name: Likes Likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_pkey" PRIMARY KEY (user_id, recipe_id);


--
-- Name: Ratings Ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT "Ratings_pkey" PRIMARY KEY (recipe_id, user_id);


--
-- Name: Recipes_image Recipes_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipes_image"
    ADD CONSTRAINT "Recipes_image_pkey" PRIMARY KEY (id);


--
-- Name: Recipes Recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipes"
    ADD CONSTRAINT "Recipes_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: VerificationData VerificationData_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VerificationData"
    ADD CONSTRAINT "VerificationData_pkey" PRIMARY KEY (email);


--
-- Name: VerificationLogs VerificationLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VerificationLogs"
    ADD CONSTRAINT "VerificationLogs_pkey" PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_event_id; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_cron_event_invocation_event_id ON hdb_catalog.hdb_cron_event_invocation_logs USING btree (event_id);


--
-- Name: hdb_cron_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_cron_event_status ON hdb_catalog.hdb_cron_events USING btree (status);


--
-- Name: hdb_cron_events_unique_scheduled; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_cron_events_unique_scheduled ON hdb_catalog.hdb_cron_events USING btree (trigger_name, scheduled_time) WHERE (status = 'scheduled'::text);


--
-- Name: hdb_scheduled_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_scheduled_event_status ON hdb_catalog.hdb_scheduled_events USING btree (status);


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: Recipes set_public_Recipes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "set_public_Recipes_updated_at" BEFORE UPDATE ON public."Recipes" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER "set_public_Recipes_updated_at" ON "Recipes"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER "set_public_Recipes_updated_at" ON public."Recipes" IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: Users set_public_Users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "set_public_Users_updated_at" BEFORE UPDATE ON public."Users" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER "set_public_Users_updated_at" ON "Users"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER "set_public_Users_updated_at" ON public."Users" IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: Ratings trg_update_avg_rating; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_avg_rating AFTER INSERT OR DELETE OR UPDATE ON public."Ratings" FOR EACH ROW EXECUTE FUNCTION public.update_recipe_avg_rating();


--
-- Name: Likes trg_update_like_count; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_like_count AFTER INSERT OR DELETE ON public."Likes" FOR EACH ROW EXECUTE FUNCTION public.update_recipe_like_count();


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_cron_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_scheduled_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Bookmarks Bookmarks_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bookmarks"
    ADD CONSTRAINT "Bookmarks_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public."Recipes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Bookmarks Bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bookmarks"
    ADD CONSTRAINT "Bookmarks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comments Comments_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public."Recipes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comments Comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ingredient Ingredient_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ingredient"
    ADD CONSTRAINT "Ingredient_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public."Recipes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Likes Likes_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public."Recipes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Likes Likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ratings Ratings_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT "Ratings_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public."Recipes"(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: Ratings Ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT "Ratings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Recipes Recipes_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipes"
    ADD CONSTRAINT "Recipes_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Recipes Recipes_created_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipes"
    ADD CONSTRAINT "Recipes_created_id_fkey" FOREIGN KEY (created_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Recipes_image Recipes_image_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipes_image"
    ADD CONSTRAINT "Recipes_image_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public."Recipes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VerificationData VerificationData_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VerificationData"
    ADD CONSTRAINT "VerificationData_email_fkey" FOREIGN KEY (email) REFERENCES public."Users"(email) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

