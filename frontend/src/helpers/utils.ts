import { Gender } from "@/lib/types";

export function convertGender(index: Gender) {
  if (Number(index) === Gender.Male) return "Male";
  if (Number(index) === Gender.Female) return "Female";
  if (Number(index) === Gender.Transgender) return "Transgender";
}
