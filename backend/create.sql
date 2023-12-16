drop schema IF EXISTS cccat13 cascade;
create schema IF NOT EXISTS cccat13;
CREATE TABLE cccat13.accounts (
  id uuid,
  name text,
  email text,
  cpf text,
  password text,
  password_algorithm text,
  password_salt text,
  car_plate text,
  is_passenger boolean,
  is_driver boolean,
  date timestamp,
  is_verified boolean,
  verification_code uuid
);
CREATE TABLE cccat13.rides (
  id uuid,
  passenger_id uuid,
  driver_id uuid,
  status text,
  fare numeric,
  distance numeric,
  from_lat numeric,
  from_long numeric,
  to_lat numeric,
  to_long numeric,
  date timestamp
);
CREATE TABLE cccat13.positions (
  id uuid primary key,
  ride_id uuid,
  lat numeric,
  long numeric,
  date timestamp
);
CREATE TABLE ride_projections (
  ride_id uuid,
  passenger_name text,
  passenger_email text,
  status text
)