create database Garage_system;
use Garage_system;

create table register(
  id int auto_increment primary key,
  first_name varchar(45),
  last_name varchar(45),
  email varchar(45),
  address varchar(255),
  contact_no varchar(45),
  Gender varchar(45),
  is_mechanic boolean,
  is_customer boolean,
  password varchar(45),
  pw_salt varchar(45)
);

create table appointment(
 application_id int auto_increment primary key,
 mechanic_id int,
 customer_id int,
 appointment_datetime varchar(45),
 foreign key(mechanic_id) references register(id),
 foreign key(customer_id) references register(id)
);

create table garage(
    garage_id int auto_increment primary key,
    garage_location varchar(50),
    garage_name varchar(30),
    owner_id int,
    foreign key (owner_id) references register(id)
);

create table payment_bill(
    bill_no int auto_increment primary key,
    bill_amount float,
    cust_id int,
    mech_id int,
    mode_of_payment varchar(45),
	foreign key (cust_id) references register(id),
    foreign key (mech_id) references register(id)
);

create table vehicle(
id int auto_increment primary key,
model_name varchar(45),
cust_id int,
foreign key (cust_id) references register(id)
);

