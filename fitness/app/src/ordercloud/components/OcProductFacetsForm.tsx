import { isNil, mapKeys, mapValues, omit, omitBy, xor } from 'lodash'
import { Filters, ListFacet } from 'ordercloud-javascript-sdk'
import { FormEvent, FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { useOcSelector } from '../redux/ocStore'

interface OcProductFacetFieldProps {
  count: number
  selected: string[]
  valueId: string
  value: string
  onChange: (updated: string[]) => void
}

const OcProductFacetField: FunctionComponent<OcProductFacetFieldProps> = ({
  valueId,
  count,
  selected,
  value,
  onChange,
}) => {
  const handleCheckboxChange = useCallback(() => {
    onChange(xor(selected, [value]))
  }, [selected, onChange, value])

  return (
    <label htmlFor={valueId}>
      <input
        id={valueId}
        type="checkbox"
        checked={selected.includes(value)}
        onChange={handleCheckboxChange}
      />{' '}
      {`${value} (${count})`}
    </label>
  )
}

interface OcProductFacetProps {
  facet: ListFacet
  values: string[] | undefined
  onChange: (xpPath: string, newValues?: string[]) => void
}

const OcProductFacet: FunctionComponent<OcProductFacetProps> = ({ facet, values, onChange }) => {
  const handleChange = (updated: string[]) => {
    onChange(facet.XpPath, updated)
  }
  return (
    <div>
      <p>{facet.Name}</p>
      {facet.Values.map((v) => {
        const valueId = `${facet.XpPath}_${v.Value}`
        return (
          <OcProductFacetField
            onChange={handleChange}
            key={valueId}
            valueId={valueId}
            value={v.Value}
            count={v.Count}
            selected={values}
          />
        )
      })}
    </div>
  )
}

export interface OcProductFacetsFormProps {
  onChange: (filters: { [x: string]: string }) => void
}

function mapOptionFilters(filters?: Filters): { [x: string]: string[] | undefined } {
  if (!filters) return {}
  return mapValues(
    mapKeys(omitBy(filters, isNil), (v, k: string) => k.toLowerCase()),
    (v) => {
      return typeof v === 'string' ? v.split('|') : [String(v)]
    }
  )
}

const OcProductFacetsForm: FunctionComponent<OcProductFacetsFormProps> = ({ onChange }) => {
  const { options, meta, loading } = useOcSelector((s) => s.ocProductList)

  const [filters, setFilters] = useState(mapOptionFilters(options && options.filters))

  const showClearButton = useMemo(() => {
    return Boolean(Object.values(filters).join('').length)
  }, [filters])

  const shouldClearCallOnChange = useMemo(() => {
    return Boolean(Object.values(mapOptionFilters(options && options.filters)).join('').length)
  }, [options])

  const handleClearFilters = useCallback(() => {
    setFilters({})
    if (shouldClearCallOnChange) {
      onChange({})
    }
  }, [onChange, shouldClearCallOnChange])

  useEffect(() => {
    setFilters(mapOptionFilters(options && options.filters))
  }, [options])

  const handleFacetChange = useCallback((xpPath: string, newValue: string[]) => {
    setFilters((f) => {
      return f ? { ...f, [`xp.${xpPath}`]: newValue } : { [`xp.${xpPath}`]: newValue }
    })
  }, [])

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      onChange(mapValues(filters, (v) => v && v.join('|')))
    },
    [onChange, filters]
  )

  const mapProductFacets = useCallback(
    (f: ListFacet) => {
      return (
        <OcProductFacet
          key={f.XpPath}
          facet={f}
          values={filters[`xp.${f.XpPath}`] || []}
          onChange={handleFacetChange}
        />
      )
    },
    [handleFacetChange, filters]
  )

  return (
    <form onSubmit={handleSubmit}>
      {meta && meta.Facets && meta.Facets.map(mapProductFacets)}
      <button type="submit" disabled={loading}>
        Apply Filters
      </button>
      {showClearButton && (
        <button type="button" disabled={loading} onClick={handleClearFilters}>
          Clear Filters
        </button>
      )}
    </form>
  )
}

export default OcProductFacetsForm
