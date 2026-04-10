export default function LoadingSpinner({
    label = 'Cargando...',
}: {
    label?: string
}) {
    return (
        <div className="flex items-center gap-3 text-sm text-slate-700">
            <span className="h-5 w-5 animate-spin border-2 border-blue-600 border-t-transparent" />
            <span>{label}</span>
        </div>
    )
}
