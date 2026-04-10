import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientInfo from './PatientInfo'
import ConsultationsTab from './ConsultationsTab'
import PrescriptionsTab from './PrescriptionsTab'
import LaboratoryTab from './LaboratoryTab'
import { useAuth } from '../../hooks/useAuth'
import { ApiClientError } from '../../utils/apiClient'
import { ERROR_MESSAGES } from '../../utils/constants'
import * as historyService from '../../services/historyService'
import * as laboratoryService from '../../services/laboratoryService'
import type {
    Allergy,
    Consultation,
    LaboratoryResult,
    Patient,
    Prescription,
} from '../../types/api'
import LoadingSpinner from '../Common/LoadingSpinner'

type TabKey = 'patient' | 'consultations' | 'prescriptions' | 'laboratories'

const TAB_LABELS: Record<TabKey, string> = {
    patient: 'Informacion del paciente',
    consultations: 'Consultas',
    prescriptions: 'Prescripciones',
    laboratories: 'Laboratorios',
}

export default function HistoryPage() {
    const navigate = useNavigate()
    const { token, user } = useAuth()
    const [activeTab, setActiveTab] = useState<TabKey>('patient')

    const [patient, setPatient] = useState<Patient | null>(null)
    const [allergies, setAllergies] = useState<Allergy[]>([])
    const [consultations, setConsultations] = useState<Consultation[]>([])
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
    const [laboratories, setLaboratories] = useState<LaboratoryResult[]>([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadHistory = async () => {
            if (!token || !user?.patientId) {
                setError('No se encontro informacion del paciente autenticado.')
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const [historyResponse, laboratoryResponse] = await Promise.all([
                    historyService.getHistory(user.patientId, token),
                    laboratoryService.getLaboratories(user.patientId, token),
                ])

                setPatient(historyResponse.patient)
                setAllergies(historyResponse.allergies || [])
                setConsultations(historyResponse.consultations || [])
                setPrescriptions(historyResponse.activePrescriptions || [])
                setLaboratories(
                    laboratoryResponse.length > 0
                        ? laboratoryResponse
                    : historyResponse.laboratoryResults || [],
                )
            } catch (caught) {
                if (caught instanceof ApiClientError) {
                    if (caught.errorCode === 'PATIENT_NOT_FOUND') {
                        navigate('/dashboard', { replace: true })
                        return
                    }

                    setError(
                        (caught.errorCode && ERROR_MESSAGES[caught.errorCode]) || caught.message,
                    )
                } else {
                    setError('No fue posible cargar la historia clinica.')
                }
            } finally {
                setLoading(false)
            }
        }

        void loadHistory()
    }, [navigate, token, user?.patientId])

    const currentTabContent = useMemo(() => {
        if (!patient) {
            return null
        }

        if (activeTab === 'patient') {
            return <PatientInfo patient={patient} allergies={allergies} />
        }

        if (activeTab === 'consultations') {
            return <ConsultationsTab consultations={consultations} />
        }

        if (activeTab === 'prescriptions') {
            return <PrescriptionsTab prescriptions={prescriptions} />
        }

        return <LaboratoryTab results={laboratories} />
    }, [activeTab, allergies, consultations, laboratories, patient, prescriptions])

    if (loading) {
        return (
            <div className="idie-card p-6">
                <LoadingSpinner label="Cargando historia clinica..." />
            </div>
        )
    }

    if (error) {
        return (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
            </div>
        )
    }

    return (
        <section className="grid gap-4 idie-fade-in">
            <div className="idie-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold text-blue-900">Historia clinica completa</h2>
                    <button
                        type="button"
                        className="border border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-50"
                        onClick={() => window.print()}
                    >
                        Imprimir
                    </button>
                </div>

                <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
                    {(Object.keys(TAB_LABELS) as TabKey[]).map((tabKey) => (
                        <button
                            key={tabKey}
                            type="button"
                            className={[
                                'border px-3 py-2 text-sm font-semibold text-left',
                                activeTab === tabKey
                                    ? 'border-blue-800 bg-blue-800 text-white'
                                    : 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100',
                            ].join(' ')}
                            onClick={() => setActiveTab(tabKey)}
                        >
                            {TAB_LABELS[tabKey]}
                        </button>
                    ))}
                </div>
            </div>

            {currentTabContent}
        </section>
    )
}
