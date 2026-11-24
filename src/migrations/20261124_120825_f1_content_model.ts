import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

import { enableRowLevelSecurity } from '../lib/db/rls'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ro', 'en', 'it', 'fr', 'de', 'zh', 'sv');
  CREATE TYPE "public"."enum_home_page_hero_media_mode" AS ENUM('video', 'slideshow');
  CREATE TYPE "public"."enum_wines_type" AS ENUM('sparkling', 'white', 'rose', 'red', 'dessert');
  CREATE TYPE "public"."enum_wines_volume" AS ENUM('0.375', '0.75', '1.5');
  CREATE TYPE "public"."enum_reviews_group" AS ENUM('restaurant', 'hotel');
  CREATE TYPE "public"."enum_reviews_source" AS ENUM('google', 'tripadvisor', 'facebook', 'other');
  CREATE TYPE "public"."enum_faqs_group" AS ENUM('home', 'private-events', 'pizza', 'stay', 'restaurant');
  CREATE TYPE "public"."enum_media_kind" AS ENUM('photo', 'clip', 'logo', 'badge', 'video-variant', 'video-poster');
  CREATE TYPE "public"."enum_submissions_subject" AS ENUM('privateEvent', 'pizzaCourse', 'accommodation', 'question', 'complaint');
  CREATE TYPE "public"."enum_submissions_status" AS ENUM('new', 'in-progress', 'resolved');
  CREATE TYPE "public"."enum_settings_hours_day" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
  CREATE TYPE "public"."enum_settings_active_locales" AS ENUM('ro', 'en', 'it', 'fr', 'de', 'zh', 'sv');
  CREATE TYPE "public"."enum_settings_default_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_awards_placements" AS ENUM('hero', 'wines-section', 'wines-page', 'footer');
  CREATE TABLE "home_page_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"desktop_id" integer,
  	"mobile_id" integer
  );
  
  CREATE TABLE "home_page_private_events_event_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_private_events_event_types_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"hero_enabled" boolean DEFAULT true,
  	"hero_placeholder" boolean DEFAULT false,
  	"hero_order" numeric,
  	"hero_media_mode" "enum_home_page_hero_media_mode" DEFAULT 'video' NOT NULL,
  	"hero_video_desktop_id" integer,
  	"hero_video_mobile_id" integer,
  	"hero_poster_desktop_id" integer,
  	"hero_poster_mobile_id" integer,
  	"stay_enabled" boolean DEFAULT true,
  	"stay_placeholder" boolean DEFAULT false,
  	"stay_order" numeric,
  	"stay_max_adults" numeric DEFAULT 6 NOT NULL,
  	"stay_max_children" numeric DEFAULT 4 NOT NULL,
  	"kitchen_enabled" boolean DEFAULT true,
  	"kitchen_placeholder" boolean DEFAULT false,
  	"kitchen_order" numeric,
  	"wines_enabled" boolean DEFAULT true,
  	"wines_placeholder" boolean DEFAULT false,
  	"wines_order" numeric,
  	"reviews_enabled" boolean DEFAULT true,
  	"reviews_placeholder" boolean DEFAULT false,
  	"reviews_order" numeric,
  	"parties_enabled" boolean DEFAULT true,
  	"parties_placeholder" boolean DEFAULT false,
  	"parties_order" numeric,
  	"private_events_enabled" boolean DEFAULT true,
  	"private_events_placeholder" boolean DEFAULT false,
  	"private_events_order" numeric,
  	"pizza_enabled" boolean DEFAULT true,
  	"pizza_placeholder" boolean DEFAULT false,
  	"pizza_order" numeric,
  	"pizza_photo_id" integer,
  	"hotel_enabled" boolean DEFAULT true,
  	"hotel_placeholder" boolean DEFAULT false,
  	"hotel_order" numeric,
  	"hotel_hotel_name" varchar NOT NULL,
  	"hotel_hotel_address" varchar NOT NULL,
  	"hotel_hotel_url" varchar,
  	"hotel_price_from" numeric,
  	"gallery_enabled" boolean DEFAULT true,
  	"gallery_placeholder" boolean DEFAULT false,
  	"gallery_order" numeric,
  	"contact_enabled" boolean DEFAULT true,
  	"contact_placeholder" boolean DEFAULT false,
  	"contact_order" numeric,
  	"footer_placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_page_locales" (
  	"hero_menu_label" varchar,
  	"hero_subtitle" varchar,
  	"hero_book_label" varchar DEFAULT 'Rezervă o masă' NOT NULL,
  	"hero_menu_button_label" varchar DEFAULT 'Meniu' NOT NULL,
  	"stay_menu_label" varchar,
  	"stay_title" varchar DEFAULT 'Cazare la Hotel ANNA' NOT NULL,
  	"stay_note" varchar NOT NULL,
  	"stay_button_label" varchar DEFAULT 'Cere ofertă de cazare' NOT NULL,
  	"kitchen_menu_label" varchar,
  	"kitchen_title" varchar NOT NULL,
  	"kitchen_intro" varchar,
  	"kitchen_button_label" varchar DEFAULT 'Vezi meniul complet' NOT NULL,
  	"wines_menu_label" varchar,
  	"wines_title" varchar NOT NULL,
  	"wines_intro" varchar,
  	"wines_button_label" varchar DEFAULT 'Vezi lista de vinuri' NOT NULL,
  	"reviews_menu_label" varchar,
  	"reviews_title" varchar NOT NULL,
  	"reviews_button_label" varchar DEFAULT 'Lasă o recenzie' NOT NULL,
  	"parties_menu_label" varchar,
  	"parties_title" varchar NOT NULL,
  	"parties_intro" varchar,
  	"parties_empty_message" varchar DEFAULT 'Pregătim următoarea seară' NOT NULL,
  	"private_events_menu_label" varchar,
  	"private_events_title" varchar NOT NULL,
  	"private_events_intro" varchar,
  	"private_events_button_label" varchar DEFAULT 'Rezervă salonul' NOT NULL,
  	"pizza_menu_label" varchar,
  	"pizza_title" varchar NOT NULL,
  	"pizza_short_text" varchar NOT NULL,
  	"pizza_button_label" varchar DEFAULT 'Înscrie copilul' NOT NULL,
  	"pizza_full_text" jsonb,
  	"pizza_age" varchar,
  	"pizza_duration" varchar,
  	"pizza_price" varchar,
  	"pizza_seats" varchar,
  	"hotel_menu_label" varchar,
  	"hotel_title" varchar NOT NULL,
  	"hotel_intro" varchar NOT NULL,
  	"hotel_price_note" varchar,
  	"gallery_menu_label" varchar,
  	"gallery_title" varchar NOT NULL,
  	"gallery_button_label" varchar DEFAULT 'Vezi galeria' NOT NULL,
  	"contact_menu_label" varchar,
  	"contact_title" varchar NOT NULL,
  	"contact_intro" varchar,
  	"footer_copyright" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "events_locales" (
  	"description" varchar,
  	"entry" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "dish_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"photo_id" integer,
  	"link" varchar,
  	"active" boolean DEFAULT true,
  	"placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "dish_categories_locales" (
  	"short_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "wines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"producer" varchar,
  	"type" "enum_wines_type" NOT NULL,
  	"region" varchar,
  	"vintage" numeric,
  	"grapes" varchar,
  	"price_bottle" numeric NOT NULL,
  	"volume" "enum_wines_volume" DEFAULT '0.75' NOT NULL,
  	"price_glass" numeric,
  	"photo_id" integer,
  	"featured" boolean DEFAULT false,
  	"available" boolean DEFAULT true,
  	"external_code" varchar,
  	"active" boolean DEFAULT true,
  	"placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "wines_locales" (
  	"country" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"tenant_id" integer,
  	"author" varchar NOT NULL,
  	"group" "enum_reviews_group" DEFAULT 'restaurant' NOT NULL,
  	"source" "enum_reviews_source" DEFAULT 'google' NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"rating" numeric,
  	"source_url" varchar,
  	"active" boolean DEFAULT true,
  	"placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reviews_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "salons_amenities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "salons_amenities_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "salons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"capacity" numeric NOT NULL,
  	"active" boolean DEFAULT true,
  	"placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "salons_locales" (
  	"location" varchar,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "salons_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "room_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"photo_id" integer,
  	"active" boolean DEFAULT true,
  	"placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "room_types_locales" (
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "gallery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"tenant_id" integer,
  	"file_id" integer NOT NULL,
  	"category_id" integer NOT NULL,
  	"on_home" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "gallery_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"tenant_id" integer,
  	"active" boolean DEFAULT true,
  	"placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gallery_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"tenant_id" integer,
  	"group" "enum_faqs_group" DEFAULT 'home' NOT NULL,
  	"active" boolean DEFAULT true,
  	"placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "complaint_reasons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"tenant_id" integer,
  	"active" boolean DEFAULT true,
  	"placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "complaint_reasons_locales" (
  	"reason" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "group_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"url" varchar,
  	"active" boolean DEFAULT true,
  	"placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "legal_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"tenant_id" integer,
  	"slug" varchar NOT NULL,
  	"in_footer" boolean DEFAULT true,
  	"active" boolean DEFAULT true,
  	"placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "legal_pages_locales" (
  	"title" varchar NOT NULL,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"subject" "enum_submissions_subject" NOT NULL,
  	"status" "enum_submissions_status" DEFAULT 'new' NOT NULL,
  	"name" varchar,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar,
  	"details_event_type" varchar,
  	"details_event_date" timestamp(3) with time zone,
  	"details_guests" numeric,
  	"details_salon_id" integer,
  	"details_children" numeric,
  	"details_ages" varchar,
  	"details_preferred_date" timestamp(3) with time zone,
  	"details_check_in" timestamp(3) with time zone,
  	"details_check_out" timestamp(3) with time zone,
  	"details_adults" numeric,
  	"details_kids" numeric,
  	"details_room_type_id" integer,
  	"details_visit_date" timestamp(3) with time zone,
  	"details_reason_id" integer,
  	"details_waiter" varchar,
  	"consent" boolean DEFAULT false NOT NULL,
  	"consent_at" timestamp(3) with time zone,
  	"email_sent" boolean DEFAULT false,
  	"email_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "settings_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_settings_hours_day" NOT NULL,
  	"opens" varchar,
  	"closes" varchar,
  	"closed" boolean DEFAULT false
  );
  
  CREATE TABLE "settings_other_networks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "settings_active_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_settings_active_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"tagline" varchar NOT NULL,
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"logo_group_id" integer,
  	"favicon_id" integer,
  	"colors_background" varchar,
  	"colors_text" varchar,
  	"colors_accent" varchar,
  	"colors_accent2" varchar,
  	"default_theme" "enum_settings_default_theme",
  	"share_image_id" integer,
  	"address_street" varchar NOT NULL,
  	"address_city" varchar NOT NULL,
  	"address_county" varchar,
  	"address_country" varchar NOT NULL,
  	"address_lat" numeric,
  	"address_lng" numeric,
  	"phone_reservations" varchar NOT NULL,
  	"phone_events" varchar,
  	"social_facebook" varchar,
  	"social_instagram" varchar,
  	"social_youtube" varchar,
  	"social_tiktok" varchar,
  	"social_tripadvisor" varchar,
  	"google_review_url" varchar,
  	"ialoc_id" varchar NOT NULL,
  	"analytics_id" varchar,
  	"digital_menu_url" varchar NOT NULL,
  	"requests_private_event_active" boolean DEFAULT false,
  	"requests_pizza_course_active" boolean DEFAULT false,
  	"requests_accommodation_active" boolean DEFAULT false,
  	"requests_question_active" boolean DEFAULT false,
  	"requests_complaint_active" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "settings_locales" (
  	"hours_note" varchar,
  	"requests_private_event_response_time" varchar,
  	"requests_pizza_course_response_time" varchar,
  	"requests_accommodation_response_time" varchar,
  	"requests_question_response_time" varchar,
  	"requests_complaint_response_time" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "settings_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "awards_placements" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_awards_placements",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "awards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"organization" varchar NOT NULL,
  	"level" varchar,
  	"year" numeric,
  	"badge_id" integer,
  	"source_url" varchar,
  	"structured_data" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "awards_locales" (
  	"line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"permanent" boolean DEFAULT true,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "events" ALTER COLUMN "type" SET DEFAULT 'dj';
  ALTER TABLE "events" ALTER COLUMN "placeholder" SET DEFAULT false;
  ALTER TABLE "media" ADD COLUMN "kind" "enum_media_kind" DEFAULT 'photo' NOT NULL;
  ALTER TABLE "media" ADD COLUMN "title" varchar;
  ALTER TABLE "media" ADD COLUMN "credit" varchar;
  ALTER TABLE "media" ADD COLUMN "has_children" boolean DEFAULT false;
  ALTER TABLE "media" ADD COLUMN "parental_consent" boolean DEFAULT false;
  ALTER TABLE "media" ADD COLUMN "original_name" varchar;
  ALTER TABLE "media" ADD COLUMN "original_bytes" numeric;
  ALTER TABLE "media" ADD COLUMN "duration_seconds" numeric;
  ALTER TABLE "media" ADD COLUMN "efficient_variant_id" integer;
  ALTER TABLE "media" ADD COLUMN "poster_id" integer;
  ALTER TABLE "media" ADD COLUMN "codec" varchar;
  ALTER TABLE "media" ADD COLUMN "variant_of_id" integer;
  ALTER TABLE "media" ADD COLUMN "sizes_avif640_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif640_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif640_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif640_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif640_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif640_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp640_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp640_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp640_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp640_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp640_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp640_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif960_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif960_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif960_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif960_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif960_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif960_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp960_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp960_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp960_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp960_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp960_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp960_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif1280_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif1280_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif1280_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif1280_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif1280_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif1280_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp1280_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp1280_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp1280_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp1280_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp1280_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp1280_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif1920_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif1920_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif1920_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif1920_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif1920_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif1920_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp1920_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp1920_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp1920_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp1920_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp1920_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp1920_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif2560_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif2560_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif2560_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif2560_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avif2560_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avif2560_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp2560_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp2560_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp2560_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp2560_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_webp2560_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_webp2560_filename" varchar;
  ALTER TABLE "events" ADD COLUMN "ends_at" timestamp(3) with time zone;
  ALTER TABLE "events" ADD COLUMN "guest" varchar;
  ALTER TABLE "events" ADD COLUMN "poster_id" integer;
  ALTER TABLE "events" ADD COLUMN "book_with_date" boolean DEFAULT true;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "home_page_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "dish_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "wines_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reviews_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "salons_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "room_types_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "gallery_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "gallery_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faqs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "complaint_reasons_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "group_links_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "legal_pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "submissions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "settings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "awards_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "redirects_id" integer;
  ALTER TABLE "home_page_hero_slides" ADD CONSTRAINT "home_page_hero_slides_desktop_id_media_id_fk" FOREIGN KEY ("desktop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_hero_slides" ADD CONSTRAINT "home_page_hero_slides_mobile_id_media_id_fk" FOREIGN KEY ("mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_hero_slides" ADD CONSTRAINT "home_page_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_private_events_event_types" ADD CONSTRAINT "home_page_private_events_event_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_private_events_event_types_locales" ADD CONSTRAINT "home_page_private_events_event_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_private_events_event_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_video_desktop_id_media_id_fk" FOREIGN KEY ("hero_video_desktop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_video_mobile_id_media_id_fk" FOREIGN KEY ("hero_video_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_poster_desktop_id_media_id_fk" FOREIGN KEY ("hero_poster_desktop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_poster_mobile_id_media_id_fk" FOREIGN KEY ("hero_poster_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_pizza_photo_id_media_id_fk" FOREIGN KEY ("pizza_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dish_categories" ADD CONSTRAINT "dish_categories_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dish_categories" ADD CONSTRAINT "dish_categories_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dish_categories_locales" ADD CONSTRAINT "dish_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dish_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines" ADD CONSTRAINT "wines_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wines_locales" ADD CONSTRAINT "wines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."wines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews_locales" ADD CONSTRAINT "reviews_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "salons_amenities" ADD CONSTRAINT "salons_amenities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "salons_amenities_locales" ADD CONSTRAINT "salons_amenities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."salons_amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "salons" ADD CONSTRAINT "salons_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "salons_locales" ADD CONSTRAINT "salons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "salons_rels" ADD CONSTRAINT "salons_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "salons_rels" ADD CONSTRAINT "salons_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "room_types" ADD CONSTRAINT "room_types_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "room_types" ADD CONSTRAINT "room_types_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "room_types_locales" ADD CONSTRAINT "room_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery" ADD CONSTRAINT "gallery_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery" ADD CONSTRAINT "gallery_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery" ADD CONSTRAINT "gallery_category_id_gallery_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."gallery_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_locales" ADD CONSTRAINT "gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery_categories" ADD CONSTRAINT "gallery_categories_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_categories_locales" ADD CONSTRAINT "gallery_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gallery_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "complaint_reasons" ADD CONSTRAINT "complaint_reasons_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "complaint_reasons_locales" ADD CONSTRAINT "complaint_reasons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."complaint_reasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "group_links" ADD CONSTRAINT "group_links_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal_pages" ADD CONSTRAINT "legal_pages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal_pages_locales" ADD CONSTRAINT "legal_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "submissions" ADD CONSTRAINT "submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "submissions" ADD CONSTRAINT "submissions_details_salon_id_salons_id_fk" FOREIGN KEY ("details_salon_id") REFERENCES "public"."salons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "submissions" ADD CONSTRAINT "submissions_details_room_type_id_room_types_id_fk" FOREIGN KEY ("details_room_type_id") REFERENCES "public"."room_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "submissions" ADD CONSTRAINT "submissions_details_reason_id_complaint_reasons_id_fk" FOREIGN KEY ("details_reason_id") REFERENCES "public"."complaint_reasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings_hours" ADD CONSTRAINT "settings_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_other_networks" ADD CONSTRAINT "settings_other_networks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_active_locales" ADD CONSTRAINT "settings_active_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_group_id_media_id_fk" FOREIGN KEY ("logo_group_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_share_image_id_media_id_fk" FOREIGN KEY ("share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings_locales" ADD CONSTRAINT "settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_texts" ADD CONSTRAINT "settings_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards_placements" ADD CONSTRAINT "awards_placements_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards_locales" ADD CONSTRAINT "awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects" ADD CONSTRAINT "redirects_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_hero_slides_order_idx" ON "home_page_hero_slides" USING btree ("_order");
  CREATE INDEX "home_page_hero_slides_parent_id_idx" ON "home_page_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_slides_desktop_idx" ON "home_page_hero_slides" USING btree ("desktop_id");
  CREATE INDEX "home_page_hero_slides_mobile_idx" ON "home_page_hero_slides" USING btree ("mobile_id");
  CREATE INDEX "home_page_private_events_event_types_order_idx" ON "home_page_private_events_event_types" USING btree ("_order");
  CREATE INDEX "home_page_private_events_event_types_parent_id_idx" ON "home_page_private_events_event_types" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_private_events_event_types_locales_locale_parent_i" ON "home_page_private_events_event_types_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_private_events_event_types_locales_parent_id_idx" ON "home_page_private_events_event_types_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_tenant_idx" ON "home_page" USING btree ("tenant_id");
  CREATE INDEX "home_page_hero_hero_video_desktop_idx" ON "home_page" USING btree ("hero_video_desktop_id");
  CREATE INDEX "home_page_hero_hero_video_mobile_idx" ON "home_page" USING btree ("hero_video_mobile_id");
  CREATE INDEX "home_page_hero_hero_poster_desktop_idx" ON "home_page" USING btree ("hero_poster_desktop_id");
  CREATE INDEX "home_page_hero_hero_poster_mobile_idx" ON "home_page" USING btree ("hero_poster_mobile_id");
  CREATE INDEX "home_page_pizza_pizza_photo_idx" ON "home_page" USING btree ("pizza_photo_id");
  CREATE INDEX "home_page_updated_at_idx" ON "home_page" USING btree ("updated_at");
  CREATE INDEX "home_page_created_at_idx" ON "home_page" USING btree ("created_at");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_locales_parent_id_idx" ON "home_page_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_media_id_idx" ON "home_page_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_locales_parent_id_idx" ON "events_locales" USING btree ("_parent_id");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_media_id_idx" ON "events_rels" USING btree ("media_id");
  CREATE INDEX "dish_categories__order_idx" ON "dish_categories" USING btree ("_order");
  CREATE INDEX "dish_categories_tenant_idx" ON "dish_categories" USING btree ("tenant_id");
  CREATE INDEX "dish_categories_photo_idx" ON "dish_categories" USING btree ("photo_id");
  CREATE INDEX "dish_categories_active_idx" ON "dish_categories" USING btree ("active");
  CREATE INDEX "dish_categories_placeholder_idx" ON "dish_categories" USING btree ("placeholder");
  CREATE INDEX "dish_categories_updated_at_idx" ON "dish_categories" USING btree ("updated_at");
  CREATE INDEX "dish_categories_created_at_idx" ON "dish_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "dish_categories_locales_locale_parent_id_unique" ON "dish_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "dish_categories_locales_parent_id_idx" ON "dish_categories_locales" USING btree ("_parent_id");
  CREATE INDEX "wines__order_idx" ON "wines" USING btree ("_order");
  CREATE INDEX "wines_tenant_idx" ON "wines" USING btree ("tenant_id");
  CREATE INDEX "wines_photo_idx" ON "wines" USING btree ("photo_id");
  CREATE INDEX "wines_active_idx" ON "wines" USING btree ("active");
  CREATE INDEX "wines_placeholder_idx" ON "wines" USING btree ("placeholder");
  CREATE INDEX "wines_updated_at_idx" ON "wines" USING btree ("updated_at");
  CREATE INDEX "wines_created_at_idx" ON "wines" USING btree ("created_at");
  CREATE UNIQUE INDEX "wines_locales_locale_parent_id_unique" ON "wines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "wines_locales_parent_id_idx" ON "wines_locales" USING btree ("_parent_id");
  CREATE INDEX "reviews__order_idx" ON "reviews" USING btree ("_order");
  CREATE INDEX "reviews_tenant_idx" ON "reviews" USING btree ("tenant_id");
  CREATE INDEX "reviews_active_idx" ON "reviews" USING btree ("active");
  CREATE INDEX "reviews_placeholder_idx" ON "reviews" USING btree ("placeholder");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE UNIQUE INDEX "reviews_locales_locale_parent_id_unique" ON "reviews_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "reviews_locales_parent_id_idx" ON "reviews_locales" USING btree ("_parent_id");
  CREATE INDEX "salons_amenities_order_idx" ON "salons_amenities" USING btree ("_order");
  CREATE INDEX "salons_amenities_parent_id_idx" ON "salons_amenities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "salons_amenities_locales_locale_parent_id_unique" ON "salons_amenities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "salons_amenities_locales_parent_id_idx" ON "salons_amenities_locales" USING btree ("_parent_id");
  CREATE INDEX "salons__order_idx" ON "salons" USING btree ("_order");
  CREATE INDEX "salons_tenant_idx" ON "salons" USING btree ("tenant_id");
  CREATE INDEX "salons_active_idx" ON "salons" USING btree ("active");
  CREATE INDEX "salons_placeholder_idx" ON "salons" USING btree ("placeholder");
  CREATE INDEX "salons_updated_at_idx" ON "salons" USING btree ("updated_at");
  CREATE INDEX "salons_created_at_idx" ON "salons" USING btree ("created_at");
  CREATE UNIQUE INDEX "salons_locales_locale_parent_id_unique" ON "salons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "salons_locales_parent_id_idx" ON "salons_locales" USING btree ("_parent_id");
  CREATE INDEX "salons_rels_order_idx" ON "salons_rels" USING btree ("order");
  CREATE INDEX "salons_rels_parent_idx" ON "salons_rels" USING btree ("parent_id");
  CREATE INDEX "salons_rels_path_idx" ON "salons_rels" USING btree ("path");
  CREATE INDEX "salons_rels_media_id_idx" ON "salons_rels" USING btree ("media_id");
  CREATE INDEX "room_types__order_idx" ON "room_types" USING btree ("_order");
  CREATE INDEX "room_types_tenant_idx" ON "room_types" USING btree ("tenant_id");
  CREATE INDEX "room_types_photo_idx" ON "room_types" USING btree ("photo_id");
  CREATE INDEX "room_types_active_idx" ON "room_types" USING btree ("active");
  CREATE INDEX "room_types_placeholder_idx" ON "room_types" USING btree ("placeholder");
  CREATE INDEX "room_types_updated_at_idx" ON "room_types" USING btree ("updated_at");
  CREATE INDEX "room_types_created_at_idx" ON "room_types" USING btree ("created_at");
  CREATE UNIQUE INDEX "room_types_locales_locale_parent_id_unique" ON "room_types_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "room_types_locales_parent_id_idx" ON "room_types_locales" USING btree ("_parent_id");
  CREATE INDEX "gallery__order_idx" ON "gallery" USING btree ("_order");
  CREATE INDEX "gallery_tenant_idx" ON "gallery" USING btree ("tenant_id");
  CREATE INDEX "gallery_file_idx" ON "gallery" USING btree ("file_id");
  CREATE INDEX "gallery_category_idx" ON "gallery" USING btree ("category_id");
  CREATE INDEX "gallery_active_idx" ON "gallery" USING btree ("active");
  CREATE INDEX "gallery_placeholder_idx" ON "gallery" USING btree ("placeholder");
  CREATE INDEX "gallery_updated_at_idx" ON "gallery" USING btree ("updated_at");
  CREATE INDEX "gallery_created_at_idx" ON "gallery" USING btree ("created_at");
  CREATE UNIQUE INDEX "gallery_locales_locale_parent_id_unique" ON "gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "gallery_locales_parent_id_idx" ON "gallery_locales" USING btree ("_parent_id");
  CREATE INDEX "gallery_categories__order_idx" ON "gallery_categories" USING btree ("_order");
  CREATE INDEX "gallery_categories_tenant_idx" ON "gallery_categories" USING btree ("tenant_id");
  CREATE INDEX "gallery_categories_active_idx" ON "gallery_categories" USING btree ("active");
  CREATE INDEX "gallery_categories_placeholder_idx" ON "gallery_categories" USING btree ("placeholder");
  CREATE INDEX "gallery_categories_updated_at_idx" ON "gallery_categories" USING btree ("updated_at");
  CREATE INDEX "gallery_categories_created_at_idx" ON "gallery_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "gallery_categories_locales_locale_parent_id_unique" ON "gallery_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "gallery_categories_locales_parent_id_idx" ON "gallery_categories_locales" USING btree ("_parent_id");
  CREATE INDEX "faqs__order_idx" ON "faqs" USING btree ("_order");
  CREATE INDEX "faqs_tenant_idx" ON "faqs" USING btree ("tenant_id");
  CREATE INDEX "faqs_active_idx" ON "faqs" USING btree ("active");
  CREATE INDEX "faqs_placeholder_idx" ON "faqs" USING btree ("placeholder");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_locales_parent_id_idx" ON "faqs_locales" USING btree ("_parent_id");
  CREATE INDEX "complaint_reasons__order_idx" ON "complaint_reasons" USING btree ("_order");
  CREATE INDEX "complaint_reasons_tenant_idx" ON "complaint_reasons" USING btree ("tenant_id");
  CREATE INDEX "complaint_reasons_active_idx" ON "complaint_reasons" USING btree ("active");
  CREATE INDEX "complaint_reasons_placeholder_idx" ON "complaint_reasons" USING btree ("placeholder");
  CREATE INDEX "complaint_reasons_updated_at_idx" ON "complaint_reasons" USING btree ("updated_at");
  CREATE INDEX "complaint_reasons_created_at_idx" ON "complaint_reasons" USING btree ("created_at");
  CREATE UNIQUE INDEX "complaint_reasons_locales_locale_parent_id_unique" ON "complaint_reasons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "complaint_reasons_locales_parent_id_idx" ON "complaint_reasons_locales" USING btree ("_parent_id");
  CREATE INDEX "group_links__order_idx" ON "group_links" USING btree ("_order");
  CREATE INDEX "group_links_tenant_idx" ON "group_links" USING btree ("tenant_id");
  CREATE INDEX "group_links_active_idx" ON "group_links" USING btree ("active");
  CREATE INDEX "group_links_placeholder_idx" ON "group_links" USING btree ("placeholder");
  CREATE INDEX "group_links_updated_at_idx" ON "group_links" USING btree ("updated_at");
  CREATE INDEX "group_links_created_at_idx" ON "group_links" USING btree ("created_at");
  CREATE INDEX "legal_pages__order_idx" ON "legal_pages" USING btree ("_order");
  CREATE INDEX "legal_pages_tenant_idx" ON "legal_pages" USING btree ("tenant_id");
  CREATE INDEX "legal_pages_active_idx" ON "legal_pages" USING btree ("active");
  CREATE INDEX "legal_pages_placeholder_idx" ON "legal_pages" USING btree ("placeholder");
  CREATE INDEX "legal_pages_updated_at_idx" ON "legal_pages" USING btree ("updated_at");
  CREATE INDEX "legal_pages_created_at_idx" ON "legal_pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "legal_pages_locales_locale_parent_id_unique" ON "legal_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "legal_pages_locales_parent_id_idx" ON "legal_pages_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "submissions_tenant_idx" ON "submissions" USING btree ("tenant_id");
  CREATE INDEX "submissions_details_details_salon_idx" ON "submissions" USING btree ("details_salon_id");
  CREATE INDEX "submissions_details_details_room_type_idx" ON "submissions" USING btree ("details_room_type_id");
  CREATE INDEX "submissions_details_details_reason_idx" ON "submissions" USING btree ("details_reason_id");
  CREATE INDEX "submissions_updated_at_idx" ON "submissions" USING btree ("updated_at");
  CREATE INDEX "submissions_created_at_idx" ON "submissions" USING btree ("created_at");
  CREATE INDEX "settings_hours_order_idx" ON "settings_hours" USING btree ("_order");
  CREATE INDEX "settings_hours_parent_id_idx" ON "settings_hours" USING btree ("_parent_id");
  CREATE INDEX "settings_other_networks_order_idx" ON "settings_other_networks" USING btree ("_order");
  CREATE INDEX "settings_other_networks_parent_id_idx" ON "settings_other_networks" USING btree ("_parent_id");
  CREATE INDEX "settings_active_locales_order_idx" ON "settings_active_locales" USING btree ("order");
  CREATE INDEX "settings_active_locales_parent_idx" ON "settings_active_locales" USING btree ("parent_id");
  CREATE UNIQUE INDEX "settings_tenant_idx" ON "settings" USING btree ("tenant_id");
  CREATE INDEX "settings_logo_idx" ON "settings" USING btree ("logo_id");
  CREATE INDEX "settings_logo_dark_idx" ON "settings" USING btree ("logo_dark_id");
  CREATE INDEX "settings_logo_group_idx" ON "settings" USING btree ("logo_group_id");
  CREATE INDEX "settings_favicon_idx" ON "settings" USING btree ("favicon_id");
  CREATE INDEX "settings_share_image_idx" ON "settings" USING btree ("share_image_id");
  CREATE INDEX "settings_updated_at_idx" ON "settings" USING btree ("updated_at");
  CREATE INDEX "settings_created_at_idx" ON "settings" USING btree ("created_at");
  CREATE UNIQUE INDEX "settings_locales_locale_parent_id_unique" ON "settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "settings_locales_parent_id_idx" ON "settings_locales" USING btree ("_parent_id");
  CREATE INDEX "settings_texts_order_parent" ON "settings_texts" USING btree ("order","parent_id");
  CREATE INDEX "awards_placements_order_idx" ON "awards_placements" USING btree ("order");
  CREATE INDEX "awards_placements_parent_idx" ON "awards_placements" USING btree ("parent_id");
  CREATE INDEX "awards__order_idx" ON "awards" USING btree ("_order");
  CREATE INDEX "awards_tenant_idx" ON "awards" USING btree ("tenant_id");
  CREATE INDEX "awards_badge_idx" ON "awards" USING btree ("badge_id");
  CREATE INDEX "awards_active_idx" ON "awards" USING btree ("active");
  CREATE INDEX "awards_placeholder_idx" ON "awards" USING btree ("placeholder");
  CREATE INDEX "awards_updated_at_idx" ON "awards" USING btree ("updated_at");
  CREATE INDEX "awards_created_at_idx" ON "awards" USING btree ("created_at");
  CREATE UNIQUE INDEX "awards_locales_locale_parent_id_unique" ON "awards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "awards_locales_parent_id_idx" ON "awards_locales" USING btree ("_parent_id");
  CREATE INDEX "redirects_tenant_idx" ON "redirects" USING btree ("tenant_id");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  ALTER TABLE "media" ADD CONSTRAINT "media_efficient_variant_id_media_id_fk" FOREIGN KEY ("efficient_variant_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_variant_of_id_media_id_fk" FOREIGN KEY ("variant_of_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_home_page_fk" FOREIGN KEY ("home_page_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dish_categories_fk" FOREIGN KEY ("dish_categories_id") REFERENCES "public"."dish_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wines_fk" FOREIGN KEY ("wines_id") REFERENCES "public"."wines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_salons_fk" FOREIGN KEY ("salons_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_room_types_fk" FOREIGN KEY ("room_types_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_categories_fk" FOREIGN KEY ("gallery_categories_id") REFERENCES "public"."gallery_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_complaint_reasons_fk" FOREIGN KEY ("complaint_reasons_id") REFERENCES "public"."complaint_reasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_group_links_fk" FOREIGN KEY ("group_links_id") REFERENCES "public"."group_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legal_pages_fk" FOREIGN KEY ("legal_pages_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_submissions_fk" FOREIGN KEY ("submissions_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_settings_fk" FOREIGN KEY ("settings_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_awards_fk" FOREIGN KEY ("awards_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_kind_idx" ON "media" USING btree ("kind");
  CREATE INDEX "media_efficient_variant_idx" ON "media" USING btree ("efficient_variant_id");
  CREATE INDEX "media_poster_idx" ON "media" USING btree ("poster_id");
  CREATE INDEX "media_variant_of_idx" ON "media" USING btree ("variant_of_id");
  CREATE INDEX "media_sizes_avif640_sizes_avif640_filename_idx" ON "media" USING btree ("sizes_avif640_filename");
  CREATE INDEX "media_sizes_webp640_sizes_webp640_filename_idx" ON "media" USING btree ("sizes_webp640_filename");
  CREATE INDEX "media_sizes_avif960_sizes_avif960_filename_idx" ON "media" USING btree ("sizes_avif960_filename");
  CREATE INDEX "media_sizes_webp960_sizes_webp960_filename_idx" ON "media" USING btree ("sizes_webp960_filename");
  CREATE INDEX "media_sizes_avif1280_sizes_avif1280_filename_idx" ON "media" USING btree ("sizes_avif1280_filename");
  CREATE INDEX "media_sizes_webp1280_sizes_webp1280_filename_idx" ON "media" USING btree ("sizes_webp1280_filename");
  CREATE INDEX "media_sizes_avif1920_sizes_avif1920_filename_idx" ON "media" USING btree ("sizes_avif1920_filename");
  CREATE INDEX "media_sizes_webp1920_sizes_webp1920_filename_idx" ON "media" USING btree ("sizes_webp1920_filename");
  CREATE INDEX "media_sizes_avif2560_sizes_avif2560_filename_idx" ON "media" USING btree ("sizes_avif2560_filename");
  CREATE INDEX "media_sizes_webp2560_sizes_webp2560_filename_idx" ON "media" USING btree ("sizes_webp2560_filename");
  CREATE INDEX "events_starts_at_idx" ON "events" USING btree ("starts_at");
  CREATE INDEX "events_poster_idx" ON "events" USING btree ("poster_id");
  CREATE INDEX "events_active_idx" ON "events" USING btree ("active");
  CREATE INDEX "events_placeholder_idx" ON "events" USING btree ("placeholder");
  CREATE INDEX "payload_locked_documents_rels_home_page_id_idx" ON "payload_locked_documents_rels" USING btree ("home_page_id");
  CREATE INDEX "payload_locked_documents_rels_dish_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("dish_categories_id");
  CREATE INDEX "payload_locked_documents_rels_wines_id_idx" ON "payload_locked_documents_rels" USING btree ("wines_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_salons_id_idx" ON "payload_locked_documents_rels" USING btree ("salons_id");
  CREATE INDEX "payload_locked_documents_rels_room_types_id_idx" ON "payload_locked_documents_rels" USING btree ("room_types_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_categories_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_complaint_reasons_id_idx" ON "payload_locked_documents_rels" USING btree ("complaint_reasons_id");
  CREATE INDEX "payload_locked_documents_rels_group_links_id_idx" ON "payload_locked_documents_rels" USING btree ("group_links_id");
  CREATE INDEX "payload_locked_documents_rels_legal_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("legal_pages_id");
  CREATE INDEX "payload_locked_documents_rels_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("submissions_id");
  CREATE INDEX "payload_locked_documents_rels_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("settings_id");
  CREATE INDEX "payload_locked_documents_rels_awards_id_idx" ON "payload_locked_documents_rels" USING btree ("awards_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  -- Textul alternativ devine pe limbi (D-28): valoarea existentă trece în română.
  INSERT INTO "media_locales" ("alt", "_locale", "_parent_id") SELECT "alt", 'ro', "id" FROM "media" WHERE "alt" IS NOT NULL;
  ALTER TABLE "media" DROP COLUMN "alt";`)

  await enableRowLevelSecurity(db)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  CREATE TEMP TABLE "_media_alt_ro" AS SELECT "_parent_id" AS "id", "alt" FROM "media_locales" WHERE "_locale" = 'ro';
   ALTER TABLE "home_page_hero_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_private_events_event_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_private_events_event_types_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dish_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dish_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "wines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "wines_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reviews_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "salons_amenities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "salons_amenities_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "salons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "salons_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "salons_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "room_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "room_types_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "complaint_reasons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "complaint_reasons_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "group_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "legal_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "legal_pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_hours" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_other_networks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_active_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "awards_placements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "awards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "awards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_page_hero_slides" CASCADE;
  DROP TABLE "home_page_private_events_event_types" CASCADE;
  DROP TABLE "home_page_private_events_event_types_locales" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "dish_categories" CASCADE;
  DROP TABLE "dish_categories_locales" CASCADE;
  DROP TABLE "wines" CASCADE;
  DROP TABLE "wines_locales" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "reviews_locales" CASCADE;
  DROP TABLE "salons_amenities" CASCADE;
  DROP TABLE "salons_amenities_locales" CASCADE;
  DROP TABLE "salons" CASCADE;
  DROP TABLE "salons_locales" CASCADE;
  DROP TABLE "salons_rels" CASCADE;
  DROP TABLE "room_types" CASCADE;
  DROP TABLE "room_types_locales" CASCADE;
  DROP TABLE "gallery" CASCADE;
  DROP TABLE "gallery_locales" CASCADE;
  DROP TABLE "gallery_categories" CASCADE;
  DROP TABLE "gallery_categories_locales" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "complaint_reasons" CASCADE;
  DROP TABLE "complaint_reasons_locales" CASCADE;
  DROP TABLE "group_links" CASCADE;
  DROP TABLE "legal_pages" CASCADE;
  DROP TABLE "legal_pages_locales" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "submissions" CASCADE;
  DROP TABLE "settings_hours" CASCADE;
  DROP TABLE "settings_other_networks" CASCADE;
  DROP TABLE "settings_active_locales" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "settings_locales" CASCADE;
  DROP TABLE "settings_texts" CASCADE;
  DROP TABLE "awards_placements" CASCADE;
  DROP TABLE "awards" CASCADE;
  DROP TABLE "awards_locales" CASCADE;
  DROP TABLE "redirects" CASCADE;
  ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "events_poster_id_media_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT IF EXISTS "media_efficient_variant_id_media_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT IF EXISTS "media_poster_id_media_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT IF EXISTS "media_variant_of_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_home_page_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_dish_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_wines_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_reviews_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_salons_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_room_types_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_gallery_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_gallery_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_faqs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_complaint_reasons_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_group_links_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_legal_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_submissions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_settings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_awards_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_redirects_fk";
  
  DROP INDEX IF EXISTS "events_starts_at_idx";
  DROP INDEX IF EXISTS "events_poster_idx";
  DROP INDEX IF EXISTS "events_active_idx";
  DROP INDEX IF EXISTS "events_placeholder_idx";
  DROP INDEX IF EXISTS "media_kind_idx";
  DROP INDEX IF EXISTS "media_efficient_variant_idx";
  DROP INDEX IF EXISTS "media_poster_idx";
  DROP INDEX IF EXISTS "media_variant_of_idx";
  DROP INDEX IF EXISTS "media_sizes_avif640_sizes_avif640_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_webp640_sizes_webp640_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_avif960_sizes_avif960_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_webp960_sizes_webp960_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_avif1280_sizes_avif1280_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_webp1280_sizes_webp1280_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_avif1920_sizes_avif1920_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_webp1920_sizes_webp1920_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_avif2560_sizes_avif2560_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_webp2560_sizes_webp2560_filename_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_home_page_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_dish_categories_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_wines_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_reviews_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_salons_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_room_types_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_gallery_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_gallery_categories_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_faqs_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_complaint_reasons_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_group_links_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_legal_pages_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_submissions_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_settings_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_awards_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_redirects_id_idx";
  ALTER TABLE "events" ALTER COLUMN "type" DROP DEFAULT;
  ALTER TABLE "events" ALTER COLUMN "placeholder" SET DEFAULT true;
  ALTER TABLE "media" ADD COLUMN "alt" varchar;
  UPDATE "media" SET "alt" = t."alt" FROM "_media_alt_ro" t WHERE "media"."id" = t."id";
  UPDATE "media" SET "alt" = '' WHERE "alt" IS NULL;
  ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "events" DROP COLUMN "ends_at";
  ALTER TABLE "events" DROP COLUMN "guest";
  ALTER TABLE "events" DROP COLUMN "poster_id";
  ALTER TABLE "events" DROP COLUMN "book_with_date";
  ALTER TABLE "media" DROP COLUMN "kind";
  ALTER TABLE "media" DROP COLUMN "title";
  ALTER TABLE "media" DROP COLUMN "credit";
  ALTER TABLE "media" DROP COLUMN "has_children";
  ALTER TABLE "media" DROP COLUMN "parental_consent";
  ALTER TABLE "media" DROP COLUMN "original_name";
  ALTER TABLE "media" DROP COLUMN "original_bytes";
  ALTER TABLE "media" DROP COLUMN "duration_seconds";
  ALTER TABLE "media" DROP COLUMN "efficient_variant_id";
  ALTER TABLE "media" DROP COLUMN "poster_id";
  ALTER TABLE "media" DROP COLUMN "codec";
  ALTER TABLE "media" DROP COLUMN "variant_of_id";
  ALTER TABLE "media" DROP COLUMN "sizes_avif640_url";
  ALTER TABLE "media" DROP COLUMN "sizes_avif640_width";
  ALTER TABLE "media" DROP COLUMN "sizes_avif640_height";
  ALTER TABLE "media" DROP COLUMN "sizes_avif640_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_avif640_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_avif640_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_webp640_url";
  ALTER TABLE "media" DROP COLUMN "sizes_webp640_width";
  ALTER TABLE "media" DROP COLUMN "sizes_webp640_height";
  ALTER TABLE "media" DROP COLUMN "sizes_webp640_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_webp640_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_webp640_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_avif960_url";
  ALTER TABLE "media" DROP COLUMN "sizes_avif960_width";
  ALTER TABLE "media" DROP COLUMN "sizes_avif960_height";
  ALTER TABLE "media" DROP COLUMN "sizes_avif960_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_avif960_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_avif960_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_webp960_url";
  ALTER TABLE "media" DROP COLUMN "sizes_webp960_width";
  ALTER TABLE "media" DROP COLUMN "sizes_webp960_height";
  ALTER TABLE "media" DROP COLUMN "sizes_webp960_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_webp960_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_webp960_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_avif1280_url";
  ALTER TABLE "media" DROP COLUMN "sizes_avif1280_width";
  ALTER TABLE "media" DROP COLUMN "sizes_avif1280_height";
  ALTER TABLE "media" DROP COLUMN "sizes_avif1280_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_avif1280_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_avif1280_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_webp1280_url";
  ALTER TABLE "media" DROP COLUMN "sizes_webp1280_width";
  ALTER TABLE "media" DROP COLUMN "sizes_webp1280_height";
  ALTER TABLE "media" DROP COLUMN "sizes_webp1280_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_webp1280_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_webp1280_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_avif1920_url";
  ALTER TABLE "media" DROP COLUMN "sizes_avif1920_width";
  ALTER TABLE "media" DROP COLUMN "sizes_avif1920_height";
  ALTER TABLE "media" DROP COLUMN "sizes_avif1920_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_avif1920_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_avif1920_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_webp1920_url";
  ALTER TABLE "media" DROP COLUMN "sizes_webp1920_width";
  ALTER TABLE "media" DROP COLUMN "sizes_webp1920_height";
  ALTER TABLE "media" DROP COLUMN "sizes_webp1920_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_webp1920_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_webp1920_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_avif2560_url";
  ALTER TABLE "media" DROP COLUMN "sizes_avif2560_width";
  ALTER TABLE "media" DROP COLUMN "sizes_avif2560_height";
  ALTER TABLE "media" DROP COLUMN "sizes_avif2560_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_avif2560_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_avif2560_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_webp2560_url";
  ALTER TABLE "media" DROP COLUMN "sizes_webp2560_width";
  ALTER TABLE "media" DROP COLUMN "sizes_webp2560_height";
  ALTER TABLE "media" DROP COLUMN "sizes_webp2560_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_webp2560_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_webp2560_filename";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "home_page_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "dish_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "wines_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reviews_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "salons_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "room_types_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "gallery_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "gallery_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faqs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "complaint_reasons_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "group_links_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "legal_pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "submissions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "settings_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "awards_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "redirects_id";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_home_page_hero_media_mode";
  DROP TYPE "public"."enum_wines_type";
  DROP TYPE "public"."enum_wines_volume";
  DROP TYPE "public"."enum_reviews_group";
  DROP TYPE "public"."enum_reviews_source";
  DROP TYPE "public"."enum_faqs_group";
  DROP TYPE "public"."enum_media_kind";
  DROP TYPE "public"."enum_submissions_subject";
  DROP TYPE "public"."enum_submissions_status";
  DROP TYPE "public"."enum_settings_hours_day";
  DROP TYPE "public"."enum_settings_active_locales";
  DROP TYPE "public"."enum_settings_default_theme";
  DROP TYPE "public"."enum_awards_placements";`)
}
