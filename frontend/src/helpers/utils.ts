import { Gender } from "@/lib/types";

export function convertGender(index: Gender) {
  if (Number(index) === Gender.Male) return "Male";
  if (Number(index) === Gender.Female) return "Female";
  if (Number(index) === Gender.Transgender) return "Transgender";
}

export function maskEmail(text: string): string {
  const beforeAt = text.slice(0, text.indexOf("@")).split(/[.]+/);
  const afterAt = text.slice(text.indexOf("@") + 1);

  const $hide = (arr: string[]) => {
    return arr.map(item => {
      if (item.length >= 5) {
        return item.slice(0, 2) + "***" + item.slice(-1);
      } else {
        return item.slice(0, 1) + "***" + item.slice(-1);
      }
    }).join(".");
  };

  return $hide(beforeAt) + "@" + afterAt;
}
