import { Gender } from "@/lib/types";

export function convertGender(index: Gender) {
  return ["Male", "Female", "Transgender"][index];
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

export function numToHex(num: number): string {
  return num.toString(16);
}

export function hexToNum(hex: string): number {
  return parseInt(hex, 16);
}
