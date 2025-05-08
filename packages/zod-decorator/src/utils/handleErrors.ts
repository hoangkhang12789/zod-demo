import { ZodIssue } from "zod";

export function handleErrors(validateResult: ZodIssue[]): {
  ok: boolean;
  error: { code: number; message: string; details: string[] };
} {
  const minimalErrors = validateResult.map(({ path, message }) => {
    const propertyName = path.length > 0 ? path[0] : '';
    const cleanedMessage = message.replace(/["\\]/g, '');
    return {
      message: propertyName === '' ? cleanedMessage.trim() : `${propertyName} ${cleanedMessage}`,
    };
  });

  return {
    ok: false,
    error: {
      code: 1000,
      message: 'Invalid argument',
      details: minimalErrors.map((error) => error.message),
    },
  };
}
