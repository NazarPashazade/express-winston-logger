const commonFields = ["password", "token", "accessToken", "refreshToken"];

export const sanitizeData = (
  data: Record<string, any>,
  extraFields: string[] = []
): Record<string, any> => {
  if (!data || typeof data !== "object") return data;

  const sanitized: Record<string, any> = Array.isArray(data) ? [] : { ...data };
  const sensitiveFields = [...commonFields, ...extraFields];

  for (const key in data) {
    if (sensitiveFields.includes(key)) {
      sanitized[key] = "****";
    } else if (typeof data[key] === "object" && data[key] !== null) {
      sanitized[key] = sanitizeData(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  }

  return sanitized;
};
