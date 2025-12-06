import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import { AlertCard } from '../components/AlertCard'
import { AlertStats } from '../components/AlertStats'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Activity, AlertTriangle } from 'lucide-react'

interface Alert {
    id: string
    patient_name: string
    equipment_type: string
    severity: 'critique' | 'urgente' | 'normale'
    phone: string
    address: string
    created_at: string
    is_resolved: boolean
}

export function MonitoringDashboard() {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [filter, setFilter] = useState<'all' | 'critique' | 'resolved'>('all')
    const [loading, setLoading] = useState(true)

    const fetchAlerts = async () => {
        try {
            const { data, error } = await supabase
                .from('alerts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setAlerts(data || [])
        } catch (error) {
            console.error('Error fetching alerts:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAlerts()

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchAlerts, 30000)

        // Real-time subscription
        const channel = supabase
            .channel('alerts-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'alerts' },
                () => {
                    fetchAlerts()
                }
            )
            .subscribe()

        return () => {
            clearInterval(interval)
            channel.unsubscribe()
        }
    }, [])

    const filteredAlerts = alerts.filter(alert => {
        if (filter === 'all') return !alert.is_resolved
        if (filter === 'critique') return alert.severity === 'critique' && !alert.is_resolved
        if (filter === 'resolved') return alert.is_resolved
        return true
    })

    const criticalCount = alerts.filter(a => a.severity === 'critique' && !a.is_resolved).length

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Activity className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold">Monitoring en Temps Réel</h1>
                </div>
                <p className="text-muted-foreground">
                    Surveillance active des alertes patients - {alerts.filter(a => !a.is_resolved).length} alertes actives
                </p>
                {criticalCount > 0 && (
                    <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <p className="text-destructive font-medium">
                            {criticalCount} alerte{criticalCount > 1 ? 's' : ''} critique{criticalCount > 1 ? 's' : ''} nécessite{criticalCount > 1 ? 'nt' : ''} une attention immédiate
                        </p>
                    </div>
                )}
            </div>

            <AlertStats
                totalAlerts={alerts.length}
                criticalAlerts={criticalCount}
                resolvedAlerts={alerts.filter(a => a.is_resolved).length}
            />

            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6 mt-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="all">
                        Toutes ({alerts.filter(a => !a.is_resolved).length})
                    </TabsTrigger>
                    <TabsTrigger value="critique">
                        Critiques ({criticalCount})
                    </TabsTrigger>
                    <TabsTrigger value="resolved">
                        Résolues ({alerts.filter(a => a.is_resolved).length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                            <p className="mt-4 text-muted-foreground">Chargement des alertes...</p>
                        </div>
                    ) : filteredAlerts.length === 0 ? (
                        <div className="text-center py-12">
                            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Aucune alerte à afficher</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredAlerts.map((alert) => (
                                <AlertCard
                                    key={alert.id}
                                    id={alert.id}
                                    patientName={alert.patient_name}
                                    equipmentType={alert.equipment_type}
                                    severity={alert.severity}
                                    phone={alert.phone}
                                    address={alert.address}
                                    createdAt={alert.created_at}
                                    isResolved={alert.is_resolved}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
