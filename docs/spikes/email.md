# F0 · Test „email” (ADR-009)

Data: 24.11.2026 · Rezultat: **AMÂNAT la decizia lui Alin**. Emailul se configurează ultimul, odată cu mutarea DNS a domeniului (mesajul lui Alin din 24.11.2026). Limitele Resend sunt verificate; partea de cod e pregătită.

## Ce este gata

- Adaptorul oficial `@payloadcms/email-resend` 3.94.1 e configurat în `src/payload.config.ts`. Pornește doar când există `RESEND_API_KEY`; fără cheie, Payload afișează emailurile în consolă.
- `EMAIL_FROM` acceptă „adresa” sau „Nume <adresa>” (`src/lib/email.ts`). Numele restaurantului se pune la trimitere, pe tenant (D-15).

## Fapte verificate (pagini oficiale, 24.11.2026)

| Fapt | Valoare | Consecință |
|---|---|---|
| Plan gratuit | 100 de emailuri pe zi, 3.000 pe lună, 3 domenii | Suficient pentru formulare |
| Destinatari în CC/BCC | fiecare contează separat | O cerere de cazare către rezervari@hotelanna.ro + copie către tine = **2 emailuri** din cota zilnică. Plafon practic: **50 de cereri cu copie pe zi** |
| Fără domeniu verificat | se poate trimite doar către adresa contului Resend, de pe `resend.dev` | Testul cu copie către altă adresă cere domeniul verificat |

## Ce rămâne de probat (la final, odată cu domeniul)

1. Verificarea domeniului de trimitere în Resend (înregistrările DNS, la mutarea NS).
2. Un email de probă cu copie: către rezervari@hotelanna.ro și adresa ta. Măsor timpul de livrare și verific că nu ajunge în spam (SPF, DKIM, DMARC).
3. Subiectul „Cerere de cazare de pe site-ul Trattoria da Vittoria” (D-15) și ce se întâmplă când trimiterea eșuează: cererea rămâne salvată în baza de date (ADR-009).

Opțional, mai devreme: dacă îmi dai o cheie Resend prin formularul securizat, pot trimite un email de probă **doar către adresa contului tău Resend**, de pe `resend.dev`. Asta confirmă integrarea, nu și copia.

## Concluzie

ADR-009 nu se schimbă. Riscul de cotă e mic (50 de cereri cu copie pe zi pe planul gratuit). Testul complet se mută în F5, la legarea domeniului.

---

100% AI Solutions & Agentic Work-Flows for SMEs
Made with ❤️ by BizTech Consulting SRL
Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro
