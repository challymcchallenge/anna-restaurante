'use client'

import { TextField, TextareaField, useField } from '@payloadcms/ui'
import type { TextFieldClientComponent, TextareaFieldClientComponent } from 'payload'
import React from 'react'

/** Contor de caractere sub câmp (content-model 1: „panoul arată un contor”). */
function Counter({ path, max }: { path: string; max?: number }) {
  const { value } = useField<string>({ path })
  if (!max) return null
  const length = typeof value === 'string' ? value.length : 0
  const over = length > max
  return (
    <div
      className={`char-counter${over ? ' char-counter--over' : ''}`}
      aria-live="polite"
    >
      {length} / {max} caractere{over ? ' · prea lung, nu se poate salva' : ''}
    </div>
  )
}

export const CountedTextField: TextFieldClientComponent = (props) => (
  <div className="counted-field">
    <TextField {...props} />
    <Counter path={props.path} max={props.field.maxLength} />
  </div>
)

export const CountedTextareaField: TextareaFieldClientComponent = (props) => (
  <div className="counted-field">
    <TextareaField {...props} />
    <Counter path={props.path} max={props.field.maxLength} />
  </div>
)
