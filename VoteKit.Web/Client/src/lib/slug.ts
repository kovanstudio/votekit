import slugifyBase from "slugify";

export const slugify = (input) =>
  slugifyBase(input.trim(), { lower: true, remove: /[^A-Za-z0-9\s-]/g });
