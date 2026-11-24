/**
 * EMAIL_FROM acceptă „adresa@domeniu” sau „Nume <adresa@domeniu>”.
 * Numele restaurantului se pune la trimitere, pe tenant (D-15); aici e doar valoarea implicită.
 */
export function parseFromAddress(value: string | undefined): { address: string; name: string } {
  const raw = (value || '').trim()
  const match = raw.match(/^(.*)<([^>]+)>$/)
  if (match) {
    return { name: match[1].trim().replace(/^"|"$/g, ''), address: match[2].trim() }
  }
  return { name: '', address: raw }
}
