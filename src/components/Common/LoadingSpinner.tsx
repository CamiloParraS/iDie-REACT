export default function LoadingSpinner({
    label = 'Cargando...',
}: {
    label?: string
}) {
    return (
        <div className="flex items-center gap-3 text-sm text-slate-700">
            <span className="idie-spinner" />
            <span>{label}</span>
        </div>
    )
}
