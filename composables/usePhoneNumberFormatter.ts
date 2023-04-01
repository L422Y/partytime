export const usePhoneNumberFormatter = (number: string) => {
  if (!number) return null
  let formattedNumber = number
  if (formattedNumber.startsWith("+1")) {
    formattedNumber = formattedNumber.replace("+1", "")
    formattedNumber = `(${formattedNumber.substring(0, 3)}) ${formattedNumber.substring(3, 6)}-${formattedNumber.substring(6)}`
  }
  return formattedNumber
}
