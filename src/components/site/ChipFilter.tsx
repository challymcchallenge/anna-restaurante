import React from 'react'

/**
 * Filtru pe jetoane (lista de vinuri, galeria): un grup de butoane radio, primul ales. Merge fără
 * JavaScript (regulile CSS `:has` ascund ce nu se potrivește), cu tastatura (săgețile) și e
 * anunțat corect de cititoarele de ecran. Valorile ajung în `id`, deci sunt simple (litere, cifre).
 */
export function ChipFilter({
  name,
  legend,
  options,
}: {
  name: string
  legend: string
  options: { value: string; label: string }[]
}) {
  return (
    <fieldset className="chip-filter">
      <legend className="sr-only">{legend}</legend>
      {options.map((o, i) => (
        <span key={o.value} className="chip">
          <input type="radio" name={name} id={`${name}-${o.value}`} value={o.value} defaultChecked={i === 0} />
          <label htmlFor={`${name}-${o.value}`}>{o.label}</label>
        </span>
      ))}
    </fieldset>
  )
}
