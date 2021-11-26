export enum Gender {
  Male,
  Female,
  Transgender
}

export interface IUserDetails {
  firstName: string;
  lastName: string;
  nationalId: string;
  gender: number;
  email: string;
  phone: string;
}

export interface IUserFormData {
  firstName: string;
  lastName: string;
  nationalId: string;
  gender: number;
  email: string;
  phone: string;
}

export interface IOrganizationDetails {
  name: string;
  registrationId: string;
  email: string;
  phone: string;
  admins: string[];
  owner: string;
  contractAddress: string;
}

export interface IOrganizationFormData {
  name: string;
  registrationId: string;
  email: string;
  phone: string;
  admins: string[];
}

export interface IOrganizationDetailsRes {
  _name: string;
  _registrationId: string;
  _email: string;
  _phone: string;
  _admins: string[];
  _owner: string;
}
