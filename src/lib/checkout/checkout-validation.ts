import type { CheckoutFormErrors, CheckoutFormValues } from "@/types/checkout";

function isBlank(value: string) {
  return !value.trim();
}

function isEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export function validateCheckoutForm(values: CheckoutFormValues) {
  const errors: CheckoutFormErrors = {};

  if (isBlank(values.fullName)) errors.fullName = "Full name is required.";
  if (isBlank(values.email)) {
    errors.email = "Email is required.";
  } else if (!isEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (isBlank(values.phoneNumber)) errors.phoneNumber = "Phone number is required.";
  if (isBlank(values.country)) errors.country = "Country is required.";
  if (isBlank(values.state)) errors.state = "State is required.";
  if (isBlank(values.city)) errors.city = "City is required.";
  if (isBlank(values.addressLine)) errors.addressLine = "Address line is required.";

  return errors;
}
