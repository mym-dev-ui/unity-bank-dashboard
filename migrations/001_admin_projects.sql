-- Migration: admin_projects table
-- Run once against your PostgreSQL database.
-- The API server also calls CREATE TABLE IF NOT EXISTS on startup,
-- so this file is optional but useful for explicit migrations.

CREATE TABLE IF NOT EXISTS admin_projects (
  id          SERIAL PRIMARY KEY,
  key         TEXT UNIQUE NOT NULL,
  label       TEXT NOT NULL,
  api_base    TEXT NOT NULL,
  site_path   TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
