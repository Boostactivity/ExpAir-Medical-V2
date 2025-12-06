interface EquipmentMetric {
    label: string
    value: number
    unit: string
    threshold: number
    color: string
}

interface EquipmentMonitorProps {
    leakage: number // L/min
    iah: number // Index Apnée-Hypopnée
    pressure: number // cm H2O
}

function CircularGauge({ value, max, label, unit, isAlert }: {
    value: number
    max: number
    label: string
    unit: string
    isAlert: boolean
}) {
    const percentage = Math.min((value / max) * 100, 100)
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted opacity-20"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className={`transition-all duration-500 ${isAlert ? 'text-red-500' : 'text-primary'
                            }`}
                        strokeLinecap="round"
                    />
                </svg>
                {/* Center value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-bold ${isAlert ? 'text-red-600' : ''}`}>
                        {value.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">{unit}</span>
                </div>
            </div>
            <div className="text-center">
                <p className="text-sm font-medium">{label}</p>
                {isAlert && (
                    <p className="text-xs text-red-600 font-medium">⚠️ Seuil dépassé</p>
                )}
            </div>
        </div>
    )
}

export function EquipmentMonitor({ leakage, iah, pressure }: EquipmentMonitorProps) {
    const metrics: EquipmentMetric[] = [
        {
            label: 'Fuite',
            value: leakage,
            unit: 'L/min',
            threshold: 24, // Seuil d'alerte à 24 L/min
            color: 'blue'
        },
        {
            label: 'IAH',
            value: iah,
            unit: '',
            threshold: 30, // Seuil pathologique à 30
            color: 'purple'
        },
        {
            label: 'Pression',
            value: pressure,
            unit: 'cmH₂O',
            threshold: 15, // Seuil maximal habituel
            color: 'green'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-card rounded-lg border">
            <div className="md:col-span-3">
                <h3 className="text-lg font-semibold mb-4">Métriques PPC en Temps Réel</h3>
            </div>

            {metrics.map((metric) => (
                <CircularGauge
                    key={metric.label}
                    value={metric.value}
                    max={metric.threshold * 1.5} // 150% du seuil pour l'échelle
                    label={metric.label}
                    unit={metric.unit}
                    isAlert={metric.value > metric.threshold}
                />
            ))}

            <div className="md:col-span-3 mt-4 p-4 bg-muted/50 rounded-md">
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">Seuil Fuite:</span>
                        <span className="ml-2 font-medium">24 L/min</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Seuil IAH:</span>
                        <span className="ml-2 font-medium">30</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Pression Max:</span>
                        <span className="ml-2 font-medium">15 cmH₂O</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
