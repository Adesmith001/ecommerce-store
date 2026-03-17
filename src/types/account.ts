export type AccountProfile = {
  avatar: string;
  clerkId: string;
  email: string;
  fullName: string;
  id: string | null;
  phone: string;
  role: string;
};

export type AccountAddress = {
  addressLine: string;
  city: string;
  clerkId: string;
  country: string;
  createdAt: string;
  fullName: string;
  id: string;
  isDefault: boolean;
  label: string;
  landmark: string;
  phoneNumber: string;
  postalCode: string;
  state: string;
  updatedAt: string;
};
