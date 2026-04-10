import { SPECIALTIES } from '../../utils/constants'

interface SpecialtySelectorProps {
    value: keyof typeof SPECIALTIES | ''
    onChange: (value: keyof typeof SPECIALTIES) => void
    disabled?: boolean
}

export default function SpecialtySelector({
    value,
    onChange,
    disabled = false,
}: SpecialtySelectorProps) {
    return (
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Especialidad
            <select
                className="idie-input"
                value={value}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value as keyof typeof SPECIALTIES)}
            >
                <option value="">Selecciona una especialidad</option>
                {Object.entries(SPECIALTIES).map(([key, label]) => (
                    <option key={key} value={key}>
                        {label}
                    </option>
                ))}
            </select>
        </label>
    )
}
